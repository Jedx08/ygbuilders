import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Line } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import capitalIcon from "../../media/bus_pouch.png";
import salesIcon from "../../media/bus_sales.png";
import expensesIcon from "../../media/bus_expenses.png";
import profitIcon from "../../media/bus_profit.png";
import monthlyCapitalIcon from "../../media/busmon_pouch.png";
import monthlySalesIcon from "../../media/busmon_sales.png";
import monthlyExpensesIcon from "../../media/busmon_expenses.png";
import monthlyProfitIcon from "../../media/busmon_net.png";
import BusinessYearlySummary from "./BusinessYearlySummary";

const BusinessSummary = () => {
  const {
    monthIndex,
    setMonthIndex,
    personalSummaryView,
    setPersonalSummaryView,
  } = useContext(CalendarContext);
  const getBusinessData = useGetBusinessData();
  const getMonthlyExpenses = useBusinessExpenses();
  const getMonthlyCapital = useBusinessCapital();

  const [capital, setCapital] = useState(0);
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const [capitalCount, setCapitalCount] = useState([]);
  const [salesCount, setSalesCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [profitCount, setProfitCount] = useState([]);

  const [monthlyCapital, setMonthlyCapital] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [overallMonthlyExpenses, setOverallMonthlyExpenses] = useState(0);

  const [monthExpenses, setMonthExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const thisMonth = dayjs().month(monthIndex).format("MMMM");

  //getting overall data
  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    setIsLoading(true);

    const overallData = async () => {
      const overallData = await getBusinessData();
      const monthCapital = await getMonthlyCapital();
      const overallMonthlyExpenses = await getMonthlyExpenses();

      overallData.forEach((data) => {
        return (c += data.capital), (s += data.sales), (e += data.expenses);
      });

      monthCapital.forEach((data) => {
        m_c += data.amount;
      });

      overallMonthlyExpenses.forEach((data) => {
        m_e += data.amount;
      });

      setOverallMonthlyExpenses(m_e);
      setCapital(c + m_c);
      setSales(s);
      setExpenses(e);
      setIsLoading(false);
    };

    overallData();
  }, []);

  //getting monthly data
  const monthCount = dayjs().month(monthIndex).daysInMonth();

  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }

  useEffect(() => {
    const lineGraphData = async () => {
      const monthData = await getBusinessData();

      const filteredData = monthData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );

      const monthCount = dayjs().month(monthIndex).daysInMonth();

      //get line graph capital
      let capitalPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        capitalPerDate.push(0);
      }
      setCapitalCount(capitalPerDate);

      filteredData.map((data) => {
        capitalPerDate.map(() => {
          capitalPerDate[dayjs(data.day).format("D") - 1] = data.capital;
        });

        setCapitalCount(capitalPerDate);
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
      let salesPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        salesPerDate.push(0);
      }
      setSalesCount(salesPerDate);

      filteredData.map((data) => {
        salesPerDate.map(() => {
          salesPerDate[dayjs(data.day).format("D") - 1] = data.sales;
        });

        setSalesCount(salesPerDate);
      });

      //get line graph profit
      let profitPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        profitPerDate.push(0);
      }
      setProfitCount(profitPerDate);

      filteredData.map((data) => {
        profitPerDate.map(() => {
          profitPerDate[dayjs(data.day).format("D") - 1] = data.profit;
        });

        setProfitCount(profitPerDate);
      });
    };

    lineGraphData();
  }, [monthIndex]);

  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const monthlyIncomeData = async () => {
      const monthData = await getBusinessData();
      const monthCapital = await getMonthlyCapital();

      const filteredData = monthData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );
      filteredData.forEach((data) => {
        (c += data.capital), (s += data.sales), (e += data.expenses);
      });

      monthCapital
        .filter(
          (data) =>
            dayjs(data.month).format("MMMM YYYY") ===
            dayjs().month(monthIndex).format("MMMM YYYY")
        )
        .forEach((data) => {
          m_c += data.amount;
        });

      setMonthlyCapital(c + m_c);
      setMonthlySales(s);
      setMonthlyExpenses(e);
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

  const overallProfit = sales - expenses - overallMonthlyExpenses - capital;
  const monthlyProfit =
    monthlySales - monthlyExpenses - monthlyCapital - monthExpenses;

  Chart.register(ChartDataLabels);

  return (
    <>
      <div className="flex justify-between px-5">
        <div className="mx-auto py-5 grid grid-flow-col place-items-center gap-5 ssm:gap-3">
          <div
            className={`shadow-lg px-5 py-3 rounded-md font-bold
             ${
               personalSummaryView
                 ? "bg-loranges text-white cursor-default"
                 : "bg-white cursor-pointer hover:text-loranges"
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
            <div className="w-[80%] mx-auto md:w-[90%]">
              <div className="grid grid-flow-col justify-start place-items-center gap-2 mb-2">
                <div className="flex">
                  <div>
                    <FaAngleLeft
                      className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                      onClick={handlePrevMonth}
                    />
                  </div>
                  <div>
                    <FaAngleRight
                      className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                      onClick={handleNextMonth}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="font-extrabold text-center text-4xl text-oranges ssm:text-3xl">
                    {
                      /* display current month and year */
                      dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
                    }
                  </h1>
                </div>
              </div>
              <div className="bg-white py-4 rounded-lg shadow-lg overflow-y-auto">
                <div className="h-[600px] w-full md:h-[400px] lg:w-[800px]">
                  <Line
                    className="w-full"
                    data={{
                      labels: dayCount,
                      datasets: [
                        {
                          label: "Capital",
                          data: capitalCount,
                          borderColor: "#ff9f1c",
                          backgroundColor: "#fdac3a",
                          tension: 0.5,
                        },
                        {
                          label: "Sales",
                          data: salesCount,
                          borderColor: "#399CB4",
                          backgroundColor: "#41B8D5",
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
                          label: "Profit",
                          data: profitCount,
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
                  {/* Total Capital */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                      <img
                        src={monthlyCapitalIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Total Capital</p>
                    </div>
                    <div className="text-2xl text-oranges font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                      {monthlyCapital.toLocaleString()}
                    </div>
                  </div>
                  {/* Sales */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                      <img
                        src={monthlySalesIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Sales</p>
                    </div>
                    <div className="text-2xl text-[#399CB4] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                      {monthlySales.toLocaleString()}
                    </div>
                  </div>
                  {/* Expenses */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 px-2 pt-3 xs:px-3">
                      <img
                        src={monthlyExpensesIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Expenses</p>
                    </div>
                    <div className="text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold sm:text-lg">
                      {monthlyExpenses.toLocaleString()}
                    </div>
                  </div>
                  {/* Profit - Month Expenses */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3 px-3 font-medium xs:px-3">
                      <div className="flex items-center gap-1 sm:text-sm">
                        <img
                          src={monthlyCapitalIcon}
                          alt="month expenses"
                          className="w-9 sm:w-7"
                        />
                        Monthly profit
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
                        className={`${
                          monthlySales - monthlyExpenses - monthlyCapital < 0
                            ? "text-[red]"
                            : "text-greens"
                        }`}
                      >
                        (
                        {(
                          monthlySales -
                          monthlyExpenses -
                          monthlyCapital
                        ).toLocaleString()}
                        )
                      </span>{" "}
                      <span className="text-[red]">
                        - ({monthExpenses.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  {/* Total Profit */}
                  <div className="bg-white rounded-lg shadow-lg w-fit min-w-[30%]">
                    <div className="flex items-center justify-center gap-2 pb-1 pt-3 xs:px-3">
                      <img
                        src={monthlyProfitIcon}
                        alt="puch"
                        className="w-9 sm:w-7"
                      />
                      <p className="sm:text-sm font-medium">Total Profit</p>
                    </div>
                    <div
                      className={
                        monthlyProfit < 0
                          ? "text-2xl text-[red] font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                          : "text-2xl text-greens font-bold pb-2 text-center ssm:font-semibold  sm:text-lg"
                      }
                    >
                      {monthlyProfit.toLocaleString()}
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
                  className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                  onClick={prevYear}
                />
              </div>
              <div>
                <h1 className="font-extrabold text-center text-4xl text-oranges select-none ssm:text-3xl">
                  {
                    /* display current month and year */
                    dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                  }
                </h1>
              </div>
              <div>
                <FaAngleRight
                  className="text-oranges text-4xl hover:text-loranges cursor-pointer ssm:text-3xl"
                  onClick={nextYear}
                />
              </div>
            </div>
          </div>
          <BusinessYearlySummary />
        </div>
      </div>

      <div className="w-full py-5 mt-10 pb-20">
        <div>
          <h1 className="font-bold text-center text-3xl pb-5 ssm:text-2xl">
            Overall Summary
          </h1>
        </div>
        <div className="w-[80%] gap-1 mx-auto flex flex-wrap items-center justify-center text-center xl:w-[80%] ssm:w-[100%]">
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img
                src={capitalIcon}
                alt="capital icon"
                className="w-9 sm:w-7"
              />
              <div className="font-medium">Capital</div>
            </div>
            <div className="text-4xl text-oranges w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {capital.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={salesIcon} alt="sales icon" className="w-9 sm:w-7" />
              <div className="font-medium">Sales</div>
            </div>
            <div className="text-4xl text-[#399CB4] w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {sales.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img
                src={expensesIcon}
                alt="expenses icon"
                className="w-9 sm:w-7"
              />
              <div className="font-medium">Expenses</div>
            </div>
            <div className="text-4xl text-[red] w-fit mx-auto font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl">
              {(expenses + overallMonthlyExpenses).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg min-w-[30%] shadow-lg">
            <div className="flex items-center justify-center gap-2 pt-5 xs:flex-col">
              <img src={profitIcon} alt="profit icon" className="w-9 sm:w-7" />
              <div className="font-medium">Profit</div>
            </div>
            <div
              className={
                overallProfit < 0
                  ? "text-4xl text-[red] font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl"
                  : "text-4xl text-greens font-bold px-2 py-4 lg:text-3xl md:text-2xl sm:text-xl"
              }
            >
              {overallProfit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessSummary;
