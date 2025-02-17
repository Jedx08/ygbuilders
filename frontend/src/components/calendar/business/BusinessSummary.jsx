import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import useGetBusinessData from "../../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../../hooks/useBusinessExpenses";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Line } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useBusinessCapital from "../../../hooks/useBusinessCapital";
import capitalIcon from "../../../media/bus_pouch.png";
import salesIcon from "../../../media/bus_sales.png";
import expensesIcon from "../../../media/bus_expenses.png";
import profitIcon from "../../../media/bus_profit.png";
import monthlyCapitalIcon from "../../../media/busmon_pouch.png";
import monthlySalesIcon from "../../../media/busmon_sales.png";
import monthlyExpensesIcon from "../../../media/busmon_expenses.png";
import monthlyProfitIcon from "../../../media/busmon_net.png";
import BusinessYearlySummary from "./BusinessYearlySummary";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";
import NumberFlow from "@number-flow/react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { BsInfoCircle } from "react-icons/bs";

const BusinessSummary = () => {
  const {
    monthIndex,
    setMonthIndex,
    businessIncomeData,
    businessIncomeLoading,
    setBusinessIncomeLoading,
    businessExpensesData,
    businessExpensesLoading,
    setBusinessExpensesLoading,
    businessCapitalData,
    businessCapitalLoading,
    setBusinessCapitalLoading,
  } = useContext(CalendarContext);
  const getBusinessData = useGetBusinessData();
  const getMonthlyExpenses = useBusinessExpenses();
  const getMonthlyCapital = useBusinessCapital();

  const [capital, setCapital] = useState(0);
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const [capitalCount, setCapitalCount] = useState([]);
  const [salesCount, setSalesCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [profitCount, setProfitCount] = useState([]);

  const [monthlyCapital, setMonthlyCapital] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [overallMonthlyExpenses, setOverallMonthlyExpenses] = useState(0);

  const [monthExpenses, setMonthExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const overallProfit = sales - expenses - overallMonthlyExpenses - capital;

  const monthlyProfit =
    monthlySales - monthlyExpenses - monthlyCapital - monthExpenses;

  // month identifier
  const thisMonth = dayjs().month(monthIndex).format("MMMM");

  //number of days per month using dayjs
  const monthCount = dayjs().month(monthIndex).daysInMonth();

  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }

  // getting businessIncome
  // will re-trigger when businessIncomeLoading is set to true
  useEffect(() => {
    if (businessIncomeLoading) {
      getBusinessData();
      setBusinessIncomeLoading(false);
    }
  }, [businessIncomeLoading]);

  // getting monthlyExpenses
  // will re-trigger when businessExpensesLoading is set to true
  useEffect(() => {
    if (businessExpensesLoading) {
      getMonthlyExpenses();
      setBusinessExpensesLoading(false);
    }
  }, [businessExpensesLoading]);

  // getting monthlyCapital
  // will re-trigger when businessCapitalLoading is set to true
  useEffect(() => {
    if (businessCapitalLoading) {
      getMonthlyCapital();
      setBusinessCapitalLoading(false);
    }
  }, [businessCapitalLoading]);

  // calculation for overall data
  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    setIsLoading(true);

    const overallData = async () => {
      businessIncomeData.forEach((data) => {
        return (c += data.capital), (s += data.sales), (e += data.expenses);
      });

      businessCapitalData.forEach((data) => {
        m_c += data.amount;
      });

      businessExpensesData.forEach((data) => {
        m_e += data.amount;
      });

      setOverallMonthlyExpenses(m_e);
      setCapital(c + m_c);
      setSales(s);
      setExpenses(e);
      setIsLoading(false);
    };

    overallData();
  }, [businessIncomeData, businessCapitalData, businessExpensesData]);

  // calculation for line graph data
  useEffect(() => {
    const lineGraphData = async () => {
      const filteredData = businessIncomeData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );

      const monthCount = dayjs().month(monthIndex).daysInMonth();

      //get line graph capital
      let capitalPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        capitalPerDate.push(0);
      }
      setCapitalCount(capitalPerDate);

      filteredData.map((data) => {
        capitalPerDate.map(() => {
          capitalPerDate[dayjs(data.day).format("D") - 1] = data.capital;
        });

        setCapitalCount(capitalPerDate);
      });

      //get line graph expenses
      let expensesPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        expensesPerDate.push(0);
      }
      setExpensesCount(expensesPerDate);

      filteredData.map((data) => {
        expensesPerDate.map(() => {
          expensesPerDate[dayjs(data.day).format("D") - 1] = data.expenses;
        });

        setExpensesCount(expensesPerDate);
      });

      //get line graph sales
      let salesPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        salesPerDate.push(0);
      }
      setSalesCount(salesPerDate);

      filteredData.map((data) => {
        salesPerDate.map(() => {
          salesPerDate[dayjs(data.day).format("D") - 1] = data.sales;
        });

        setSalesCount(salesPerDate);
      });

      //get line graph profit
      let profitPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        profitPerDate.push(0);
      }
      setProfitCount(profitPerDate);

      filteredData.map((data) => {
        profitPerDate.map(() => {
          profitPerDate[dayjs(data.day).format("D") - 1] = data.profit;
        });

        setProfitCount(profitPerDate);
      });
    };

    lineGraphData();
  }, [monthIndex, businessIncomeData]);

  //calculation for monthly income
  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const monthlyIncomeData = async () => {
      const filteredData = businessIncomeData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );
      filteredData.forEach((data) => {
        (c += data.capital), (s += data.sales), (e += data.expenses);
      });

      businessCapitalData
        .filter(
          (data) =>
            dayjs(data.month).format("MMMM YYYY") ===
            dayjs().month(monthIndex).format("MMMM YYYY")
        )
        .forEach((data) => {
          m_c += data.amount;
        });

      setMonthlyCapital(c + m_c);
      setMonthlySales(s);
      setMonthlyExpenses(e);
    };

    const monthlyExpensesData = async () => {
      businessExpensesData
        .filter(
          (data) => data.month === dayjs().month(monthIndex).format("MMMM YYYY")
        )
        .forEach((data) => {
          m_e += data.amount;
        });

      setMonthExpenses(m_e);
    };

    monthlyIncomeData();
    monthlyExpensesData();
  }, [
    monthIndex,
    businessIncomeData,
    businessCapitalData,
    businessExpensesData,
  ]);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  const nextYear = () => {
    setMonthIndex(monthIndex + 12);
  };

  const prevYear = () => {
    setMonthIndex(monthIndex - 12);
  };

  // driver js tour content
  const showTour = async () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#overallIncome",
          popover: {
            title: "Overall Income",
            description:
              "Displays a summary of your financial performance, including profit, capital, sales, and total expenses. This helps you quickly assess your financial status.",
          },
        },
        {
          element: "#monthlyIncome",
          popover: {
            title: "Monthly Income",
            description:
              "Shows a detailed breakdown of your capital, sales, expenses, and profit for the selected month. You can change the graph view by clicking the colored buttons.",
          },
        },
        {
          element: "#yearlyIncome",
          popover: {
            title: "Yearly Income",
            description:
              "Provides an annual financial overview, displaying capital, sales, expenes, and profit across all months. A bar chart helps visualize income and spending trends for better financial planning.",
          },
        },
        {
          element: "#instructions",
          popover: {
            description:
              "You can always come back in this button to run the instructions again",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return (
    <>
      {/* instructions */}
      <div
        id="instructions"
        onClick={() => {
          showTour();
        }}
        className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-sm rounded-md mt-5 cursor-pointer border border-white hover:border-lyellows text-sm mmd:text-xs md:py-1 mx-auto`}
      >
        <BsInfoCircle className={`text-oranges text-2xl mmd:text-xl`} />
        <p>
          How to use? <span className="font-bold">Instructions</span>
        </p>
      </div>
      <div
        id="overallIncome"
        className="bg-white shadow-sm rounded-lg mb-5 py-5 mt-5 mx-5 xl:ml-24 lg:ml-5"
      >
        <div
          className={`flex justify-center items-center text-oranges font-bold pb-2 text-2xl sm:text-xl`}
        >
          Overall Income
        </div>
        <div className="flex items-center justify-evenly flex-wrap gap-2 mt-1 xl:px-3">
          <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
            <div className="text-base font-semibold text-center mdd:text-sm">
              Profit
            </div>
            <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={profitIcon}
                  alt="net"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div
                className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                  overallProfit < 0 ? "text-[red]" : "text-greens"
                }`}
              >
                <NumberFlow
                  value={overallProfit}
                  trend={5}
                  spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                  format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
              <div>
                {overallProfit < 0 ? (
                  <PiChartLineDown className="text-3xl mdd:text-2xl sm:text-xl text-[#ff3a33]" />
                ) : (
                  <PiChartLineUp className="text-3xl mdd:text-2xl sm:text-xl text-[#32ca5b]" />
                )}
              </div>
            </div>
          </div>
          <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
            <div className="text-base font-semibold text-center mdd:text-sm">
              Capital
            </div>
            <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={capitalIcon}
                  alt="gross"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                <NumberFlow
                  value={capital}
                  trend={5}
                  spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                  format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
            <div className="text-base font-semibold text-center mdd:text-sm">
              Sales
            </div>
            <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={salesIcon}
                  alt="gross"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div className="text-[#399CB4] font-bold text-2xl mdd:text-xl sm:text-lg">
                <NumberFlow
                  value={sales}
                  trend={5}
                  spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                  format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
            <div className="text-base font-semibold text-center mdd:text-sm">
              Expenses
            </div>
            <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={expensesIcon}
                  alt="expenses"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div className="text-[red] font-bold text-2xl mdd:text-xl sm:text-lg">
                {/* {(expenses + overallMonthlyExpenses).toLocaleString()} */}
                <NumberFlow
                  value={expenses + overallMonthlyExpenses}
                  trend={5}
                  spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                  format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="monthlyIncome"
        className="bg-white p-5 mx-5 mb-5 rounded-lg shadow-sm xl:ml-24 lg:ml-5"
      >
        <div className="bg-light font-pops">
          {isLoading ? (
            <div className="w-[60%] mx-auto bg-white p-5 rounded-lg flex items-center flex-col md:w-[90%] ">
              <div className="w-[35%]">
                <Skeleton />
              </div>
              <div className="w-[100%]">
                <Skeleton height={500} />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white w-full flex gap-5 lg:flex-col">
                <div className="hidden bg-white shadow-sm rounded-lg mb-5 py-5 mx-5 lg:block">
                  <div
                    className={`flex justify-center items-center text-oranges font-bold pb-2 text-2xl sm:text-xl`}
                  >
                    Monthly Summary
                  </div>
                  <div className="flex items-center justify-evenly flex-wrap gap-2 mt-1 xl:px-3">
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                      <div className="text-base font-semibold text-center mdd:text-sm">
                        Profit
                      </div>
                      <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                        <div>
                          <img
                            src={monthlyProfitIcon}
                            alt="net"
                            className="w-14 mdd:w-11 sm:w-9"
                          />
                        </div>
                        <div
                          className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                            monthlyProfit < 0 ? "text-[red]" : "text-greens"
                          }`}
                        >
                          <NumberFlow
                            value={monthlyProfit}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                        <div>
                          {monthlyProfit < 0 ? (
                            <PiChartLineDown className="text-3xl mdd:text-2xl sm:text-xl text-[#ff3a33]" />
                          ) : (
                            <PiChartLineUp className="text-3xl mdd:text-2xl sm:text-xl text-[#32ca5b]" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                      <div className="text-base font-semibold text-center mdd:text-sm">
                        Capital
                      </div>
                      <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                        <div>
                          <img
                            src={monthlyCapitalIcon}
                            alt="gross"
                            className="w-14 mdd:w-11 sm:w-9"
                          />
                        </div>
                        <div className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                          <NumberFlow
                            value={monthlyCapital}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                      <div className="text-base font-semibold text-center mdd:text-sm">
                        Sales
                      </div>
                      <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                        <div>
                          <img
                            src={monthlySalesIcon}
                            alt="gross"
                            className="w-14 mdd:w-11 sm:w-9"
                          />
                        </div>
                        <div className="text-[#399CB4] font-bold text-2xl mdd:text-xl sm:text-lg">
                          <NumberFlow
                            value={monthlySales}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                      <div className="text-base font-semibold text-center mdd:text-sm">
                        Expenses
                      </div>
                      <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                        <div>
                          <img
                            src={monthlyExpensesIcon}
                            alt="expenses"
                            className="w-14 mdd:w-11 sm:w-9"
                          />
                        </div>
                        <div className="text-[red] font-bold text-2xl mdd:text-xl sm:text-lg">
                          <NumberFlow
                            value={monthlyExpenses + monthExpenses}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white w-[65%] lg:w-full p-4 border border-light rounded-lg shadow-sm overflow-y-auto">
                  <div className="w-full flex justify-center text-xl text-oranges font-pops font-bold py-3">
                    <div className="flex w-full gap-2 items-center">
                      <div className="flex justify-start">
                        <div>
                          <FaAngleLeft
                            className="text-oranges text-2xl hover:text-loranges cursor-pointer ssm:text-3xl"
                            onClick={handlePrevMonth}
                          />
                        </div>
                        <div>
                          <FaAngleRight
                            className="text-oranges text-2xl hover:text-loranges cursor-pointer ssm:text-3xl"
                            onClick={handleNextMonth}
                          />
                        </div>
                      </div>{" "}
                      {thisMonth}
                    </div>
                  </div>
                  <div className="h-[400px] w-full lg:w-full">
                    <Line
                      className="w-full"
                      data={{
                        labels: dayCount,
                        datasets: [
                          {
                            label: "Capital",
                            data: capitalCount,
                            borderColor: "#ff9f1c",
                            backgroundColor: "#fdac3a",
                            tension: 0.5,
                          },
                          {
                            label: "Sales",
                            data: salesCount,
                            borderColor: "#399CB4",
                            backgroundColor: "#41B8D5",
                            tension: 0.5,
                          },
                          {
                            label: "Expenses",
                            data: expensesCount,
                            borderColor: "#ff6384",
                            backgroundColor: "#FA829C",
                            tension: 0.5,
                          },
                          {
                            label: "Profit",
                            data: profitCount,
                            borderColor: "#2ec4b6",
                            backgroundColor: "#3cd5c5",
                            tension: 0.5,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          datalabels: {
                            font: {
                              weight: 550,
                            },
                          },
                          legend: {
                            align: "center",
                            labels: {
                              font: {
                                size: 14,
                              },
                              usePointStyle: true,
                              generateLabels: function (chart) {
                                const labels =
                                  Chart.defaults.plugins.legend.labels.generateLabels(
                                    chart
                                  );
                                labels.forEach((label, index) => {
                                  label.hidden = !chart.isDatasetVisible(index);
                                });
                                return labels;
                              },
                            },
                            onClick: (e, legendItem, legend) => {
                              const index = legendItem.datasetIndex;
                              const chart = legend.chart;

                              // Toggle dataset visibility
                              chart.setDatasetVisibility(
                                index,
                                !chart.isDatasetVisible(index)
                              );

                              // Update the chart
                              chart.update();
                            },
                            onHover: (event, legendItem) => {
                              event.native.target.style.cursor = "pointer";
                            },
                            onLeave: (event) => {
                              event.native.target.style.cursor = "default";
                            },
                          },
                          ChartDataLabels,
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
                <div className="w-[35%] lg:hidden xs:w-full">
                  <div className="h-hfull w-full flex flex-col items-center justify-center gap-2 md:w-[90%] ssm:w-[100%] xs:flex-row">
                    <div className="flex font-bold text-2xl text-center text-oranges items-center justify-center pb-3 ssm:text-xl">
                      Monthly Summary
                    </div>
                    {/* Total Capital */}
                    <div className="bg-white h-hfull rounded-lg shadow-sm border border-light w-full min-w-[30%]">
                      <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                        <p className="sm:text-sm text-base font-semibold">
                          Capital
                        </p>
                      </div>
                      <div className="flex justify-center text-2xl text-oranges font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                        <div className="flex justify-center items-center gap-3 px-5 py-2 rounded-md">
                          <img
                            src={monthlyCapitalIcon}
                            alt="puch"
                            className="w-11 sm:w-9"
                          />
                          <NumberFlow
                            value={monthlyCapital}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Sales */}
                    <div className="bg-white h-hfull rounded-lg shadow-sm border border-light w-full min-w-[30%]">
                      <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                        <p className="sm:text-sm text-base font-semibold">
                          Sales
                        </p>
                      </div>
                      <div className="flex justify-center text-2xl text-[#399CB4] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                        <div className="flex justify-center items-center gap-3 px-5 py-2 rounded-md">
                          <img
                            src={monthlySalesIcon}
                            alt="puch"
                            className="w-11 sm:w-9"
                          />
                          <NumberFlow
                            value={monthlySales}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Expenses */}
                    <div className="bg-white h-hfull rounded-lg shadow-sm border border-light w-full min-w-[30%]">
                      <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                        <p className="sm:text-sm text-base font-semibold">
                          Expenses
                        </p>
                      </div>
                      <div className="flex justify-center text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                        <div className="flex justify-center items-center gap-3 px-5 py-2 rounded-md">
                          <img
                            src={monthlyExpensesIcon}
                            alt="puch"
                            className="w-11 sm:w-9"
                          />
                          {/* {(monthlyExpenses + monthExpenses).toLocaleString()} */}
                          <NumberFlow
                            value={monthlyExpenses + monthExpenses}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Total Profit */}
                    <div className="bg-white h-hfull rounded-lg shadow-sm border border-light w-full min-w-[30%]">
                      <div className="flex items-center justify-center gap-2 pb-1 pt-3 xs:px-3">
                        <p className="sm:text-sm text-base font-semibold">
                          Profit
                        </p>
                      </div>
                      <div
                        className={
                          monthlyProfit < 0
                            ? "flex justify-center text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                            : "flex justify-center text-2xl text-greens font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                        }
                      >
                        <div className="flex justify-center items-center gap-3 px-5 py-2 rounded-md">
                          <img
                            src={monthlyProfitIcon}
                            alt="puch"
                            className="w-11 sm:w-9"
                          />
                          <NumberFlow
                            value={monthlyProfit}
                            trend={5}
                            spinTiming={{
                              duration: 1500,
                              easing: "ease-in-out",
                            }}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg mx-5 xl:ml-24 lg:ml-5">
        <div className="grid grid-flow-col justify-center place-items-center gap-2 xxs:flex xxs:items-center xxs:justify-center xxs:gap-0">
          <div className="font-bold text-2xl text-center items-center justify-center py-5">
            Yearly Summary
          </div>
          <div className="flex items-center xxs:pr-5">
            <div>
              <FaAngleLeft
                className="text-oranges text-2xl hover:text-loranges cursor-pointer"
                onClick={prevYear}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-center text-2xl text-oranges select-none">
                {
                  /* display current month and year */
                  dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                }
              </h1>
            </div>
            <div>
              <FaAngleRight
                className="text-oranges text-2xl hover:text-loranges cursor-pointer"
                onClick={nextYear}
              />
            </div>
          </div>
        </div>
        <BusinessYearlySummary />
      </div>
    </>
  );
};

export default BusinessSummary;
