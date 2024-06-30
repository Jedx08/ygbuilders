import React from "react";
import PersonalDay from "./PersonalDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PersonalForm from "./PersonalForm";
import PersonalMonthlyExpensesForm from "./PersonalMonthlyExpensesForm";
import expenses from "../media/expenses.png";

const PersonalMonth = ({ month }) => {
  const {
    monthIndex,
    setMonthIndex,
    showPersonalForm,
    showPersonalExpense,
    setShowPersonalExpenses,
  } = useContext(CalendarContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops overflow-auto">
        <div className="mb-24">
          <div className="grid grid-flow-col grid-cols-7 mt-5 mx-5">
            <div className="grid grid-flow-col justify-end col-span-4 items-center gap-5">
              <div>
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className="text-greens text-3xl hover:text-lgreens cursor-pointer"
                  onClick={handlePrevMonth}
                />
              </div>
              <div className="">
                <h1 className="font-extrabold text-center text-4xl text-greens">
                  {
                    /* display current month and year */
                    dayjs(new Date(dayjs().year(), monthIndex)).format(
                      "MMMM YYYY"
                    )
                  }
                </h1>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faCaretRight}
                  className="text-greens text-3xl hover:text-lgreens cursor-pointer"
                  onClick={handleNextMonth}
                />
              </div>
            </div>
            <div className="grid col-span-3 justify-end items-center mr-8">
              <div className="bg-white py-1 px-3 rounded-md">
                <p className="text-xs font-semibold text-loranges">
                  Monthly Bills, Loan etc...
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img src={expenses} className="h-5 w-5" />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[red]">5000</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-xs"
                      onClick={() => setShowPersonalExpenses(true)}
                    >
                      edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white grid grid-flow-col text-center text-sm font-bold mx-5 rounded-md mt-3">
            <div className="text-oranges">SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div className="text-oranges">SAT</div>
          </div>
          <div className="h-s80 flex-1 grid grid-cols-7 grid-rows-6 mx-5 mt-1 rounded-lg overflow-hidden">
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <PersonalDay day={day} key={idx} rowIdx={i} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {showPersonalExpense && <PersonalMonthlyExpensesForm />}
      {showPersonalForm && <PersonalForm />}
    </>
  );
};

export default PersonalMonth;
