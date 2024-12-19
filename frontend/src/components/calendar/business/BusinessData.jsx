import { useEffect, useContext, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useGetBusinessData from "../../../hooks/useGetBusinessData";
import dayjs from "dayjs";
import capitalIcon from "../../../media/bus_pouch.png";
import expensesIcon from "../../../media/bus_expenses.png";
import salesIcon from "../../../media/sales.png";
import profitIcon from "../../../media/bus_profit.png";
import monthCapitalIcon from "../../../media/busmon_pouch.png";
import monthSalesIcon from "../../../media/busmon_sales.png";
import monthExpensesIcon from "../../../media/busmon_expenses.png";
import monthProfitIcon from "../../../media/busmon_net.png";

const BusinessData = () => {
  const {
    monthIndex,
    businessIncomeLoading,
    businessIncomeData,
    setExactDaySelected,
    setBusinessFormSelectedDate,
    setBusinessButton,
    exactDaySelected,
  } = useContext(CalendarContext);
  const getBusinessIncome = useGetBusinessData();

  const [capitalCount, setCapitalCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [profitCount, setProfitCount] = useState(0);

  const [monthData, setMonthData] = useState(null);
  const [businessDataLoading, setBusinessDataLoading] = useState(true);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);

  useEffect(() => {
    if (businessIncomeLoading) {
      setBusinessDataLoading(true);
      getBusinessIncome();
    }
  }, [businessIncomeLoading]);

  useEffect(() => {
    if (!businessIncomeLoading) {
      const businessIncomeDB = async () => {
        const data = await businessIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("MMMM-YYYY") ===
            dayjs().month(monthIndex).format("MMMM-YYYY")
        );
        setMonthData(data);
        setBusinessDataLoading(false);
        setBusinessButton(true);
        setMonthlyDataLoading(false);
      };

      businessIncomeDB();

      const data = businessIncomeData.filter(
        (date) =>
          dayjs(date.day).format("DD-MM-YY") ===
          exactDaySelected.format("DD-MM-YY")
      );

      setBusinessFormSelectedDate(data[0]);
    }
  }, [businessIncomeLoading, monthIndex]);

  useEffect(() => {
    let cap = 0;
    let sales = 0;
    let expenses = 0;
    let profit = 0;
    if (!monthlyDataLoading) {
      const monthlyCount = () => {
        monthData.forEach((data) => {
          cap += data.capital;
          sales += data.sales;
          expenses += data.expenses;
          profit += data.profit;
        });

        setCapitalCount(cap);
        setSalesCount(sales);
        setExpensesCount(expenses);
        setProfitCount(profit);
      };

      monthlyCount();
    }
  }, [monthlyDataLoading, monthData]);

  return (
    <div className="flex justify-center space-x-10">
      {/* Income Data */}
      <div>
        <div
          className={`border border-light shadow-lg bg-white font-bold rounded-md `}
        >
          <div
            className={`flex gap-3 justify-center items-center px-1 py-1 text-oranges text-xl`}
          >
            <p>Income</p>
          </div>
        </div>
        {businessDataLoading && (
          <div className="bg-white border border-light py-3 text-center shadow-lg rounded-md text-sm text-[#A6ACAF]">
            Getting Data...
          </div>
        )}
        {!businessDataLoading && (
          <>
            {monthData.length === 0 ? (
              <div className="bg-white border border-light py-3 text-center shadow-lg rounded-md text-sm text-[#A6ACAF]">
                No data to show
              </div>
            ) : (
              ""
            )}
            {monthData.map((d, i) => {
              return (
                <div
                  onClick={() => {
                    setExactDaySelected(dayjs(d.day));
                    setBusinessFormSelectedDate(d);
                  }}
                  key={i}
                  className="bg-white border border-light py-1 cursor-pointer hover:border-loranges shadow-lg rounded-md"
                >
                  <div className="text-lg font-medium text-center">
                    {dayjs(d.day).format("MMMM D")}
                  </div>
                  <div
                    className={`flex font-medium justify-center text-sm py-2`}
                  >
                    <div className={`flex space-x-4`}>
                      {/* capital */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={capitalIcon}
                            alt="capital"
                            className={`w-8`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-oranges text-lg">
                            {d.capital.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* sales */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img src={salesIcon} alt="sales" className={`w-8`} />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-oranges text-lg">
                            {d.sales.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* expenses */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={expensesIcon}
                            alt="expenses"
                            className={`w-8`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-[red] text-lg">
                            {d.expenses.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* profit */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={profitIcon}
                            alt="profit"
                            className={`w-8`}
                          />
                          <p className="ml-1 font-semibold text-[#D0D0D0]">:</p>
                          <p
                            className={`text-lg ${
                              d.profit < 0 ? "text-[red]" : "text-greens"
                            }`}
                          >
                            {d.profit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Monthly Summary */}
      <div>
        <div
          className={`border border-light shadow-lg bg-white font-bold rounded-md`}
        >
          <div
            className={`flex gap-3 justify-center items-center px-1 py-1 text-oranges text-xl`}
          >
            <p>Summary</p>
          </div>
        </div>
        <div className="border border-light shadow-lg bg-white rounded-md">
          <div className="flex items-center space-x-5 py-2">
            {/* Monthly Capital */}
            <div className="flex items-center font-semibold">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthCapitalIcon}
                  alt="mon_capital"
                  className={`w-14`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-oranges text-lg">
                  {capitalCount.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Sales */}
            <div className="flex items-center font-semibold">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img src={monthSalesIcon} alt="mon_sales" className={`w-14`} />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-oranges text-lg">
                  {salesCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-5 py-2">
            {/* Monthly Expenses */}
            <div className="flex items-center font-semibold">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthExpensesIcon}
                  alt="mon_expenses"
                  className={`w-14`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-oranges text-lg">
                  {expensesCount.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Profit */}
            <div className="flex items-center font-semibold">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthProfitIcon}
                  alt="mon_profit"
                  className={`w-14`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-oranges text-lg">
                  {profitCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessData;
