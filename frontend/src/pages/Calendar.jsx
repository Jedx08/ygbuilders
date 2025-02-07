import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { CalendarContext } from "../context/CalendarContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import FooterNav from "../components/FooterNav";
import Sidebar from "../components/Sidebar";
import BusinessCalendar from "../components/calendar/business/BusinessCalendar";
import PersonalCalendar from "../components/calendar/personal/PersonalCalendar";

const Calendar = () => {
  const { auth } = useAuth();
  const { setLoggedIn } = useContext(CalendarContext);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!tab) {
      navigate("/calendar?tab=Personal", { replace: true });
    }
  }, [tab, navigate]);

  const changeTab = (tabName) => {
    navigate(`?tab=${tabName}`, { replace: true });
  };

  return (
    <div className="flex lg:flex-col">
      <div className="lg:hidden">
        <Sidebar />
      </div>
      <div className="w-full bg-light">
        <Navbar />
        <div className="font-pops  min-h-[100vh]">
          {/* Calendar Switch View */}
          <div className="flex justify-center space-x-5 pt-5">
            <div
              onClick={() => {
                changeTab("Personal");
              }}
              className={`px-5 py-3 rounded-md font-bold
              ${
                tab === "Personal" || !params.get("tab")
                  ? "bg-lgreens text-white cursor-default"
                  : "bg-white cursor-pointer hover:text-lgreens shadow-md"
              }
             `}
            >
              Personal
            </div>
            <div
              onClick={() => {
                changeTab("Business");
              }}
              className={`px-5 py-3 rounded-md font-bold
              ${
                tab === "Business"
                  ? "bg-loranges text-white cursor-default"
                  : "bg-white cursor-pointer hover:text-loranges shadow-md"
              }
            `}
            >
              Business
            </div>
          </div>
          {/* Calendar Display Personal/Business */}
          <div>
            {tab === "Personal" && <PersonalCalendar />}
            {tab === "Business" && <BusinessCalendar />}
          </div>
        </div>
        <div className="mt-20 lg:mb-[5rem]">
          <Footer />
        </div>
      </div>

      <div className="hidden lg:block">
        <FooterNav />
      </div>
    </div>
  );
};

export default Calendar;
