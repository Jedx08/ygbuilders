import React, { useEffect, useState } from "react";
import BusinessDay from "./BusinessDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faCaretLeft,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./../Navbar";
import Footer from "./../Footer";
import BusinessForm from "./BusinessForm";
import expenses from "../../media/expenses.png";
import BMonthlyExpensesForm from "./BMonthlyExpensesForm";
import BMonthlyCapitalForm from "./BMonthlyCapitalForm";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import useBusinessCapital from "../../hooks/useBusinessCapital";

const BusinessMonth = ({ month }) => {
  const {
    monthIndex,
    setMonthIndex,
    showBusinessForm,
    showBusinessExpenseForm,
    setShowBusinessExpensesForm,
    businessExpensesLoading,
    setBusinessExpensesLoading,
    businessExpensesData,
    showBusinessCapitalForm,
    businessCapitalLoading,
    setBusinessCapitalLoading,
    businessCapitalData,
    setShowBusinessCapitalForm,
  } = useContext(CalendarContext);

  const getBusinessExpenses = useBusinessExpenses();
  const getBusinessCapital = useBusinessCapital();

  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [monthlyCapital, setMonthlyCapital] = useState("");

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  useEffect(() => {
    getBusinessExpenses();
    getBusinessCapital();
    setBusinessExpensesLoading(false);
    setBusinessCapitalLoading(false);
  }, [businessExpensesLoading, businessCapitalLoading]);

  useEffect(() => {
    let mExpenses = 0;
    let mCapital = 0;
    if (!businessExpensesLoading) {
      const getData = () => {
        businessExpensesData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (mExpenses += data.amount);
        });
      };

      getData();
      setMonthlyExpenses(mExpenses);
    }
    if (!businessCapitalLoading) {
      const getData = () => {
        businessCapitalData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (mCapital += data.amount);
        });
      };

      getData();
      setMonthlyCapital(mCapital);
    }
  }, [businessExpensesData, businessCapitalData, monthIndex]);

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops overflow-auto">
        <div className="mb-24 mx-5">
          <div className="grid grid-flow-col grid-cols-7 mt-5 mx-5">
            <div className="grid grid-flow-col justify-end col-span-4 items-center gap-5">
              <div>
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={handlePrevMonth}
                />
              </div>
              <div className="">
                <h1 className="font-extrabold text-center text-4xl text-oranges">
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
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={handleNextMonth}
                />
              </div>
            </div>
            <div className="grid grid-flow-col gap-1 col-span-3 justify-end items-center mr-8">
              {/* Monthly Capital */}
              <div className="bg-white py-1 px-3 rounded-md">
                <p className="text-sm font-bold text-lgreens">
                  Monthly Capital
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img src={expenses} className="h-5 w-8" />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-md font-semibold text-[red]">
                      {monthlyCapital}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => setShowBusinessCapitalForm(true)}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="text-oranges hover:text-loranges cursor-pointer text-lg"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Monthly Expenses */}
              <div className="bg-white py-1 px-3 rounded-md">
                <p className="text-sm font-bold text-lgreens">
                  Monthly Bills, Rent etc...
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img src={expenses} className="h-5 w-8" />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-md font-semibold text-[red]">
                      {monthlyExpenses}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => setShowBusinessExpensesForm(true)}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="text-oranges hover:text-loranges cursor-pointer text-lg"
                      />
                    </button>
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
          <div className="h-s80 flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto rounded-lg shadow-lg">
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <BusinessDay day={day} key={idx} rowIdx={i} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {showBusinessExpenseForm && (
        <BMonthlyExpensesForm monthlyExpenses={monthlyExpenses} />
      )}
      {showBusinessCapitalForm && (
        <BMonthlyCapitalForm monthlyCapital={monthlyCapital} />
      )}
      {showBusinessForm && <BusinessForm />}
    </>
  );
};

export default BusinessMonth;
