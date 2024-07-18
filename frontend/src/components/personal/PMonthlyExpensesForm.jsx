import React, { useContext, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import PMonthlyExpensesAdd from "./PMonthlyExpensesAdd";
import PMonthlyExpensesData from "./PMonthlyExpensesData";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import Skeleton from "react-loading-skeleton";
import expensesIcon from "../../media/monexpenses.png";

const PMonthlyExpensesForm = ({ monthlyExpenses }) => {
  const {
    monthIndex,
    setShowPersonalExpensesForm,
    personalExpensesData,
    showPersonalExpenseInput,
    setShowPersonalExpensesInput,
    personalExpensesLoading,
    loadPage,
  } = useContext(CalendarContext);

  const [expensesData, setExpensesData] = useState([]);
  const [expensesDataLoading, setExpensesDataLoading] = useState(true);

  const getPersonalExpenses = usePersonalExpenses();

  function addExpenses() {
    setShowPersonalExpensesInput(true);
  }

  useEffect(() => {
    getPersonalExpenses();
  }, [personalExpensesLoading]);

  useEffect(() => {
    if (!personalExpensesLoading) {
      const monthlyExpense = async () => {
        const data = await personalExpensesData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );

        setExpensesData(data);
        setExpensesDataLoading(false);
      };
      monthlyExpense();
    } else {
      setExpensesDataLoading(true);
    }
  }, [personalExpensesData, monthIndex]);

  return (
    <>
      <div className="font-pops h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-70">
        <form className="rounded-md bg-white overflow-hidden px-5 shadow-lg">
          <div className="flex items-center justify-center relative w-full">
            <div className="text-center mt-6">
              <h1 className="font-bold text-2xl text-greens mb-2">
                Monthly Expenses
              </h1>
              <p className="text-md font-bold mb-2">
                {dayjs(new Date(dayjs().year(), monthIndex)).format(
                  "MMMM YYYY"
                )}
              </p>
            </div>
            <div
              onClick={(e) => {
                if (loadPage) {
                  location.reload();
                }

                e.preventDefault(),
                  setShowPersonalExpensesForm(false),
                  setShowPersonalExpensesInput(false);
              }}
              className="absolute right-0 pr-2 mb-5 cursor-pointer"
            >
              <IoClose className="text-xl text-lgreens hover:text-greens" />
            </div>
          </div>

          <div className="text-sm text-center font-bold mb-3">
            Expenses:{" "}
            <span className="text-xs text-[#A6ACAF] font-normal">
              (Bills, Loan, Insurance, Tuition, Rent and etc...)
            </span>
          </div>

          {expensesData.map((d, i) => (
            <React.Fragment key={i}>
              {expensesDataLoading ? (
                <div className="px-5">
                  <Skeleton height={28} />
                </div>
              ) : (
                <PMonthlyExpensesData expensesData={d} />
              )}
            </React.Fragment>
          ))}

          <div className="flex justify-center">
            <div
              onClick={addExpenses}
              className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1 text-white flex items-center gap-1 border border-greens bg-greens hover:bg-lgreens font-semibold my-2 ${
                showPersonalExpenseInput ? "hidden" : ""
              }`}
            >
              <MdOutlinePostAdd className="text-3xl" /> Add
            </div>
          </div>

          {/* Add button for monthly expenses */}
          <div>{showPersonalExpenseInput && <PMonthlyExpensesAdd />}</div>

          {/* Total Expenses */}
          <div className="px-5 mb-5 flex items-center space-x-2 justify-center mt-2">
            <div>
              <p className="text-sm font-bold">Total:</p>
            </div>
            <div className="border border-inputLight rounded-md py-1 text-center w-fit">
              <div className="grid grid-cols-3 items-center">
                <div className="pl-2">
                  <img src={expensesIcon} className="w-11 mr-2" />
                </div>
                <div className="mt-[0.15rem]">
                  <p className="text-[red] font-bold">
                    {monthlyExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PMonthlyExpensesForm;
