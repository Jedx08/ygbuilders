import { useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import useGetPersonalData from "../../hooks/useGetPersonalData";
import dayjs from "dayjs";
// import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Line } from "react-chartjs-2";
import { CalendarContext } from "../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import pouch from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networth from "../../media/networth.png";
import monthlyGrossIcon from "../../media/monpouch.png";
import monthlyExpensesIcon from "../../media/monexpenses.png";
import monthlyNetIcon from "../../media/monprofit.png";
import PersonalYearlySummary from "./PersonalYearlySummary";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
    personalSummaryView,
    setPersonalSummaryView,
  } = useContext(CalendarContext);

  const { userInfo } = useAuth();

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

  Chart.register(ChartDataLabels);

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

  // identifier if instructions is already shown
  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);
        if (userInfo.instructions.summary && !isLoading) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, [isLoading]);

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

  // next and prev month functions
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  // driver js tour content
  const showTour = async () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#summaryView",
          popover: {
            title: "Personal-Business button",
            description: "You can change the summary view using these buttons.",
            side: "left",
          },
        },
        {
          element: "#lineGraph",
          popover: {
            title: "Monthly Line Graph",
            description:
              "In here, you can view your Income with a Line Graph. You can change the graph view by clicking the colored buttons.",
          },
        },
        {
          element: "#lineGraphOverview",
          popover: {
            title: "Line Graph Overview",
            description:
              "In this section you can easily see your monthly income information",
          },
        },
        {
          element: "#barGraph",
          popover: {
            title: "Yearly Bar Graph",
            description:
              "Just like the first graph, in this section you can monitor your yearly Income",
          },
        },
        {
          element: "#barGraphOverview",
          popover: {
            title: "Bar Graph Overview",
            description: "Just like the title says",
          },
        },
        {
          element: "#overall",
          popover: {
            title: "Overall Income",
            description: "Here you can see the overall income information",
          },
        },
      ],
    });

    driverObj.drive();

    setInstructions((prev) => ({ ...prev, summary: false }));
  };

  return (
    <div className="">
      <div className="flex space-x-10 p-5">
        <div id="summaryView" className=" py-5 flex space-x-5 ssm:gap-3">
          <div
            className={`shadow-lg px-5 py-3 rounded-md font-bold
             ${
               personalSummaryView
                 ? "bg-lgreens text-white cursor-default"
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
            className={`shadow-lg px-5 py-3 rounded-md font-bold
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

        <div
          id="month"
          className="w-fit flex justify-center items-center gap-2"
        >
          <div className="flex">
            <div>
              <FaAngleLeft
                className="text-greens text-4xl hover:text-lgreens cursor-pointer ssm:text-3xl"
                onClick={handlePrevMonth}
              />
            </div>
            <div>
              <FaAngleRight
                className="text-greens text-4xl hover:text-lgreens cursor-pointer ssm:text-3xl"
                onClick={handleNextMonth}
              />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-center text-4xl text-greens ssm:text-3xl">
              {
                /* display current month and year */
                dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
              }
            </h1>
          </div>
        </div>
      </div>
      <div id="overall" className="w-full pb-10">
        <div className="w-full gap-[2%] px-5 flex text-center">
          <div className="bg-lgreens rounded-lg min-w-[40%] shadow-lg">
            <div className="flex items-start justify-between gap-2 pt-5 px-10 xs:flex-col">
              <p className="text-white text-xl">Overall Net</p>
              <p className="bg-white px-5 py-3 rounded-lg text-lgreens font-semibold cursor-pointer">
                Calendar
              </p>
            </div>
            <div
              className={`w-fit px-10 ${
                overallNet < 0
                  ? "text-5xl text-[red] font-bold pb-4 lg:text-3xl md:text-2xl sm:text-xl"
                  : "text-5xl text-white font-bold pb-4 lg:text-3xl md:text-2xl sm:text-xl"
              }`}
            >
              {overallNet.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[28%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={pouch} alt="puch" className="w-9 sm:w-7" />
              <p className="font-medium">Gross</p>
            </div>
            <div className="text-4xl text-oranges w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {gross.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[28%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={expensesIcon} alt="puch" className="w-9 sm:w-7" />
              <p className="font-medium">Expenses</p>
            </div>
            <div className="text-4xl text-[red] w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {expenses.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex font-bold text-3xl text-center items-center justify-center py-5 ssm:text-2xl">
        Monthly Summary ({thisMonth})
      </div>

      <div className="bg-light font-pops">
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
          <div className="w-full flex">
            <div className="w-[65%] px-5">
              <span id="lineGraph">
                <div className="bg-white py-4 rounded-lg shadow-lg overflow-y-auto px-3">
                  <div className="h-[600px] w-full md:h-[400px] md:w-[800px]">
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
              </span>
            </div>

            <div className="w-[35%] px-5 flex flex-col items-center justify-center gap-5">
              <div className="flex w-full h-[100%] gap-5">
                {/* Monthly Gross */}
                <div className="bg-white w-full rounded-lg shadow-lg">
                  <div className="flex items-center justify-center gap-2 pb-1 pt-3 xs:px-3">
                    <img
                      src={monthlyGrossIcon}
                      alt="gross"
                      className="w-9 sm:w-7"
                    />
                    <p className="sm:text-sm font-medium">Gross</p>
                  </div>
                  <div className="text-2xl text-oranges font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                    {monthlyGross.toLocaleString()}
                  </div>
                </div>
                {/* Monthly Expenses */}
                <div className="bg-white w-full rounded-lg shadow-lg">
                  <div className="flex items-center justify-center gap-2 pb-1 pt-3 xs:px-3">
                    <img
                      src={monthlyExpensesIcon}
                      alt="expenses"
                      className="w-9 sm:w-7"
                    />
                    <p className="sm:text-sm font-medium">Expenses</p>
                  </div>
                  <div className="text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                    {monthlyExpenses.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex w-full h-[100%] gap-5">
                {/* Monthly Net */}
                <div className="bg-white rounded-lg shadow-lg w-full">
                  <div className="flex flex-wrap items-center justify-center gap-2 pb-1 pt-3 px-3 font-medium">
                    <div className="flex items-center gap-1 sm:text-sm">
                      <img
                        src={monthlyNetIcon}
                        alt="month expenses"
                        className="w-9 sm:w-7"
                      />
                      Monthly net
                    </div>
                    -
                    <div className="flex items-center gap-1 sm:text-sm">
                      Monthly expenses
                      <img
                        src={monthlyExpensesIcon}
                        alt=""
                        className="w-9 sm:w-7"
                      />
                    </div>
                  </div>
                  <div className="text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                    <span
                      className={monthlyNet < 0 ? "text-[red]" : "text-greens"}
                    >
                      ({monthlyNet.toLocaleString()})
                    </span>{" "}
                    <span className="text-[red]">
                      - ({monthExpenses.toLocaleString()})
                    </span>
                  </div>
                </div>
                {/* Montly Total Net */}
                <div className="bg-white rounded-lg shadow-lg w-full">
                  <div className="flex items-center justify-center gap-2 pb-1 pt-3 xs:px-3">
                    <img
                      src={monthlyNetIcon}
                      alt="total net"
                      className="w-9 sm:w-7"
                    />
                    <p className="sm:text-sm font-medium">Total Net</p>
                  </div>
                  <div
                    className={
                      monthlyNet - monthExpenses < 0
                        ? "text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                        : "text-2xl text-greens font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                    }
                  >
                    {(monthlyNet - monthExpenses).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <PersonalYearlySummary />
      </div>
    </div>
  );
};

export default PersonalSummary;
