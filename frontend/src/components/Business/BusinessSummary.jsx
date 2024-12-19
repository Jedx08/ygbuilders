import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Line } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import capitalIcon from "../../media/bus_pouch.png";
import salesIcon from "../../media/bus_sales.png";
import expensesIcon from "../../media/bus_expenses.png";
import profitIcon from "../../media/bus_profit.png";
import monthlyCapitalIcon from "../../media/busmon_pouch.png";
import monthlySalesIcon from "../../media/busmon_sales.png";
import monthlyExpensesIcon from "../../media/busmon_expenses.png";
import monthlyProfitIcon from "../../media/busmon_net.png";
import BusinessYearlySummary from "./BusinessYearlySummary";

const BusinessSummary = () => {
  const {
    monthIndex,
    setMonthIndex,
    personalSummaryView,
    setPersonalSummaryView,
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

  Chart.register(ChartDataLabels);

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

  return (
    <>
      <div className="flex space-x-10 p-5">
        <div className="flex py-5 gap-5 xs:p-0 ssm:gap-3 xs:py-0">
          <div
            className={`shadow-lg px-5 py-3 rounded-md font-bold xl:text-sm xl:px-3 xl:py-2
             ${
               personalSummaryView
                 ? "bg-loranges text-white cursor-default"
                 : "bg-white cursor-pointer hover:text-lgreens"
             }
            `}
            onClick={() => {
              setPersonalSummaryView(true);
            }}
          >
            Personal
          </div>
          <div
            className={`shadow-lg px-5 py-3 rounded-md font-bold xl:text-sm xl:px-3 xl:py-2 
              ${
                personalSummaryView
                  ? "bg-white cursor-pointer hover:text-loranges"
                  : "bg-loranges text-white cursor-default"
              }
            `}
            onClick={() => {
              setPersonalSummaryView(false);
            }}
          >
            Business
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="flex">
            <div>
              <FaAngleLeft
                className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                onClick={handlePrevMonth}
              />
            </div>
            <div>
              <FaAngleRight
                className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                onClick={handleNextMonth}
              />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-center text-4xl text-oranges xl:text-3xl ssm:hidden">
              {
                /* display current month and year */
                dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
              }
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full pb-10 ssm:pb-0">
        <div className="w-full px-5 gap-3 flex mdd:flex-col">
          <div className="bg-loranges w-[40%] rounded-lg shadow-lg p-5 space-y-3 mdd:w-full">
            <div className="flex items-start justify-between gap-2 xs:flex-col">
              <div className="text-white text-xl xl:text-lg">
                Overall Profit
              </div>
              <p className="bg-white px-5 py-3 rounded-lg text-loranges font-semibold cursor-pointer xl:text-sm xl:px-3 xl:py-2">
                Calendar
              </p>
            </div>
            <div
              className={
                overallProfit < 0
                  ? "text-5xl text-[red] font-bold xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl"
                  : "text-5xl text-white font-bold xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl"
              }
            >
              {overallProfit.toLocaleString()}
            </div>
          </div>
          <div className="flex w-full space-x-3">
            <div className="bg-white w-full rounded-lg shadow-lg">
              <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
                <img
                  src={capitalIcon}
                  alt="capital icon"
                  className="w-9 sm:w-7"
                />
                <div className="font-medium">Capital</div>
              </div>
              <div className="text-4xl text-oranges w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
                {capital.toLocaleString()}
              </div>
            </div>
            <div className="bg-white w-full rounded-lg shadow-lg">
              <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
                <img src={salesIcon} alt="sales icon" className="w-9 sm:w-7" />
                <div className="font-medium">Sales</div>
              </div>
              <div className="text-4xl text-[#399CB4] w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
                {sales.toLocaleString()}
              </div>
            </div>
            <div className="bg-white w-full rounded-lg shadow-lg">
              <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
                <img
                  src={expensesIcon}
                  alt="expenses icon"
                  className="w-9 sm:w-7"
                />
                <div className="font-medium">Expenses</div>
              </div>
              <div className="text-4xl text-[red] w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
                {(expenses + overallMonthlyExpenses).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex font-bold text-3xl text-center items-center justify-center py-5 lg:text-2xl ssm:text-xl">
        Monthly Summary ({thisMonth})
      </div>

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
            <div className="w-full flex gap-5 xs:flex-col">
              <div className="bg-white w-[70%]  xs:w-full p-4 rounded-lg shadow-lg overflow-y-auto">
                <div className="h-[600px] w-full md:h-[400px] lg:w-[800px]">
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
                          align: "start",
                          labels: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                        ChartDataLabels,
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
              <div className="w-[30%]  xs:w-full">
                <div className="h-hfull w-full flex flex-col items-center justify-center gap-2 md:w-[90%] ssm:w-[100%] xs:flex-row">
                  {/* Total Capital */}
                  <div className="bg-white h-hfull rounded-lg shadow-lg w-full min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                      <img
                        src={monthlyCapitalIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Capital</p>
                    </div>
                    <div className="text-2xl text-oranges font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                      {monthlyCapital.toLocaleString()}
                    </div>
                  </div>
                  {/* Sales */}
                  <div className="bg-white h-hfull rounded-lg shadow-lg w-full min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                      <img
                        src={monthlySalesIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Sales</p>
                    </div>
                    <div className="text-2xl text-[#399CB4] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                      {monthlySales.toLocaleString()}
                    </div>
                  </div>
                  {/* Expenses */}
                  <div className="bg-white h-hfull rounded-lg shadow-lg w-full min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                      <img
                        src={monthlyExpensesIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Expenses</p>
                    </div>
                    <div className="text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                      {(monthlyExpenses + monthExpenses).toLocaleString()}
                    </div>
                  </div>

                  {/* Total Profit */}
                  <div className="bg-white h-hfull rounded-lg shadow-lg w-full min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3 xs:px-3">
                      <img
                        src={monthlyProfitIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Profit</p>
                    </div>
                    <div
                      className={
                        monthlyProfit < 0
                          ? "text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                          : "text-2xl text-greens font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                      }
                    >
                      {monthlyProfit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-2 xxs:flex xxs:items-center xxs:justify-center xxs:gap-0">
          <div className="font-bold text-3xl text-center items-center justify-center py-5 ssm:text-2xl">
            Yearly Summary
          </div>
          <div className="flex items-center xxs:pr-5">
            <div>
              <FaAngleLeft
                className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                onClick={prevYear}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-center text-4xl text-oranges select-none ssm:text-3xl">
                {
                  /* display current month and year */
                  dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                }
              </h1>
            </div>
            <div>
              <FaAngleRight
                className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
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
