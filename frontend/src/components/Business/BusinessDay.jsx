import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import capitalIcon from "../../media/bus_pouch.png";
import expensesIcon from "../../media/bus_expenses.png";
import salesIcon from "../../media/sales.png";
import profitsIcon from "../../media/bus_profit.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useGetBusinessData from "../../hooks/useGetBusinessData";

const BusinessDay = ({ day }) => {
  const {
    monthIndex,
    setShowBusinessForm,
    setExactDaySelected,
    setBusinessFormSelectedDate,
    businessIncomeData,
    dispatchBusinessIncomeData,
    businessIncomeLoading,
    setBusinessIncomeLoading,
  } = useContext(CalendarContext);

  const getBusinessIncome = useGetBusinessData();

  const [dayData, setDayData] = useState([]);
  const [businessDataLoading, setBusinessDataLoading] = useState(true);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-oranges text-white rounded-[50%] w-9"
      : "";
  }

  function formData(arg) {
    const data = businessIncomeData.filter(
      (date) => dayjs(date.day).format("DD-MM-YY") === arg.format("DD-MM-YY")
    );
    setBusinessFormSelectedDate(data[0]);
  }

  function toggleForm() {
    return (
      notThisMonth ? setShowBusinessForm(false) : setShowBusinessForm(true),
      setExactDaySelected(day),
      formData(day)
    );
  }

  useEffect(() => {
    setBusinessDataLoading(true);
    getBusinessIncome();
    setBusinessIncomeLoading(false);
  }, [dispatchBusinessIncomeData, businessIncomeLoading]);

  useEffect(() => {
    if (!businessIncomeLoading) {
      const businessIncomeDB = async () => {
        const data = await businessIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
        setBusinessDataLoading(false);
      };
      businessIncomeDB();
    } else {
      setBusinessDataLoading(true);
    }
  }, [businessIncomeData, day]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col h-[100%] ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={businessDataLoading ? null : toggleForm}
      >
        <header className="flex flex-col items-center">
          <p
            className={`text-lg font-bold pt-1 text-center ${
              notThisMonth ? "text-[#EEEEEE]" : ""
            } ${currentDay()}`}
          >
            {day.format("D")}
          </p>
        </header>

        {businessDataLoading ? (
          <div
            className={`flex items-center justify-center ${
              notThisMonth ? "hidden" : ""
            }`}
          >
            <Skeleton width={100} height={15} count={3} />
          </div>
        ) : (
          /* displaying data on their respective date */
          dayData.map((d, i) => (
            <div
              className={`flex font-medium text-xs mt-3 justify-center ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div className="space-y-1">
                {/* Capital */}
                <div className="flex space-x-1">
                  <img src={capitalIcon} alt="capital" className="h-4 w-5" />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-greens">{d.capital.toLocaleString()}</p>
                </div>
                {/* Sales */}
                <div className="flex space-x-1">
                  <img src={salesIcon} alt="sales" className="h-4 w-5" />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`${
                      d.sales >= d.capital ? "text-greens" : "text-[red]"
                    }`}
                  >
                    {d.sales.toLocaleString()}
                  </p>
                </div>
                {/* Expenses */}
                <div className="flex space-x-1">
                  <img src={expensesIcon} alt="expenses" className="h-4 w-5" />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-[red]">{d.expenses.toLocaleString()}</p>
                </div>
                <hr className="text-[#D0D0D0]" />
                {/* Profits */}
                <div className="flex space-x-1">
                  <img src={profitsIcon} alt="profits" className="h-4 w-5" />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`font-bold ${
                      d.profit < 0 ? "text-[red]" : "text-lgreens"
                    }`}
                  >
                    {d.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default BusinessDay;
