import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import dayjs from "dayjs";
import pouch from "../media/pouch.png";
import expenses from "../media/expenses.png";
import networth from "../media/networth.png";

const PersonalDay = ({ day, rowIdx }) => {
  const { monthIndex, setShowPersonalForm, setExactDaySelected } =
    useContext(CalendarContext);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function notMonthStyle() {
    return notThisMonth ? "text-light" : "";
  }

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-greens text-white rounded-full w-9"
      : "";
  }

  function toggleForm() {
    return (
      notThisMonth ? setShowPersonalForm(false) : setShowPersonalForm(true),
      setExactDaySelected(day)
    );
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

  return (
    <>
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
          {/* data G, E, N */}
          {/* <div className="flex space-x-8 text-xs font-semibold mt-3">
            <div>
              <ul>
                <li>
                  <div className="flex">
                    <img src={pouch} alt="Gross" className="h-4 w-4" />
                    <p className="ml-1">:</p>
                  </div>
                </li>
                <li>
                  <div className="flex">
                    <img src={expenses} className="h-4 w-4" />
                    <p className="ml-1">:</p>
                  </div>
                </li>
                <li>
                  <div className="flex">
                    <img src={networth} className="h-4 w-4" />
                    <p className="ml-1">:</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="text-xs">
              <ul>
                <li>
                  <p>500</p>
                </li>
                <li>
                  <p>200</p>
                </li>
                <li>
                  <p>300</p>
                </li>
              </ul>
            </div>
          </div> */}
        </header>
      </div>
    </>
  );
};

export default PersonalDay;
