import { useContext, useEffect, useState } from "react";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import useGetPersonalData from "../../hooks/useGetPersonalData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar, Line } from "react-chartjs-2";
import { CalendarContext } from "../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import pouch from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networth from "../../media/networth.png";

const PersonalSummary = () => {
  const { monthIndex, setMonthIndex } = useContext(CalendarContext);

  const year = dayjs().month(monthIndex).year();
  const thisMonth = dayjs().month(monthIndex).format("MMMM");

  const [gross, setGross] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const [grossCount, setGrossCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setNetCount] = useState([]);

  const [monthlyGross, setMonthlyGross] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [yearlyGross, setyearlyGross] = useState(0);
  const [yearlyExpenses, setyearlyExpenses] = useState(0);

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

  useEffect(() => {
    let g = 0;
    let e = 0;

    const YearlyIncomeData = async () => {
      const yearData = await getPersonalData();
      const overallMonthExpenses = await getMonthlyExpenses();

      yearData
        .filter(
          (data) =>
            dayjs(data.day).format("YY") ===
            dayjs().month(monthIndex).format("YY")
        )
        .forEach((data) => {
          g += data.gross;
          e += data.expenses;
        });

      overallMonthExpenses
        .filter(
          (data) =>
            dayjs(data.day).format("YY") ===
            dayjs().month(monthIndex).format("YY")
        )
        .forEach((data) => {
          e += data.amount;
        });

      setyearlyGross(g);
      setyearlyExpenses(e);
    };

    YearlyIncomeData();
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

  useEffect(() => {
    const monthlyIncomeData = async () => {
      const monthData = await getPersonalData();

      const filteredData = monthData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );

      const grossPerDate = filteredData.map((data) => {
        const dateData = data.gross;

        return dateData;
      });

      const exspensesPerDate = filteredData.map((data) => {
        const dateData = data.expenses;

        return dateData;
      });

      const netPerDate = filteredData.map((data) => {
        const dateData = data.net;

        return dateData;
      });

      setGrossCount(grossPerDate);
      setExpensesCount(exspensesPerDate);
      setNetCount(netPerDate);
    };

    monthlyIncomeData();
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

  const monthCount = dayjs().month(monthIndex).daysInMonth();

  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }

  const overallNet = gross - expenses;
  const yearlyNet = yearlyGross - yearlyExpenses;
  const monthlyNet = monthlyGross - monthlyExpenses;

  return (
    <>
      <div className="w-full py-5">
        <div>
          <h1 className="font-extrabold text-center text-4xl text-greens pb-5">
            Overall Summary
          </h1>
        </div>
        <div className="w-[60%] mx-auto flex justify-between text-center">
          <div className="bg-white rounded-lg w-[30%] shadow-lg">
            <div className="flex justify-center gap-2 pt-5">
              <img src={pouch} alt="puch" className="h-4 w-7" />
              <p>Gross</p>
            </div>
            <div className="text-4xl text-oranges font-bold px-5 py-4">
              {gross.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[30%] shadow-lg">
            <div className="flex justify-center gap-2 pt-5">
              <img src={expensesIcon} alt="puch" className="h-4 w-9" />
              <p>Expenses</p>
            </div>
            <div className="text-4xl text-[red] font-bold px-5 py-4">
              {expenses.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[30%] shadow-lg">
            <div className="flex justify-center gap-2 pt-5">
              <img src={networth} alt="puch" className="h-3 w-9" />
              <p>Net</p>
            </div>
            <div
              className={
                overallNet < 0
                  ? "text-4xl text-[red] font-bold px-5 py-4"
                  : "text-4xl text-greens font-bold px-5 py-4"
              }
            >
              {overallNet.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5 mb-2">
          <div>
            <FaAngleLeft
              className="text-greens text-3xl hover:text-lgreens cursor-pointer"
              onClick={handlePrevMonth}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-center text-4xl text-greens">
              {
                /* display current month and year */
                dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
              }
            </h1>
          </div>
          <div>
            <FaAngleRight
              className="text-greens text-3xl hover:text-lgreens cursor-pointer"
              onClick={handleNextMonth}
            />
          </div>
        </div>
      </div>

      <div className="bg-light font-pops pb-7">
        {isLoading ? (
          <div className="w-[60%] mx-auto bg-white p-8 rounded-lg flex items-center flex-col">
            <div className="w-[35%]">
              <Skeleton />
            </div>
            <div className="w-[100%]">
              <Skeleton height={500} />
            </div>
          </div>
        ) : (
          <>
            <div className=" w-[60%] mx-auto bg-white p-8 rounded-lg shadow-lg">
              <Line
                className="w-full"
                // options={options}
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
              />
              <div className="w-[100%]  h-[fit-content] ">
                <div className="text-center">
                  <div className="text-lg py-5">
                    Monthly Summary ({thisMonth})
                  </div>
                  <div className="w-[100%] grid grid-cols-4 gap-2 mx-auto">
                    <div>
                      <div className="text-sm mb-2 flex justify-center gap-2">
                        <img src={pouch} alt="puch" className="h-4 w-5" />
                        <p>Gross</p>
                      </div>
                      <div className="text-xl text-oranges font-bold">
                        {monthlyGross.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2 flex justify-center gap-2">
                        <img
                          src={expensesIcon}
                          alt="puch"
                          className="h-4 w-7"
                        />
                        <p>Expenses</p>
                      </div>
                      <div className="text-xl text-[red] font-bold">
                        {monthlyExpenses.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">
                        Net - (Monthly Expenses)
                      </div>
                      <div className="text-xl font-bold">
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
                    <div>
                      <div className="text-sm mb-2 flex justify-center gap-2">
                        <img src={networth} alt="puch" className="h-4 w-8" />
                        <p>Total Net</p>
                      </div>
                      <div
                        className={
                          monthlyNet - monthExpenses < 0
                            ? "text-[red] text-xl font-bold"
                            : "text-greens text-xl font-bold"
                        }
                      >
                        {(monthlyNet - monthExpenses).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="w-[60%] mx-auto m-5  mt-5 gap-3 content-center">
          <div>
            <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5 mb-2">
              <div>
                <FaAngleLeft
                  className="text-greens text-3xl hover:text-lgreens cursor-pointer"
                  onClick={prevYear}
                />
              </div>
              <div>
                <h1 className="font-extrabold text-center text-4xl text-greens">
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
          <div className=" text-center bg-white rounded-lg  shadow-lg">
            {isLoading ? (
              <div>
                <div className="w-[60%] mx-auto pt-2">
                  <Skeleton className="my-2" />
                  <Skeleton />
                  <Skeleton height={30} />
                </div>
                <Skeleton className="w-[80%] my-5" height={200} />
              </div>
            ) : (
              <div className="p-5">
                <div className="w-[80%] mt-5 mx-auto">
                  <Bar
                    data={{
                      labels: ["Gross", "Expenses", "Net"],
                      datasets: [
                        {
                          label: `Yearly Summary (${year})`,
                          data: [yearlyGross, yearlyExpenses, yearlyNet],
                          backgroundColor: ["#ff9f1c", "#ff6384", "#2ec4b6"],
                          borderRadius: 5,
                        },
                      ],
                    }}
                  />
                </div>
                <div className=" p-5 text-center">
                  <div className="text-lg py-5">Yearly Summary ({year})</div>
                  <div className="w-[60%] grid grid-cols-3 mx-auto">
                    <div className="flex justify-center gap-2 pb-3">
                      <img src={pouch} alt="puch" className="h-4 w-6" />
                      <p>Gross</p>
                    </div>
                    <div className="flex justify-center gap-2 pb-3">
                      <img src={expensesIcon} alt="puch" className="h-4 w-8" />
                      <p>Expenses</p>
                    </div>
                    <div className="flex justify-center gap-2 pb-3">
                      <img src={networth} alt="puch" className="h-3 w-9" />
                      <p>Net</p>
                    </div>
                  </div>
                  <div className="w-[60%] grid grid-cols-3 mx-auto mt-1 font-bold text-3xl">
                    <div className="text-oranges">
                      {yearlyGross.toLocaleString()}
                    </div>
                    <div className="text-[red]">
                      {yearlyExpenses.toLocaleString()}
                    </div>
                    <div
                      className={yearlyNet < 0 ? "text-[red]" : "text-greens"}
                    >
                      {yearlyNet.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalSummary;
