import React, { useEffect, useState } from "react";
import PersonalDay from "./PersonalDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight, FaAngleDown } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { FaPenToSquare } from "react-icons/fa6";
import Navbar from "../Navbar";
import Footer from "../Footer";
import PersonalForm from "./PersonalForm";
import PMonthlyExpensesForm from "./PMonthlyExpensesForm";
import expensesIcon from "../../media/monexpenses.png";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import PersonalMobileData from "./PersonalMobileData";

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
  const [showMobileData, setShowMobileData] = useState(false);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleMobileData() {
    if (showMobileData) {
      setShowMobileData(false);
    } else {
      setShowMobileData(true);
    }
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
          <div className="grid grid-flow-col grid-cols-3 mt-5 mx-5 lg:grid-rows-2 lg:grid-flow-row sm:mx-0">
            {/* Info */}
            <div className="col-span-1 items-center flex lg:order-3 lg:col-span-1 lg:justify-end">
              <div className="bg-white flex items-center gap-2 w-fit text-sm px-3 py-2 shadow-lg rounded-md mt-2 lg:text-xs md:py-1">
                <BsInfoCircle className="text-oranges text-2xl" />
                <p>
                  Click a Date to <span className="font-bold">Add/Edit</span>{" "}
                  data
                </p>
              </div>
            </div>
            {/* Month and Year */}
            <div className="grid grid-flow-col justify-center col-span-1 items-center gap-5 lg:justify-start lg:col-span-2 lg:order-2 sm:gap-3 sm:justify-start">
              <div>
                <FaAngleLeft
                  className="text-greens text-3xl hover:text-lgreens cursor-pointer sm:text-2xl"
                  onClick={handlePrevMonth}
                />
              </div>
              <div className="">
                <h1 className="font-extrabold text-center text-4xl text-greens lg:text-3xl sm:font-bold ssm:text-2xl xs:text-lg">
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
                  className="text-greens text-3xl hover:text-lgreens cursor-pointer sm:text-2xl"
                  onClick={handleNextMonth}
                />
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="grid grid-flow-col gap-1 col-span-1 justify-end items-center mr-8 lg:col-span-3 lg:row-span-1 lg:mr-0 sm:mr-0 ssm:mr-0">
              <div
                onClick={() => setShowPersonalExpensesForm(true)}
                className="bg-white py-1 px-3 rounded-md text-center cursor-pointer shadow-lg ssm:px-2"
              >
                <p className="text-md text-center font-bold text-greens md:text-sm sm:text-xs sm:font-semibold">
                  Monthly Expenses
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img src={expensesIcon} className="w-10 ssm:w-6" />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p className="text-md font-bold text-[red] ssm:text-sm xs:text-sm">
                      {monthlyExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPenToSquare className="text-lgreens hover:text-greens text-2xl font-bold ssm:text-xl" />
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
          <div className="flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto rounded-lg shadow-lg">
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <PersonalDay day={day} key={idx} rowIdx={i} />
                ))}
              </React.Fragment>
            ))}
          </div>

          <div
            onClick={handleMobileData}
            className="border border-light shadow-lg bg-white mt-3 text-sm font-bold rounded-md hidden ssm:block"
          >
            <div className="flex gap-3 justify-center items-center px-1 py-1 text-greens text-lg">
              <p>Income</p>
            </div>
          </div>
          <div className="hidden ssm:block">
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <PersonalMobileData day={day} key={idx} rowIdx={i} />
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
