import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import pouch from "../../media/pouch.png";
import expenses from "../../media/expenses.png";
import networth from "../../media/networth.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useGetBusinessData from "../../hooks/useGetBusinessData";

const BusinessDay = ({ day }) => {
  const {
    monthIndex,
    setShowBusinessForm,
    setExactDaySelected,
    setBusinessFormSelectedDate,
    businessIncomeData,
    dispatchBusinessIncomeData,
    businessIncomeLoading,
    setBusinessIncomeLoading,
  } = useContext(CalendarContext);

  const getBusinessIncome = useGetBusinessData();

  const [dayData, setDayData] = useState([]);
  const [businessDataLoading, setBusinessDataLoading] = useState(true);

  const notThisMonth =
    day.format("MM") !==
    dayjs(new Date(dayjs().year(), monthIndex)).format("MM");

  function currentDay() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-oranges text-white rounded-[50%] w-9"
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
    setBusinessDataLoading(true);
    getBusinessIncome();
    setBusinessIncomeLoading(false);
  }, [dispatchBusinessIncomeData, businessIncomeLoading]);

  useEffect(() => {
    if (!businessIncomeLoading) {
      const businessIncomeDB = async () => {
        const data = await businessIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
        );

        setDayData(data);
        setBusinessDataLoading(false);
      };
      businessIncomeDB();
    } else {
      setBusinessDataLoading(true);
    }
  }, [businessIncomeData, day]);

  return (
    <>
      <div
        className={`border border-light bg-white flex flex-col ${
          notThisMonth
            ? "cursor-default"
            : "hover:border-loranges cursor-pointer"
        }`}
        onClick={businessDataLoading ? null : toggleForm}
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

        {businessDataLoading ? (
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
              className={`flex font-medium space-x-2 text-xs mt-3 justify-center ${
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
                    <p className="text-lgreens">
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.capital.toLocaleString()}
                    </p>
                  </li>
                  <li>
                    <p
                      className={`${
                        d.sales >= d.capital ? "text-greens" : "text-[red]"
                      }`}
                    >
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.sales.toLocaleString()}
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
                        d.profit < 0 ? "text-[red]" : "text-lgreens"
                      }`}
                    >
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {d.profit.toLocaleString()}
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

export default BusinessDay;
