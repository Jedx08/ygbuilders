import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useGetPersonalData from "../../hooks/useGetPersonalData";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import pouch from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networth from "../../media/networth.png";

const BusinessYearlySummary = () => {
  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();

  const { monthIndex, setMonthIndex } = useContext(CalendarContext);

  const [yearlyGross, setYearlyGross] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [grossCount, setCapitalCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setProfitCount] = useState([]);

  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  dayjs.extend(localeData);
  dayjs().localeData();

  const year = dayjs().month(monthIndex).year();

  const yearlyNet = yearlyGross - (yearlyExpenses + thisYearMonthlyExpenses);

  useEffect(() => {
    let g = 0;
    let e = 0;
    let m_e = 0;

    const YearlyIncomeData = async () => {
      const yearData = await getPersonalData();

      yearData
        .filter(
          (data) =>
            dayjs(data.day).format("YY") ===
            dayjs().month(monthIndex).format("YY")
        )
        .forEach((data) => {
          (g += data.gross), (e += data.expenses);
        });

      setYearlyGross(g);
      setYearlyExpenses(e);
      setIsLoading(false);
    };

    const thisYearMonthlyExpenses = async () => {
      const thisYearMonthlyExpenses = await getMonthlyExpenses();

      thisYearMonthlyExpenses
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
  }, [monthIndex]);

  useEffect(() => {
    const barGraphData = async () => {
      const yearData = await getPersonalData();
      const monthExpenses = await getMonthlyExpenses();
      const allMonths = dayjs.months();

      const filteredData = yearData.filter(
        (data) =>
          dayjs(data.day).format("YY") ===
          dayjs().month(monthIndex).format("YY")
      );

      const filteredMonthlyExpenses = monthExpenses.filter(
        (data) =>
          dayjs(data.moth).format("YYYY") ===
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
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            g += data.gross;
          });

        grossPerDate[index - 1] = g;
      });

      setCapitalCount(grossPerDate);

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
            (month) => dayjs(month.month).format("M") === index.toString()
          )
          .forEach((data) => {
            me += data.amount;
          });

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            e += data.expenses;
          });

        expensesPerDate[index - 1] = e + me;
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
            (month) => dayjs(month.month).format("M") === index.toString()
          )
          .forEach((data) => {
            m_e += data.amount;
          });

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            n += data.net;
          });

        netPerDate[index - 1] = n - m_e;
      });

      setProfitCount(netPerDate);
    };

    barGraphData();
  }, [monthIndex]);

  const nextYear = () => {
    setMonthIndex(monthIndex + 12);
  };

  const prevYear = () => {
    setMonthIndex(monthIndex - 12);
  };

  const months = dayjs.months();

  const newMonths = months.map((month) => {
    return month.slice(0, 3);
  });

  return (
    <div>
      <div>
        <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5">
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
      <div className="w-[60%] mx-auto gap-3 content-center lg:w-[80%] md:w-[90%]">
        <div className="text-center bg-white rounded-lg  shadow-lg">
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
            <div className="p-5 w-full mx-auto">
              <Bar
                className="w-full"
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
              />

              <div className="p-5 text-center">
                <div className="font-bold text-lg py-5">
                  Yearly Summary ({year})
                </div>
                <div className="w-[80%] flex justify-between mx-auto sm:w-full">
                  <div>
                    <div className="flex items-center justify-center pb-2 gap-2">
                      <img
                        src={pouch}
                        alt="yearly capital"
                        className="h-4 w-7"
                      />
                      <div className="text-md">Gross</div>
                    </div>
                    <div className="text-2xl text-oranges font-bold">
                      {yearlyGross.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center pb-2 gap-2">
                      <img
                        src={expensesIcon}
                        alt="yearly expenses"
                        className="h-4 w-7"
                      />
                      <div className="text-md">Expenses</div>
                    </div>
                    <div className="text-2xl text-[red] font-bold">
                      {(
                        yearlyExpenses + thisYearMonthlyExpenses
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center pb-2 gap-2">
                      <img
                        src={networth}
                        alt="yearly net"
                        className="h-4 w-7"
                      />
                      <div className="text-md">Net</div>
                    </div>
                    <div
                      className={
                        yearlyNet < 0
                          ? "text-2xl font-bold text-[red]"
                          : "text-2xl font-bold text-greens"
                      }
                    >
                      {yearlyNet.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessYearlySummary;
