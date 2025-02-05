import { useContext, useEffect } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useGetPersonalData from "../../../hooks/useGetPersonalData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import dayjs from "dayjs";
import pouch from "../../../media/pouch.png";
import expensesIcon from "../../../media/expenses.png";
import networth from "../../../media/networth.png";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";

const PersonalDateRange = () => {
  const {
    startDate,
    endDate,
    personalIncomeData,
    personalIncomeLoading,
    setPersonalIncomeLoading,
  } = useContext(CalendarContext);

  const getPersonalData = useGetPersonalData();

  // getting personalIncome
  // will re-trigger when personalIncomeLoading is set to true
  useEffect(() => {
    if (personalIncomeLoading) {
      getPersonalData();
      setPersonalIncomeLoading(false);
    }
  }, [personalIncomeLoading]);

  // filtering dates an sorting them between a certain range
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);

  const getDatesInRange = (data, startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (startDate && endDate) {
      const daysDiff = end.diff(start, "day");
      console.log(daysDiff + 1);
    }

    return data.filter((item) => {
      const itemDate = dayjs(item.day);
      return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
    });
  };

  const filteredDatesInRange = getDatesInRange(
    personalIncomeData,
    startDate,
    endDate
  );

  let grossRange = 0;
  let expensesRange = 0;
  let netRange = 0;

  filteredDatesInRange.map((data) => {
    return (
      (grossRange += data.gross),
      (expensesRange += data.expenses),
      (netRange += data.net)
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
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm">
                Gross
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-3 items-center justify-center`}>
                  <img
                    src={pouch}
                    alt="gross"
                    className={`w-14 mdd:w-11 sm:w-9`}
                  />
                  <p className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                    {grossRange.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Expenses */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm">
                Expenses
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-3 items-center justify-center`}>
                  <img
                    src={expensesIcon}
                    alt="expenses"
                    className={`w-14 mdd:w-11 sm:w-9`}
                  />
                  <p className="text-[red] font-bold text-2xl mdd:text-xl sm:text-lg">
                    {expensesRange.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Net */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm">
                Net
              </div>
              <div className="bg-subCon px-5 py-2 rounded-md flex items-center justify-center space-x-3">
                <div>
                  <img
                    src={networth}
                    alt="net"
                    className="w-14 mdd:w-11 sm:w-9"
                  />
                </div>
                <div
                  className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                    netRange < 0 ? "text-[red]" : "text-greens"
                  }`}
                >
                  {netRange.toLocaleString()}
                </div>
                <div>
                  {netRange < 0 ? (
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
                  <div className="flex items-center justify-evenly py-1">
                    <div className="flex items-center space-x-3">
                      <img src={pouch} alt="pouch" className="w-8 sm:w-6" />
                      {/* <p className="text-sm">Gross</p> */}
                      <span className="text-oranges text-base font-semibold">
                        {data.gross.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={expensesIcon}
                        alt="expenses"
                        className="w-8 sm:w-6"
                      />
                      {/* <p className="text-sm">Expenses</p> */}
                      <span className="text-[red] text-base font-semibold">
                        {data.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img src={networth} alt="net" className="w-8 sm:w-6" />
                      {/* <p className="text-sm">Net</p> */}
                      <span
                        className={`text-base font-semibold ${
                          data.net < 0 ? "text-[red]" : "text-greens"
                        }`}
                      >
                        {data.net.toLocaleString()}
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

export default PersonalDateRange;
