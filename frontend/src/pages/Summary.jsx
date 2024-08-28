import { useContext } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PersonalSummary from "../components/personal/PersonalSummary";
import BusinessSummary from "../components/business/BusinessSummary";
import { CalendarContext } from "../context/CalendarContext";

const Summary = () => {
  const { personalSummaryView } = useContext(CalendarContext);

  return (
    <>
      <Navbar />
      <div className="bg-light font-pops">
        {personalSummaryView ? <PersonalSummary /> : <BusinessSummary />}
      </div>
      <Footer />
    </>
  );
};

export default Summary;
