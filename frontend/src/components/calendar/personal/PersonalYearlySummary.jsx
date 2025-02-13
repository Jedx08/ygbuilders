import { CalendarContext } from "../../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chartjs, do not remove
import { Bar } from "react-chartjs-2";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import useGetPersonalData from "../../../hooks/useGetPersonalData";
import usePersonalExpenses from "../../../hooks/usePersonalExpenses";
import yearlyGrossIcon from "../../../media/yearpouch.png";
import yearlyExpensesIcon from "../../../media/yearexpenses.png";
import yearlyNetIcon from "../../../media/yearprofit.png";
import NumberFlow from "@number-flow/react";

const BusinessYearlySummary = () => {
  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();

  const {
    monthIndex,
    setMonthIndex,
    personalIncomeData,
    personalIncomeLoading,
    setPersonalIncomeLoading,
    personalExpensesData,
    personalExpensesLoading,
    setPersonalExpensesLoading,
  } = useContext(CalendarContext);

  const [yearlyGross, setYearlyGross] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [grossCount, setGrossCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setNetCount] = useState([]);

  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  // dayjs months (jan - dec)
  dayjs.extend(localeData);
  dayjs().localeData();
  const months = dayjs.months();

  const newMonths = months.map((month) => {
    return month.slice(0, 3);
  });

  // calculated yearly net
  const yearlyNet = yearlyGross - (yearlyExpenses + thisYearMonthlyExpenses);

  // getting monthlyExpenses
  // will re-trigger when personalExpensesLoading is set to true
  useEffect(() => {
    if (personalExpensesLoading) {
      getMonthlyExpenses();
      setPersonalExpensesLoading(false);
    }
  }, [personalExpensesLoading]);

  // getting personalIncome
  // will re-trigger when personalIncomeLoading is set to true
  useEffect(() => {
    if (personalIncomeLoading) {
      getPersonalData();
      setPersonalIncomeLoading(false);
    }
  }, [personalIncomeLoading]);

  // calculation for yearly income
  useEffect(() => {
    let g = 0;
    let e = 0;
    let m_e = 0;

    const YearlyIncomeData = async () => {
      personalIncomeData
        .filter(
          (data) =>
            dayjs(data.day).format("YYYY") ===
            dayjs().month(monthIndex).format("YYYY")
        )
        .forEach((data) => {
          (g += data.gross), (e += data.expenses);
        });

      setYearlyGross(g);
      setYearlyExpenses(e);
    };

    const thisYearMonthlyExpenses = async () => {
      personalExpensesData
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
  }, [personalIncomeData, personalExpensesData, monthIndex]);

  // calculation for bar graph data
  useEffect(() => {
    const barGraphData = async () => {
      const allMonths = dayjs.months();

      const filteredData = personalIncomeData.filter(
        (data) =>
          dayjs(data.day).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      const filteredMonthlyExpenses = personalExpensesData.filter(
        (data) =>
          dayjs(data.month).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      //calculate yearly gross
      let grossPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        grossPerDate.push(0);
      }

      grossPerDate.map((months, index) => {
        let g = 0;

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            g += data.gross;
          });

        grossPerDate[index] = g;
      });

      setGrossCount(grossPerDate);

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

      //calculate yearly net
      let netPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        netPerDate.push(0);
      }

      netPerDate.map((months, index) => {
        let n = 0;
        let m_e = 0;

        filteredMonthlyExpenses
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            m_e += data.amount;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            n += data.net;
          });

        netPerDate[index] = n - m_e;
      });

      setNetCount(netPerDate);
      setIsLoading(false);
    };

    barGraphData();
  }, [monthIndex, personalIncomeData, personalExpensesData]);

  //identifier if yearly data should be displayed or not
  const setGraphDataDisplay = [];

  for (let i = 0; i < grossCount.length; i++) {
    if ((grossCount[i] || expensesCount[i] || netCount[i]) !== 0) {
      setGraphDataDisplay.push(true);
    } else {
      setGraphDataDisplay.push(false);
    }
  }

  // next and previous year functions
  const nextYear = () => {
    setMonthIndex(monthIndex + 12);
  };

  const prevYear = () => {
    setMonthIndex(monthIndex - 12);
  };

  return (
    <>
      <div
        id="yearlyIncome"
        className="bg-white mx-5 px-5 rounded-lg shadow-sm"
      >
        <div className="w-full grid grid-flow-col justify-center place-items-center gap-2 xs:pt-2 xxs:flex xxs:flex-col xxs:items-center xxs:justify-center xxs:gap-0">
          <div className="font-bold text-2xl text-center items-center justify-center py-5 sm:text-2xl xxs:py-2">
            Yearly Summary
          </div>
          <div className="flex items-center justify-center xxs:pb-3">
            <div>
              <FaAngleLeft
                className="text-greens text-2xl hover:text-lgreens cursor-pointer sm:text-2xl"
                onClick={prevYear}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-center text-2xl text-greens select-none sm:text-2xl">
                {
                  /* display current month and year */
                  dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                }
              </h1>
            </div>
            <div>
              <FaAngleRight
                className="text-greens text-2xl hover:text-lgreens cursor-pointer ssm:text-2xl"
                onClick={nextYear}
              />
            </div>
          </div>
        </div>

        {/* bar graph and overview */}
        {isLoading ? (
          <div className="w-full bg-white p-5 rounded-lg flex items-center flex-col md:w-full">
            <div className="w-[35%]">
              <Skeleton />
            </div>
            <div className="w-[100%]">
              <Skeleton height={500} />
            </div>
          </div>
        ) : (
          <div className="w-full flex pb-5 xs:flex-col-reverse gap-5 xs:pb-5">
            <div
              id="barGraphOverview"
              className="w-[35%] flex flex-col gap-5 rounded-md justify-center items-center md:p-0 xs:w-full xs:flex-row"
            >
              <div className="flex flex-col w-full h-hfull justify-center items-center gap-2 border border-light bg-white shadow-sm rounded-md px-5 py-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-base font-semibold sm:text-sm">
                    Gross
                  </div>
                </div>
                <div className=" px-4 rounded-md py-2 flex justify-center gap-3 text-2xl text-oranges font-bold sm:text-xl ssm:font-semibold">
                  <img
                    src={yearlyGrossIcon}
                    alt="yearly capital"
                    className="w-11 sm:w-9"
                  />
                  <NumberFlow
                    value={yearlyGross}
                    trend={5}
                    spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                    format={{
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full h-hfull justify-center items-center gap-2 border border-light bg-white shadow-sm rounded-md px-5 py-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-base font-semibold sm:text-sm">
                    Expenses
                  </div>
                </div>
                <div className=" px-4 rounded-md py-2 flex justify-center gap-3 text-2xl text-[red] font-bold sm:text-xl ssm:font-semibold">
                  <img
                    src={yearlyExpensesIcon}
                    alt="yearly expenses"
                    className="w-11 sm:w-9"
                  />
                  {/* {(yearlyExpenses + thisYearMonthlyExpenses).toLocaleString()} */}
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
              <div className="flex flex-col w-full h-hfull justify-center items-center gap-2 border border-light bg-white shadow-sm rounded-md px-5 py-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-base font-semibold sm:text-sm">Net</div>
                </div>
                <div
                  className={
                    yearlyNet < 0
                      ? " px-4 rounded-md py-2 flex justify-center gap-3 text-2xl font-bold text-[red] sm:text-xl ssm:font-semibold"
                      : " px-4 rounded-md py-2 flex justify-center gap-3 text-2xl font-bold text-greens sm:text-xl ssm:font-semibold"
                  }
                >
                  <img
                    src={yearlyNetIcon}
                    alt="yearly net"
                    className="w-11 sm:w-9"
                  />
                  <NumberFlow
                    value={yearlyNet}
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

            <div id="barGraph" className="w-[65%] xs:w-full">
              <div className="w-full bg-white p-5 rounded-lg border border-light overflow-y-auto shadow-sm">
                <div className="h-[400px] w-full lg:w-[800px]">
                  <Bar
                    className="w-full h-hfull"
                    data={{
                      labels: newMonths,
                      datasets: [
                        {
                          label: "Gross",
                          data: grossCount,
                          borderColor: "#ff9f1c",
                          backgroundColor: "#fdac3a",
                        },
                        {
                          label: "Expenses",
                          data: expensesCount,
                          borderColor: "#ff6384",
                          backgroundColor: "#FA829C",
                        },
                        {
                          label: "Net",
                          data: netCount,
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
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BusinessYearlySummary;
