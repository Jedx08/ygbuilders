import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import grossIcon from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import netIcon from "../../media/networth.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PersonalMobileData = ({ day }) => {
  const {
    monthIndex,
    setShowPersonalForm,
    setExactDaySelected,
    setFormSelectedDate,
    personalIncomeData,
    personalIncomeLoading,
    setIsDataPersonal,
    inMobile,
  } = useContext(CalendarContext);

  const [dayData, setDayData] = useState([]);
  const [personalDataLoading, setPersonalDataLoading] = useState(true);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "text-greens"
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
    if (!personalIncomeLoading) {
      setIsDataPersonal(true);
      const personalIncomeDB = async () => {
        const data = await personalIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
        setPersonalDataLoading(false);
      };

      const personalisData = async () => {
        personalIncomeData.forEach((evnt) => {
          if (
            dayjs(evnt.day).format("MMMM YYYY") ===
            dayjs().month(monthIndex).format("MMMM YYYY")
          ) {
            setIsDataPersonal(false);
          }
        });
      };

      personalIncomeDB();
      personalisData();
    } else {
      setPersonalDataLoading(true);
    }
  }, [personalIncomeData, day]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col overflow-hidden rounded-md py-1 ${
          inMobile ? "h-fit" : ""
        } ${
          notThisMonth
            ? "cursor-default hidden"
            : "hover:border-greens cursor-pointer"
        } ${dayData.length === 0 ? "hidden" : ""}`}
        onClick={personalDataLoading ? null : toggleForm}
      >
        <div className="flex flex-col items-center">
          <p
            className={`text-md font-semibold text-center ${
              inMobile ? "text-2xl ssm:text-base" : ""
            } ${notThisMonth ? "text-[#EEEEEE]" : ""} ${currentDay()}`}
          >
            {day.format("MMMM D")}
          </p>
        </div>

        {personalDataLoading ? (
          <div className={`${notThisMonth ? "hidden" : ""}`}>
            <Skeleton height={15} count={1} />
          </div>
        ) : (
          /* displaying data on their respective date */
          dayData.map((d, i) => (
            <div
              className={`flex font-medium justify-center text-sm py-1 ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div
                className={`flex ${
                  inMobile
                    ? "gap-10 flex-wrap justify-center md:gap-5"
                    : "gap-5 xs:gap-3"
                }`}
              >
                {/* gross */}
                <div className="flex items-center font-semibold">
                  <div
                    className={`flex space-x-1 items-center justify-center ${
                      inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                    }`}
                  >
                    <img
                      src={grossIcon}
                      alt="capital"
                      className={`${inMobile ? "w-10 ssm:w-6" : "w-5"}`}
                    />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p className="text-oranges">{d.gross.toLocaleString()}</p>
                  </div>
                </div>
                {/* expenses */}
                <div className="flex items-center font-semibold">
                  <div
                    className={`flex space-x-1 items-center justify-center ${
                      inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                    }`}
                  >
                    <img
                      src={expensesIcon}
                      alt="capital"
                      className={`${inMobile ? "w-10 ssm:w-6" : "w-5"}`}
                    />
                    <p className="ml-1 text-[#D0D0D0]">:</p>
                    <p className="text-[red]">{d.expenses.toLocaleString()}</p>
                  </div>
                </div>
                {/* net */}
                <div className="flex items-center font-extrabold">
                  <div
                    className={`flex space-x-1 items-center justify-center ${
                      inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                    }`}
                  >
                    <img
                      src={netIcon}
                      alt="capital"
                      className={`${inMobile ? "w-10 ssm:w-6" : "w-5"}`}
                    />
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

export default PersonalMobileData;
