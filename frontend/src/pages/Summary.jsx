import { useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import PersonalSummary from "../components/personal/PersonalSummary";
import BusinessSummary from "../components/Business/BusinessSummary";
import { CalendarContext } from "../context/CalendarContext";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FooterNav from "../components/FooterNav";

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
      <div className="flex lg:flex-col">
        <div className="lg:hidden">
          <Sidebar />
        </div>
        <div className="bg-light w-full font-pops px-20 xl:pl-40 lg:pl-20 lg:pb-20">
          {personalSummaryView ? <PersonalSummary /> : <BusinessSummary />}
        </div>
        <div className="hidden lg:block">
          <FooterNav />
        </div>
      </div>
    </>
  );
};

export default Summary;
