import { useEffect, useContext, useState } from "react";
import useAuth from "../hooks/useAuth";
import { CalendarContext } from "../context/CalendarContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BusinessCalendar from "../components/calendar/business/BusinessCalendar";
import PersonalCalendar from "../components/calendar/personal/PersonalCalendar";

const Calendar = () => {
  const { auth } = useAuth();
  const { setLoggedIn } = useContext(CalendarContext);

  const [calendarView, setCalendarView] = useState(false);

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops">
        {/* Calendar Switch View */}
        <div className="flex justify-center space-x-5 pt-5">
          <div
            onClick={() => {
              setCalendarView(false);
            }}
            className={`shadow-lg px-5 py-3 rounded-md font-bold
              ${
                !calendarView
                  ? "bg-lgreens text-white cursor-default"
                  : "bg-white cursor-pointer hover:text-lgreens"
              }
             `}
          >
            Personal
          </div>
          <div
            onClick={() => {
              setCalendarView(true);
            }}
            className={`shadow-lg px-5 py-3 rounded-md font-bold
              ${
                !calendarView
                  ? "bg-white cursor-pointer hover:text-loranges"
                  : "bg-loranges text-white cursor-default"
              }
            `}
          >
            Business
          </div>
        </div>
        {/* Calendar Display Personal/Business */}
        <div>{!calendarView ? <PersonalCalendar /> : <BusinessCalendar />}</div>
      </div>
      <Footer />
    </>
  );
};

export default Calendar;
