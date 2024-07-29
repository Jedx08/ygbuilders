import React, { useContext, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import BMonthlyExpensesAdd from "./BMonthlyExpensesAdd";
import BMonthlyExpensesData from "./BMonthlyExpensesData";
import expensesIcon from "../../media/busmon_expenses.png";

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
              <h1 className="font-bold text-2xl text-loranges mb-2">
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
              className="absolute right-0 mb-5 cursor-pointer hover:bg-light hover:rounded-full p-1"
            >
              <IoClose className="text-2xl text-loranges hover:text-oranges" />
            </div>
          </div>

          <div className="text-sm font-bold mb-3 text-center">
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
              className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1 text-white flex items-center gap-1 border border-loranges bg-loranges hover:bg-oranges font-semibold my-2 ${
                showBusinessExpenseInput ? "hidden" : ""
              }`}
            >
              <MdOutlinePostAdd className="text-3xl" /> Add
            </div>
          </div>

          {/* Add button for monthly expenses */}
          <div>{showBusinessExpenseInput && <BMonthlyExpensesAdd />}</div>

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

export default BMonthlyExpensesForm;
