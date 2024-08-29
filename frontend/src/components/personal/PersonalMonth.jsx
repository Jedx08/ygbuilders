import React, { useEffect, useState } from "react";
import PersonalDay from "./PersonalDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
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
    isDataPersonal,
    inMobile,
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
      <div className="bg-light font-pops overflow-auto min-h-[100vh]">
        <div className="mb-24 mx-5">
          <div
            className={`grid grid-flow-col grid-cols-3 mt-5 ${
              inMobile
                ? "grid-rows-2 grid-flow-row xs:flex xs:flex-col"
                : "mx-5 lg:grid-rows-2 lg:grid-flow-row sm:mx-0"
            }`}
          >
            {/* Info */}
            <div
              className={`items-center flex ${
                inMobile
                  ? "order-3 col-span-1 justify-end xs:justify-center xs:order-2 xs:mt-1"
                  : "col-span-1 order-2 justify-center lg:order-3 lg:col-span-1 lg:justify-end"
              }`}
            >
              <div
                className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-lg rounded-md mt-2 ${
                  inMobile
                    ? "text-xl sm:text-lg ssm:text-xs xs:mt-0"
                    : "text-sm lg:text-xs md:py-1"
                }`}
              >
                <BsInfoCircle
                  className={`text-oranges ${
                    inMobile ? "text-5xl sm:text-4xl xs:text-lg" : "text-2xl"
                  }`}
                />
                <p>
                  Click a Date to <span className="font-bold">Add/Edit</span>{" "}
                  data
                </p>
              </div>
            </div>
            {/* Month and Year */}
            <div
              className={`grid grid-flow-col items-center ${
                inMobile
                  ? "justify-start gap-3 col-span-2 order-2 xs:order-3 xs:mt-5"
                  : "gap-3 order-1 col-span-1 justify-start lg:justify-start lg:col-span-2 lg:order-2 sm:gap-3 sm:justify-start"
              }`}
            >
              <div className="flex">
                <FaAngleLeft
                  className={`text-greens  hover:text-lgreens cursor-pointer ${
                    inMobile
                      ? "text-4xl sm:text-3xl ssm:text-2xl "
                      : "text-3xl sm:text-2xl"
                  }`}
                  onClick={handlePrevMonth}
                />
                <FaAngleRight
                  className={`text-greens hover:text-lgreens cursor-pointer ${
                    inMobile
                      ? "text-4xl sm:text-3xl ssm:text-2xl"
                      : "text-3xl sm:text-2xl"
                  }`}
                  onClick={handleNextMonth}
                />
              </div>
              <div>
                <h1
                  className={`font-extrabold text-center text-greens select-none ${
                    inMobile
                      ? "text-4xl ssm:text-2xl"
                      : "text-4xl lg:text-3xl sm:font-bold ssm:text-2xl xs:text-lg"
                  }`}
                >
                  {
                    /* display current month and year */
                    dayjs(new Date(dayjs().year(), monthIndex)).format(
                      "MMMM YYYY"
                    )
                  }
                </h1>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div
              className={`grid grid-flow-col gap-1 justify-end items-center ${
                inMobile
                  ? "col-span-3 row-span-1 xs:justify-center"
                  : "col-span-1 order-3 mr-8 lg:order-1 lg:col-span-3 lg:row-span-1 lg:mr-0 sm:mr-0 ssm:mr-0"
              }`}
            >
              <div
                id="personalMonthlyExpenses"
                onClick={() => setShowPersonalExpensesForm(true)}
                className={`bg-white px-3 rounded-md text-center cursor-pointer shadow-lg ${
                  inMobile ? "py-2" : "ssm:px-2 py-1"
                }`}
              >
                <p
                  className={`text-center font-bold text-greens ${
                    inMobile
                      ? "text-xl ssm:text-sm ssm:font-semibold"
                      : "text-md md:text-sm sm:text-xs sm:font-semibold"
                  }`}
                >
                  Monthly Expenses
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img
                      src={expensesIcon}
                      className={`${
                        inMobile ? "w-12 ssm:w-8" : "w-10 ssm:w-6"
                      }`}
                    />
                    <p className="ml-1 text-[#D0D0D0] text-xs">:</p>
                  </div>
                  <div>
                    <p
                      className={`font-bold text-[red]  ${
                        inMobile
                          ? "text-xl ssm:text-base"
                          : "text-md ssm:text-sm xs:text-sm"
                      }`}
                    >
                      {monthlyExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPenToSquare
                      className={`text-lgreens hover:text-greens font-bold ${
                        inMobile
                          ? "text-3xl ssm:text-2xl"
                          : "text-2xl ssm:text-xl"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`bg-white grid grid-flow-col text-center  font-semibold rounded-md mt-3 ${
              inMobile ? "text-xl ssm:text-sm" : "text-sm"
            }`}
          >
            <div className="text-loranges">SUN</div>
            <div className="text-lgreens">MON</div>
            <div className="text-lgreens">TUE</div>
            <div className="text-lgreens">WED</div>
            <div className="text-lgreens">THU</div>
            <div className="text-lgreens">FRI</div>
            <div className="text-loranges">SAT</div>
          </div>
          <div
            className={`flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto rounded-lg shadow-lg ${
              inMobile ? "h-s40" : ""
            }`}
          >
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <PersonalDay day={day} key={idx} rowIdx={i} />
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="shadow-lg">
            <div
              className={`border border-light shadow-lg bg-white mt-3 font-bold rounded-md ${
                inMobile ? "" : "hidden ssm:block text-sm"
              }`}
            >
              <div
                className={`flex gap-3 justify-center items-center px-1 py-1 text-greens ${
                  inMobile ? "text-2xl ssm:text-lg" : "text-lg"
                }`}
              >
                <p>Income</p>
              </div>
            </div>
            {isDataPersonal && (
              <div
                className={`border border-light bg-white text-sm rounded-md  ${
                  inMobile ? "" : "hidden ssm:block"
                }`}
              >
                <div
                  className={`flex gap-3 justify-center items-center ${
                    inMobile ? "px-2 py-2 text-2xl ssm:text-lg" : "px-1 py-1"
                  }`}
                >
                  <p className="text-[#535353]">No data to show</p>
                </div>
              </div>
            )}
            <div className={`${inMobile ? "" : "hidden ssm:block"}`}>
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
