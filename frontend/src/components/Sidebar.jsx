import logo from "../media/YG_LOGO.png";
import { FaGear, FaPiggyBank } from "react-icons/fa6";
import { FaCalendarAlt, FaFilter, FaChartLine } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <div className="group bg-white poppins h-[100vh] w-fit flex flex-col p-5 sticky top-0 shadow-lg gap-10 xl:p-0 xl:hover:w-[230px] xl:fixed xl:left-0 transition-all duration-300 z-20">
        <div className="flex justify-center space-x-3 p-5">
          <img src={logo} className="w-12" />
          <div className="flex justify-center items-center space-x-1 xl:hidden ">
            <p className="text-greens text-2xl font-bold">Your</p>
            <p className="text-oranges text-2xl font-bold">Gross</p>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <Link to="/summary">
            <div
              className={`flex pl-7 p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
                location.pathname === "/summary" ? "bg-light" : ""
              }`}
            >
              <FaChartLine className="text-2xl text-[#b8b8b8]" />
              <p className="xl:hidden xl:group-hover:block">Dashboard</p>
            </div>
          </Link>
          <Link to="/calendar">
            <div
              className={`flex pl-7 p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
                location.pathname === "/calendar" ? "bg-light" : ""
              }`}
            >
              <FaCalendarAlt className="text-2xl text-[#b8b8b8]" />
              <p className="xl:hidden xl:group-hover:block">Calendar</p>
            </div>
          </Link>
          <Link to="/savings">
            <div
              className={`flex items-center pl-7 p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
                location.pathname === "/savings" ? "bg-light" : ""
              }`}
            >
              <FaPiggyBank className="text-3xl text-[#b8b8b8]" />
              <p className="xl:hidden xl:group-hover:block">Savings</p>
            </div>
          </Link>
          <Link to="/filter">
            <div
              className={`flex pl-7 p-2 gap-2 hover:bg-light rounded-md cursor-pointer ${
                location.pathname === "/filter" ? "bg-light" : ""
              }`}
            >
              <FaFilter className="text-2xl text-[#b8b8b8]" />
              <p className="xl:hidden xl:group-hover:block">Filter</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
