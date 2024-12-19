import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import dayjs from "dayjs";
import grossIcon from "../../../media/pouch.png";
import expensesIcon from "../../../media/expenses.png";
import netIcon from "../../../media/networth.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useGetData from "../../../hooks/useGetPersonalData";

const PersonalDay = ({ day }) => {
  const {
    monthIndex,
    setShowPersonalForm,
    exactDaySelected,
    setExactDaySelected,
    formSelectedDate,
    setFormSelectedDate,
    personalIncomeData,
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
      ? "bg-greens text-white rounded-[50%] w-9"
      : "";
  }

  function formData(arg) {
    const data = personalIncomeData.filter(
      (date) => dayjs(date.day).format("DD-MM-YY") === arg.format("DD-MM-YY")
    );
    setFormSelectedDate(data[0]);
  }

  function toggleForm() {
    return (
      notThisMonth ? setShowPersonalForm(dayjs()) : setExactDaySelected(day),
      formData(day)
    );
  }

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col items-center justify-center overflow-hidden ${
          notThisMonth ? "cursor-default" : "hover:border-greens cursor-pointer"
        }`}
        onClick={toggleForm}
      >
        <div className="flex flex-col">
          <p
            className={`font-bold pt-1 text-center ${
              inMobile ? "text-2xl ssm:text-lg" : "text-lg"
            } ${notThisMonth ? "text-[#EEEEEE]" : ""} ${currentDay()}`}
          >
            {day.format("D")}
          </p>
        </div>
      </div>
    </>
  );
};

export default PersonalDay;
