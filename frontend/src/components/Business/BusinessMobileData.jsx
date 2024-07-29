import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import capitalIcon from "../../media/bus_pouch.png";
import expensesIcon from "../../media/bus_expenses.png";
import salesIcon from "../../media/sales.png";
import profitsIcon from "../../media/bus_profit.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BusinessMobileData = ({ day }) => {
  const {
    monthIndex,
    setShowBusinessForm,
    setExactDaySelected,
    setBusinessFormSelectedDate,
    businessIncomeData,
    businessIncomeLoading,
  } = useContext(CalendarContext);

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
        className={`border border-light bg-white flex flex-col overflow-hidden rounded-md ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        } ${dayData.length === 0 ? "hidden" : ""}`}
        onClick={businessDataLoading ? null : toggleForm}
      >
        <header className="flex flex-col items-center">
          <p
            className={`text-md font-semibold text-center ${
              notThisMonth ? "text-[#EEEEEE]" : ""
            } ${currentDay()}`}
          >
            {day.format("MMMM D")}
          </p>
        </header>

        {businessDataLoading ? (
          <div
            className={`flex items-center justify-center ssm:hidden ${
              notThisMonth ? "hidden" : ""
            }`}
          >
            <Skeleton width={100} height={15} count={3} />
          </div>
        ) : (
          /* displaying data on their respective date */
          dayData.map((d, i) => (
            <div
              className={`flex font-medium justify-center text-sm py-1 ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div className="flex gap-5 xs:gap-3">
                {/* Capital */}
                <div className="flex space-x-1  items-center font-semibold">
                  <img src={capitalIcon} alt="capital" className="w-6 md:w-4" />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-oranges">{d.capital.toLocaleString()}</p>
                </div>
                {/* Sales */}
                <div className="flex space-x-1  items-center font-semibold">
                  <img src={salesIcon} alt="sales" className="w-6 md:w-4" />
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
                <div className="flex space-x-1  items-center font-semibold">
                  <img
                    src={expensesIcon}
                    alt="expenses"
                    className="w-6 md:w-4"
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-[red]">{d.expenses.toLocaleString()}</p>
                </div>
                {/* Profits */}
                <div className="flex space-x-1 items-center font-extrabold">
                  <img src={profitsIcon} alt="profits" className="w-6 md:w-4" />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`${
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

export default BusinessMobileData;
