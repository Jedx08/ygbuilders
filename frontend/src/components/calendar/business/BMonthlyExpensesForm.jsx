import React, { useContext } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import { CalendarContext } from "../../../context/CalendarContext";
import dayjs from "dayjs";
import BMonthlyExpensesAdd from "./BMonthlyExpensesAdd";
import BMonthlyExpensesData from "./BMonthlyExpensesData";
import expensesIcon from "../../../media/busmon_expenses.png";
import { useNavigate } from "react-router-dom";

const BMonthlyExpensesForm = ({
  expensesDataLoading,
  expensesData,
  monthlyExpenses,
}) => {
  const {
    monthIndex,
    setShowBusinessExpensesForm,
    showBusinessExpenseInput,
    setShowBusinessExpensesInput,
    loggedIn,
  } = useContext(CalendarContext);

  const navigate = useNavigate();

  function addExpenses() {
    setShowBusinessExpensesInput(true);
  }

  return (
    <div className="h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-50">
      <div className="rounded-md bg-white overflow-hidden px-5 py-5 shadow-lg relative min-w-[441px] border border-[#ebebeb]">
        {/* close button */}
        <div
          onClick={() => {
            setShowBusinessExpensesForm(false);
          }}
          className={`cursor-pointer hover:bg-light hover:rounded-full font-bold absolute top-1 right-1 mb-5 p-1 text-2xl`}
        >
          <IoClose className="text-loranges hover:text-oranges" />
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <h1 className="font-bold text-lg text-loranges mb-2">
              Monthly Expenses
            </h1>
            <p className="text-sm font-normal mb-2">
              {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs text-[#A6ACAF] font-normal">
            (Bills, Loan, Insurance, Rent and etc...)
          </span>
        </div>

        {/* Monthly Expenses Data */}
        <div
          className={`h-[158px] mx-auto max-w-[608px] ${
            showBusinessExpenseInput ? "" : "overflow-auto"
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
                <BMonthlyExpensesData
                  expensesData={d}
                  expensesDataLoading={expensesDataLoading}
                />
              </React.Fragment>
            );
          })}
        </div>

        <div
          className={`flex justify-center ${
            showBusinessExpenseInput ? "h-[56px]" : ""
          }`}
        >
          <div
            onClick={() => {
              if (!loggedIn) {
                navigate("/Login");
              } else {
                addExpenses();
              }
            }}
            className={`mx-auto py-1 rounded-md px-6 text-base font-semibold text-white flex gap-1 items-center cursor-pointer my-2 border-loranges bg-loranges hover:bg-oranges ${
              showBusinessExpenseInput ? "hidden" : ""
            }`}
          >
            <span className="text-3xl">
              <MdOutlinePostAdd />
            </span>
            Add
          </div>
        </div>

        {/* Add button for monthly expenses */}
        {showBusinessExpenseInput && (
          <div className="absolute top-0 left-0 pt-[25%] bg-light bg-opacity-70 h-hfull w-full">
            <BMonthlyExpensesAdd />
          </div>
        )}

        {/* Total Expenses */}
        <div className="bottom-2 w-full">
          <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
            <div className="border border-inputLight rounded-md py-1 text-center w-fit">
              <div className="grid grid-cols-3 items-center">
                <div className="pl-2">
                  <img src={expensesIcon} className="w-11 mr-2" />
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

export default BMonthlyExpensesForm;
