import { useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import usePersonalExpenses from "../../../hooks/usePersonalExpenses";
import useGetPersonalData from "../../../hooks/useGetPersonalData";
import dayjs from "dayjs";
// import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js/auto"; // core data for chart, do not remove
import { Line } from "react-chartjs-2";
import { CalendarContext } from "../../../context/CalendarContext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";
import Skeleton from "react-loading-skeleton";
import pouch from "../../../media/pouch.png";
import expensesIcon from "../../../media/expenses.png";
import networth from "../../../media/networth.png";
import monthlyGrossIcon from "../../../media/monpouch.png";
import monthlyExpensesIcon from "../../../media/monexpenses.png";
import monthlyNetIcon from "../../../media/monprofit.png";
// import PersonalYearlySummary from "./PersonalYearlySummary";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const PersonalSummary = () => {
  const {
    monthIndex,
    setMonthIndex,
    personalIncomeData,
    personalIncomeLoading,
    setPersonalIncomeLoading,
    personalExpensesData,
    personalExpensesLoading,
    setPersonalExpensesLoading,
    personalSummaryView,
    setPersonalSummaryView,
  } = useContext(CalendarContext);

  const { userInfo } = useAuth();

  const thisMonth = dayjs().month(monthIndex).format("MMMM");

  const [gross, setGross] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const [grossCount, setGrossCount] = useState([]);
  const [expensesCount, setExpensesCount] = useState([]);
  const [netCount, setNetCount] = useState([]);

  const [monthlyGross, setMonthlyGross] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const [monthExpenses, setMonthExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [instructions, setInstructions] = useState(null);

  const getPersonalData = useGetPersonalData();
  const getMonthlyExpenses = usePersonalExpenses();
  const axiosPrivate = useAxiosPrivate();

  const overallNet = gross - expenses;

  const monthlyNet = monthlyGross - monthlyExpenses;

  Chart.register(ChartDataLabels);

  Chart.register(ChartDataLabels);

  //number of days per month using dayjs
  const monthCount = dayjs().month(monthIndex).daysInMonth();

  let dayCount = [];

  for (let i = 0; i <= monthCount - 1; i++) {
    dayCount.push(i + 1);
  }

  // getting monthlyExpenses
  // will re-trigger when personalExpensesLoading is set to true
  useEffect(() => {
    if (personalExpensesLoading) {
      getMonthlyExpenses();
      setPersonalExpensesLoading(false);
    }
  }, [personalExpensesLoading]);

  // getting personalIncome
  // will re-trigger when personalIncomeLoading is set to true
  useEffect(() => {
    if (personalIncomeLoading) {
      getPersonalData();
      setPersonalIncomeLoading(false);
    }
  }, [personalIncomeLoading]);

  // calculation for line graph data
  useEffect(() => {
    const lineGraphData = async () => {
      const filteredData = personalIncomeData.filter(
        (data) =>
          dayjs(data.day).format("MM-YY") ===
          dayjs().month(monthIndex).format("MM-YY")
      );

      const monthCount = dayjs().month(monthIndex).daysInMonth();

      //get line graph capital
      let grossPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        grossPerDate.push(0);
      }
      setGrossCount(grossPerDate);

      filteredData.map((data) => {
        grossPerDate.map(() => {
          grossPerDate[dayjs(data.day).format("D") - 1] = data.gross;
        });

        setGrossCount(grossPerDate);
      });

      //get line graph expenses
      let expensesPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        expensesPerDate.push(0);
      }
      setExpensesCount(expensesPerDate);

      filteredData.map((data) => {
        expensesPerDate.map(() => {
          expensesPerDate[dayjs(data.day).format("D") - 1] = data.expenses;
        });

        setExpensesCount(expensesPerDate);
      });

      //get line graph sales
      let netPerDate = [];

      for (let i = 1; i <= monthCount; i++) {
        netPerDate.push(0);
      }
      setNetCount(netPerDate);

      filteredData.map((data) => {
        netPerDate.map(() => {
          netPerDate[dayjs(data.day).format("D") - 1] = data.net;
        });

        setNetCount(netPerDate);
      });
    };

    lineGraphData();
  }, [personalIncomeData, monthIndex]);

  //calculation for monthly income
  useEffect(() => {
    let g = 0;
    let e = 0;
    let m_e = 0;

    const monthlyIncomeData = async () => {
      personalIncomeData
        .filter(
          (data) =>
            dayjs(data.day).format("MM-YY") ===
            dayjs().month(monthIndex).format("MM-YY")
        )
        .forEach((data) => {
          g += data.gross;
          e += data.expenses;
        });

      setMonthlyGross(g);
      setMonthlyExpenses(e);
      setIsLoading(false);
    };

    const monthlyExpensesData = async () => {
      personalExpensesData
        .filter(
          (data) => data.month === dayjs().month(monthIndex).format("MMMM YYYY")
        )
        .forEach((data) => {
          m_e += data.amount;
        });

      setMonthExpenses(m_e);
    };

    monthlyIncomeData();
    monthlyExpensesData();
  }, [personalIncomeData, personalExpensesData, monthIndex]);

  // calculation for overall income
  useEffect(() => {
    let g = 0;
    let e = 0;

    setIsLoading(true);
    const overallData = async () => {
      personalIncomeData.forEach((data) => {
        return (g += data.gross), (e += data.expenses);
      });

      personalExpensesData.forEach((data) => {
        return (e += data.amount);
      });

      setGross(g);
      setExpenses(e);
      setIsLoading(false);
    };

    overallData();
  }, [personalIncomeData, personalExpensesData]);

  // identifier if instructions is already shown
  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);
        if (userInfo.instructions.summary && !isLoading) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, [isLoading]);

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

  // next and prev month functions
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  // driver js tour content
  const showTour = async () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#summaryView",
          popover: {
            title: "Personal-Business button",
            description: "You can change the summary view using these buttons.",
            side: "left",
          },
        },
        {
          element: "#lineGraph",
          popover: {
            title: "Monthly Line Graph",
            description:
              "In here, you can view your Income with a Line Graph. You can change the graph view by clicking the colored buttons.",
          },
        },
        {
          element: "#lineGraphOverview",
          popover: {
            title: "Line Graph Overview",
            description:
              "In this section you can easily see your monthly income information",
          },
        },
        {
          element: "#barGraph",
          popover: {
            title: "Yearly Bar Graph",
            description:
              "Just like the first graph, in this section you can monitor your yearly Income",
          },
        },
        {
          element: "#barGraphOverview",
          popover: {
            title: "Bar Graph Overview",
            description: "Just like the title says",
          },
        },
        {
          element: "#overall",
          popover: {
            title: "Overall Income",
            description: "Here you can see the overall income information",
          },
        },
      ],
    });

    driverObj.drive();

    setInstructions((prev) => ({ ...prev, summary: false }));
  };

  return (
    <>
      {/* Overall data */}
      <div className="bg-white rounded-lg py-3 mt-5 mx-5 xl:ml-24 lg:ml-5">
        <div
          className={`flex justify-center items-center text-greens font-bold text-2xl sm:text-xl`}
        >
          Overall Income
        </div>
        <div className="flex items-center justify-evenly flex-wrap gap-2 mt-1 xl:px-3">
          <div>
            <div className="text-base font-semibold text-center mdd:text-sm">
              Net
            </div>
            <div className="bg-subCon px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={networth}
                  alt="net"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div
                className={`font-bold text-2xl mdd:text-xl sm:text-lg ${
                  overallNet < 0 ? "text-[red]" : "text-greens"
                }`}
              >
                {overallNet.toLocaleString()}
              </div>
              <div>
                {overallNet < 0 ? (
                  <PiChartLineDown className="text-3xl mdd:text-2xl sm:text-xl text-[#ff3a33]" />
                ) : (
                  <PiChartLineUp className="text-3xl mdd:text-2xl sm:text-xl text-[#32ca5b]" />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-base font-semibold text-center mdd:text-sm">
              Gross
            </div>
            <div className="bg-subCon px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img src={pouch} alt="gross" className="w-14 mdd:w-11 sm:w-9" />
              </div>
              <div className="text-oranges font-bold text-2xl mdd:text-xl sm:text-lg">
                {gross.toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <div className="text-base font-semibold text-center mdd:text-sm">
              Expenses
            </div>
            <div className="bg-subCon px-5 py-2 rounded-md flex items-center justify-center space-x-3">
              <div>
                <img
                  src={expensesIcon}
                  alt="expenses"
                  className="w-14 mdd:w-11 sm:w-9"
                />
              </div>
              <div className="text-[red] font-bold text-2xl mdd:text-xl sm:text-lg">
                {expenses.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly data */}
      {/* <div className="grid grid-cols-2 grid-rows-4">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
    </>
  );
};

export default PersonalSummary;
