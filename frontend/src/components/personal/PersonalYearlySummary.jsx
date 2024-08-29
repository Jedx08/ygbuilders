import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar } from "react-chartjs-2";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import useGetPersonalData from "../../hooks/useGetPersonalData";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import yearlyGrossIcon from "../../media/yearpouch.png";
import yearlyExpensesIcon from "../../media/yearexpenses.png";
import yearlyNetIcon from "../../media/yearprofit.png";

const BusinessYearlySummary = () => {
  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();

  const { monthIndex, setMonthIndex } = useContext(CalendarContext);

  const [yearlyGross, setYearlyGross] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [grossCount, setGrossCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setNetCount] = useState([]);

  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  dayjs.extend(localeData);
  dayjs().localeData();

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

      setNetCount(netPerDate);
      setIsLoading(false);
    };

    barGraphData();
  }, [monthIndex]);

  const months = dayjs.months();

  const newMonths = months.map((month) => {
    return month.slice(0, 3);
  });

  //identify if yearly data should be displayed or not
  const setGraphDataDisplay = [];

  for (let i = 0; i < grossCount.length; i++) {
    if ((grossCount[i] || expensesCount[i] || netCount[i]) !== 0) {
      setGraphDataDisplay.push(true);
    } else {
      setGraphDataDisplay.push(false);
    }
  }
  const nextYear = () => {
    setMonthIndex(monthIndex + 12);
  };

  const prevYear = () => {
    setMonthIndex(monthIndex - 12);
  };

  return (
    <>
      <div className="flex flex-col justify-center">
        <span id="barGraph">
          <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-2 xs:pt-2 xxs:flex xxs:items-center xxs:justify-center xxs:gap-0">
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
          <div className="flex flex-col w-[80%] mx-auto gap-3 content-center lg:w-[80%] md:w-[90%]">
            <div className="text-center bg-white rounded-lg shadow-lg">
              {isLoading ? (
                <div className="w-full mx-auto bg-white p-5 rounded-lg flex items-center flex-col md:w-full">
                  <div className="w-[35%]">
                    <Skeleton />
                  </div>
                  <div className="w-[100%]">
                    <Skeleton height={500} />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="w-full h-hfull bg-white py-4 rounded-lg shadow-lg">
                      <div className="h-[600px] w-full lg:w-full">
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
                                labels: {
                                  font: {
                                    size: 15,
                                  },
                                },
                              },
                            },
                            indexAxis: "y",
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </span>

        <div className="w-full flex justify-center mt-5 text-center">
          <div
            id="barGraphOverview"
            className="w-[80%] bg-white flex flex-wrap justify-between px-10 py-5 rounded-md shadow-lg xxs:justify-center xxs:gap-3"
          >
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={yearlyGrossIcon}
                  alt="yearly capital"
                  className="w-9 sm:w-7"
                />
                <div className="text-md font-medium sm:text-sm">Gross</div>
              </div>
              <div className="text-2xl text-oranges font-bold sm:text-xl ssm:font-semibold">
                {yearlyGross.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={yearlyExpensesIcon}
                  alt="yearly expenses"
                  className="w-9 sm:w-7"
                />
                <div className="text-md font-medium sm:text-sm">Expenses</div>
              </div>
              <div className="text-2xl text-[red] font-bold sm:text-xl ssm:font-semibold">
                {(yearlyExpenses + thisYearMonthlyExpenses).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <img
                  src={yearlyNetIcon}
                  alt="yearly net"
                  className="w-9 sm:w-7"
                />
                <div className="text-md font-medium sm:text-sm">Net</div>
              </div>
              <div
                className={
                  yearlyNet < 0
                    ? "text-2xl font-bold text-[red] sm:text-xl ssm:font-semibold"
                    : "text-2xl font-bold text-greens sm:text-xl ssm:font-semibold"
                }
              >
                {yearlyNet.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessYearlySummary;
