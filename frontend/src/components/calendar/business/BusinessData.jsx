import { useEffect, useContext, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useGetBusinessData from "../../../hooks/useGetBusinessData";
import dayjs from "dayjs";
import capitalIcon from "../../../media/bus_pouch.png";
import expensesIcon from "../../../media/bus_expenses.png";
import salesIcon from "../../../media/sales.png";
import profitIcon from "../../../media/bus_profit.png";

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
    <div>
      <div>
        {businessDataLoading && (
          <div className="bg-white border border-light py-3 text-center rounded-md">
            Getting Data...
          </div>
        )}
        {!businessDataLoading && (
          <>
            {monthData.length === 0 ? (
              <div className="bg-white border border-light py-3 text-center rounded-md">
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
                  className="bg-white border border-light py-1 cursor-pointer hover:border-loranges rounded-md"
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
      <div>capital: {capitalCount}</div>
      <div>sale: {salesCount}</div>
      <div>expenses: {expensesCount}</div>
      <div>profit: {profitCount}</div>
    </div>
  );
};

export default BusinessData;
