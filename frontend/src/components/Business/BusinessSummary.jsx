import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar, Line } from "react-chartjs-2";
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
import yearlyCapitalIcon from "../../media/busyear_pouch.png";
import yearlySalesIcon from "../../media/busyear_sales.png";
import yearlyExpensesIcon from "../../media/busyear_expenses.png";
import yearlyProfitIcon from "../../media/busyear_net.png";

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

  const [monthlyCapital, setMonthlyCapital] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [yearlyCapital, setYearlyCapital] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [overallMonthlyExpenses, setOverallMonthlyExpenses] = useState(0);
  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);
  const [monthExpenses, setMonthExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const year = dayjs().month(monthIndex).year();
  const thisMonth = dayjs().month(monthIndex).format("MMMM");

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
        console.log(dayjs(data.month).format("YYYY"));
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

  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const YearlyIncomeData = async () => {
      const yearData = await getBusinessData();
      const monthCapital = await getMonthlyCapital();

      yearData
        .filter(
          (data) =>
            dayjs(data.day).format("YY") ===
            dayjs().month(monthIndex).format("YY")
        )
        .forEach((data) => {
          (c += data.capital), (s += data.sales), (e += data.expenses);
        });

      monthCapital
        .filter(
          (data) =>
            dayjs(data.moth).format("YYYY") ===
            dayjs().month(monthIndex).format("YYYY")
        )
        .forEach((data) => {
          m_c += data.amount;
        });

      setYearlyCapital(c + m_c);
      setYearlySales(s);
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
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const monthlyIncomeData = async () => {
      const monthData = await getBusinessData();
      const monthCapital = await getMonthlyCapital();

      monthData
        .filter(
          (data) =>
            dayjs(data.day).format("MM-YY") ===
            dayjs().month(monthIndex).format("MM-YY")
        )
        .forEach((data) => {
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

  useEffect(() => {
    const monthlyIncomeData = async () => {
      const monthData = await getBusinessData();

      const filteredData = monthData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );

      const capitalPerDate = filteredData.map((data) => {
        const dateData = data.capital;

        return dateData;
      });

      const salesPerDate = filteredData.map((data) => {
        const dateData = data.sales;

        return dateData;
      });

      const expensesPerDate = filteredData.map((data) => {
        const dateData = data.expenses;

        return dateData;
      });

      setCapitalCount(capitalPerDate);
      setSalesCount(salesPerDate);
      setExpensesCount(expensesPerDate);
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

  const overallProfit = sales - expenses - overallMonthlyExpenses - capital;
  const monthlyProfit =
    monthlySales - monthExpenses - monthlyCapital - monthExpenses;
  const yearlyProfit =
    yearlySales - yearlyExpenses - thisYearMonthlyExpenses - yearlyCapital;

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
                      data: [monthlyProfit],
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
                        <div className="text-sm mb-2">Capital</div>
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
                        <span className="text-[#ff9f1c]">
                          (
                          {(
                            monthlySales -
                            monthExpenses -
                            monthlyCapital
                          ).toLocaleString()}
                          )
                        </span>{" "}
                        <span className="text-[red]">- ({monthExpenses})</span>
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
          </>
        )}

        <div className="w-[60%] mx-auto m-5  mt-5 gap-3 content-center">
          <div>
            <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5 mb-2">
              <div>
                <FaAngleLeft
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={prevYear}
                />
              </div>
              <div>
                <h1 className="font-extrabold text-center text-4xl text-oranges">
                  {
                    /* display current month and year */
                    dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")
                  }
                </h1>
              </div>
              <div>
                <FaAngleRight
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
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
                      labels: ["Capital", "Sales", "Expenses", "Profit"],
                      datasets: [
                        {
                          label: `Yearly Summary (${year})`,
                          data: [
                            yearlyCapital,
                            yearlySales,
                            yearlyExpenses,
                            yearlyProfit,
                          ],
                          backgroundColor: [
                            "#ff9f1c",
                            "#41B8D5",
                            "#ff6384",
                            "#2ec4b6",
                          ],
                          borderRadius: 5,
                        },
                      ],
                    }}
                  />
                </div>
                <div className=" p-5 text-center">
                  <div className="text-lg py-5">Yearly Summary ({year})</div>
                  <div className="w-[80%] flex justify-between mx-auto">
                    <div>
                      <div className="flex items-center justify-center pb-2 gap-2">
                        <img
                          src={yearlyCapitalIcon}
                          alt="yearly capital"
                          className="h-4 w-7"
                        />
                        <div className="text-md">Capital</div>
                      </div>
                      <div className="text-2xl text-oranges font-bold">
                        {yearlyCapital.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center pb-2 gap-2">
                        <img
                          src={yearlySalesIcon}
                          alt="yearly sales"
                          className="h-4 w-7"
                        />
                        <div className="text-md">Sales</div>
                      </div>
                      <div className="text-2xl text-[#399CB4] font-bold">
                        {yearlySales.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center pb-2 gap-2">
                        <img
                          src={yearlyExpensesIcon}
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
                          src={yearlyProfitIcon}
                          alt="yearly profit"
                          className="h-4 w-7"
                        />
                        <div className="text-md">Profit</div>
                      </div>
                      <div
                        className={
                          yearlyProfit < 0
                            ? "text-2xl font-bold text-[red]"
                            : "text-2xl font-bold text-greens"
                        }
                      >
                        {yearlyProfit.toLocaleString()}
                      </div>
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

export default BusinessSummary;
