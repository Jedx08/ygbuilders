import React, { useContext } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import dayjs from "dayjs";
import "react-loading-skeleton/dist/skeleton.css";

const BusinessDay = ({ day }) => {
  const {
    monthIndex,
    setShowBusinessForm,
    exactDaySelected,
    setExactDaySelected,
    formSelectedDate,
    setBusinessFormSelectedDate,
    businessIncomeData,
    dispatchPersonalIncomeData,
    personalIncomeLoading,
    setPersonalIncomeLoading,
    inMobile,
  } = useContext(CalendarContext);

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
      notThisMonth ? setShowBusinessForm(false) : setExactDaySelected(day),
      formData(day)
    );
  }

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col items-center justify-center overflow-hidden ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={toggleForm}
      >
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
