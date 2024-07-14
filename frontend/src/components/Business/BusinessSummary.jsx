import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar, Line } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useBusinessCapital from "../../hooks/useBusinessCapital";

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

  const [yearlyCapital, setYearlyCapital] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);
  const [yearlyProfit, setYearlyProfit] = useState(0);

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
    let p = 0;
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
          (c += data.capital),
            (s += data.sales),
            (e += data.expenses),
            (p += data.profit);
        });

      monthCapital.forEach((data) => {
        m_c += data.amount;
      });

      setYearlyCapital(c + m_c);
      setYearlySales(s);
      setYearlyExpenses(e);
      setYearlyProfit(p);
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
  }, []);

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

      monthCapital.forEach((data) => {
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

      const profitPerDate = filteredData.map((data) => {
        const dateData = data.profit;

        return dateData;
      });

      setCapitalCount(capitalPerDate);
      setSalesCount(salesPerDate);
      setExpensesCount(expensesPerDate);
      setProfitCount(profitPerDate);
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
  return (
    <>
      <div className=" w-full py-5">
        <div>
          <h1 className="font-extrabold text-center text-4xl text-oranges pb-5">
            Overall Summary
          </h1>
        </div>
        <div className=" w-[80%] mx-auto justify-between flex text-center">
          <div className=" bg-white rounded-lg w-[20%]">
            <div className="pt-3">Capital</div>
            <div className="text-4xl font-bold px-5 py-4">
              {capital.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[20%]">
            <div className="pt-3">Sales</div>
            <div className="text-4xl font-bold px-5 py-4">
              {sales.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[20%]">
            <div className="pt-3">Expenses</div>
            <div className="text-4xl font-bold px-5 py-4">
              {(expenses + overallMonthlyExpenses).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg w-[20%]">
            <div className="pt-3">Profit</div>
            <div className="text-4xl font-bold px-5 py-4">
              {(
                sales -
                expenses -
                overallMonthlyExpenses -
                capital
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

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
            <h1 className="font-extrabold text-center text-4xl text-oranges">
              {
                /* display current month and year */
                dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")
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
                      borderColor: "#2ec4b6",
                      backgroundColor: "#3cd5c5",
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
                      borderColor: "#ff9f1c",
                      backgroundColor: "#fdac3a",
                    },
                  ],
                }}
              />
              <div className="w-[100%]  h-[fit-content] ">
                <div className="text-center">
                  <div className="text-lg py-5">
                    Monthly Summary ({thisMonth})
                  </div>
                  <div className="w-[100%] grid grid-cols-5 gap-2 mx-auto">
                    <div>
                      <div className="text-sm mb-2">Capital</div>
                      <div className="text-xl font-bold">
                        {monthlyCapital.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">Sales</div>
                      <div className="text-xl font-bold">
                        {monthlySales.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">Expenses</div>
                      <div className="text-xl font-bold">
                        {monthlyExpenses.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">
                        Profit - (Monthly Expenses)
                      </div>
                      <div className="text-xl font-bold">
                        {monthlySales - monthExpenses - monthlyCapital} - (
                        {monthExpenses})
                      </div>
                    </div>
                    <div>
                      <div className="text-sm mb-2">Total Profit</div>
                      <div className="text-xl font-bold">
                        {(
                          monthlySales -
                          monthExpenses -
                          monthlyCapital -
                          monthExpenses
                        ).toLocaleString()}
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
            <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5 mb-5">
              <div>
                <FontAwesomeIcon
                  icon={faCaretLeft}
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
                <FontAwesomeIcon
                  icon={faCaretRight}
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
                            "#2ec4b6",
                            "#41B8D5",
                            "#ff6384",
                            "#ff9f1c",
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
                      Capital:
                      <div className="text-2xl font-bold">
                        {yearlyCapital.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      Sales:
                      <div className="text-2xl font-bold">
                        {yearlySales.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      Expenses:
                      <div className="text-2xl font-bold">
                        {(
                          yearlyExpenses + thisYearMonthlyExpenses
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      Profit:
                      <div className="text-2xl font-bold">
                        {(
                          yearlySales -
                          yearlyExpenses -
                          thisYearMonthlyExpenses -
                          yearlyCapital
                        ).toLocaleString()}
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
