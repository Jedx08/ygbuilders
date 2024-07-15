import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import PMonthlyExpensesAdd from "./PMonthlyExpensesAdd";
import PMonthlyExpensesData from "./PMonthlyExpensesData";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import Skeleton from "react-loading-skeleton";

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
        <form className="rounded-md bg-white overflow-hidden px-5 shadow-lg border">
          <div className="flex items-center justify-center relative w-full">
            <div className="text-center mt-6">
              <h1 className="font-bold text-2xl text-oranges mb-2">
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
              <FontAwesomeIcon
                icon={faXmark}
                className="text-xl text-loranges hover:text-oranges"
              />
            </div>
          </div>

          <div className="text-sm font-bold mb-3">
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
              className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1  ${
                showPersonalExpenseInput ? "hidden" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-greens text-4xl hover:text-lgreens cursor-pointer"
              />
            </div>
          </div>

          {/* Add button for monthly expenses */}
          <div>{showPersonalExpenseInput && <PMonthlyExpensesAdd />}</div>

          {/* Total Expenses */}
          <div className="px-5 mb-5 flex items-center space-x-2 justify-center mt-2">
            <div>
              <p className="text-sm font-bold">Total Expenses:</p>
            </div>
            <div className="border border-inputLight rounded-md py-1 text-center w-fit">
              <div className="grid grid-cols-3">
                <div className="pl-2">
                  <img className="w-7 mr-3" />
                </div>
                <div className="mt-[0.15rem]">
                  <p className="text-[red] font-bold">{monthlyExpenses}</p>
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
