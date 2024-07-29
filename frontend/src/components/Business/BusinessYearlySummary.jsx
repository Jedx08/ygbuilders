import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarContext } from "../../context/CalendarContext";
import { useContext, useEffect, useState } from "react";
import localeData from "dayjs/plugin/localeData";
import dayjs from "dayjs";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Bar } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import yearlyCapitalIcon from "../../media/busyear_pouch.png";
import yearlySalesIcon from "../../media/busyear_sales.png";
import yearlyExpensesIcon from "../../media/busyear_expenses.png";
import yearlyProfitIcon from "../../media/busyear_net.png";
const BusinessYearlySummary = () => {
  const getBusinessData = useGetBusinessData();
  const getMonthlyExpenses = useBusinessExpenses();
  const getMonthlyCapital = useBusinessCapital();

  const { monthIndex, setMonthIndex } = useContext(CalendarContext);

  const [yearlyCapital, setYearlyCapital] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [capitalCount, setCapitalCount] = useState([]);
  const [salesCount, setSalesCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [profitCount, setProfitCount] = useState([]);

  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  dayjs.extend(localeData);
  dayjs().localeData();

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
      const yearData = await getBusinessData();
      const monthCapital = await getMonthlyCapital();
      const monthExpenses = await getMonthlyExpenses();
      const allMonths = dayjs.months();

      const filteredData = yearData.filter(
        (data) =>
          dayjs(data.day).format("YY") ===
          dayjs().month(monthIndex).format("YY")
      );

      const filteredMonthlyCapital = monthCapital.filter(
        (data) =>
          dayjs(data.moth).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      const filteredMonthlyExpenses = monthExpenses.filter(
        (data) =>
          dayjs(data.moth).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      //calculate yearly capital
      let capitalPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        capitalPerDate.push(0);
      }

      capitalPerDate.map((months, index) => {
        let c = 0;
        let mc = 0;

        filteredMonthlyCapital
          .filter(
            (month) => dayjs(month.month).format("M") === index.toString()
          )
          .forEach((data) => {
            mc += data.amount;
          });

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            c += data.capital;
          });

        capitalPerDate[index - 1] = c + mc;
      });

      setCapitalCount(capitalPerDate);

      //calculate yearly sales
      let salesPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        salesPerDate.push(0);
      }

      salesPerDate.map((months, index) => {
        let c = 0;

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            c += data.sales;
          });

        salesPerDate[index - 1] = c;
      });

      setSalesCount(salesPerDate);

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

      //calculate yearly profit
      let profitPerDate = [];

      for (let i = 1; i <= allMonths.length; i++) {
        profitPerDate.push(0);
      }

      profitPerDate.map((months, index) => {
        let c = 0;
        let s = 0;
        let e = 0;
        let m_c = 0;
        let m_e = 0;

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            e += data.expenses;
          });

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            s += data.sales;
          });

        filteredData
          .filter((month) => dayjs(month.day).format("M") === index.toString())
          .forEach((data) => {
            c += data.capital;
          });

        filteredMonthlyCapital
          .filter(
            (month) => dayjs(month.month).format("M") === index.toString()
          )
          .forEach((data) => {
            m_c += data.amount;
          });

        filteredMonthlyExpenses
          .filter(
            (month) => dayjs(month.month).format("M") === index.toString()
          )
          .forEach((data) => {
            m_e += data.amount;
          });

        profitPerDate[index - 1] = s - e - m_e - m_c - c;
      });

      setProfitCount(profitPerDate);
    };

    barGraphData();
  }, [monthIndex]);

  const year = dayjs().month(monthIndex).year();

  const yearlyProfit =
    yearlySales - yearlyExpenses - thisYearMonthlyExpenses - yearlyCapital;

  const nextYear = () => {
    setMonthIndex(monthIndex + 12);
  };

  const prevYear = () => {
    setMonthIndex(monthIndex - 12);
  };

  return (
    <div>
      <div className=" w-[60%] mx-auto m-5  mt-5 gap-3 content-center">
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
            <>
              <div className="p-5 rounded-lg">
                <div className="w-[80%] mt-5 mx-auto z-10">
                  <Bar
                    data={{
                      labels: dayjs.months(),
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessYearlySummary;
