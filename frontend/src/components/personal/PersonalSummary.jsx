import { useContext, useEffect, useState } from "react";
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

const PersonalSummary = () => {
  const {
    monthIndex,
    setMonthIndex,
    personalSummaryView,
    setPersonalSummaryView,
  } = useContext(CalendarContext);

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

  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();

  useEffect(() => {
    let g = 0;
    let e = 0;

    setIsLoading(true);
    const overallData = async () => {
      const overallMonthExpenses = await getMonthlyExpenses();
      const overallData = await getPersonalData();

      overallData.forEach((data) => {
        return (g += data.gross), (e += data.expenses);
      });

      overallMonthExpenses.forEach((data) => {
        return (e += data.amount);
      });

      setGross(g);
      setExpenses(e);
      setIsLoading(false);
    };

    overallData();
  }, []);

  const monthCount = dayjs().month(monthIndex).daysInMonth();

  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }

  useEffect(() => {
    const lineGraphData = async () => {
      const monthData = await getPersonalData();

      const filteredData = monthData.filter(
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
  }, [monthIndex]);

  useEffect(() => {
    let g = 0;
    let e = 0;
    let m_e = 0;

    const monthlyIncomeData = async () => {
      const monthData = await getPersonalData();

      monthData
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
      const monthData = await getMonthlyExpenses();

      monthData
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
  }, [monthIndex]);

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

  const overallNet = gross - expenses;

  // const year = dayjs().month(monthIndex).year();

  const monthlyNet = monthlyGross - monthlyExpenses;

  Chart.register(ChartDataLabels);

  return (
    <>
      <div className="flex justify-between px-5">
        <div className="mx-auto py-5 grid grid-flow-col place-items-center gap-5 ssm:gap-3">
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
      </div>
      <div className="flex font-bold text-3xl text-center items-center justify-center py-5 ssm:text-2xl">
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
            <div className="w-[80%] mx-auto md:w-[90%]">
              <div className="grid grid-flow-col justify-start place-items-center gap-2 mb-2">
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
              <div className="md:w-full mt-3">
                <div className="flex flex-wrap items-center justify-center mx-auto gap-2 w-[80%] md:w-[90%] ssm:w-[100%]">
                  {/* Monthly Gross */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3">
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
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3">
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
                  {/* Monthly Net */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3 px-3 font-medium">
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
                        className={
                          monthlyNet < 0 ? "text-[red]" : "text-greens"
                        }
                      >
                        ({monthlyNet.toLocaleString()})
                      </span>{" "}
                      <span className="text-[red]">
                        - ({monthExpenses.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  {/* Montly Total Net */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3">
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
          </>
        )}

        <div>
          <div className="pt-5 mt-10 grid grid-flow-col justify-center place-items-center gap-2 xxs:flex xxs:items-center xxs:justify-center xxs:gap-0">
            <div className="font-bold text-3xl text-center items-center justify-center py-5 ssm:text-2xl">
              Yearly Summary
            </div>
            <div className="flex items-center xxs:pr-5">
              <div>
                <FaAngleLeft
                  className="text-greens text-4xl hover:text-lgreens cursor-pointer ssm:text-3xl"
                  onClick={prevYear}
                />
              </div>
              <div>
                <h1 className="font-extrabold text-center text-4xl text-greens select-none ssm:text-3xl">
                  {
                    /* display current month and year */
                    dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                  }
                </h1>
              </div>
              <div>
                <FaAngleRight
                  className="text-greens text-4xl hover:text-lgreens cursor-pointer ssm:text-3xl"
                  onClick={nextYear}
                />
              </div>
            </div>
          </div>
          <PersonalYearlySummary />
        </div>
      </div>

      <div className="w-full py-5 mt-10 pb-20">
        <div>
          <h1 className="font-bold text-center text-3xl pb-5 ssm:text-2xl">
            Overall Summary
          </h1>
        </div>
        <div className="w-[60%] gap-1 mx-auto flex flex-wrap items-center justify-center text-center xl:w-[80%] ssm:w-[100%]">
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={pouch} alt="puch" className="w-9 sm:w-7" />
              <p className="font-medium">Gross</p>
            </div>
            <div className="text-4xl text-oranges w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {gross.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={expensesIcon} alt="puch" className="w-9 sm:w-7" />
              <p className="font-medium">Expenses</p>
            </div>
            <div className="text-4xl text-[red] w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {expenses.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={networth} alt="puch" className="w-9 sm:w-7" />
              <p className="font-medium">Net</p>
            </div>
            <div
              className={`w-fit mx-auto ${
                overallNet < 0
                  ? "text-4xl text-[red] font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl"
                  : "text-4xl text-greens font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl"
              }`}
            >
              {overallNet.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalSummary;
