import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import capitalIcon from "../../media/bus_pouch.png";
import expensesIcon from "../../media/bus_expenses.png";
import salesIcon from "../../media/sales.png";
import profitsIcon from "../../media/bus_profit.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BusinessMobileData = ({ day }) => {
  const {
    monthIndex,
    setShowBusinessForm,
    setExactDaySelected,
    setBusinessFormSelectedDate,
    businessIncomeData,
    businessIncomeLoading,
    setIsDataBusiness,
    inMobile,
  } = useContext(CalendarContext);

  const [dayData, setDayData] = useState([]);
  const [businessDataLoading, setBusinessDataLoading] = useState(true);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "text-oranges"
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
      notThisMonth ? setShowBusinessForm(false) : setShowBusinessForm(true),
      setExactDaySelected(day),
      formData(day)
    );
  }

  useEffect(() => {
    if (!businessIncomeLoading) {
      setIsDataBusiness(true);
      const businessIncomeDB = async () => {
        const data = await businessIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
        setBusinessDataLoading(false);
      };

      const businessisData = async () => {
        businessIncomeData.forEach((evnt) => {
          if (
            dayjs(evnt.day).format("MMMM YYYY") ===
            dayjs().month(monthIndex).format("MMMM YYYY")
          ) {
            setIsDataBusiness(false);
          }
        });
      };

      businessIncomeDB();
      businessisData();
    } else {
      setBusinessDataLoading(true);
    }
  }, [businessIncomeData, day]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col overflow-hidden rounded-md py-1 ${
          inMobile ? "h-fit" : ""
        } ${
          notThisMonth
            ? "cursor-default hidden"
            : "hover:border-loranges cursor-pointer"
        } ${dayData.length === 0 ? "hidden" : ""}`}
        onClick={businessDataLoading ? null : toggleForm}
      >
        <header className="flex flex-col items-center">
          <p
            className={`text-md font-semibold text-center ${
              inMobile ? "text-2xl ssm:text-base" : ""
            } ${notThisMonth ? "text-[#EEEEEE]" : ""} ${currentDay()}`}
          >
            {day.format("MMMM D")}
          </p>
        </header>

        {businessDataLoading ? (
          <div className={`${notThisMonth ? "hidden" : ""}`}>
            <Skeleton height={15} count={1} />
          </div>
        ) : (
          /* displaying data on their respective date */
          dayData.map((d, i) => (
            <div
              className={`flex font-medium justify-center text-sm py-2 ${
                notThisMonth ? "hidden" : ""
              }`}
              key={i}
            >
              <div
                className={`flex gap-5 xs:gap-3 ${
                  inMobile
                    ? "gap-10 flex-wrap justify-center md:gap-5"
                    : "gap-5 xs:gap-3"
                }`}
              >
                {/* Capital */}
                <div
                  className={`flex space-x-1  items-center font-semibold justify-center ${
                    inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                  }`}
                >
                  <img
                    src={capitalIcon}
                    alt="capital"
                    className={`${inMobile ? "w-10 ssm:w-7" : "w-6 md:w-4"} `}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-oranges">{d.capital.toLocaleString()}</p>
                </div>
                {/* Sales */}
                <div
                  className={`flex space-x-1  items-center font-semibold justify-center ${
                    inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                  }`}
                >
                  <img
                    src={salesIcon}
                    alt="sales"
                    className={`${inMobile ? "w-10 ssm:w-7" : "w-6 md:w-4"} `}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`${
                      d.sales >= d.capital ? "text-greens" : "text-[red]"
                    }`}
                  >
                    {d.sales.toLocaleString()}
                  </p>
                </div>
                {/* Expenses */}
                <div
                  className={`flex space-x-1  items-center font-semibold justify-center ${
                    inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                  }`}
                >
                  <img
                    src={expensesIcon}
                    alt="expenses"
                    className={`${inMobile ? "w-10 ssm:w-7" : "w-6 md:w-4"} `}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-[red]">{d.expenses.toLocaleString()}</p>
                </div>
                {/* Profits */}
                <div
                  className={`flex space-x-1 items-center font-extrabold justify-center ${
                    inMobile ? "text-xl xs:text-lg ssm:text-base" : ""
                  }`}
                >
                  <img
                    src={profitsIcon}
                    alt="profits"
                    className={`${inMobile ? "w-10 ssm:w-7" : "w-6 md:w-4"} `}
                  />
                  <p className="ml-1 font-semibold text-[#D0D0D0]">:</p>
                  <p
                    className={`${
                      d.profit < 0 ? "text-[red]" : "text-lgreens"
                    }`}
                  >
                    {d.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default BusinessMobileData;
