import logo from "../media/YG_LOGO.png";
import { MdSavings } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { GrLineChart } from "react-icons/gr";
import { GiReceiveMoney } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <div className="group bg-white font-pops h-[100vh] w-fit flex flex-col border-r border-[#ebebeb] py-5 px-[1px] sticky top-0 shadow-lg gap-10 xl:p-0 xl:hover:w-[230px] xl:fixed xl:left-0 transition-all duration-300 z-20">
        <Link to="/">
          <div className="flex items-center justify-center space-x-2 p-5">
            <img src={logo} className="w-12" />
            <div className=" xl:hidden ">
              <p className="text-greens text-2xl font-bold">
                Your
                <span className="text-oranges text-2xl font-bold">Gross</span>
              </p>
            </div>
          </div>
        </Link>

        <div className="flex flex-col space-y-[1px]">
          <Link to="/dashboard">
            <div
              className={`flex pl-7 px-2 py-5 space-x-3 h-hfit hover:bg-light rounded-sm cursor-pointer ${
                location.pathname === "/dashboard"
                  ? "bg-subCon text-oranges"
                  : ""
              }`}
            >
              <GrLineChart
                className={`text-2xl ${
                  location.pathname === "/dashboard"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
              <p className="xl:hidden xl:group-hover:block font-medium">
                Dashboard
              </p>
            </div>
          </Link>
          <Link to="/income">
            <div
              className={`flex items-center pl-7 px-2 py-5 space-x-3 hover:bg-light rounded-sm cursor-pointer ${
                location.pathname === "/income" ? "bg-subCon text-oranges" : ""
              }`}
            >
              <GiReceiveMoney
                className={`text-3xl ${
                  location.pathname === "/income"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
              <p className="xl:hidden xl:group-hover:block font-medium">
                Income
              </p>
            </div>
          </Link>
          <Link to="/savings">
            <div
              className={`flex items-center pl-7 px-2 py-5 space-x-3 hover:bg-light rounded-sm cursor-pointer ${
                location.pathname === "/savings" ? "bg-subCon text-oranges" : ""
              }`}
            >
              <MdSavings
                className={`text-3xl ${
                  location.pathname === "/savings"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
              <p className="xl:hidden xl:group-hover:block font-medium">
                Savings
              </p>
            </div>
          </Link>
          <Link to="/filter">
            <div
              className={`flex pl-7 px-2 py-5 space-x-3 hover:bg-light rounded-sm cursor-pointer ${
                location.pathname === "/filter" ? "bg-subCon text-oranges" : ""
              }`}
            >
              <FaFilter
                className={`text-2xl ${
                  location.pathname === "/filter"
                    ? "text-loranges"
                    : "text-[#b8b8b8]"
                }`}
              />
              <p className="xl:hidden xl:group-hover:block font-medium">
                Filter
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
