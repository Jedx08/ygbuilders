import React, { useContext } from "react";
import dayjs from "dayjs";
import { CalendarContext } from "../../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import PersonalDay from "./PersonalDay";
const PersonalMonth = ({ month, monthData, personalDataLoading }) => {
  const { monthIndex, setMonthIndex, inMobile } = useContext(CalendarContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  return (
    <div className="mx-auto">
      <div>
        {/* Month and Year */}
        <div className={`flex justify-between items-center text-3xl pr-2`}>
          <div className="flex">
            <FaAngleLeft
              className={`text-greens  hover:text-lgreens cursor-pointer `}
              onClick={handlePrevMonth}
            />
            <FaAngleRight
              className={`text-greens hover:text-lgreens cursor-pointer `}
              onClick={handleNextMonth}
            />
          </div>
          <div className={`font-extrabold text-center text-greens select-none`}>
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
        <div className="text-lgreens">MON</div>
        <div className="text-lgreens">TUE</div>
        <div className="text-lgreens">WED</div>
        <div className="text-lgreens">THU</div>
        <div className="text-lgreens">FRI</div>
        <div className="text-loranges">SAT</div>
      </div>
      <div
        id="calendar"
        className={`flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto h-[250px] min-w-[350px] mmd:h-hfull`}
      >
        {month.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <PersonalDay
                day={day}
                key={idx}
                rowIdx={i}
                monthData={monthData}
                personalDataLoading={personalDataLoading}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PersonalMonth;
