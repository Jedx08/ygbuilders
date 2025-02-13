import { useContext, useState, useEffect } from "react";
import { getMonth } from "../../../utilities/getMonth";
import { CalendarContext } from "../../../context/CalendarContext";
import useGetData from "../../../hooks/useGetPersonalData";
import usePersonalExpenses from "../../../hooks/usePersonalExpenses";
import dayjs from "dayjs";
import PersonalMonth from "./PersonalMonth";
import PersonalForm from "./PersonalForm";
import PersonalData from "./PersonalData";
import PMonthlyExpensesForm from "./PMonthlyExpensesForm";
import PersonalMonthlySummary from "./PersonalMonthlySummary";
import { BsInfoCircle } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import monthExpensesIcon from "../../../media/monexpenses.png";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const PersonalCalendar = () => {
  const {
    monthIndex,
    personalIncomeLoading,
    personalIncomeData,
    setPersonalButton,
    setFormSelectedDate,
    exactDaySelected,
    showPersonalForm,
    showPersonalExpenseForm,
    personalExpensesLoading,
    personalExpensesData,
    setShowPersonalExpensesForm,
  } = useContext(CalendarContext);
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  const { userInfo, setUserInfo } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const getPersonalData = useGetData();

  const [monthData, setMonthData] = useState(null);
  const [personalDataLoading, setPersonalDataLoading] = useState(true);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);

  const [grossCount, setGrossCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);

  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    if (personalIncomeLoading) {
      setPersonalDataLoading(true);
      getPersonalData();
    }
  }, [personalIncomeLoading]);

  useEffect(() => {
    if (!personalIncomeLoading) {
      const personalIncomeDB = async () => {
        const data = await personalIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("MMMM-YYYY") ===
            dayjs().month(monthIndex).format("MMMM-YYYY")
        );

        setMonthData(data);
        setPersonalDataLoading(false);
        setPersonalButton(true);
        setMonthlyDataLoading(false);
      };

      personalIncomeDB();

      const data = personalIncomeData.filter(
        (date) =>
          dayjs(date.day).format("DD-MM-YY") ===
          exactDaySelected.format("DD-MM-YY")
      );

      setFormSelectedDate(data[0]);
    }
  }, [personalIncomeLoading, monthIndex]);

  useEffect(() => {
    let g = 0;
    let e = 0;
    if (!monthlyDataLoading) {
      const monthlyCount = () => {
        monthData.forEach((data) => {
          g += data.gross;
          e += data.expenses;
        });

        setGrossCount(g);
        setExpensesCount(e);
      };

      monthlyCount();
    }
  }, [monthlyDataLoading, monthData]);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  // monthly expenses
  const getPersonalExpenses = usePersonalExpenses();

  const [expensesData, setExpensesData] = useState([]);
  const [expensesDataLoading, setExpensesDataLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  const [personalExpensesFloat, setPersonalExpensesFloat] = useState(false);

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

  useEffect(() => {
    const personalFloat = () => {
      if (window.innerWidth <= 1181) {
        setPersonalExpensesFloat(true);
      } else {
        setPersonalExpensesFloat(false);
        setShowPersonalExpensesForm(false);
      }
    };
    window.addEventListener("resize", personalFloat);
    if (window.innerWidth <= 1181) {
      setPersonalExpensesFloat(true);
    } else {
      setPersonalExpensesFloat(false);
      setShowPersonalExpensesForm(false);
    }
    return () => {
      window.removeEventListener("resize", personalFloat);
    };
  }, []);

  // identifier if instructions is already shown
  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);
        if (userInfo?.instructions?.income) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, [userInfo.instructions]);

  // saving instructions to db
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

  // driver js tour content
  const showTour = async () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#monthlySummary",
          popover: {
            title: "Personal Monthly Income",
            description:
              "In here, you can view the summary of your personal monthly income",
          },
        },
        {
          element: "#calendar",
          popover: {
            title: "Calendar",
            description: "You can select any date you want to add data into.",
          },
        },
        {
          element: "#addData",
          popover: {
            title: "Data Editor",
            description:
              "After clicking a date in the calendar, you can add or edit your data in this section.",
          },
        },
        {
          element: "#monthlyExpenses",
          popover: {
            title: "Monthly Expenses",
            description: "You can add or edit your Monthly Expenses in here.",
          },
        },
        {
          element: "#dataOverview",
          popover: {
            title: "Data Overview",
            description:
              "In this section you can view all of your data including everyday gross, expenses, and net income.",
          },
        },
        {
          element: "#instructions",
          popover: {
            description:
              "You can always come back in this button to run the instructions again",
          },
        },
      ],
    });

    driverObj.drive();

    setUserInfo((prev) => ({
      ...prev,
      instructions: { ...prev.instructions, income: false },
    }));
  };

  return (
    <>
      {/* instructions */}
      <div
        id="instructions"
        onClick={() => {
          showTour();
        }}
        className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-sm rounded-md mt-5 cursor-pointer border border-white hover:border-lgreens text-sm mmd:text-xs md:py-1 mx-auto`}
      >
        <BsInfoCircle className={`text-oranges text-2xl mmd:text-xl`} />
        <p>
          How to use? <span className="font-bold">Instructions</span>
        </p>
      </div>

      {/* monthly summary */}
      <div className="px-5 mt-5 xl:pl-24 lg:pl-5">
        <PersonalMonthlySummary
          grossCount={grossCount}
          expensesCount={expensesCount}
          monthlyExpenses={monthlyExpenses}
        />
      </div>

      {/* components */}
      <div className="grid grid-cols-3 gap-4 mt-2 py-1 px-5 overflow-hidden xl:pl-24 lg:pl-5 clg:grid-cols-2 clg:grid-rows-2">
        <div
          id="calendar"
          className="bg-white shadow-sm rounded-lg pt-8 min-w-[350px] h-[406px] relative mmd:pt-2 mmd:col-span-2 mmd:h-hfull"
        >
          <PersonalMonth
            month={currentMonth}
            monthData={monthData}
            personalDataLoading={personalDataLoading}
          />
        </div>
        <div
          id="addData"
          className="bg-white shadow-sm rounded-lg pt-8 min-w-[350px] h-[406px] mmd:hidden"
        >
          <PersonalForm />
        </div>
        <div
          id="monthlyExpenses"
          className="bg-white shadow-sm rounded-lg min-w-[350px] max-h-[406px] clg:col-span-2 clg:row-span-full clg:h-hfit"
        >
          {!personalExpensesFloat && (
            <PMonthlyExpensesForm
              expensesDataLoading={expensesDataLoading}
              expensesData={expensesData}
              monthlyExpenses={monthlyExpenses}
              personalExpensesFloat={personalExpensesFloat}
            />
          )}
          {personalExpensesFloat && (
            <>
              <div id="monthlyExpenses" className="text-center py-1">
                <h1 className="text-lg text-greens mb-2 font-bold clg:mb-0 sm:text-base">
                  Monthly Expenses
                </h1>
                <div className={`text-center`}>
                  <span className="text-xs text-[#A6ACAF] font-normal sm:text-[10px]">
                    (Bills, Loan, Insurance, Tuition, Rent and etc...)
                  </span>
                </div>
                <div className="bottom-2 w-full">
                  <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
                    <div className=" rounded-md py-1 text-center w-fit clg:py-0">
                      <div className="flex justify-center items-center">
                        <div className="pl-2">
                          <img
                            src={monthExpensesIcon}
                            className="w-14 mr-2 mdd:w-10"
                          />
                        </div>
                        <div className="mt-[0.15rem]">
                          <p className="text-[red] font-bold text-xl/[24px] mdd:text-lg sm:text-base">
                            {monthlyExpenses.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setShowPersonalExpensesForm(true);
                  }}
                  className="flex justify-center items-center space-x-1 w-fit mx-auto px-2 rounded-md overflow-hidden py-1 text-white gap-1 border border-greens bg-greens hover:bg-lgreens text-base font-semibold my-2 cursor-pointer"
                >
                  <div>
                    <FaRegEye className="text-2xl" />
                  </div>
                  <div>View</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="hidden mx-5 py-1 bg-white rounded-md text-center text-sm text-[#A6ACAF] font-normal mmd:block">
        ( Click a date to add/edit data )
      </div>

      {/* data */}
      <div className="px-5 mt-5 xl:pl-24 lg:pl-5">
        <PersonalData
          personalDataLoading={personalDataLoading}
          monthData={monthData}
        />
      </div>

      {showPersonalExpenseForm && (
        <PMonthlyExpensesForm
          expensesDataLoading={expensesDataLoading}
          expensesData={expensesData}
          monthlyExpenses={monthlyExpenses}
          personalExpensesFloat={personalExpensesFloat}
        />
      )}
      {showPersonalForm && <PersonalForm />}
    </>
  );
};

export default PersonalCalendar;
