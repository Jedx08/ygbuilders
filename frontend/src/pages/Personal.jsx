import { getMonth } from "../utilities/getMonth";
import PersonalMonth from "../components/PersonalMonth";
import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";

const Personal = () => {
  const [currentMonth, setCurrentMonth] = useState(getMonth()); // to set current month in calendar
  const { monthIndex } = useContext(CalendarContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <div>
      <PersonalMonth month={currentMonth} /* props current month */ />
    </div>
  );
};

export default Personal;
