import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import useGetPersonalData from "../../hooks/useGetPersonalData";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import dayjs from "dayjs";
import pouch from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networth from "../../media/networth.png";

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
      <div className="font-pops bg-light h-s100">
        <div className="flex flex-col justify-center items-center">
          <div className="bg-white w-[80%] mt-8 p-5 rounded-lg flex items-center justify-center">
            <div className="w-[60%] flex items-center justify-between space-x-5">
              <div className="w-fit space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={pouch} alt="puch" className="w-[3rem] sm:w-7" />
                  <p className="font-semibold text-2xl">Gross</p>
                </div>
                <div className="flex justify-center text-2xl font-bold text-greens">
                  {grossRange.toLocaleString()}
                </div>
              </div>
              <div className="w-fit space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={expensesIcon}
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
                  <img src={networth} alt="puch" className="w-[3rem] sm:w-7" />
                  <p className="font-semibold text-2xl">Net</p>
                </div>
                <div
                  className={`flex justify-center text-2xl font-bold ${
                    netRange < 0 ? "text-red" : "text-greens"
                  }`}
                >
                  {netRange.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white w-[80%] mt-5 p-5 rounded-lg flex items-center justify-center">
            <div className="w-[80%]">
              {sortedRange.map((data, index) => {
                return (
                  <div key={index} className="w-full flex justify-between p-3">
                    <div>{dayjs(data.day).format("MMMM D, YYYY")}</div>
                    <div className="w-[20%] flex items-center space-x-2">
                      <img
                        src={pouch}
                        alt="puch"
                        className="w-[1.8rem] sm:w-7"
                      />
                      {/* <p className="text-sm">Gross</p> */}
                      <span className="text-lg">
                        {data.gross.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-[20%] flex items-center space-x-2">
                      <img
                        src={expensesIcon}
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
                        src={networth}
                        alt="puch"
                        className="w-[1.8rem] sm:w-7"
                      />
                      {/* <p className="text-sm">Net</p> */}
                      <span className="text-lg">
                        {data.net.toLocaleString()}
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

export default PersonalDateRange;
