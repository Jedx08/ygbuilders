import React, { useContext } from "react";
import dayjs from "dayjs";
import { CalendarContext } from "../../../context/CalendarContext";
import { BsInfoCircle } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import BusinessDay from "./BusinessDay";

const BusinessMonth = ({ month }) => {
  const { monthIndex, inMobile, setMonthIndex } = useContext(CalendarContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  return (
    <>
      <div className="mb-24">
        <div className={``}>
          {/* Month and Year */}
          <div className={`grid grid-flow-col items-center `}>
            <div className="flex">
              <FaAngleLeft
                className={`text-oranges hover:text-loranges cursor-pointer `}
                onClick={handlePrevMonth}
              />
              <FaAngleRight
                className={`text-oranges hover:text-loranges cursor-pointer `}
                onClick={handleNextMonth}
              />
            </div>
            <div>
              <h1
                className={`font-extrabold text-center text-oranges select-none `}
              >
                {
                  /* display current month and year */
                  dayjs(new Date(dayjs().year(), monthIndex)).format(
                    "MMMM YYYY"
                  )
                }
              </h1>
            </div>
          </div>
        </div>

        <div
          className={`bg-white grid grid-flow-col text-center font-semibold rounded-md mt-3 `}
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
          className={`flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto rounded-lg shadow-lg`}
        >
          {month.map((row, i) => (
            <React.Fragment key={i}>
              {row.map((day, idx) => (
                <BusinessDay day={day} key={idx} rowIdx={i} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default BusinessMonth;
