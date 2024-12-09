import { useContext, useEffect } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import dayjs from "dayjs";
import businessCapitalIcon from "../../media/bus_pouch.png";
import businessSalesIcon from "../../media/bus_sales.png";
import businessExpensesIcon from "../../media/bus_expenses.png";
import businessEProfitIcon from "../../media/bus_profit.png";

const BusinessDateRange = () => {
  const {
    startDate,
    endDate,
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
      <div className="font-pops bg-light h-s100">
        <div className="flex flex-col justify-center items-center">
          <div className="bg-white w-[80%] mt-8 p-5 rounded-lg flex items-center justify-center">
            <div className="w-[80%] flex items-center justify-between space-x-5">
              <div className="w-fit space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={businessCapitalIcon}
                    alt="puch"
                    className="w-[3rem] sm:w-7"
                  />
                  <p className="font-semibold text-2xl">Capital</p>
                </div>
                <div className="flex justify-center text-2xl font-bold text-greens">
                  {capitalRange.toLocaleString()}
                </div>
              </div>
              <div className="w-fit space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={businessSalesIcon}
                    alt="puch"
                    className="w-[3rem] sm:w-7"
                  />
                  <p className="font-semibold text-2xl">Sales</p>
                </div>
                <div className="flex justify-center text-2xl font-bold text-greens">
                  {salesRange.toLocaleString()}
                </div>
              </div>
              <div className="w-fit space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={businessExpensesIcon}
                    alt="puch"
                    className="w-[3rem] sm:w-7"
                  />
                  <p className="font-semibold text-2xl">Expenses</p>
                </div>
                <div className="flex justify-center text-2xl font-bold text-[red]">
                  {expensesRange.toLocaleString()}
                </div>
              </div>
              <div className="w-fit space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={businessEProfitIcon}
                    alt="puch"
                    className="w-[3rem] sm:w-7"
                  />
                  <p className="font-semibold text-2xl">Profit</p>
                </div>
                <div
                  className={`flex justify-center text-2xl font-bold ${
                    profitRange < 0 ? "text-red" : "text-greens"
                  }`}
                >
                  {profitRange.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white w-[80%] mt-5 p-5 rounded-lg flex items-center justify-center">
            <div className="w-full">
              {sortedRange.map((data, index) => {
                return (
                  <div key={index} className="w-full flex justify-between p-3">
                    <div className="w-[20%] flex items-center space-x-2">
                      {dayjs(data.day).format("MMMM D, YYYY")}
                    </div>
                    <div className="w-[20%] flex items-center space-x-2">
                      <img
                        src={businessCapitalIcon}
                        alt="puch"
                        className="w-[1.8rem] sm:w-7"
                      />
                      {/* <p className="text-sm">Gross</p> */}
                      <span className="text-lg">
                        {data.capital.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-[20%] flex items-center space-x-2">
                      <img
                        src={businessSalesIcon}
                        alt="puch"
                        className="w-[1.8rem] sm:w-7"
                      />
                      {/* <p className="text-sm">Gross</p> */}
                      <span className="text-lg">
                        {data.sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-[20%] flex items-center space-x-2">
                      <img
                        src={businessExpensesIcon}
                        alt="puch"
                        className="w-[1.8rem] sm:w-7"
                      />
                      {/* <p className="text-sm">Expenses</p> */}
                      <span className="text-lg">
                        {data.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-[20%] flex items-center space-x-2">
                      <img
                        src={businessEProfitIcon}
                        alt="puch"
                        className="w-[1.8rem] sm:w-7"
                      />
                      {/* <p className="text-sm">Net</p> */}
                      <span className="text-lg">
                        {data.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDateRange;
