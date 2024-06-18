import { getMonth } from "../utilities/getMonth";
import PersonalMonth from "../components/PersonalMonth";
import { useState } from "react";

const Personal = () => {
  const [currentMonth, setCurrentMonth] = useState(getMonth()); // to set current month in calendar

  return (
    <div>
      <PersonalMonth />
    </div>
  );
};

export default Personal;
