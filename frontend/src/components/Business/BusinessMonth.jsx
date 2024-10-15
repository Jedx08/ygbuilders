import React, { useEffect, useState } from "react";
import BusinessDay from "./BusinessDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FaPenToSquare } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import Navbar from "../Navbar";
import Footer from "../Footer";
import BusinessForm from "./BusinessForm";
import expensesIcon from "../../media/busmon_expenses.png";
import capitalIcon from "../../media/busmon_pouch.png";
import BMonthlyExpensesForm from "./BMonthlyExpensesForm";
import BMonthlyCapitalForm from "./BMonthlyCapitalForm";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import BusinessMobileData from "./BusinessMobileData";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
    isDataBusiness,
    inMobile,
    setLoggedIn,
  } = useContext(CalendarContext);

  const { userInfo, auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const getBusinessExpenses = useBusinessExpenses();
  const getBusinessCapital = useBusinessCapital();

  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [monthlyCapital, setMonthlyCapital] = useState("");
  const [instructions, setInstructions] = useState(null);

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

  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);

        if (userInfo.instructions.calendarB) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, []);

  useEffect(() => {
    const toggleInstructions = async () => {
      try {
        if (instructions) {
          await axiosPrivate.patch(
            "/user/instructions",
            JSON.stringify({ instructions: instructions })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    toggleInstructions();
  }, [instructions]);

  const showTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#monthlyCapital",
          popover: {
            title: "Monthly Expenses",
            description: "Here you can add your monthly Capital. (Optional)",
            side: "left",
          },
        },
        {
          element: "#monthlyExpenses",
          popover: {
            title: "Monthly Expenses",
            description:
              "Here you can add your monthly Bills, Loan, Insurance, Rent and etc...",
            side: "left",
          },
        },
        {
          element: "#howtouse",
          popover: {
            title: "Instructions",
            description:
              "If you want to view the instructions again you can click here.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#calendar",
          popover: {
            title: "Calendar",
            description:
              "Here you can add and edit your data. just click a date.",
            side: "left",
            align: "start",
          },
        },
      ],
    });

    driverObj.drive();

    setInstructions((prev) => ({ ...prev, calendarB: false }));
  };

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

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
                  : "order-2 col-span-1 justify-center lg:order-3 lg:col-span-1 lg:justify-end"
              }`}
            >
              <div
                id="howtouse"
                onClick={() => {
                  showTour();
                }}
                className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-lg rounded-md mt-2 cursor-pointer  hover:border-2 hover:border-loranges ${
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
                  How to use? <span className="font-bold">Instructions</span>
                </p>
              </div>
            </div>

            {/* Month Year */}
            <div
              className={`grid grid-flow-col items-center ${
                inMobile
                  ? "justify-start gap-3 col-span-2 order-2 xs:justify-start xs:order-3 xs:mt-5"
                  : "order-1 gap-3 col-span-1 justify-start lg:justify-start lg:col-span-2 lg:order-2 sm:gap-3 sm:justify-start"
              }`}
            >
              <div className="flex">
                <FaAngleLeft
                  className={`text-oranges hover:text-loranges cursor-pointer ${
                    inMobile
                      ? "text-4xl sm:text-3xl ssm:text-2xl "
                      : "text-3xl sm:text-2xl"
                  }`}
                  onClick={handlePrevMonth}
                />
                <FaAngleRight
                  className={`text-oranges hover:text-loranges cursor-pointer ${
                    inMobile
                      ? "text-4xl sm:text-3xl ssm:text-2xl"
                      : "text-3xl sm:text-2xl"
                  }`}
                  onClick={handleNextMonth}
                />
              </div>
              <div>
                <h1
                  className={`font-extrabold text-center text-oranges select-none ${
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

            {/* Monthly Capital */}
            <div
              className={`grid grid-flow-col gap-1 justify-end items-center ${
                inMobile
                  ? "col-span-3 row-span-1 xs:justify-center"
                  : "order-3 col-span-1 mr-8 lg:order-1 lg:col-span-3 lg:row-span-1 lg:mr-0 sm:mr-0 ssm:mr-0"
              }`}
            >
              <div
                id="monthlyCapital"
                onClick={() => setShowBusinessCapitalForm(true)}
                className={`bg-white px-3 rounded-md text-center cursor-pointer shadow-lg ${
                  inMobile ? "py-2" : "ssm:px-2 py-1"
                }`}
              >
                <p
                  className={`font-bold text-loranges ${
                    inMobile
                      ? "text-xl ssm:text-sm ssm:font-semibold"
                      : "md:text-sm sm:text-xs sm:font-semibold"
                  }`}
                >
                  Monthly Capital
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center">
                    <img
                      src={capitalIcon}
                      alt="Capital"
                      title="Monthly Capital"
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
                      {monthlyCapital.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaPenToSquare
                      className={`text-loranges hover:text-oranges font-bold ${
                        inMobile
                          ? "text-3xl ssm:text-2xl"
                          : "text-2xl ssm:text-xl"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Expenses */}
              <div
                id="monthlyExpenses"
                onClick={() => setShowBusinessExpensesForm(true)}
                className={`bg-white px-3 rounded-md text-center cursor-pointer shadow-lg ${
                  inMobile ? "py-2" : "ssm:px-2 py-1"
                }`}
              >
                <p
                  className={`font-bold text-loranges text-center ${
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
                      alt="Expenses"
                      title="Monthly Expenses"
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
                      className={`text-oranges hover:text-loranges ${
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
            className={`bg-white grid grid-flow-col text-center font-semibold rounded-md mt-3 ${
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
            id="calendar"
            className={`flex-1 grid grid-cols-7 grid-rows-6 mt-1 overflow-auto rounded-lg shadow-lg ${
              inMobile ? "h-s40" : ""
            }`}
          >
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <BusinessDay day={day} key={idx} rowIdx={i} />
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
                className={`flex gap-3 justify-center items-center px-1 py-1 text-oranges ${
                  inMobile ? "text-2xl ssm:text-lg" : "text-lg"
                }`}
              >
                <p>Income</p>
              </div>
            </div>
            {isDataBusiness && (
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
                    <BusinessMobileData day={day} key={idx} rowIdx={i} />
                  ))}
                </React.Fragment>
              ))}
            </div>
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
