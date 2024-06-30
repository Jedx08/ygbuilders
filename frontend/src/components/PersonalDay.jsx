import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import dayjs from "dayjs";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import pouch from "../media/pouch.png";
import expenses from "../media/expenses.png";
import networth from "../media/networth.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PersonalDay = ({ day, rowIdx }) => {
  const {
    monthIndex,
    setShowPersonalForm,
    setExactDaySelected,
    setFormSelectedDate,
    personalIncomeData,
    dispatchPersonalIncomeData,
    dayLoading,
    setDayLoading,
  } = useContext(CalendarContext);
  const axiosPrivate = useAxiosPrivate();
  const [dayData, setDayData] = useState([]);

  useEffect(() => {
    const getPersonalIncomeData = async () => {
      const response = await axiosPrivate.get("/api/personal-income");
      const json = await response.data;

      if (response.status === 200) {
        dispatchPersonalIncomeData({ type: "set", payload: json });
      } else {
        throw new Error("Error getting data");
      }
    };
    getPersonalIncomeData();
    setDayLoading(false);
  }, [dispatchPersonalIncomeData, dayLoading]);

  useEffect(() => {
    const personalIncomeDB = async () => {
      const data = await personalIncomeData.filter(
        (evnt) => dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
      );

      setDayData(data);
    };

    personalIncomeDB();
  }, [personalIncomeData, day]);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-greens text-white rounded-full w-9"
      : "";
  }

  function weekends() {
    const sunday = day.format("dddd").toUpperCase() === "SUNDAY";
    const saturday = day.format("dddd").toUpperCase() === "SATURDAY";

    return sunday || saturday ? "text-oranges" : "";
  }

  function formData(arg) {
    const data = personalIncomeData.filter(
      (date) => dayjs(date.day).format("DD-MM-YY") === arg.format("DD-MM-YY")
    );
    setFormSelectedDate(data[0]);
  }

  function toggleForm() {
    return (
      notThisMonth ? setShowPersonalForm(false) : setShowPersonalForm(true),
      setExactDaySelected(day),
      formData(day)
    );
  }

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={dayLoading ? null : toggleForm}
      >
        <header className="flex flex-col items-center">
          {
            /* display sunday - saturday */
            rowIdx === 0 && (
              <p
                className={`select-none text-sm mb-1 font-bold relative mt-[-21px] ${weekends()}`}
              >
                {day.format("dddd").toUpperCase()}
              </p>
            )
          }
          <p
            className={`text-lg font-bold pt-1 mt-1 text-center ${
              notThisMonth ? "text-[#EEEEEE]" : ""
            } ${currentDay()}`}
          >
            {day.format("D")}
          </p>
        </header>

        {dayLoading ? (
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
              className={`flex space-x-6 text-xs font-semibold mt-3 justify-center ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div>
                <ul>
                  <li>
                    <div className="flex">
                      <img src={pouch} alt="Gross" className="h-4 w-4" />
                      <p className="ml-1 text-[#D0D0D0]">:</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      <img src={expenses} className="h-4 w-4" />
                      <p className="ml-1 text-[#D0D0D0]">:</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      <img src={networth} className="h-4 w-4" />
                      <p className="ml-1 text-[#D0D0D0]">:</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="text-xs">
                <ul>
                  <li>
                    <p className="text-greens">{d.gross}</p>
                  </li>
                  <li>
                    <p className="text-oranges">{d.expenses}</p>
                  </li>
                  <li>
                    <p
                      className={`${d.net < 0 ? "text-[red]" : "text-lgreens"}`}
                    >
                      {d.net}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PersonalDay;
