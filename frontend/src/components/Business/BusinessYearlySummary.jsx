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
import NumberFlow from "@number-flow/react";

const BusinessYearlySummary = () => {
  const getBusinessData = useGetBusinessData();
  const getMonthlyExpenses = useBusinessExpenses();
  const getMonthlyCapital = useBusinessCapital();

  const {
    monthIndex,
    businessIncomeData,
    businessIncomeLoading,
    setBusinessIncomeLoading,
    businessExpensesData,
    businessExpensesLoading,
    setBusinessExpensesLoading,
    businessCapitalData,
    businessCapitalLoading,
    setBusinessCapitalLoading,
  } = useContext(CalendarContext);

  const [yearlyCapital, setYearlyCapital] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [yearlyExpenses, setYearlyExpenses] = useState(0);

  const [capitalCount, setCapitalCount] = useState([]);
  const [salesCount, setSalesCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [profitCount, setProfitCount] = useState([]);

  const [thisYearMonthlyExpenses, setThisYearMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const yearlyProfit =
    yearlySales - yearlyExpenses - thisYearMonthlyExpenses - yearlyCapital;

  // dayjs months (jan - dec)
  dayjs.extend(localeData);
  dayjs().localeData();
  const months = dayjs.months();
  const newMonths = months.map((month) => {
    return month.slice(0, 3);
  });

  // getting businessIncome
  // will re-trigger when businessIncomeLoading is set to true
  useEffect(() => {
    if (businessIncomeLoading) {
      getBusinessData();
      setBusinessIncomeLoading(false);
    }
  }, [businessIncomeLoading]);

  // getting monthlyExpenses
  // will re-trigger when businessExpensesLoading is set to true
  useEffect(() => {
    if (businessExpensesLoading) {
      getMonthlyExpenses();
      setBusinessExpensesLoading(false);
    }
  }, [businessExpensesLoading]);

  // getting monthlyCapital
  // will re-trigger when businessCapitalLoading is set to true
  useEffect(() => {
    if (businessCapitalLoading) {
      getMonthlyCapital();
      setBusinessCapitalLoading(false);
    }
  }, [businessCapitalLoading]);

  // calculation for yearly income
  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const YearlyIncomeData = async () => {
      businessIncomeData
        .filter(
          (data) =>
            dayjs(data.day).format("YYYY") ===
            dayjs().month(monthIndex).format("YYYY")
        )
        .forEach((data) => {
          (c += data.capital), (s += data.sales), (e += data.expenses);
        });

      businessCapitalData
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
      businessExpensesData
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
  }, [
    monthIndex,
    businessCapitalData,
    businessExpensesData,
    businessIncomeData,
  ]);

  // calculation for bar graph data
  useEffect(() => {
    const barGraphData = async () => {
      const allMonths = dayjs.months();

      const filteredData = businessIncomeData.filter(
        (data) =>
          dayjs(data.day).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      const filteredMonthlyCapital = businessCapitalData.filter(
        (data) =>
          dayjs(data.month).format("YYYY") ===
          dayjs().month(monthIndex).format("YYYY")
      );

      const filteredMonthlyExpenses = businessExpensesData.filter(
        (data) =>
          dayjs(data.month).format("YYYY") ===
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
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            mc += data.amount;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            c += data.capital;
          });

        capitalPerDate[index] = c + mc;
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
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            c += data.sales;
          });

        salesPerDate[index] = c;
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
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            me += data.amount;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            e += data.expenses;
          });

        expensesPerDate[index] = e + me;
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
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            e += data.expenses;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            s += data.sales;
          });

        filteredData
          .filter(
            (month) => dayjs(month.day).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            c += data.capital;
          });

        filteredMonthlyCapital
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            m_c += data.amount;
          });

        filteredMonthlyExpenses
          .filter(
            (month) => dayjs(month.month).format("M") === (index + 1).toString()
          )
          .forEach((data) => {
            m_e += data.amount;
          });

        profitPerDate[index] = s - e - m_e - m_c - c;
      });

      setProfitCount(profitPerDate);
    };

    barGraphData();
  }, [
    monthIndex,
    businessCapitalData,
    businessExpensesData,
    businessIncomeData,
  ]);

  //identifier if yearly data should be displayed or not
  const setGraphDataDisplay = [];

  for (let i = 0; i < capitalCount.length; i++) {
    if (
      (capitalCount[i] ||
        salesCount[i] ||
        expensesCount[i] ||
        profitCount[i]) !== 0
    ) {
      setGraphDataDisplay.push(true);
    } else {
      setGraphDataDisplay.push(false);
    }
  }

  return (
    <>
      <div className="w-full gap-5 pb-5 px-5 shadow-sm">
        {isLoading ? (
          <div className="w-full  bg-white p-5 rounded-lg flex items-center flex-col md:w-full">
            <div className="w-[35%]">
              <Skeleton />
            </div>
            <div className="w-[100%]">
              <Skeleton height={500} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-full gap-5 mb-5 flex">
              <div className="border border-light shadow-sm w-full bg-white rounded-md h-hfull p-5">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <div className="text-base font-semibold sm:text-sm">
                      Capital
                    </div>
                  </div>
                  <div className="text-2xl text-oranges font-bold sm:text-xl ssm:font-semibold">
                    <div className="flex gap-3">
                      <img
                        src={yearlyCapitalIcon}
                        alt="yearly capital"
                        className="w-11 sm:w-9"
                      />
                      <NumberFlow
                        value={yearlyCapital}
                        trend={5}
                        spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                        format={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-light shadow-sm w-full bg-white rounded-md h-hfull p-5">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <div className="text-base font-semibold sm:text-sm">
                      Sales
                    </div>
                  </div>
                  <div className="text-2xl text-[#399CB4] font-bold sm:text-xl ssm:font-semibold">
                    <div className="flex gap-3">
                      <img
                        src={yearlySalesIcon}
                        alt="yearly capital"
                        className="w-11 sm:w-9"
                      />
                      <NumberFlow
                        value={yearlySales}
                        trend={5}
                        spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                        format={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-light shadow-sm w-full bg-white rounded-md h-hfull p-5">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <div className="text-base font-semibold sm:text-sm">
                      Expenses
                    </div>
                  </div>

                  <div className="text-2xl text-[red] font-bold sm:text-xl ssm:font-semibold">
                    <div className="flex gap-3">
                      <img
                        src={yearlyExpensesIcon}
                        alt="yearly capital"
                        className="w-11 sm:w-9"
                      />
                      {/* {(
                        yearlyExpenses + thisYearMonthlyExpenses
                      ).toLocaleString()} */}
                      <NumberFlow
                        value={yearlyExpenses + thisYearMonthlyExpenses}
                        trend={5}
                        spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                        format={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-light shadow-sm w-full bg-white rounded-md h-hfull p-5">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <div className="text-base font-semibold sm:text-sm">
                      Profit
                    </div>
                  </div>
                  <div
                    className={
                      yearlyProfit < 0
                        ? "text-2xl font-bold text-[red] sm:text-xl ssm:font-semibold"
                        : "text-2xl font-bold text-greens sm:text-xl ssm:font-semibold"
                    }
                  >
                    <div className="flex gap-3">
                      <img
                        src={yearlyProfitIcon}
                        alt="yearly capital"
                        className="w-11 sm:w-9"
                      />
                      <NumberFlow
                        value={yearlyProfit}
                        trend={5}
                        spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                        format={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-light w-full h-hfull bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
              <div className="h-[400px] w-full">
                <Bar
                  className="h-hfull"
                  data={{
                    labels: newMonths,
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
                    indexAxis: "x",
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BusinessYearlySummary;
