import { FaChartLine } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const FooterNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 bg-white w-full pt-2">
      <div className="flex justify-between gap-7 w-full px-20 sm:px-10 xs:px-5">
        <Link to="/summary" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
              location.pathname === "/summary" ? "bg-light" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaChartLine className="text-xl text-[#b8b8b8]" />
            </div>
            <p className="text-sm">Dashboard</p>
          </div>
        </Link>
        <Link to="/calendar" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
              location.pathname === "/calendar" ? "bg-light" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaCalendarAlt className="text-xl text-[#b8b8b8]" />
            </div>
            <p className="text-sm">Calendar</p>
          </div>
        </Link>
        <Link to="/settings" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
              location.pathname === "/settings" ? "bg-light" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaGear className="text-xl text-[#b8b8b8]" />
            </div>
            <p className="text-sm">Settings</p>
          </div>
        </Link>
        <Link to="/filter" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
              location.pathname === "/filter" ? "bg-light" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaFilter className="text-xl text-[#b8b8b8]" />
            </div>
            <p className="text-sm">Filter</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FooterNav;
