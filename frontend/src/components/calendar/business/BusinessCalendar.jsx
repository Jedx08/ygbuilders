import { useContext, useEffect, useState } from "react";
import { getMonth } from "../../../utilities/getMonth";
import { CalendarContext } from "../../../context/CalendarContext";
import BusinessMonth from "./BusinessMonth";
import BusinessForm from "./BusinessForm";
import BMonthlyCapitalForm from "./BMonthlyCapitalForm";
import BMonthlyExpensesForm from "./BMonthlyExpensesForm";
import { BsInfoCircle } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";
import dayjs from "dayjs";
import BusinessData from "./BusinessData";
import useGetBusinessData from "../../../hooks/useGetBusinessData";
import useBusinessExpenses from "../../../hooks/useBusinessExpenses";
import useBusinessCapital from "../../../hooks/useBusinessCapital";
import BusinessMonthlySummary from "./BusinessMonthlySummary";
import expensesIcon from "../../../media/busmon_expenses.png";
import profitIcon from "../../../media/busmon_pouch.png";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const BusinessCalendar = () => {
  const {
    monthIndex,
    businessExpensesLoading,
    setBusinessExpensesLoading,
    businessExpensesData,
    businessCapitalLoading,
    setBusinessCapitalLoading,
    businessCapitalData,
    showBusinessForm,
    showBusinessExpenseForm,
    setShowBusinessExpensesForm,
    showBusinessCapitalForm,
    setShowBusinessCapitalForm,
    businessIncomeLoading,
    businessIncomeData,
    setBusinessButton,
    exactDaySelected,
    setBusinessFormSelectedDate,
  } = useContext(CalendarContext);
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  // Business Income Data
  const getBusinessIncome = useGetBusinessData();

  const [capitalCount, setCapitalCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [profitCount, setProfitCount] = useState(0);

  const [monthData, setMonthData] = useState(null);
  const [businessDataLoading, setBusinessDataLoading] = useState(true);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);

  useEffect(() => {
    if (businessIncomeLoading) {
      setBusinessDataLoading(true);
      getBusinessIncome();
    }
  }, [businessIncomeLoading]);

  useEffect(() => {
    if (!businessIncomeLoading) {
      const businessIncomeDB = async () => {
        const data = await businessIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("MMMM-YYYY") ===
            dayjs().month(monthIndex).format("MMMM-YYYY")
        );
        setMonthData(data);
        setBusinessDataLoading(false);
        setBusinessButton(true);
        setMonthlyDataLoading(false);
      };

      businessIncomeDB();

      const data = businessIncomeData.filter(
        (date) =>
          dayjs(date.day).format("DD-MM-YY") ===
          exactDaySelected.format("DD-MM-YY")
      );

      setBusinessFormSelectedDate(data[0]);
    }
  }, [businessIncomeLoading, monthIndex]);

  useEffect(() => {
    let cap = 0;
    let sales = 0;
    let expenses = 0;
    let profit = 0;
    if (!monthlyDataLoading) {
      const monthlyCount = () => {
        monthData.forEach((data) => {
          cap += data.capital;
          sales += data.sales;
          expenses += data.expenses;
          profit += data.profit;
        });

        setCapitalCount(cap);
        setSalesCount(sales);
        setExpensesCount(expenses);
        setProfitCount(profit);
      };

      monthlyCount();
    }
  }, [monthlyDataLoading, monthData]);

  // -------------------

  // Business expenses Get Data
  const getBusinessExpenses = useBusinessExpenses();

  const [expensesData, setExpensesData] = useState([]);
  const [expensesDataLoading, setExpensesDataLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  useEffect(() => {
    if (businessExpensesLoading) {
      getBusinessExpenses();
      setBusinessExpensesLoading(false);
    }
  }, [businessExpensesLoading]);

  useEffect(() => {
    let m_e = 0;
    if (!businessExpensesLoading) {
      const monthlyExpense = async () => {
        const data = await businessExpensesData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );

        setExpensesData(data);
        setExpensesDataLoading(false);
      };
      monthlyExpense();

      const getData = () => {
        businessExpensesData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (m_e += data.amount);
        });
      };

      getData();
      setMonthlyExpenses(m_e);
    } else {
      setExpensesDataLoading(true);
    }
  }, [businessExpensesData, monthIndex]);

  // -------------------

  // Business Capital Get Data
  const getBusinessCapital = useBusinessCapital();

  const [capitalData, setCapitalData] = useState([]);
  const [capitalDataLoading, setCapitalDataLoading] = useState(true);
  const [monthlyCapital, setMonthlyCapital] = useState("");

  useEffect(() => {
    if (businessCapitalLoading) {
      getBusinessCapital();
      setBusinessCapitalLoading(false);
    }
  }, [businessCapitalLoading]);

  useEffect(() => {
    let mCapital = 0;
    if (!businessCapitalLoading) {
      const monthlyCapital = async () => {
        const data = await businessCapitalData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );

        setCapitalData(data);
        setCapitalDataLoading(false);
      };
      monthlyCapital();

      const getData = () => {
        businessCapitalData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (mCapital += data.amount);
        });
      };

      getData();
      setMonthlyCapital(mCapital);
    } else {
      setCapitalDataLoading(true);
    }
  }, [businessCapitalData, monthIndex]);

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
              "In here, you can view the summary of your monthly business income",
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
          element: "#monthlyCapital",
          popover: {
            title: "Monthly Expenses",
            description: "You can add or edit your Monthly Capital in here.",
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
              "In this section you can view all of your data including everyday capital, sales, expenses, and profit.",
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
  };

  return (
    <>
      {/* Instructions */}
      <div className={`items-center flex justify-center `}>
        <div
          id="instructions"
          onClick={() => {
            showTour();
          }}
          className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-sm rounded-md mt-5 cursor-pointer border border-white hover:border-loranges text-sm mmd:text-xs md:py-1 mx-auto`}
        >
          <BsInfoCircle className={`text-oranges text-2xl mmd:text-xl`} />
          <p>
            How to use? <span className="font-bold">Instructions</span>
          </p>
        </div>
      </div>

      <div id="monthlySummary" className="px-5 mt-5 xl:pl-24 lg:pl-5">
        <BusinessMonthlySummary
          capitalCount={capitalCount}
          salesCount={salesCount}
          expensesCount={expensesCount}
          profitCount={profitCount}
          monthlyExpenses={monthlyExpenses}
          monthlyCapital={monthlyCapital}
        />
      </div>

      {/* Components */}
      <div className="grid grid-cols-3 gap-4 mt-2 py-1 px-5 overflow-hidden xl:pl-24 lg:pl-5 clg:grid-cols-2 clg:grid-rows-2">
        {/* Calendar */}
        <div
          id="calendar"
          className="bg-white shadow-sm rounded-lg pt-14 min-w-[350px] h-[480px] relative mmd:pt-2 mmd:col-span-2 mmd:h-hfull"
        >
          <BusinessMonth
            month={currentMonth}
            monthData={monthData}
            businessDataLoading={businessDataLoading}
          />
        </div>
        {/* Data Form */}
        <div
          id="addData"
          className="bg-white shadow-sm rounded-lg pt-8 min-w-[350px] h-[480px] mmd:hidden"
        >
          <BusinessForm />
        </div>
        {/* Monthly */}
        <div className="bg-white shadow-sm rounded-lg min-w-[350px] max-h-[480px] flex flex-col justify-evenly items-center px-8 clg:col-span-2 clg:row-span-full clg:h-hfit clg:flex-row clg:space-x-2">
          {/* Monthly Capital Form */}
          <div
            id="monthlyCapital"
            className=" w-full text-center py-3 rounded-lg clg:py-1"
          >
            <h1 className="text-lg text-loranges mb-2 font-bold clg:mb-0 sm:text-base">
              Monthly Capital
            </h1>
            <div className="text-sm font-bold mb-3 text-center clg:mb-1">
              <span className="text-xs text-[#A6ACAF] font-normal sm:text-[10px]">
                (Cash, Assets etc...)
              </span>
            </div>
            <div className="bottom-2 w-full">
              <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
                <div className="rounded-md py-1 text-center w-fit clg:py-0">
                  <div className="flex justify-center items-center">
                    <div className="pl-2">
                      <img src={profitIcon} className="w-11 mr-2 mdd:w-9" />
                    </div>
                    <div className="mt-[0.15rem]">
                      <p className="text-[red] font-bold text-xl/[24px] mdd:text-lg sm:text-base">
                        {monthlyCapital.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setShowBusinessCapitalForm(true);
              }}
              className="flex justify-center items-center space-x-1 w-fit mx-auto px-2 rounded-md overflow-hidden py-1 text-white gap-1 border border-oranges bg-oranges hover:bg-loranges text-base font-semibold my-2 cursor-pointer"
            >
              <div>
                <FaRegEye className="text-2xl" />
              </div>
              <div>View</div>
            </div>
          </div>
          {/* Monthly Expenses Form */}
          <div
            id="monthlyExpenses"
            className=" w-full text-center py-3 rounded-lg clg:py-1"
          >
            <h1 className="text-lg text-loranges mb-2 font-bold clg:mb-0 sm:text-base">
              Monthly Expenses
            </h1>
            <div className="mb-3 text-center clg:mb-1">
              <span
                style={{
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  display: "-webkit-box",
                }}
                className="text-xs text-[#A6ACAF] font-normal sm:text-[10px]"
              >
                (Bills, Loan, Insurance, Rent and etc...)
              </span>
            </div>
            <div className="bottom-2 w-full">
              <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
                <div className="rounded-md py-1 text-center w-fit clg:py-0">
                  <div className="flex justify-center items-center">
                    <div className="pl-2">
                      <img src={expensesIcon} className="w-11 mr-2 mdd:w-9" />
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
                setShowBusinessExpensesForm(true);
              }}
              className="flex justify-center items-center space-x-1 w-fit mx-auto px-2 rounded-md overflow-hidden py-1 text-white gap-1 border border-oranges bg-oranges hover:bg-loranges text-base font-semibold my-2 cursor-pointer"
            >
              <div>
                <FaRegEye className="text-2xl" />
              </div>
              <div>View</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden mx-5 py-1 bg-white rounded-md text-center text-sm text-[#A6ACAF] font-normal mmd:block">
        ( Click a date to add/edit data )
      </div>

      {/* Business Data */}
      <div id="dataOverview" className="px-5 mt-5 xl:pl-24 lg:pl-5">
        <BusinessData
          businessDataLoading={businessDataLoading}
          monthData={monthData}
        />
      </div>

      {showBusinessExpenseForm && (
        <>
          <BMonthlyExpensesForm
            expensesDataLoading={expensesDataLoading}
            expensesData={expensesData}
            monthlyExpenses={monthlyExpenses}
          />
        </>
      )}

      {showBusinessCapitalForm && (
        <>
          <BMonthlyCapitalForm
            capitalDataLoading={capitalDataLoading}
            capitalData={capitalData}
            monthlyCapital={monthlyCapital}
          />
        </>
      )}

      {showBusinessForm && <BusinessForm />}
    </>
  );
};

export default BusinessCalendar;
