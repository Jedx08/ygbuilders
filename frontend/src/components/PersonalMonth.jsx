import React, { useState } from "react";
import PersonalDay from "./PersonalDay";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { CalendarContext } from "../context/CalendarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PersonalForm from "./PersonalForm";

const PersonalMonth = ({ month }) => {
  const { monthIndex, setMonthIndex, showPersonalForm, personalIncomeData } =
    useContext(CalendarContext);
  const [monthData, setMonthData] = useState([]);
  const [monthlyGross, setMonthlyGross] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyNet, setMonthlyNet] = useState(0);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  useEffect(() => {
    const personalIncomeDB = async () => {
      const data = await personalIncomeData.filter(
        (evnt) =>
          dayjs(evnt.day).format("M-YY") ===
          dayjs().month(monthIndex).format("M-YY")
      );

      setMonthData(data);
    };

    personalIncomeDB();
  }, [personalIncomeData, monthIndex]);

  useEffect(() => {
    let g = 0;
    let e = 0;
    let n = 0;

    const monthlyIncomeData = () => {
      monthData.forEach((data) => {
        g += data.gross;
        e += data.expenses;
        n += data.net;
      });
    };

    monthlyIncomeData();
    setMonthlyGross(g);
    setMonthlyExpenses(e);
    setMonthlyNet(n);
  }, [monthData]);

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops">
        <div>
          <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5">
            <div>
              <FontAwesomeIcon
                icon={faCaretLeft}
                className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                onClick={handlePrevMonth}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-center text-4xl text-greens">
                {
                  /* display current month and year */
                  dayjs(new Date(dayjs().year(), monthIndex)).format(
                    "MMMM YYYY"
                  )
                }
              </h1>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faCaretRight}
                className="text-oranges text-3xl hover:text-loranges cursor-pointer"
                onClick={handleNextMonth}
              />
            </div>
          </div>

          <div className="h-s80 flex-1 grid grid-cols-7 grid-rows-6 mx-5 mt-10 rounded-lg">
            {month.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((day, idx) => (
                  <PersonalDay day={day} key={idx} rowIdx={i} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>{monthlyGross}</div>
        <div>{monthlyExpenses}</div>
        <div>{monthlyNet}</div>

        <Footer />
      </div>

      {showPersonalForm && <PersonalForm />}
    </>
  );
};

export default PersonalMonth;
