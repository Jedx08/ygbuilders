import React, { useEffect, useState } from "react";
import PersonalDay from "./PersonalDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import Navbar from "../Navbar";
import Footer from "../Footer";
import PersonalForm from "./PersonalForm";
import PMonthlyExpensesForm from "./PMonthlyExpensesForm";
import expensesIcon from "../../media/monexpenses.png";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";

const PersonalMonth = ({ month }) => {
  const {
    monthIndex,
    setMonthIndex,
    showPersonalForm,
    showPersonalExpenseForm,
    setShowPersonalExpensesForm,
    personalExpensesData,
    personalExpensesLoading,
    setPersonalExpensesLoading,
  } = useContext(CalendarContext);

  const getPersonalExpenses = usePersonalExpenses();

  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  useEffect(() => {
    getPersonalExpenses();
    setPersonalExpensesLoading(false);
  }, [personalExpensesLoading]);

  useEffect(() => {
    let mExpenses = 0;
    if (!personalExpensesLoading) {
      const getData = () => {
        personalExpensesData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (mExpenses += data.amount);
        });
      };

      getData();
      setMonthlyExpenses(mExpenses);
    }
  }, [personalExpensesData, monthIndex]);

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops overflow-auto">
        <div className="mb-24 mx-5">
          <div className="grid grid-flow-col grid-cols-7 mt-5 mx-5">
            <div className="grid grid-flow-col justify-end col-span-4 items-center gap-5">
              <div>
                <FaAngleLeft
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
                <FaAngleRight
                  className="text-greens text-3xl hover:text-lgreens cursor-pointer"
                  onClick={handleNextMonth}
                />
              </div>
            </div>
            <div className="grid col-span-3 justify-end items-center mr-8">
              {/* Monthly Expenses */}
              <div
                onClick={() => setShowPersonalExpensesForm(true)}
                className="bg-white py-1 px-3 rounded-md text-center cursor-pointer shadow-lg"
              >
                <p className="text-md text-center font-bold text-greens">
                  Monthly Expenses
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img src={expensesIcon} className="h-5 w-10" />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-md font-bold text-[red]">
                      {monthlyExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPenToSquare className="text-lgreens hover:text-greens text-2xl font-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white grid grid-flow-col text-center text-sm font-semibold rounded-md mt-3">
            <div className="text-loranges">SUN</div>
            <div className="text-lgreens">MON</div>
            <div className="text-lgreens">TUE</div>
            <div className="text-lgreens">WED</div>
            <div className="text-lgreens">THU</div>
            <div className="text-lgreens">FRI</div>
            <div className="text-loranges">SAT</div>
          </div>
          <div className="h-s90 flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto rounded-lg shadow-lg">
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

      {showPersonalExpenseForm && (
        <PMonthlyExpensesForm monthlyExpenses={monthlyExpenses} />
      )}
      {showPersonalForm && <PersonalForm />}
    </>
  );
};

export default PersonalMonth;
