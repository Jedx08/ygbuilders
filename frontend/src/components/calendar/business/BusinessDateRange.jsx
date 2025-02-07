import { useContext, useEffect } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useGetBusinessData from "../../../hooks/useGetBusinessData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import dayjs from "dayjs";
import businessCapitalIcon from "../../../media/bus_pouch.png";
import businessSalesIcon from "../../../media/bus_sales.png";
import businessExpensesIcon from "../../../media/bus_expenses.png";
import businessEProfitIcon from "../../../media/bus_profit.png";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";

const BusinessDateRange = ({ startDate, endDate }) => {
  const {
    businessIncomeData,
    businessIncomeLoading,
    setBusinessIncomeLoading,
  } = useContext(CalendarContext);

  const getBusinessData = useGetBusinessData();

  // getting personalIncome
  // will re-trigger when personalIncomeLoading is set to true
  useEffect(() => {
    if (businessIncomeLoading) {
      getBusinessData();
      setBusinessIncomeLoading(false);
    }
  }, [businessIncomeLoading]);

  // filtering dates an sorting them between a certain range
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);

  const getDatesInRange = (data, startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return data.filter((item) => {
      const itemDate = dayjs(item.day);
      return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
    });
  };

  const filteredDatesInRange = getDatesInRange(
    businessIncomeData,
    startDate,
    endDate
  );

  let capitalRange = 0;
  let salesRange = 0;
  let expensesRange = 0;
  let profitRange = 0;

  filteredDatesInRange.map((data) => {
    return (
      (capitalRange += data.capital),
      (salesRange += data.sales),
      (expensesRange += data.expenses),
      (profitRange += data.profit)
    );
  });

  const sortedRange = filteredDatesInRange.sort((a, b) => {
    const dateA = dayjs(a.day);
    const dateB = dayjs(b.day);

    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
  });

  return (
    <>
      <div className="mt-3 px-5 xl:pl-24 lg:pl-5">
        <div className="bg-white rounded-lg py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-evenly space-x-5">
            {/* Gross */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm">
                Capital
              </div>
              <div className="flex items-center font-semibold px-5 py-2">
                <div className={`flex space-x-3 items-center justify-center`}>
                  <img
                    src={businessCapitalIcon}
                    alt="capital"
                    className={`w-14 mdd:w-11 sm:w-9`}
                  />
                  <p className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                    {capitalRange.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Sales */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm">
                Sales
              </div>
              <div className="flex items-center font-semibold px-5 py-2">
                <div className={`flex space-x-3 items-center justify-center`}>
                  <img
                    src={businessSalesIcon}
                    alt="sales"
                    className={`w-14 mdd:w-11 sm:w-9`}
                  />
                  <p className="text-[#399CB4] font-bold text-2xl mdd:text-xl sm:text-lg">
                    {salesRange.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Expenses */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm">
                Expenses
              </div>
              <div className="flex items-center font-semibold px-5 py-2">
                <div className={`flex space-x-3 items-center justify-center`}>
                  <img
                    src={businessExpensesIcon}
                    alt="expenses"
                    className={`w-14 mdd:w-11 sm:w-9`}
                  />
                  <p className="text-[red] font-bold text-2xl mdd:text-xl sm:text-lg">
                    {expensesRange.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Profit */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm">
                Profit
              </div>
              <div className="px-5 py-2 flex items-center justify-center space-x-3">
                <div>
                  <img
                    src={businessEProfitIcon}
                    alt="profit"
                    className="w-14 mdd:w-11 sm:w-9"
                  />
                </div>
                <div
                  className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                    profitRange < 0 ? "text-[red]" : "text-greens"
                  }`}
                >
                  {profitRange.toLocaleString()}
                </div>
                <div>
                  {profitRange < 0 ? (
                    <PiChartLineDown className="text-3xl mdd:text-2xl sm:text-xl text-[#ff3a33]" />
                  ) : (
                    <PiChartLineUp className="text-3xl mdd:text-2xl sm:text-xl text-[#32ca5b]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white mt-3 py-3 w-full rounded-lg items-center justify-center shadow-sm min-h-[280px] max-h-[592px] overflow-auto">
          {sortedRange.length === 0 && (
            <div className="bg-white py-3 text-center rounded-md text-base text-[#A6ACAF] sm:text-sm">
              No data to show
            </div>
          )}
          <div className="">
            {sortedRange.map((data, index) => {
              return (
                <div key={index} className="border border-light py-1">
                  <div className="text-base font-medium text-center">
                    {dayjs(data.day).format("MMMM D, YYYY")}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center justify-evenly py-1">
                    <div className="flex items-center space-x-3">
                      <img
                        src={businessCapitalIcon}
                        alt="capital"
                        className="w-8 sm:w-6"
                      />
                      {/* <p className="text-sm">Gross</p> */}
                      <span className="text-oranges text-base font-semibold">
                        {data.capital.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={businessSalesIcon}
                        alt="sales"
                        className="w-8 sm:w-6"
                      />
                      {/* <p className="text-sm">Gross</p> */}
                      <span className="text-[#399CB4] text-base font-semibold">
                        {data.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={businessExpensesIcon}
                        alt="expenses"
                        className="w-8 sm:w-6"
                      />
                      {/* <p className="text-sm">Expenses</p> */}
                      <span className="text-[red] text-base font-semibold">
                        {data.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={businessEProfitIcon}
                        alt="profit"
                        className="w-8 sm:w-6"
                      />
                      {/* <p className="text-sm">Net</p> */}
                      <span
                        className={`text-base font-semibold ${
                          data.profit < 0 ? "text-[red]" : "text-greens"
                        }`}
                      >
                        {data.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDateRange;
