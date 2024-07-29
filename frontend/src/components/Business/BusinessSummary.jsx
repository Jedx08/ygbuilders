import { FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
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
  const { monthIndex, setMonthIndex } = useContext(CalendarContext);
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

  const [showYearlySummary, setShowYearlySummary] = useState(false);

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
        // console.log(data);
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

  const overallProfit = sales - expenses - overallMonthlyExpenses - capital;
  const monthlyProfit =
    monthlySales - monthlyExpenses - monthlyCapital - monthExpenses;

  return (
    <>
      <div className=" w-full py-5">
        <div>
          <h1 className="font-extrabold text-center text-4xl text-oranges pb-5">
            Overall Summary
          </h1>
        </div>
        <div className=" w-[80%] mx-auto justify-center  flex text-center gap-[4%]">
          <div className=" bg-white rounded-lg w-[20%] shadow-lg">
            <div className="flex items-center justify-center pt-3 gap-2">
              <img src={capitalIcon} alt="capital icon" className="h-4 w-7" />
              <div>Capital</div>
            </div>
            <div className="text-4xl text-oranges font-bold px-5 py-4">
              {capital.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[20%] shadow-lg">
            <div className="flex items-center justify-center pt-3 gap-2">
              <img src={salesIcon} alt="sales icon" className="h-4 w-7" />
              <div>Sales</div>
            </div>
            <div className="text-4xl text-[#399CB4] font-bold px-5 py-4">
              {sales.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[20%] shadow-lg">
            <div className="flex items-center justify-center pt-3 gap-2">
              <img src={expensesIcon} alt="expenses icon" className="h-4 w-7" />
              <div>Expenses</div>
            </div>
            <div className="text-4xl text-[red] font-bold px-5 py-4">
              {(expenses + overallMonthlyExpenses).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[20%] shadow-lg">
            <div className="flex items-center justify-center pt-3 gap-2">
              <img src={profitIcon} alt="profit icon" className="h-4 w-7" />
              <div>Profit</div>
            </div>
            <div
              className={
                overallProfit < 0
                  ? "text-4xl font-bold text-[red] px-5 py-4"
                  : "text-4xl font-bold text-greens px-5 py-4"
              }
            >
              {overallProfit.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5 mb-2">
          <div>
            <FaAngleLeft
              className="text-oranges text-3xl hover:text-loranges cursor-pointer"
              onClick={handlePrevMonth}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-center text-4xl text-oranges">
              {
                /* display current month and year */
                dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
              }
            </h1>
          </div>
          <div>
            <FaAngleRight
              className="text-oranges text-3xl hover:text-loranges cursor-pointer"
              onClick={handleNextMonth}
            />
          </div>
        </div>
      </div>

      <div className=" bg-light font-pops pb-7">
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
            <div className="w-[60%] mx-auto bg-white p-8 rounded-lg shadow-lg">
              <Line
                className="w-full"
                // options={options}
                data={{
                  labels: dayCount,
                  datasets: [
                    {
                      label: "Capital",
                      data: capitalCount,
                      borderColor: "#ff9f1c",
                      backgroundColor: "#fdac3a",
                    },
                    {
                      label: "Sales",
                      data: salesCount,
                      borderColor: "#399CB4",
                      backgroundColor: "#41B8D5",
                    },
                    {
                      label: "Expenses",
                      data: expensesCount,
                      borderColor: "#ff6384",
                      backgroundColor: "#FA829C",
                    },
                    {
                      label: "Profit",
                      data: profitCount,
                      borderColor: "#2ec4b6",
                      backgroundColor: "#3cd5c5",
                    },
                  ],
                }}
              />
              <div className="w-[100%] h-[fit-content]">
                <div className="text-center">
                  <div className="text-lg py-5">
                    Monthly Summary ({thisMonth})
                  </div>
                  <div className="w-[100%] grid grid-cols-5 gap-2 mx-auto">
                    <div>
                      <div className="flex items-center justify-center pb-3 gap-2">
                        <img
                          src={monthlyCapitalIcon}
                          alt="monthly capital"
                          className="h-4 w-7"
                        />
                        <div className="text-sm mb-2">
                          Capital + (Monthly Capital)
                        </div>
                      </div>
                      <div className="text-xl font-bold text-oranges">
                        {monthlyCapital.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center pb-3 gap-2">
                        <img
                          src={monthlySalesIcon}
                          alt="monthly sales"
                          className="h-4 w-7"
                        />
                        <div className="text-sm mb-2">Sales</div>
                      </div>
                      <div className="text-xl font-bold text-[#399CB4]">
                        {monthlySales.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center pb-3 gap-2">
                        <img
                          src={monthlyExpensesIcon}
                          alt="monthly expenses"
                          className="h-4 w-7"
                        />
                        <div className="text-sm mb-2">Expenses</div>
                      </div>
                      <div className="text-xl font-bold text-[red]">
                        {monthlyExpenses.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">
                        Profit - (Monthly Expenses)
                      </div>
                      <div className="text-xl font-bold">
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
                    <div>
                      <div className="flex items-center justify-center pb-3 gap-2">
                        <img
                          src={monthlyProfitIcon}
                          alt="monthly profit"
                          className="h-4 w-7"
                        />
                        <div className="text-sm mb-2">Total Profit</div>
                      </div>
                      <div
                        className={
                          monthlyProfit < 0
                            ? "text-[red] text-xl font-bold"
                            : "text-greens text-xl font-bold"
                        }
                      >
                        {monthlyProfit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <BusinessYearlySummary />
          </>
        )}
      </div>
    </>
  );
};

export default BusinessSummary;
