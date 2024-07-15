import React, { useEffect, useState } from "react";
import BusinessDay from "./BusinessDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FaPenToSquare } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";
import BusinessForm from "./BusinessForm";
import expensesIcon from "../../media/busmon_expenses.png";
import capitalIcon from "../../media/busmon_pouch.png";
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
                <FaAngleLeft
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={handlePrevMonth}
                />
              </div>
              <div>
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
                <FaAngleRight
                  className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                  onClick={handleNextMonth}
                />
              </div>
            </div>
            <div className="grid grid-flow-col gap-1 col-span-3 justify-end items-center mr-8">
              {/* Monthly Capital */}
              <div
                onClick={() => setShowBusinessCapitalForm(true)}
                className="bg-white py-1 px-3 rounded-md text-center cursor-pointer"
              >
                <p className="text-md font-bold text-loranges">
                  Monthly Capital
                </p>
                <div className="flex items-center justify-center space-x-3 py-1">
                  <div className="flex items-center">
                    <img
                      src={capitalIcon}
                      alt="Capital"
                      title="Monthly Capital"
                      className="h-5 w-10"
                    />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-md font-bold text-[red]">
                      {monthlyCapital.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPenToSquare className="text-loranges hover:text-oranges text-2xl font-bold" />
                  </div>
                </div>
              </div>

              {/* Monthly Expenses */}
              <div
                onClick={() => setShowBusinessExpensesForm(true)}
                className="bg-white py-1 px-3 rounded-md cursor-pointer"
              >
                <p className="text-md font-bold text-loranges text-center">
                  Monthly Expenses
                </p>
                <div className="flex items-center justify-center space-x-3 py-1">
                  <div className="flex items-center">
                    <img
                      src={expensesIcon}
                      alt="Expenses"
                      title="Monthly Expenses"
                      className="h-5 w-10"
                    />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-md font-bold text-[red]">
                      {monthlyExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPenToSquare className="text-oranges hover:text-loranges  text-2xl" />
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
          <div className="h-s90 flex-1 grid grid-cols-7 grid-rows-6 mt-1 rounded-lg shadow-lg">
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
