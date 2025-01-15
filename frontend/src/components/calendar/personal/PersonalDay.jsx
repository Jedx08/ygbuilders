import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import dayjs from "dayjs";
import "react-loading-skeleton/dist/skeleton.css";
import { RxDotFilled } from "react-icons/rx";

const PersonalDay = ({ day, monthData, personalDataLoading }) => {
  const {
    monthIndex,
    setShowPersonalForm,
    setExactDaySelected,
    setFormSelectedDate,
    personalIncomeData,
    inMobile,
  } = useContext(CalendarContext);

  const [dayData, setDayData] = useState([]);

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
    return setExactDaySelected(day), formData(day);
  }

  useEffect(() => {
    if (!personalDataLoading) {
      const checkDayData = () => {
        const data = monthData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
      };
      checkDayData();
    }
  }, [monthIndex, monthData, day, personalDataLoading]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col items-center justify-center overflow-hidden relative ${
          notThisMonth ? "cursor-default" : "hover:border-greens cursor-pointer"
        }`}
        onClick={() => {
          if (!notThisMonth) {
            if (window.innerWidth <= 658) {
              setShowPersonalForm(true);
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
                dayData[0].net < 0 ? "text-[#ff3a33]" : "text-[#32ca5b]"
              }`}
            />
          </div>
        )}

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
