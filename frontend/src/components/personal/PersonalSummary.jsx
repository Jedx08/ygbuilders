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
        <div className="grid grid-flow-col justify-end place-items-center">
          <div>
            <FaAngleLeft
              className="text-greens text-3xl hover:text-lgreens cursor-pointer"
              onClick={handlePrevMonth}
            />
          </div>
          <div>
            <FaAngleRight
              className="text-greens text-3xl hover:text-lgreens cursor-pointer"
              onClick={handleNextMonth}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-center text-3xl text-greens ssm:text-2xl">
              {
                /* display current month and year */
                dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
              }
            </h1>
          </div>
        </div>
        <div className="py-5 grid grid-flow-col justify-start place-items-center gap-5 ssm:gap-3">
          <div
            className={`shadow-lg px-5 py-3 rounded-md font-bold ssm:px-2 ssm:py-2 ssm:text-xs
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
            className={`shadow-lg px-5 py-3 rounded-md font-bold ssm:px-2 ssm:py-2 ssm:text-xs
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
      <div className="flex font-bold text-2xl items-center justify-center py-5">
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
            <div className="flex gap-4 px-5 items-center  md:flex-col">
              <div className="w-full bg-white py-4 rounded-lg shadow-lg overflow-y-auto">
                <div className="h-[600px] w-full md:h-[400px] lg:w-[1000px]">
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
              <div className="w-[20%] md:w-full">
                <div className="w-full flex flex-col gap-4 text-center justify-center md:flex-row mmd:w-full mmd:grid mmd:grid-flow-col mmd:grid-rows-2 mmd:grid-cols-2">
                  <div className="bg-white rounded-lg w-full shadow-lg ssm:p-2">
                    <div className="flex flex-col items-center justify-center gap-2 pt-5 xs:flex-col">
                      <img
                        src={monthlyGrossIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="xs:text-sm">Gross</p>
                    </div>
                    <div className="text-2xl text-oranges font-bold p-5 xs:p-3 xs:text-lg">
                      {monthlyGross.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg w-full shadow-lg ssm:p-2">
                    <div className="flex flex-col items-center justify-center gap-2 pt-5 xs:flex-col">
                      <img
                        src={monthlyExpensesIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="xs:text-sm">Expenses</p>
                    </div>
                    <div className="text-2xl text-[red] font-bold p-5 xs:p-3 xs:text-lg">
                      {monthlyExpenses.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg w-full shadow-lg ssm:p-2">
                    <div className="flex flex-col items-center justify-center gap-2 pt-3 xs:flex-col">
                      <p className="xs:text-sm">
                        Net - <br />
                        (Monthly <br className="hidden md:block" />
                        Expenses)
                      </p>
                    </div>
                    <div className="text-2xl text-[red] font-bold p-5 xs:p-3 xs:text-lg">
                      <span
                        className={
                          monthlyNet < 0 ? "text-[red]" : "text-greens"
                        }
                      >
                        {monthlyNet.toLocaleString()}
                      </span>{" "}
                      <span className="text-[red]">
                        - ({monthExpenses.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg w-full shadow-lg ssm:p-2">
                    <div className="flex flex-col items-center justify-center gap-2 pt-5 xs:flex-col">
                      <img
                        src={monthlyNetIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="xs:text-sm">Total Net</p>
                    </div>
                    <div
                      className={
                        monthlyNet - monthExpenses < 0
                          ? "text-2xl text-[red] font-bold p-5 xs:p-3 xs:text-lg"
                          : "text-2xl text-greens font-bold p-5 xs:p-3 xs:text-lg"
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
          <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-2">
            <div className="flex font-bold text-xl items-center justify-center py-5">
              Yearly Summary
            </div>
            <div>
              <FaAngleLeft
                className="text-greens text-3xl hover:text-lgreens cursor-pointer"
                onClick={prevYear}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-center text-2xl text-greens">
                {
                  /* display current month and year */
                  dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                }
              </h1>
            </div>
            <div>
              <FaAngleRight
                className="text-greens text-3xl hover:text-lgreens cursor-pointer"
                onClick={nextYear}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>
          <PersonalYearlySummary />

          <div className="w-full py-5">
            <div>
              <h1 className="font-extrabold text-center text-3xl text-greens pb-5">
                Overall Summary
              </h1>
            </div>
            <div className="w-[60%] mx-auto flex justify-between text-center md:w-[80%]">
              <div className="bg-white rounded-lg w-[30%] shadow-lg">
                <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
                  <img src={pouch} alt="puch" className="w-7" />
                  <p>Gross</p>
                </div>
                <div className="text-4xl text-oranges font-bold px-5 py-4 lg:text-3xl md:text-2xl sm:text-xl">
                  {gross.toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-lg w-[30%] shadow-lg">
                <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
                  <img src={expensesIcon} alt="puch" className="w-7" />
                  <p>Expenses</p>
                </div>
                <div className="text-4xl text-[red] font-bold px-5 py-4 lg:text-3xl md:text-2xl sm:text-xl">
                  {expenses.toLocaleString()}
                </div>
              </div>
              <div className="bg-white rounded-lg w-[30%] shadow-lg">
                <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
                  <img src={networth} alt="puch" className="w-7" />
                  <p>Net</p>
                </div>
                <div
                  className={
                    overallNet < 0
                      ? "text-4xl text-[red] font-bold px-5 py-4 lg:text-3xl md:text-2xl sm:text-xl"
                      : "text-4xl text-greens font-bold px-5 py-4 lg:text-3xl md:text-2xl sm:text-xl"
                  }
                >
                  {overallNet.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalSummary;
