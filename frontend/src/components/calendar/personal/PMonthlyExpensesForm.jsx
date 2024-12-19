import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { CalendarContext } from "../../../context/CalendarContext";
import usePersonalExpenses from "../../../hooks/usePersonalExpenses";
import monthExpensesIcon from "../../../media/monexpenses.png";
import { MdOutlinePostAdd } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import PMonthlyExpensesData from "./PMonthlyExpensesData";
import PMonthlyExpensesAdd from "./PMonthlyAdd";

const PMonthlyExpensesForm = () => {
  const {
    monthIndex,
    personalExpensesLoading,
    personalExpensesData,
    showPersonalExpenseInput,
    setShowPersonalExpensesInput,
    loggedIn,
  } = useContext(CalendarContext);

  const getPersonalExpenses = usePersonalExpenses();
  const navigate = useNavigate();

  const [expensesData, setExpensesData] = useState([]);
  const [expensesDataLoading, setExpensesDataLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  useEffect(() => {
    if (personalExpensesLoading) {
      getPersonalExpenses();
    }
  }, [personalExpensesLoading]);

  useEffect(() => {
    let mExpenses = 0;

    if (!personalExpensesLoading) {
      const monthlyExpense = () => {
        const data = personalExpensesData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );
        setExpensesData(data);
        setExpensesDataLoading(false);
      };
      monthlyExpense();

      const getData = () => {
        personalExpensesData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (mExpenses += data.amount);
        });
      };

      getData();
      setMonthlyExpenses(mExpenses);
    } else {
      setExpensesDataLoading(true);
    }
  }, [personalExpensesLoading, monthIndex]);

  function addExpenses() {
    setShowPersonalExpensesInput(true);
  }

  return (
    <div className="bg-white rounded-lg py-5 w-[420px] h-[406px] relative">
      <div className="text-center">
        <h1 className="font-bold text-xl text-greens mb-2">Monthly Expenses</h1>
        <p className="text-md font-semibold mb-2">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </p>
      </div>
      <div className="text-sm text-center font-bold mb-3">
        <span className="text-xs text-[#A6ACAF] font-normal">
          (Bills, Loan, Insurance, Tuition, Rent and etc...)
        </span>
      </div>

      {/* Monthly Expenses Data */}
      <div
        className={`h-[158px] ${
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

      <div className="flex justify-center">
        <div
          onClick={() => {
            if (!loggedIn) {
              navigate("/Login");
            } else {
              addExpenses();
            }
          }}
          className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1 text-white flex items-center gap-1 border border-greens bg-greens hover:bg-lgreens font-bold my-2 ${
            showPersonalExpenseInput ? "hidden" : ""
          }`}
        >
          <MdOutlinePostAdd className="text-3xl" /> Add
        </div>
      </div>

      {/* Add button for monthly expenses */}
      {showPersonalExpenseInput && (
        <div className="absolute top-0 pt-[25%] bg-light bg-opacity-70 h-hfull w-full">
          <PMonthlyExpensesAdd />
        </div>
      )}

      {/* Total Expenses */}
      <div className="absolute bottom-2 w-full">
        <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
          <div className="border border-inputLight rounded-md py-1 text-center w-fit">
            <div className="grid grid-cols-3 items-center">
              <div className="pl-2">
                <img src={monthExpensesIcon} className="w-11 mr-2" />
              </div>
              <div className="mt-[0.15rem]">
                <p className="text-[red] font-bold">
                  {monthlyExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMonthlyExpensesForm;
