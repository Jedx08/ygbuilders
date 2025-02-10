import { useState, useEffect, useContext } from "react";
import { getMonth } from "../../utilities/getMonth";
import { CalendarContext } from "../../context/CalendarContext";
import useGetSavingsData from "../../hooks/useGetSavingsData";
import useGetGoalData from "../../hooks/useGetGoalData";
import dayjs from "dayjs";
import SavingsSummary from "./SavingsSummary";
import SavingsMonth from "./SavingsMonth";
import SavingsForm from "./SavingsForm";
import SavingsData from "./SavingsData";
import SavingsGoal from "./SavingsGoal";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BsInfoCircle } from "react-icons/bs";

const SavingsComponent = () => {
  const {
    monthIndex,
    savingsIncomeLoading,
    exactDaySelected,
    savingsData,
    setSavingsFormSelectedData,
    showSavingsForm,
    setSavingsButton,
    goalLoading,
    goalData,
    setShowGoalForm,
  } = useContext(CalendarContext);

  const { userInfo } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [currentMonth, setCurrentMonth] = useState(getMonth());

  const getSavingsData = useGetSavingsData();

  const [monthData, setMonthData] = useState(null);
  const [yearData, setYearData] = useState(null);
  const [savingsDataLoading, setSavingsDataLoading] = useState(true);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);

  const [savingsAmountMonth, setSavingsAmountMonth] = useState(0);
  const [savingsAmountYear, setSavingsAmountYear] = useState(0);
  const [savingsCurrentAmount, setSavingsCurrentAmount] = useState(0);

  const [goalInfoLoading, setGoalInfoLoading] = useState(true);

  useEffect(() => {
    if (savingsIncomeLoading) {
      setSavingsDataLoading(true);
      getSavingsData();
    }
  }, [savingsIncomeLoading]);

  useEffect(() => {
    let all = 0;

    if (!savingsIncomeLoading) {
      const savingsIncomeDB = async () => {
        await savingsData.forEach((data) => (all += data.amount));

        const monthSavings = await savingsData.filter(
          (evnt) =>
            dayjs(evnt.day).format("MMMM-YYYY") ===
            dayjs().month(monthIndex).format("MMMM-YYYY")
        );

        const yearSavings = await savingsData.filter(
          (evnt) =>
            dayjs(evnt.day).format("YYYY") ===
            dayjs().month(monthIndex).format("YYYY")
        );

        setMonthData(monthSavings);
        setYearData(yearSavings);
        setSavingsCurrentAmount(all);
        setSavingsDataLoading(false);
        setSavingsButton(true);
        setMonthlyDataLoading(false);
        setGoalInfoLoading(false);
      };

      savingsIncomeDB();

      const data = savingsData.filter(
        (date) =>
          dayjs(date.day).format("DD-MM-YY") ===
          exactDaySelected.format("DD-MM-YY")
      );

      setSavingsFormSelectedData(data[0]);
    }
  }, [savingsIncomeLoading, monthIndex]);

  useEffect(() => {
    let m = 0;
    let y = 0;
    if (!monthlyDataLoading) {
      const monthCount = () => {
        monthData.forEach((data) => {
          m += data.amount;
        });

        setSavingsAmountMonth(m);

        yearData.forEach((data) => {
          y += data.amount;
        });

        setSavingsAmountYear(y);
      };

      monthCount();
    }
  }, [monthlyDataLoading, monthData]);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  // Goal
  const getGoalData = useGetGoalData();

  const [goalGetData, setGoalGetData] = useState([]);
  const [goalDataLoading, setGoalDataLoading] = useState(true);
  const [amountGoal, setAmountGoal] = useState(0);

  const [goalFloat, setGoalFloat] = useState(false);

  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    if (goalLoading) {
      setGoalDataLoading(true);
      getGoalData();
    }
  }, [goalLoading]);

  useEffect(() => {
    let g = 0;

    if (!goalLoading) {
      const goalALlData = async () => {
        const data = await goalData.filter((evnt) => {
          return evnt;
        });

        setGoalGetData(data);
        setGoalDataLoading(false);
      };

      goalALlData();

      const goalAllAmount = async () => {
        await goalData.forEach((data) => (g += data.amount));
      };

      goalAllAmount();
      setAmountGoal(g);
    } else {
      setGoalDataLoading(true);
    }
  }, [goalLoading]);

  useEffect(() => {
    const personalFloat = () => {
      if (window.innerWidth <= 1181) {
        setGoalFloat(true);
      } else {
        setGoalFloat(false);
        setShowGoalForm(false);
      }
    };
    window.addEventListener("resize", personalFloat);
    if (window.innerWidth <= 1181) {
      setGoalFloat(true);
    } else {
      setGoalFloat(false);
      setShowGoalForm(false);
    }
    return () => {
      window.removeEventListener("resize", personalFloat);
    };
  }, []);

  // identifier if instructions is already shown
  useEffect(() => {
    const showInstructions = async () => {
      try {
        await userInfo.instructions;
        setInstructions(userInfo.instructions);
        if (userInfo?.instructions?.savings) {
          console.log(userInfo.instructions.savings);
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, []);

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
    if (userInfo.instructions.savings) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#summary",
            popover: {
              title: "Savings' Summary",
              description:
                "In this section, you can view your monthly, yearly, and total savings",
            },
          },
          {
            element: "#calendar",
            popover: {
              title: "Savings' Calendar",
              description:
                "Just like the income calendar, you can select a date in here to add your data.",
            },
          },
          {
            element: "#addData",
            popover: {
              title: "Data Editor",
              description:
                "After selecting a date, you can save or edit your data in here.",
            },
          },
          {
            element: "#goal",
            popover: {
              title: "Saving's Goal",
              description:
                "This section shows description for your saving's goal, how many days it will take, and if you've finished you desired goal.",
            },
          },
          {
            element: "#dataOverview",
            popover: {
              title: "Data Overview",
              description:
                "In this section you can view all of your savings' data and its date.",
            },
          },
        ],
      });

      driverObj.drive();

      setInstructions((prev) => ({ ...prev, savings: false }));
    }
  };

  console.log(instructions);

  return (
    <>
      {/* instructions */}
      <div
        id="howtouse"
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
      <div className="px-5 mt-5 xl:pl-24 lg:pl-5">
        <SavingsSummary
          savingsCurrentAmount={savingsCurrentAmount}
          savingsAmountMonth={savingsAmountMonth}
          savingsAmountYear={savingsAmountYear}
          month={currentMonth}
        />
      </div>

      {/* components */}
      <div className="grid grid-cols-3 gap-4 mt-2 py-1 px-5 xl:pl-24 lg:pl-5 clg:grid-cols-2 clg:grid-rows-2">
        {/* calendar */}
        <div
          id="calendar"
          className="bg-white shadow-sm rounded-lg pt-4 min-w-[350px] h-[360px] relative mmd:pt-2 mmd:col-span-2 mmd:h-hfull"
        >
          <SavingsMonth
            monthData={monthData}
            month={currentMonth}
            savingsDataLoading={savingsDataLoading}
          />
        </div>
        {/* form */}
        <div
          id="addData"
          className="bg-white shadow-sm rounded-lg pt-8 min-w-[350px] h-[360px] mmd:hidden"
        >
          <SavingsForm />
        </div>
        {/* goal */}
        <div
          id="goal"
          className="bg-white shadow-sm rounded-lg min-w-[350px] max-h-[360px] clg:col-span-2 clg:row-span-full clg:h-[400px]"
        >
          <SavingsGoal
            goalGetData={goalGetData}
            savingsCurrentAmount={savingsCurrentAmount}
            goalDataLoading={goalDataLoading}
            goalFloat={goalFloat}
            goalInfoLoading={goalInfoLoading}
          />
        </div>
      </div>

      <div className="hidden mx-5 py-1 bg-white rounded-md text-center text-sm text-[#A6ACAF] font-normal mmd:block">
        ( Click a date to add/edit data )
      </div>

      {/* data */}
      <div className="px-5 mt-5 xl:pl-24 lg:pl-5">
        <SavingsData
          savingsDataLoading={savingsDataLoading}
          monthData={monthData}
        />
      </div>

      {showSavingsForm && <SavingsForm />}
    </>
  );
};

export default SavingsComponent;
