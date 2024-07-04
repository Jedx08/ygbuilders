import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import useGetData from "../hooks/useGetData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar, Line, Pie } from "react-chartjs-2";
import { CalendarContext } from "../context/CalendarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import Skeleton from "react-loading-skeleton";

const Summary = () => {
  const { monthIndex, setMonthIndex } = useContext(CalendarContext);

  const year = dayjs().month(monthIndex).year();
  const thisMonth = dayjs().month(monthIndex).format("MMMM");

  const [grossCount, setGrossCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setNetCount] = useState([]);

  const [monthlyGross, setMonthlyGross] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyNet, setMonthlyNet] = useState(0);

  const [yearlyGross, setyearlyGross] = useState(0);
  const [yearlyExpenses, setyearlyExpenses] = useState(0);
  const [yearlyNet, setyearlyNet] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const getPersonalData = useGetData();

  useEffect(() => {
    let g = 0;
    let e = 0;
    let n = 0;

    const YearlyIncomeData = async () => {
      const yearData = await getPersonalData();

      yearData.filter((data) => {
        if (
          dayjs(data.day).format("YY") ===
          dayjs().month(monthIndex).format("YY")
        ) {
          return (g += data.gross), (e += data.expenses), (n += data.net);
        }

        setyearlyGross(g);
        setyearlyExpenses(e);
        setyearlyNet(n);
      });
    };

    YearlyIncomeData();
  }, []);

  useEffect(() => {
    let g = 0;
    let e = 0;
    let n = 0;

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
          n += data.net;
        });

      setMonthlyGross(g);
      setMonthlyExpenses(e);
      setMonthlyNet(n);
      setIsLoading(false);
    };

    monthlyIncomeData();
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
  const monthCount = dayjs().month(monthIndex).daysInMonth();
  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }
  return (
    <>
      <Navbar className="" />
      <div className=" bg-light font-pops">
        <div>
          <div>
            <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5 mb-5">
              <div>
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={handlePrevMonth}
                />
              </div>
              <div>
                <h1 className="font-extrabold text-center text-4xl text-greens">
                  {
                    /* display current month and year */
                    dayjs(new Date(dayjs().year(), monthIndex)).format(
                      "MMMM YYYY"
                    )
                  }
                </h1>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faCaretRight}
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={handleNextMonth}
                />
              </div>
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
                      borderColor: "#2ec4b6",
                      backgroundColor: "#3cd5c5",
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
                      borderColor: "#ff9f1c",
                      backgroundColor: "#fdac3a",
                    },
                  ],
                }}
              />
            </div>
          )}

          <div className="w-[60%] mx-auto m-5 grid grid-cols-3 mt-5 gap-3 content-center">
            <div className="w-[100%] col-span-1 p-5 bg-white rounded-lg  h-[fit-content] shadow-lg">
              {isLoading ? (
                <div>
                  <Skeleton />
                  <Skeleton height={300} />
                </div>
              ) : (
                <>
                  <div>
                    <Pie
                      className="w-full mb-2"
                      // options={options}
                      data={{
                        labels: ["Gross", "Expenses", "Net"],
                        datasets: [
                          {
                            label: "Gross",
                            data: [monthlyGross, monthlyExpenses, monthlyNet],
                            backgroundColor: ["#2ec4b6", "#ff6384", "#ff9f1c"],
                            hoverOffset: 6,
                          },
                        ],
                      }}
                    />
                  </div>
                  <hr />
                  <div className="text-center">
                    <div className="text-xs py-2">
                      Monthly Summary ({thisMonth})
                    </div>
                    <div className="w-[80%] grid grid-cols-3 mx-auto text-xs">
                      <div>Gross:</div>
                      <div>Expenses:</div>
                      <div>Net:</div>
                    </div>
                    <div className="w-[80%] grid grid-cols-3 mx-auto mt-1 font-bold text-sm">
                      <div>{monthlyGross}</div>
                      <div>{monthlyExpenses}</div>
                      <div>{monthlyNet}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className=" col-span-2 text-center bg-white rounded-lg  shadow-lg">
              {isLoading ? (
                <div>
                  <div className="w-[60%] mx-auto pt-2">
                    <Skeleton className="my-2" />
                    <Skeleton count={2} />
                  </div>
                  <Skeleton className="w-[80%] my-5" height={200} />
                </div>
              ) : (
                <div>
                  <div className="text-xs py-2">Yearly Summary ({year})</div>
                  <div className="w-[60%] grid grid-cols-3 mx-auto">
                    <div>Gross:</div>
                    <div>Expenses:</div>
                    <div>Net:</div>
                  </div>
                  <div className="w-[60%] grid grid-cols-3 mx-auto mt-1 font-bold text-2xl">
                    <div>{yearlyGross}</div>
                    <div>{yearlyExpenses}</div>
                    <div>{yearlyNet}</div>
                  </div>
                  <hr className="w-[80%] mx-auto mt-2" />
                  <div className="w-[80%] my-5 mx-auto">
                    <Bar
                      data={{
                        labels: ["Gross", "Expenses", "Net"],
                        datasets: [
                          {
                            label: `Overall Summary (${year})`,
                            data: [yearlyGross, yearlyExpenses, yearlyNet],
                            backgroundColor: ["#2ec4b6", "#ff6384", "#ff9f1c"],
                            borderRadius: 5,
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Summary;
