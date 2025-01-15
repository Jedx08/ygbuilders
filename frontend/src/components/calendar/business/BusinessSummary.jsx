import { useContext } from "react";
import { CalendarContext } from "../../../context/CalendarContext";

const BusinessSummary = () => {
  const {
    monthIndex,
    setMonthIndex,
    personalSummaryView,
    setPersonalSummaryView,
  } = useContext(CalendarContext);

  return (
    <>
      {/* Overall data */}
      <div>business</div>
    </>
  );
};

export default BusinessSummary;
