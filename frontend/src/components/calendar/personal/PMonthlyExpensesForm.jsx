import React, { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { CalendarContext } from "../../../context/CalendarContext";
import monthExpensesIcon from "../../../media/monexpenses.png";
import { MdOutlinePostAdd } from "react-icons/md";
import PMonthlyExpensesData from "./PMonthlyExpensesData";
import PMonthlyExpensesAdd from "./PMonthlyAdd";
import { IoClose } from "react-icons/io5";

const PMonthlyExpensesForm = ({
  expensesDataLoading,
  expensesData,
  monthlyExpenses,
  personalExpensesFloat,
}) => {
  const {
    monthIndex,
    showPersonalExpenseInput,
    setShowPersonalExpensesInput,
    loggedIn,
    showPersonalExpensesForm,
    setShowPersonalExpensesForm,
    inMobile,
  } = useContext(CalendarContext);

  const navigate = useNavigate();

  function addExpenses() {
    setShowPersonalExpensesInput(true);
  }

  // to close form when clicked outside form
  const childRef = useRef(null);

  const handleClickOutside = (event) => {
    if (childRef.current && !childRef.current.contains(event.target)) {
      setShowPersonalExpensesForm(false), setShowPersonalExpensesInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickInside = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`bg-white rounded-lg py-5 h-hfull clg:mx-auto ${
        personalExpensesFloat && showPersonalExpensesForm
          ? "h-s100 w-full fixed left-0 top-0 bg-light bg-opacity-50 flex justify-center items-center z-20"
          : "relative"
      }`}
    >
      <div
        ref={childRef}
        onMouseDown={handleClickInside}
        className={`${
          personalExpensesFloat && showPersonalExpensesForm
            ? "rounded-md bg-white overflow-hidden px-5 shadow-lg mx-auto py-5 relative border border-[#ebebeb] max-w-[441px] w-full"
            : ""
        }`}
      >
        {/* Close button */}
        {personalExpensesFloat && showPersonalExpensesForm ? (
          <div
            onClick={() => {
              setShowPersonalExpensesForm(false);
            }}
            className={`cursor-pointer hover:bg-btnHov active:bg-btnAct hover:rounded-full font-bold absolute top-1  mb-5 p-1 text-2xl ${
              inMobile ? "right-2" : "right-1"
            }`}
          >
            <IoClose className="text-greens" />
          </div>
        ) : (
          <></>
        )}

        <div className="text-center">
          <h1 className="font-bold text-lg text-greens mb-2">
            Monthly Expenses
          </h1>
          <p className="text-sm font-normal mb-2">
            {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
          </p>
        </div>
        <div className={`text-center`}>
          <span className="text-xs text-[#A6ACAF] font-normal">
            (Bills, Loan, Insurance, Tuition, Rent and etc...)
          </span>
        </div>

        {/* Monthly Expenses Data */}
        <div
          className={`h-[158px] clg:mx-auto w-full ${
            showPersonalExpenseInput ? "" : "overflow-auto"
          }`}
        >
          {expensesDataLoading && (
            <div className="text-center mt-3 text-sm text-[#A6ACAF]">
              Getting data...
            </div>
          )}

          {!expensesDataLoading && expensesData.length === 0 && (
            <div className="text-center mt-3 text-sm text-[#A6ACAF]">
              No data to show
            </div>
          )}

          {expensesData.map((d, i) => {
            return (
              <React.Fragment key={i}>
                <PMonthlyExpensesData expensesData={d} />
              </React.Fragment>
            );
          })}
        </div>

        <div
          className={`flex justify-center ${
            showPersonalExpenseInput ? "h-[56px]" : ""
          }`}
        >
          <div
            onClick={() => {
              if (!loggedIn) {
                navigate("/login");
              } else {
                addExpenses();
              }
            }}
            className={`mx-auto py-1 rounded-md px-6 bg-greens text-base font-semibold text-white hover:bg-lgreens flex gap-1 items-center cursor-pointer my-2 ${
              showPersonalExpenseInput ? "hidden" : ""
            }`}
          >
            <span className="text-3xl">
              <MdOutlinePostAdd />
            </span>
            Add
          </div>
        </div>

        {/* Add button for monthly expenses */}
        {showPersonalExpenseInput && (
          <div className="absolute top-0 left-0 pt-[25%] bg-light bg-opacity-70 h-hfull w-full">
            <PMonthlyExpensesAdd />
          </div>
        )}

        {/* Total Expenses */}
        <div className="bottom-2 w-full">
          <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
            <div className="border border-inputLight rounded-md py-1 text-center w-fit">
              <div className="grid grid-cols-3 items-center">
                <div className="pl-2">
                  <img src={monthExpensesIcon} className="w-11 mr-2" />
                </div>
                <div className="mt-[0.15rem]">
                  <p className="text-[red] font-bold text-xl/[24px]">
                    {monthlyExpenses.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMonthlyExpensesForm;
