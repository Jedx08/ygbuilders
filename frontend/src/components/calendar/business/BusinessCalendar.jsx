import { useContext, useEffect, useState } from "react";
import { getMonth } from "../../../utilities/getMonth";
import { CalendarContext } from "../../../context/CalendarContext";
import BusinessMonth from "./BusinessMonth";
import BusinessForm from "./BusinessForm";
import BMonthlyCapitalForm from "./BMonthlyCapitalForm";
import BMonthlyExpensesForm from "./BMonthlyExpensesForm";
import { BsInfoCircle } from "react-icons/bs";
import BusinessData from "./BusinessData";

const BusinessCalendar = () => {
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
          className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-lg rounded-md mt-2 cursor-pointer border border-white hover:border-loranges text-sm lg:text-xs md:py-1 `}
        >
          <BsInfoCircle className={`text-oranges text-2xl`} />
          <p>
            How to use? <span className="font-bold">Instructions</span>
          </p>
        </div>
      </div>

      {/* Components */}
      <div className="grid grid-rows-2 grid-flow-col gap-4">
        <div className="row-span-2 col-span-2">
          <BusinessMonth month={currentMonth} />
        </div>
        <div className="row-span-2">
          <BusinessForm />
        </div>
        <div className="row-span-1">
          <BMonthlyCapitalForm />
        </div>
        <div className="row-span-1">
          <BMonthlyExpensesForm />
        </div>
      </div>

      {/* Business Data */}
      <div className="shadow-lg">
        <div
          className={`border border-light shadow-lg bg-white mt-3 font-bold rounded-md `}
        >
          <div
            className={`flex gap-3 justify-center items-center px-1 py-1 text-oranges `}
          >
            <p>Income</p>
          </div>
        </div>
        <BusinessData />
      </div>
    </>
  );
};

export default BusinessCalendar;
