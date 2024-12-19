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
      <div className="flex items-center justify-center space-x-7 mt-10">
        {/* Calendar */}
        <div>
          <BusinessMonth month={currentMonth} />
        </div>
        {/* Data Form */}
        <div>
          <BusinessForm />
        </div>
        {/* Monthly Capital Form */}
        <div>
          <BMonthlyCapitalForm />
        </div>
        {/* Monthly Expenses Form */}
        <div>
          <BMonthlyExpensesForm />
        </div>
      </div>

      {/* Business Data */}
      <div className="mt-5">
        <BusinessData />
      </div>
    </>
  );
};

export default BusinessCalendar;
