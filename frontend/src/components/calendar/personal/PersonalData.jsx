import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useGetData from "../../../hooks/useGetPersonalData";
import dayjs from "dayjs";
import grossIcon from "../../../media/pouch.png";
import expensesIcon from "../../../media/expenses.png";
import netIcon from "../../../media/networth.png";

const PersonalData = () => {
  const {
    monthIndex,
    personalIncomeLoading,
    personalIncomeData,
    setPersonalButton,
    setFormSelectedDate,
    exactDaySelected,
    setExactDaySelected,
  } = useContext(CalendarContext);

  const getPersonalData = useGetData();

  const [monthData, setMonthData] = useState(null);
  const [personalDataLoading, setPersonalDataLoading] = useState(true);
  const [monthlyDataLoading, setMonthlyDataLoading] = useState(true);

  const [grossCount, setGrossCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);

  useEffect(() => {
    if (personalIncomeLoading) {
      setPersonalDataLoading(true);
      getPersonalData();
    }
  }, [personalIncomeLoading]);

  useEffect(() => {
    if (!personalIncomeLoading) {
      const personalIncomeDB = async () => {
        const data = await personalIncomeData.filter(
          (evnt) =>
            dayjs(evnt.day).format("MMMM-YYYY") ===
            dayjs().month(monthIndex).format("MMMM-YYYY")
        );

        setMonthData(data);
        setPersonalDataLoading(false);
        setPersonalButton(true);
        setMonthlyDataLoading(false);
      };

      personalIncomeDB();

      const data = personalIncomeData.filter(
        (date) =>
          dayjs(date.day).format("DD-MM-YY") ===
          exactDaySelected.format("DD-MM-YY")
      );

      setFormSelectedDate(data[0]);
    }
  }, [personalIncomeLoading, monthIndex]);

  useEffect(() => {
    let g = 0;
    let e = 0;
    if (!monthlyDataLoading) {
      const monthlyCount = () => {
        monthData.forEach((data) => {
          g += data.gross;
          e += data.expenses;
        });

        setGrossCount(g);
        setExpensesCount(e);
      };

      monthlyCount();
    }
  }, [monthlyDataLoading, monthData]);

  return (
    <div>
      <div>
        {personalDataLoading && (
          <div className="bg-white border border-light py-3 text-center rounded-md">
            Getting Data...
          </div>
        )}
        {!personalDataLoading && (
          <>
            {monthData.length === 0 ? (
              <div className="bg-white border border-light py-3 text-center rounded-md">
                No data to show
              </div>
            ) : (
              ""
            )}
            {monthData.map((d, i) => {
              return (
                <div
                  onClick={() => {
                    setExactDaySelected(dayjs(d.day));
                    setFormSelectedDate(d);
                  }}
                  key={i}
                  className="bg-white border border-light py-1 cursor-pointer hover:border-lgreens rounded-md"
                >
                  <div className="text-lg font-medium text-center">
                    {dayjs(d.day).format("MMMM D")}
                  </div>
                  <div
                    className={`flex font-medium justify-center text-sm py-2`}
                    key={i}
                  >
                    <div className={`flex space-x-4`}>
                      {/* gross */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img src={grossIcon} alt="gross" className={`w-8`} />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-oranges text-lg">
                            {d.gross.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* expenses */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={expensesIcon}
                            alt="expenses"
                            className={`w-8`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-[red] text-lg">
                            {d.expenses.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* net */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img src={netIcon} alt="net" className={`w-8`} />
                          <p className="ml-1 font-semibold text-[#D0D0D0]">:</p>
                          <p
                            className={`text-lg ${
                              d.net < 0 ? "text-[red]" : "text-greens"
                            }`}
                          >
                            {d.net.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div>gross: {grossCount}</div>
      <div>expenses: {expensesCount}</div>
      <div>net: {grossCount - expensesCount}</div>
    </div>
  );
};

export default PersonalData;
