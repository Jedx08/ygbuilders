import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import dayjs from "dayjs";
import { RxDotFilled } from "react-icons/rx";

const BusinessDay = ({ day, monthData, businessDataLoading }) => {
  const {
    monthIndex,
    setShowBusinessForm,
    setExactDaySelected,
    setBusinessFormSelectedDate,
    businessIncomeData,
    inMobile,
  } = useContext(CalendarContext);

  const [dayData, setDayData] = useState([]);

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
    return setExactDaySelected(day), formData(day);
  }

  useEffect(() => {
    if (!businessDataLoading) {
      const checkDayData = () => {
        const data = monthData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
      };
      checkDayData();
    }
  }, [monthIndex, monthData, day, businessDataLoading]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col items-center justify-center overflow-hidden relative ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={() => {
          if (!notThisMonth) {
            if (window.innerWidth <= 658) {
              setShowBusinessForm(true);
            }
            toggleForm();
          }
        }}
      >
        {dayData.length === 0 ? (
          <></>
        ) : (
          <div
            className={`absolute top-0 right-0 ${notThisMonth ? "hidden" : ""}`}
          >
            <RxDotFilled
              className={`${
                dayData[0].profit < 0 ? "text-[#ff3a33]" : "text-[#32ca5b]"
              }`}
            />
          </div>
        )}
        <header className="flex flex-col">
          <p
            className={`font-bold pt-1 text-center ${
              inMobile ? "text-2xl ssm:text-lg" : "text-lg"
            } ${notThisMonth ? "text-[#EEEEEE]" : ""} ${currentDay()}`}
          >
            {day.format("D")}
          </p>
        </header>
      </div>
    </>
  );
};

export default BusinessDay;
