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
    inMobile,
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
    if (personalIncomeLoading) {
      setPersonalDataLoading(true);
      getPersonalData();
      setPersonalIncomeLoading(false);
    }
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
        className={`border border-light bg-white flex flex-col overflow-hidden ${
          inMobile ? "" : "h-[135px] md:h-[120px] sm:h-[110px] ssm:h-[auto]"
        } ${
          notThisMonth ? "cursor-default" : "hover:border-greens cursor-pointer"
        }`}
        onClick={personalDataLoading ? null : toggleForm}
      >
        <header className="flex flex-col items-center">
          <p
            className={`font-bold pt-1 text-center ${
              inMobile ? "text-2xl ssm:text-lg" : "text-lg"
            } ${notThisMonth ? "text-[#EEEEEE]" : ""} ${currentDay()}`}
          >
            {day.format("D")}
          </p>
        </header>

        {personalDataLoading ? (
          <div
            className={`flex items-center justify-center xs:hidden ${
              notThisMonth ? "hidden" : ""
            }`}
          >
            <Skeleton
              width={100}
              height={15}
              count={3}
              className={`${inMobile ? "hidden" : ""}`}
            />
          </div>
        ) : (
          /* displaying data on their respective date */
          dayData.map((d, i) => (
            <div
              className={`flex font-medium mt-3 justify-center ${
                inMobile ? "hidden" : "md:text-sm sm:text-xs ssm:hidden"
              } ${notThisMonth ? "hidden" : ""}`}
              key={i}
            >
              <div className="space-y-1">
                {/* gross */}
                <div className="flex items-center font-semibold">
                  <div className="flex space-x-2 items-center justify-center md:space-x-1 sm:space-x-0">
                    <img src={grossIcon} alt="capital" className="w-6 md:w-4" />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p className="text-oranges">{d.gross.toLocaleString()}</p>
                  </div>
                </div>
                {/* expenses */}
                <div className="flex items-center font-semibold">
                  <div className="flex space-x-2 items-center justify-center md:space-x-1 sm:space-x-0">
                    <img
                      src={expensesIcon}
                      alt="capital"
                      className="w-6 md:w-4"
                    />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p className="text-[red]">{d.expenses.toLocaleString()}</p>
                  </div>
                </div>
                <hr className="text-[#D0D0D0]" />
                {/* net */}
                <div className="flex items-center font-extrabold">
                  <div className="flex space-x-2 items-center justify-center md:space-x-1 sm:space-x-0">
                    <img src={netIcon} alt="capital" className="w-6 md:w-4" />
                    <p className="ml-1 font-semibold text-[#D0D0D0]">:</p>
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
      </div>
    </>
  );
};

export default PersonalDay;
