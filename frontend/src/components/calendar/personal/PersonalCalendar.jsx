import { useContext, useState, useEffect } from "react";
import { getMonth } from "../../../utilities/getMonth";
import { CalendarContext } from "../../../context/CalendarContext";
import PersonalMonth from "./PersonalMonth";
import PersonalForm from "./PersonalForm";
import PersonalData from "./PersonalData";
import PMonthlyExpensesForm from "./PMonthlyExpensesForm";
import { BsInfoCircle } from "react-icons/bs";

const PersonalCalendar = () => {
  const { monthIndex } = useContext(CalendarContext);
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
      {/* Instructions */}
      <div className={`items-center flex justify-center `}>
        <div
          id="howtouse"
          // onClick={() => {
          //   showTour();
          // }}
          className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-lg rounded-md mt-2 cursor-pointer border border-white hover:border-lgreens text-sm lg:text-xs md:py-1 `}
        >
          <BsInfoCircle className={`text-oranges text-2xl`} />
          <p>
            How to use? <span className="font-bold">Instructions</span>
          </p>
        </div>
      </div>

      {/* Components */}
      <div className="fle flex-wrap">
        {/* Calendar */}
        <div className="">
          <PersonalMonth month={currentMonth} />
        </div>
        {/* Data Form */}
        <div className="">
          <PersonalForm />
        </div>
        {/* Monthly Expenses Form */}
        <div className="">
          <PMonthlyExpensesForm />
        </div>
      </div>

      {/* Personal Data */}
      <div className="shadow-lg ">
        <div
          className={`border border-light shadow-lg bg-white mt-3 font-medium rounded-md `}
        >
          <div
            className={`flex gap-3 justify-center items-center px-1 py-1 text-greens text-xl`}
          >
            Income
          </div>
        </div>
        <div>
          <PersonalData />
        </div>
      </div>
    </>
  );
};

export default PersonalCalendar;
