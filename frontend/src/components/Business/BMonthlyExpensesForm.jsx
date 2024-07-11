import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import BMonthlyExpensesAdd from "./BMonthlyExpensesAdd";
import BMonthlyExpensesData from "./BMonthlyExpensesData";

const BMonthlyExpensesForm = ({ monthlyExpenses }) => {
  const {
    monthIndex,
    setShowBusinessExpensesForm,
    businessExpensesData,
    showBusinessExpenseInput,
    setShowBusinessExpensesInput,
    businessExpensesLoading,
    loadPage,
  } = useContext(CalendarContext);

  const [expensesData, setExpensesData] = useState([]);
  const [expensesDataLoading, setExpensesDataLoading] = useState(true);

  const getBusinessExpenses = useBusinessExpenses();

  function addExpenses() {
    setShowBusinessExpensesInput(true);
  }

  useEffect(() => {
    getBusinessExpenses();
  }, [businessExpensesLoading]);

  useEffect(() => {
    if (!businessExpensesLoading) {
      const monthlyExpense = async () => {
        const data = await businessExpensesData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );

        setExpensesData(data);
        setExpensesDataLoading(false);
      };
      monthlyExpense();
    } else {
      setExpensesDataLoading(true);
    }
  }, [businessExpensesData, monthIndex]);

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
                  setShowBusinessExpensesForm(false),
                  setShowBusinessExpensesInput(false);
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
              (Bills, Loan, Insurance, Rent and etc...)
            </span>
          </div>

          {expensesData.map((d, i) => (
            <React.Fragment key={i}>
              {expensesDataLoading ? (
                <div className="px-5">
                  <Skeleton height={28} />
                </div>
              ) : (
                <BMonthlyExpensesData expensesData={d} />
              )}
            </React.Fragment>
          ))}

          <div className="flex justify-center">
            <div
              onClick={addExpenses}
              className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1  ${
                showBusinessExpenseInput ? "hidden" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="text-oranges text-4xl hover:text-loranges cursor-pointer"
              />
            </div>
          </div>

          {/* Add button for monthly expenses */}
          <div>{showBusinessExpenseInput && <BMonthlyExpensesAdd />}</div>

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

export default BMonthlyExpensesForm;
