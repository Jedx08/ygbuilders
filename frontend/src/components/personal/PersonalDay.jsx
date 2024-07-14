import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import pouch from "../../media/pouch.png";
import expenses from "../../media/expenses.png";
import networth from "../../media/networth.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useGetData from "../../hooks/useGetPersonalData";

const PersonalDay = ({ day }) => {
  const {
    monthIndex,
    setShowPersonalForm,
    setExactDaySelected,
    setFormSelectedDate,
    personalIncomeData,
    dispatchPersonalIncomeData,
    personalIncomeLoading,
    setPersonalIncomeLoading,
  } = useContext(CalendarContext);

  const getPersonalData = useGetData();

  const [dayData, setDayData] = useState([]);
  const [personalDataLoading, setPersonalDataLoading] = useState(true);

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
      notThisMonth ? setShowPersonalForm(false) : setShowPersonalForm(true),
      setExactDaySelected(day),
      formData(day)
    );
  }

  useEffect(() => {
    setPersonalDataLoading(true);
    getPersonalData();
    setPersonalIncomeLoading(false);
  }, [dispatchPersonalIncomeData, personalIncomeLoading]);

  useEffect(() => {
    if (!personalIncomeLoading) {
      const personalIncomeDB = async () => {
        const data = await personalIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
        setPersonalDataLoading(false);
      };
      personalIncomeDB();
    } else {
      setPersonalDataLoading(true);
    }
  }, [personalIncomeData, day]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col font-pops ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={personalDataLoading ? null : toggleForm}
      >
        <header className="flex flex-col items-center">
          <p
            className={`text-lg font-bold pt-1 mt-1 text-center ${
              notThisMonth ? "text-[#EEEEEE]" : ""
            } ${currentDay()}`}
          >
            {day.format("D")}
          </p>
        </header>

        {personalDataLoading ? (
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
              className={`flex font-medium space-x-2 text-xs mt-3 items-center justify-center ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div className="flex items-center">
                <ul>
                  <li>
                    <div className="flex">
                      <img src={pouch} alt="Gross" className="h-4 w-6" />
                      <p className="ml-1 text-[#D0D0D0]">:</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      <img src={expenses} className="h-4 w-6" />
                      <p className="ml-1 text-[#D0D0D0]">:</p>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      <img src={networth} className="h-4 w-6" />
                      <p className="ml-1 text-[#D0D0D0]">:</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="text-xs">
                <ul>
                  <li>
                    <p className="text-lgreens">
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.gross.toLocaleString()}
                    </p>
                  </li>
                  <li>
                    <p className="text-[red]">
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.expenses.toLocaleString()}
                    </p>
                  </li>
                  <li>
                    <p
                      className={`font-bold ${
                        d.net < 0 ? "text-[red]" : "text-lgreens"
                      }`}
                    >
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.net.toLocaleString()}
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
