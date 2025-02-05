import React, { useContext } from "react";
import dayjs from "dayjs";
import { CalendarContext } from "../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SavingsDay from "./SavingsDay";

const SavingsMonth = ({ monthData, month, savingsDataLoading }) => {
  const { monthIndex, setMonthIndex, inMobile } = useContext(CalendarContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }
  return (
    <div className="mx-auto">
      {/* Month and Year */}
      <div>
        <div className={`flex justify-between items-center text-3xl pr-2`}>
          <div className="flex">
            <FaAngleLeft
              className={`text-yellows  hover:text-lyellows cursor-pointer `}
              onClick={handlePrevMonth}
            />
            <FaAngleRight
              className={`text-yellows hover:text-lyellows cursor-pointer `}
              onClick={handleNextMonth}
            />
          </div>
          <div
            className={`font-extrabold text-center text-yellows select-none`}
          >
            {
              /* display current month and year */
              dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")
            }
          </div>
        </div>
      </div>

      <div
        className={`bg-white grid grid-flow-col text-center font-semibold rounded-md mt-3`}
      >
        <div className="text-loranges">SUN</div>
        <div className="text-loranges">MON</div>
        <div className="text-loranges">TUE</div>
        <div className="text-loranges">WED</div>
        <div className="text-loranges">THU</div>
        <div className="text-loranges">FRI</div>
        <div className="text-loranges">SAT</div>
      </div>
      <div
        id="calendar"
        className={`flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto h-[250px] min-w-[350px] mmd:h-hfull`}
      >
        {month.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <SavingsDay
                day={day}
                key={idx}
                rowIdx={i}
                monthData={monthData}
                savingsDataLoading={savingsDataLoading}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SavingsMonth;
