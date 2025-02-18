import { CalendarContext } from "../../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useGetBusinessData from "../../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../../hooks/useBusinessExpenses";
import useBusinessCapital from "../../../hooks/useBusinessCapital";
import yearlyCapitalIcon from "../../../media/busyear_pouch.png";
import yearlySalesIcon from "../../../media/busyear_sales.png";
import yearlyExpensesIcon from "../../../media/busyear_expenses.png";
import yearlyProfitIcon from "../../../media/busyear_net.png";
import NumberFlow from "@number-flow/react";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";

const BusinessYearlySummary = () => {
  const getBusinessData = useGetBusinessData();
  const getMonthlyExpenses = useBusinessExpenses();
  const getMonthlyCapital = useBusinessCapital();

  const {
    monthIndex,
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

  const [yearlyCapital, setYearlyCapital] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [capitalCount, setCapitalCount] = useState([]);
  const [salesCount, setSalesCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [profitCount, setProfitCount] = useState([]);

  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const yearlyProfit =
    yearlySales - yearlyExpenses - thisYearMonthlyExpenses - yearlyCapital;

  // dayjs months (jan - dec)
  dayjs.extend(localeData);
  dayjs().localeData();
  const months = dayjs.months();
  const newMonths = months.map((month) => {
    return month.slice(0, 3);
  });

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

  // calculation for yearly income
  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const YearlyIncomeData = async () => {
      businessIncomeData
        .filter(
          (data) =>
            dayjs(data.day).format("YYYY") ===
            dayjs().month(monthIndex).format("YYYY")
        )
        .forEach((data) => {
          (c += data.capital), (s += data.sales), (e += data.expenses);
        });

      businessCapitalData
        .filter(
          (data) =>
            dayjs(data.moth).format("YYYY") ===
            dayjs().month(monthIndex).format("YYYY")
        )
        .forEach((data) => {
          m_c += data.amount;
        });

      setYearlyCapital(c + m_c);
      setYearlySales(s);
      setYearlyExpenses(e);
      setIsLoading(false);
    };

    const thisYearMonthlyExpenses = async () => {
      businessExpensesData
        .filter(
          (data) =>
            data.month.split(" ")[1] ===
            dayjs().month(monthIndex).format("YYYY")
        )
        .forEach((data) => {
          m_e += data.amount;
        });

      setThisYearMonthlyExpenses(m_e);
    };

    thisYearMonthlyExpenses();
    YearlyIncomeData();
  }, [
    monthIndex,
    businessCapitalData,
    businessExpensesData,
    businessIncomeData,
  ]);

  // calculation for bar graph data
  useEffect(() => {
    const barGraphData = async () => {
      const allMonths = dayjs.months();

      const filteredData = businessIncomeData.filter(
        (data) =>
          dayjs(data.day).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      const filteredMonthlyCapital = businessCapitalData.filter(
        (data) =>
          dayjs(data.month).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      const filteredMonthlyExpenses = businessExpensesData.filter(
        (data) =>
          dayjs(data.month).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      //calculate yearly capital
      let capitalPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        capitalPerDate.push(0);
      }

      capitalPerDate.map((months, index) => {
        let c = 0;
        let mc = 0;

        filteredMonthlyCapital
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            mc += data.amount;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            c += data.capital;
          });

        capitalPerDate[index] = c + mc;
      });

      setCapitalCount(capitalPerDate);

      //calculate yearly sales
      let salesPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        salesPerDate.push(0);
      }

      salesPerDate.map((months, index) => {
        let c = 0;

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            c += data.sales;
          });

        salesPerDate[index] = c;
      });

      setSalesCount(salesPerDate);

      //calculate yearly expenses
      let expensesPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        expensesPerDate.push(0);
      }

      expensesPerDate.map((months, index) => {
        let e = 0;
        let me = 0;

        filteredMonthlyExpenses
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            me += data.amount;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            e += data.expenses;
          });

        expensesPerDate[index] = e + me;
      });

      setExpensesCount(expensesPerDate);

      //calculate yearly profit
      let profitPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        profitPerDate.push(0);
      }

      profitPerDate.map((months, index) => {
        let c = 0;
        let s = 0;
        let e = 0;
        let m_c = 0;
        let m_e = 0;

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            e += data.expenses;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            s += data.sales;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            c += data.capital;
          });

        filteredMonthlyCapital
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            m_c += data.amount;
          });

        filteredMonthlyExpenses
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            m_e += data.amount;
          });

        profitPerDate[index] = s - e - m_e - m_c - c;
      });

      setProfitCount(profitPerDate);
    };

    barGraphData();
  }, [
    monthIndex,
    businessCapitalData,
    businessExpensesData,
    businessIncomeData,
  ]);

  //identifier if yearly data should be displayed or not
  const setGraphDataDisplay = [];

  for (let i = 0; i < capitalCount.length; i++) {
    if (
      (capitalCount[i] ||
        salesCount[i] ||
        expensesCount[i] ||
        profitCount[i]) !== 0
    ) {
      setGraphDataDisplay.push(true);
    } else {
      setGraphDataDisplay.push(false);
    }
  }

  return (
    <>
      <div id="yearlyIncome" className="w-full gap-5 pb-5 px-5 shadow-sm">
        {isLoading ? (
          <div className="w-full  bg-white p-5 rounded-lg flex items-center flex-col md:w-full">
            <div className="w-[35%]">
              <Skeleton />
            </div>
            <div className="w-[100%]">
              <Skeleton height={500} />
            </div>
          </div>
        ) : (
          <>
            {/* <div className="bg-white shadow-sm rounded-lg p-5">
              <div className="flex items-center justify-evenly flex-wrap gap-2 mt-1 xl:px-3">
                <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                  <div className="text-base font-semibold text-center mdd:text-sm">
                    Profit
                  </div>
                  <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                    <div>
                      <img
                        src={yearlyProfitIcon}
                        alt="net"
                        className="w-14 mdd:w-11 sm:w-9"
                      />
                    </div>
                    <div
                      className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                        yearlyProfit < 0 ? "text-[red]" : "text-greens"
                      }`}
                    >
                      <NumberFlow
                        value={yearlyProfit}
                        trend={5}
                        spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                        format={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </div>
                    <div>
                      {yearlyProfit < 0 ? (
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
                        src={yearlyCapitalIcon}
                        alt="gross"
                        className="w-14 mdd:w-11 sm:w-9"
                      />
                    </div>
                    <div className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                      <NumberFlow
                        value={yearlyCapital}
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
                        src={yearlySalesIcon}
                        alt="gross"
                        className="w-14 mdd:w-11 sm:w-9"
                      />
                    </div>
                    <div className="text-[#399CB4] font-bold text-2xl mdd:text-xl sm:text-lg">
                      <NumberFlow
                        value={yearlySales}
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
                        src={yearlyExpensesIcon}
                        alt="expenses"
                        className="w-14 mdd:w-11 sm:w-9"
                      />
                    </div>
                    <div className="text-[red] font-bold text-2xl mdd:text-xl sm:text-lg">
                      <NumberFlow
                        value={yearlyExpenses + thisYearMonthlyExpenses}
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
            </div> */}

            <div>
              {/* Yearly Summary */}
              <div className="hidden bg-white h-hfit rounded-lg lg:block">
                <div>
                  <div className="grid grid-cols-4 gap-2 py-2 lg:grid-cols-2 lg:grid-rows-2 xxs:grid-rows-4 xxs:grid-cols-1">
                    {/* Yearly Capital */}
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg w-fit mx-auto lg:w-full">
                      <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                        Capital
                      </div>
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center lg:mx-auto`}
                        >
                          <img
                            src={yearlyCapitalIcon}
                            alt="mon_capital"
                            className={`w-14 mdd:w-10`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-oranges font-bold text-xl/[24px] mdd:text-lg">
                            <NumberFlow
                              value={yearlyCapital}
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
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Yearly Sales */}
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg w-fit mx-auto lg:w-full">
                      <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                        Sales
                      </div>
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center lg:mx-auto`}
                        >
                          <img
                            src={yearlySalesIcon}
                            alt="mon_sales"
                            className={`w-14 mdd:w-10`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-[#399CB4] font-bold text-xl/[24px] mdd:text-lg">
                            <NumberFlow
                              value={yearlySales}
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
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Yearly Expenses */}
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg w-fit mx-auto lg:w-full">
                      <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                        Expenses
                      </div>
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center lg:mx-auto`}
                        >
                          <img
                            src={yearlyExpensesIcon}
                            alt="mon_expenses"
                            className={`w-14 mdd:w-10`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-[red] font-bold text-xl/[24px] mdd:text-lg">
                            <NumberFlow
                              value={yearlyExpenses + thisYearMonthlyExpenses}
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
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Yearly Profit */}
                    <div className="border border-light shadow-sm px-5 py-2 rounded-lg w-fit mx-auto lg:w-full">
                      <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                        Profit
                      </div>
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center lg:mx-auto`}
                        >
                          <img
                            src={yearlyProfitIcon}
                            alt="mon_profit"
                            className={`w-14 mdd:w-10`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p
                            className={`font-bold text-xl/[24px] mdd:text-lg ${
                              yearlyProfit < 0 ? "text-[red]" : "text-greens"
                            }`}
                          >
                            <NumberFlow
                              value={yearlyProfit}
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
                          </p>
                          {yearlyProfit < 0 ? (
                            <PiChartLineDown className="text-2xl text-[#ff3a33] mdd:text-lg" />
                          ) : (
                            <PiChartLineUp className="text-2xl text-[#32ca5b] mdd:text-lg" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-light w-full h-hfull bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
              <div className="h-[400px] w-full">
                <Bar
                  className="w-full"
                  data={{
                    labels: newMonths,
                    datasets: [
                      {
                        label: "Capital",
                        data: capitalCount,
                        borderColor: "#ff9f1c",
                        backgroundColor: "#fdac3a",
                      },
                      {
                        label: "Sales",
                        data: salesCount,
                        borderColor: "#399CB4",
                        backgroundColor: "#41B8D5",
                      },
                      {
                        label: "Expenses",
                        data: expensesCount,
                        borderColor: "#ff6384",
                        backgroundColor: "#FA829C",
                      },

                      {
                        label: "Profit",
                        data: profitCount,
                        borderColor: "#2ec4b6",
                        backgroundColor: "#3cd5c5",
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      datalabels: {
                        display: setGraphDataDisplay,
                        anchor: "end",
                        align: "start",
                        color: "#000000",
                        font: {
                          weight: 550,
                          size: 13,
                        },
                      },
                      legend: {
                        align: "center",
                        labels: {
                          font: {
                            size: 15,
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
                    },
                    indexAxis: "x",
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BusinessYearlySummary;
