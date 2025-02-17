import { useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import usePersonalExpenses from "../../../hooks/usePersonalExpenses";
import useGetPersonalData from "../../../hooks/useGetPersonalData";
import dayjs from "dayjs";
// import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Line } from "react-chartjs-2";
import { CalendarContext } from "../../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import pouch from "../../../media/pouch.png";
import expensesIcon from "../../../media/expenses.png";
import networth from "../../../media/networth.png";
import monthlyGrossIcon from "../../../media/monpouch.png";
import monthlyExpensesIcon from "../../../media/monexpenses.png";
import monthlyNetIcon from "../../../media/monprofit.png";
import PersonalYearlySummary from "./PersonalYearlySummary";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";
import { BsInfoCircle } from "react-icons/bs";
import NumberFlow from "@number-flow/react";

const PersonalSummary = () => {
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

  const { userInfo, setUserInfo } = useAuth();

  const thisMonth = dayjs().month(monthIndex).format("MMMM");

  const [gross, setGross] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const [grossCount, setGrossCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setNetCount] = useState([]);

  const [monthlyGross, setMonthlyGross] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [monthExpenses, setMonthExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [instructions, setInstructions] = useState(null);

  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();
  const axiosPrivate = useAxiosPrivate();

  const overallNet = gross - expenses;

  const monthlyNet = monthlyGross - monthlyExpenses;

  // data labels (numbers in charts)
  // Chart.register(ChartDataLabels);

  //number of days per month using dayjs
  const monthCount = dayjs().month(monthIndex).daysInMonth();

  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }

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

  // calculation for line graph data
  useEffect(() => {
    const lineGraphData = async () => {
      const filteredData = personalIncomeData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );

      const monthCount = dayjs().month(monthIndex).daysInMonth();

      //get line graph capital
      let grossPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        grossPerDate.push(0);
      }
      setGrossCount(grossPerDate);

      filteredData.map((data) => {
        grossPerDate.map(() => {
          grossPerDate[dayjs(data.day).format("D") - 1] = data.gross;
        });

        setGrossCount(grossPerDate);
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
      let netPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        netPerDate.push(0);
      }
      setNetCount(netPerDate);

      filteredData.map((data) => {
        netPerDate.map(() => {
          netPerDate[dayjs(data.day).format("D") - 1] = data.net;
        });

        setNetCount(netPerDate);
      });
    };

    lineGraphData();
  }, [personalIncomeData, monthIndex]);

  //calculation for monthly income
  useEffect(() => {
    let g = 0;
    let e = 0;
    let m_e = 0;

    const monthlyIncomeData = async () => {
      personalIncomeData
        .filter(
          (data) =>
            dayjs(data.day).format("MM-YY") ===
            dayjs().month(monthIndex).format("MM-YY")
        )
        .forEach((data) => {
          g += data.gross;
          e += data.expenses;
        });

      setMonthlyGross(g);
      setMonthlyExpenses(e);
      setIsLoading(false);
    };

    const monthlyExpensesData = async () => {
      personalExpensesData
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
  }, [personalIncomeData, personalExpensesData, monthIndex]);

  // calculation for overall income
  useEffect(() => {
    let g = 0;
    let e = 0;

    setIsLoading(true);
    const overallData = async () => {
      personalIncomeData.forEach((data) => {
        return (g += data.gross), (e += data.expenses);
      });

      personalExpensesData.forEach((data) => {
        return (e += data.amount);
      });

      setGross(g);
      setExpenses(e);
      setIsLoading(false);
    };

    overallData();
  }, [personalIncomeData, personalExpensesData]);

  // next and prev month functions
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  // identifier if instructions is already shown
  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);
        if (userInfo?.instructions?.dashboard) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, []);

  // saving instructions to db
  useEffect(() => {
    const toggleInstructions = async () => {
      try {
        if (instructions) {
          await axiosPrivate.patch(
            "/user/instructions",
            JSON.stringify({ instructions: instructions })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    toggleInstructions();
  }, [instructions]);

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
              "Displays a summary of your financial performance, including net income, gross income, and total expenses. This helps you quickly assess your financial status.",
          },
        },
        {
          element: "#monthlyIncome",
          popover: {
            title: "Monthly Income",
            description:
              "Shows a detailed breakdown of your gross income, expenses, and net income for the selected month. You can change the graph view by clicking the colored buttons.",
          },
        },
        {
          element: "#yearlyIncome",
          popover: {
            title: "Yearly Income",
            description:
              "Provides an annual financial overview, displaying gross income, expenses, and net income across all months. A bar chart helps visualize income and spending trends for better financial planning.",
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

    setUserInfo((prev) => ({
      ...prev,
      instructions: { ...prev.instructions, dashboard: false },
    }));
  };

  return (
    <div>
      {/* instructions */}
      <div
        id="instructions"
        onClick={() => {
          showTour();
        }}
        className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-sm rounded-md mt-5 cursor-pointer border border-white hover:border-lgreens text-sm mmd:text-xs md:py-1 mx-auto`}
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
          className={`flex justify-center items-center text-greens font-bold pb-2 text-2xl sm:text-xl`}
        >
          Overall Income
        </div>
        <div className="flex items-center justify-evenly flex-wrap gap-2 mt-1 xl:px-3">
          <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
            <div className="text-base font-semibold text-center mdd:text-sm">
              Net
            </div>
            <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={networth}
                  alt="net"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div
                className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                  overallNet < 0 ? "text-[red]" : "text-greens"
                }`}
              >
                <NumberFlow
                  value={overallNet}
                  trend={5}
                  spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                  format={{
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }}
                />
              </div>
              <div>
                {overallNet < 0 ? (
                  <PiChartLineDown className="text-3xl mdd:text-2xl sm:text-xl text-[#ff3a33]" />
                ) : (
                  <PiChartLineUp className="text-3xl mdd:text-2xl sm:text-xl text-[#32ca5b]" />
                )}
              </div>
            </div>
          </div>
          <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
            <div className="text-base font-semibold text-center mdd:text-sm">
              Gross
            </div>
            <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img src={pouch} alt="gross" className="w-14 mdd:w-11 sm:w-9" />
              </div>
              <div className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                {
                  <NumberFlow
                    value={gross}
                    trend={5}
                    spinTiming={{ duration: 1500, easing: "linear" }}
                    format={{
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }}
                  />
                }
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
                <NumberFlow
                  value={expenses}
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

      <></>
      <div
        id="monthlyIncome"
        className="bg-white mb-5 py-5 mx-5 rounded-lg shadow-sm xl:ml-24 lg:ml-5"
      >
        <div className="font-pops">
          <div
            id="overallIncome"
            className="hidden bg-white shadow-sm rounded-lg mb-5 py-5 mx-5 xl:ml-24 lg:block lg:ml-5"
          >
            <div
              className={`flex justify-center items-center text-greens font-bold pb-2 text-2xl sm:text-xl`}
            >
              Monthly Summary
            </div>
            <div className="flex items-center justify-evenly flex-wrap gap-2 mt-1 xl:px-3">
              <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                <div className="text-base font-semibold text-center mdd:text-sm">
                  Net
                </div>
                <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                  <div>
                    <img
                      src={monthlyNetIcon}
                      alt="net"
                      className="w-14 mdd:w-11 sm:w-9"
                    />
                  </div>
                  <div
                    className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                      overallNet < 0 ? "text-[red]" : "text-greens"
                    }`}
                  >
                    <NumberFlow
                      value={monthlyNet}
                      trend={5}
                      spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                      format={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }}
                    />
                  </div>
                  <div>
                    {overallNet < 0 ? (
                      <PiChartLineDown className="text-3xl mdd:text-2xl sm:text-xl text-[#ff3a33]" />
                    ) : (
                      <PiChartLineUp className="text-3xl mdd:text-2xl sm:text-xl text-[#32ca5b]" />
                    )}
                  </div>
                </div>
              </div>
              <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
                <div className="text-base font-semibold text-center mdd:text-sm">
                  Gross
                </div>
                <div className="px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                  <div>
                    <img
                      src={monthlyGrossIcon}
                      alt="gross"
                      className="w-14 mdd:w-11 sm:w-9"
                    />
                  </div>
                  <div className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                    {
                      <NumberFlow
                        value={monthlyGross}
                        trend={5}
                        spinTiming={{ duration: 1500, easing: "linear" }}
                        format={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                      />
                    }
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
                      value={monthExpenses + monthlyExpenses}
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

          {isLoading ? (
            <div className="w-[60%] bg-white p-5 rounded-lg flex items-center flex-col md:w-[90%] ">
              <div className="w-[35%]">
                <Skeleton />
              </div>
              <div className="w-[100%]">
                <Skeleton height={500} />
              </div>
            </div>
          ) : (
            <div className="bg-white w-full flex gap-5 px-5 xs:flex-col">
              <div className="w-[65%] lg:w-full">
                <span>
                  <div className="bg-white border border-light py-4 rounded-md shadow-sm overflow-y-auto px-3">
                    <div className="w-full flex justify-center text-xl text-greens font-pops font-bold py-3">
                      <div className="flex w-full gap-2 items-center">
                        <div className="flex justify-start">
                          <div>
                            <FaAngleLeft
                              className="text-greens text-2xl hover:text-lgreens cursor-pointer ssm:text-3xl"
                              onClick={handlePrevMonth}
                            />
                          </div>
                          <div>
                            <FaAngleRight
                              className="text-greens text-2xl hover:text-lgreens cursor-pointer ssm:text-3xl"
                              onClick={handleNextMonth}
                            />
                          </div>
                        </div>{" "}
                        {thisMonth}
                      </div>
                    </div>
                    <div className="h-[400px] w-full">
                      <Line
                        className="w-full"
                        data={{
                          labels: dayCount,
                          datasets: [
                            {
                              label: "Gross",
                              data: grossCount,
                              borderColor: "#ff9f1c",
                              backgroundColor: "#fdac3a",
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
                              label: "Net",
                              data: netCount,
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
                                    label.hidden =
                                      !chart.isDatasetVisible(index);
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
                </span>
              </div>
              <div className="w-[35%] flex flex-col gap-5 rounded-md justify-center items-center lg:hidden md:p-0 xs:w-full xs:flex-row">
                <div className="font-bold text-greens text-2xl text-center items-center justify-center lg:text-2xl ssm:text-xl">
                  Monthly Summary{" "}
                </div>
                <div className="flex flex-col w-full h-hfull justify-center items-center gap-2 border border-light bg-white shadow-sm rounded-md px-5 py-3">
                  <div className="flex items-center justify-center gap-2 xs:flex-col">
                    <div className="text-base font-semibold sm:text-sm">
                      Gross
                    </div>
                  </div>
                  <div className=" px-4 rounded-md py-2 flex gap-3 text-2xl text-oranges font-bold sm:text-xl ssm:font-semibold">
                    <img
                      src={monthlyGrossIcon}
                      alt="yearly capital"
                      className="w-11 sm:w-9"
                    />
                    <NumberFlow
                      value={monthlyGross}
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
                  <div className="flex items-center justify-center gap-2 xs:flex-col">
                    <div className="text-base font-semibold sm:text-sm">
                      Expenses
                    </div>
                  </div>
                  <div className=" px-4 rounded-md py-2 flex gap-3 text-2xl text-[red] font-bold sm:text-xl ssm:font-semibold">
                    <img
                      src={monthlyExpensesIcon}
                      alt="yearly expenses"
                      className="w-11 sm:w-9"
                    />
                    <NumberFlow
                      value={monthExpenses + monthlyExpenses}
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
                  <div className="flex items-center justify-center gap-2 xs:flex-col">
                    <div className="text-base font-semibold sm:text-sm">
                      Net
                    </div>
                  </div>
                  <div
                    className={
                      monthlyNet < 0
                        ? " px-4 rounded-md py-2 flex gap-3 text-2xl font-bold text-[red] sm:text-xl ssm:font-semibold"
                        : " px-4 rounded-md py-2 flex gap-3 text-2xl font-bold text-greens sm:text-xl ssm:font-semibold"
                    }
                  >
                    <img
                      src={monthlyNetIcon}
                      alt="yearly net"
                      className="w-11 sm:w-9"
                    />
                    <NumberFlow
                      value={monthlyNet}
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
          )}
        </div>
      </div>
      <PersonalYearlySummary />
    </div>
  );
};

export default PersonalSummary;
