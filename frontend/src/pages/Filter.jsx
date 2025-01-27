import { useContext, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import Sidebar from "../components/Sidebar";
import FooterNav from "../components/FooterNav";
import Footer from "../components/Footer";
import BusinessDateRange from "../components/calendar/business/BusinessDateRange";
import PersonalDateRange from "../components/calendar/personal/PersonalDateRange";
import Navbar from "../components/Navbar";

const DateRange = () => {
  const { startDate, setStartDate, endDate, setEndDate } =
    useContext(CalendarContext);

  const [selectedView, setSelectedView] = useState(false);

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
                setSelectedView(false);
              }}
              className={`px-5 py-3 rounded-md font-bold
              ${
                !selectedView
                  ? "bg-lgreens text-white cursor-default"
                  : "bg-white cursor-pointer hover:text-lgreens shadow-md"
              }
             `}
            >
              Personal
            </div>
            <div
              onClick={() => {
                setSelectedView(true);
              }}
              className={`px-5 py-3 rounded-md font-bold
              ${
                !selectedView
                  ? "bg-white cursor-pointer hover:text-loranges shadow-md"
                  : "bg-loranges text-white cursor-default"
              }
            `}
            >
              Business
            </div>
          </div>

          {/* Date range */}
          <div className="mt-8 px-5 xl:pl-24 lg:pl-5">
            <div className="bg-white rounded-lg flex justify-center space-x-10 py-5 shadow-sm sm:space-x-3">
              <div className="flex justify-center items-center space-x-2">
                <p>From:</p>
                <input
                  className="justify-center text-center cursor-pointer text-lg border border-[#A6ACAF] py-1 rounded-md mdd:text-base"
                  type="date"
                  id="start"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex justify-center items-center space-x-2">
                <p>To:</p>
                <input
                  className="justify-center text-center cursor-pointer text-lg border border-[#A6ACAF] py-1 rounded-md mdd:text-base"
                  type="date"
                  id="end"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Calendar Display Personal/Business */}
          <div>
            {selectedView ? <BusinessDateRange /> : <PersonalDateRange />}
          </div>
        </div>
        <div className="mt-5 lg:mb-[5rem]">
          <Footer />
        </div>
      </div>

      <div className="hidden lg:block">
        <FooterNav />
      </div>
    </div>
  );
};

export default DateRange;
