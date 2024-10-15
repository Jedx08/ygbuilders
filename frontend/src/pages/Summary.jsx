import { useContext, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PersonalSummary from "../components/personal/PersonalSummary";
import BusinessSummary from "../components/business/BusinessSummary";
import { CalendarContext } from "../context/CalendarContext";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Summary = () => {
  const { auth } = useAuth();
  const { personalSummaryView, setPersonalSummaryView, setLoggedIn } =
    useContext(CalendarContext);

  let { state } = useLocation();

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (state?.from === "/business") {
      setPersonalSummaryView(false);
    } else {
      setPersonalSummaryView(true);
    }
  }, []);

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
