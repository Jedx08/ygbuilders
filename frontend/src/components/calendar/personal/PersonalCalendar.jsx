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

  const getPersonalData = useGetData();

  const [monthData, setMonthData] = useState(null);
  const [personalDataLoading, setPersonalDataLoading] = useState(true);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);

  const [grossCount, setGrossCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);

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

  return (
    <>
      {/* instructions */}
      <div
        id="howtouse"
        // onClick={() => {
        //   showTour();
        // }}
        className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-lg rounded-md mt-2 cursor-pointer border border-white hover:border-lgreens text-sm md:py-1 mx-auto`}
      >
        <BsInfoCircle className={`text-oranges text-2xl`} />
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
      <div className="grid grid-cols-3 gap-4 mt-2 px-5 overflow-hidden xl:pl-24 lg:pl-5 clg:grid-cols-2 clg:grid-rows-2">
        <div className="bg-white rounded-lg pt-8 min-w-[350px] h-[406px] relative mmd:pt-2 mmd:col-span-2 mmd:h-hfull">
          <PersonalMonth month={currentMonth} />
        </div>
        <div className="bg-white rounded-lg pt-8 min-w-[350px] h-[406px] mmd:hidden">
          <PersonalForm />
        </div>
        <div className="bg-white rounded-lg min-w-[350px] max-h-[406px] clg:col-span-2 clg:row-span-full clg:h-hfit">
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
              <div className="text-center py-1">
                <h1 className="text-lg text-greens mb-2 font-bold clg:mb-0">
                  Monthly Expenses
                </h1>
                <div className={`text-center`}>
                  <span className="text-xs text-[#A6ACAF] font-normal">
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
                            className="w-11 mr-2 md:w-10"
                          />
                        </div>
                        <div className="mt-[0.15rem]">
                          <p className="text-[red] font-bold text-xl/[24px]">
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
