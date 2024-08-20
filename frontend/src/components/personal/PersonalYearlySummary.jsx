import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useGetPersonalData from "../../hooks/useGetPersonalData";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import yearlyGrossIcon from "../../media/yearpouch.png";
import yearlyExpensesIcon from "../../media/yearexpenses.png";
import yearlyNetIcon from "../../media/yearprofit.png";

const BusinessYearlySummary = () => {
  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();

  const { monthIndex } = useContext(CalendarContext);

  const [yearlyGross, setYearlyGross] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [grossCount, setCapitalCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setProfitCount] = useState([]);

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
      setIsLoading(false);
    };

    barGraphData();
  }, [monthIndex]);

  const months = dayjs.months();

  const newMonths = months.map((month) => {
    return month.slice(0, 3);
  });

  return (
    <div className="">
      <div className="flex flex-col w-[60%] mx-auto gap-3 content-center lg:w-[80%] md:w-[90%]">
        <div className="text-center bg-white rounded-lg  shadow-lg">
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
                  <div className="h-[600px] w-full md:h-[500px] lg:w-full">
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
                            display:
                              (grossCount.map((data) => {
                                if (data === 0) {
                                  return false;
                                }
                              }),
                              expensesCount.map((data) => {
                                if (data === 0) {
                                  return false;
                                }
                              }),
                              netCount.map((data) => {
                                if (data === 0) {
                                  return false;
                                }
                              })),
                            anchor: "end",
                            align: "end",
                            color: "#000000",
                            font: {
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
        <div className="bg-white rounded-md shadow-lg p-5 text-center">
          <div className="w-[80%] flex justify-between mx-auto sm:w-full">
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <img
                  src={yearlyGrossIcon}
                  alt="yearly capital"
                  className="w-7"
                />
                <div className="text-md">Gross</div>
              </div>
              <div className="text-2xl text-oranges font-bold">
                {yearlyGross.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <img
                  src={yearlyExpensesIcon}
                  alt="yearly expenses"
                  className="w-7"
                />
                <div className="text-md">Expenses</div>
              </div>
              <div className="text-2xl text-[red] font-bold">
                {(yearlyExpenses + thisYearMonthlyExpenses).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <img src={yearlyNetIcon} alt="yearly net" className="w-7" />
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
    </div>
  );
};

export default BusinessYearlySummary;
