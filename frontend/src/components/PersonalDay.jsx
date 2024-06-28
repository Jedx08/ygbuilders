import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import dayjs from "dayjs";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import pouch from "../media/pouch.png";
import expenses from "../media/expenses.png";
import networth from "../media/networth.png";

const PersonalDay = ({ day, rowIdx }) => {
  const {
    monthIndex,
    setShowPersonalForm,
    setExactDaySelected,
    setFormSelectedDate,
    personalIncomeData,
    dispatchPersonalIncomeData,
  } = useContext(CalendarContext);
  const axiosPrivate = useAxiosPrivate();
  const [dayData, setDayData] = useState([]);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function notMonthStyle() {
    return notThisMonth ? "text-[#EEEEEE]" : "";
  }

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-greens text-white rounded-full w-9"
      : "";
  }

  function cursor() {
    return notThisMonth ? "cursor-default" : "cursor-pointer";
  }

  function hover() {
    return notThisMonth ? "" : "hover:border-loranges";
  }

  function sunday() {
    const sunday = day.format("dddd").toUpperCase() === "SUNDAY";

    return sunday ? "text-oranges" : "";
  }

  function saturday() {
    const sunday = day.format("dddd").toUpperCase() === "SATURDAY";

    return sunday ? "text-oranges" : "";
  }

  useEffect(() => {
    const getPersonalIncomeData = async () => {
      const response = await axiosPrivate.get("/api/personal-income");
      const json = await response.data;

      if (response.status === 200) {
        dispatchPersonalIncomeData({ type: "set", payload: json });
        // setDayData(json);
      } else {
        throw new Error("Error getting data");
      }
    };
    getPersonalIncomeData();
  }, [dispatchPersonalIncomeData]);

  useEffect(() => {
    const personalIncomeDB = async () => {
      const data = await personalIncomeData.filter(
        (evnt) => dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
      );

      setDayData(data);
    };

    personalIncomeDB();
  }, [personalIncomeData, day]);

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
      {}
      <div
        className={`border border-light bg-white flex flex-col ${hover()} ${cursor()}`}
        onClick={toggleForm}
      >
        <header className="flex flex-col items-center">
          {
            /* display sunday - saturday */
            rowIdx === 0 && (
              <p
                className={`select-none text-sm mb-1 font-bold relative mt-[-21px] ${sunday()} ${saturday()}`}
              >
                {day.format("dddd").toUpperCase()}
              </p>
            )
          }
          <p
            className={`text-lg font-bold p-1 my-1 text-center ${notMonthStyle()} ${currentDay()}`}
          >
            {day.format("D")}
          </p>

          {
            /* displaying data on their respective date */
            dayData.map((d, i) => (
              <div
                className="flex space-x-6 text-xs font-semibold mt-3"
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
                        className={`${
                          d.net < 0 ? "text-[red]" : "text-lgreens"
                        }`}
                      >
                        {d.net}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            ))
          }
        </header>
      </div>
    </>
  );
};

export default PersonalDay;
