import React from "react";
import PersonalDay from "./PersonalDay";
import dayjs from "dayjs";
import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PersonalForm from "./PersonalForm";

const PersonalMonth = ({ month }) => {
  const { monthIndex, setMonthIndex, showPersonalForm } =
    useContext(CalendarContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops">
        <div>
          <div className="pt-5 grid grid-flow-col justify-center place-items-center gap-5">
            <div>
              <FontAwesomeIcon
                icon={faCaretLeft}
                className="text-oranges text-3xl hover:text-loranges"
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
                className="text-oranges text-3xl hover:text-loranges"
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

        <Footer />
      </div>

      {showPersonalForm && <PersonalForm />}
    </>
  );
};

export default PersonalMonth;
