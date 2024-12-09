import { useContext, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import Navbar from "../components/Navbar";
import BusinessDateRange from "../components/Business/BusinessDateRange";
import PersonalDateRange from "../components/personal/PersonalDateRange";

const DateRange = () => {
  const { startDate, setStartDate, endDate, setEndDate } =
    useContext(CalendarContext);

  const [selectedView, setSelectedView] = useState(true);

  return (
    <>
      <Navbar />
      <div className="font-pops bg-light">
        <div className="flex justify-center items-center pt-10">
          <div className="w-[80%] bg-white rounded-lg flex justify-between py-3 px-5">
            <div className="flex space-x-5">
              <div className="flex justify-center items-center space-x-2">
                <p className="opacity-50">From:</p>
                <input
                  className="justify-center  cursor-pointer"
                  type="date"
                  id="start"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex justify-center items-center space-x-2">
                <p className="opacity-50">To:</p>
                <input
                  className="justify-center  cursor-pointer"
                  type="date"
                  id="end"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-5">
              <div
                onClick={() => {
                  setSelectedView(false);
                }}
                className={`cursor-pointer font-semibold hover:text-greens ${
                  selectedView ? "" : "text-greens"
                }`}
              >
                Personal
              </div>
              <div
                onClick={() => {
                  setSelectedView(true);
                }}
                className={`cursor-pointer font-semibold hover:text-oranges ${
                  selectedView ? "text-oranges" : ""
                }`}
              >
                Business
              </div>
            </div>
          </div>
        </div>
        {selectedView ? <BusinessDateRange /> : <PersonalDateRange />}
      </div>
    </>
  );
};

export default DateRange;
