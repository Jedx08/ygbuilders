import { FaChartLine } from "react-icons/fa";
import { FaPiggyBank } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { GrLineChart } from "react-icons/gr";
import { GiReceiveMoney } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";

const FooterNav = () => {
  const location = useLocation();

  return (
    <div className="font-pops fixed bottom-0 bg-white w-full border-t border-[#ebebeb]">
      <div className="flex justify-between w-full ">
        <Link to="/dashboard" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light cursor-pointer ${
              location.pathname === "/dashboard" ? "bg-subCon text-oranges" : ""
            }`}
          >
            <div className="flex justify-center">
              <GrLineChart
                className={`text-xl ${
                  location.pathname === "/dashboard"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
            </div>
            <p className="text-sm font-medium">Dashboard</p>
          </div>
        </Link>
        <Link to="/income" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light cursor-pointer ${
              location.pathname === "/income" ? "bg-subCon text-oranges" : ""
            }`}
          >
            <div className="flex justify-center">
              <GiReceiveMoney
                className={`text-xl ${
                  location.pathname === "/income"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
            </div>
            <p className="text-sm font-medium">Income</p>
          </div>
        </Link>
        <Link to="/savings" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light cursor-pointer ${
              location.pathname === "/savings" ? "bg-subCon text-oranges" : ""
            }`}
          >
            <div className="flex justify-center">
              <MdSavings
                className={`text-2xl ${
                  location.pathname === "/savings"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
            </div>
            <p className="text-sm font-medium">Savings</p>
          </div>
        </Link>
        <Link to="/filter" className="w-full">
          <div
            className={`flex flex-col items-center p-2 gap-2 hover:bg-light cursor-pointer ${
              location.pathname === "/filter" ? "bg-subCon text-oranges" : ""
            }`}
          >
            <div className="flex justify-center">
              <FaFilter
                className={`text-xl ${
                  location.pathname === "/filter"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
            </div>
            <p className="text-sm font-medium">Filter</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FooterNav;
