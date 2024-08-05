import { getMonth } from "../utilities/getMonth";
import PersonalMonth from "../components/personal/PersonalMonth";
import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import { useLocation, useNavigate } from "react-router-dom";

const Personal = () => {
  const [currentMonth, setCurrentMonth] = useState(getMonth()); // to set current month in calendar
  const { monthIndex } = useContext(CalendarContext);

  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    if (state?.from !== "/home") {
      navigate("/home");
    }
  }, []);

  return (
    <div>
      <PersonalMonth month={currentMonth} /* props current month */ />
    </div>
  );
};

export default Personal;
