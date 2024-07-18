import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import grossIcon from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import netIcon from "../../media/networth.png";
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
        className={`border border-light bg-white flex flex-col ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={personalDataLoading ? null : toggleForm}
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
              className={`flex font-medium text-xs mt-3 justify-center ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div className="space-y-1">
                {/* gross */}
                <div className="flex items-center font-semibold">
                  <div className="flex space-x-2 items-center">
                    <img src={grossIcon} alt="capital" className="h-4 w-6" />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p className="text-oranges">{d.gross.toLocaleString()}</p>
                  </div>
                </div>
                {/* expenses */}
                <div className="flex items-center font-semibold">
                  <div className="flex space-x-2 items-center">
                    <img src={expensesIcon} alt="capital" className="h-4 w-6" />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p className="text-[red]">{d.expenses.toLocaleString()}</p>
                  </div>
                </div>
                <hr className="text-[#D0D0D0]" />
                {/* net */}
                <div className="flex items-center font-extrabold">
                  <div className="flex space-x-2 items-center">
                    <img src={netIcon} alt="capital" className="h-4 w-6" />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p
                      className={`${d.net < 0 ? "text-[red]" : "text-greens"}`}
                    >
                      {d.net.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {/* <p
                      className={`font-bold ${
                        d.net < 0 ? "text-[red]" : "text-lgreens"
                      }`}
                    >
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.net.toLocaleString()}
                    </p> */}
      </div>
    </>
  );
};

export default PersonalDay;
