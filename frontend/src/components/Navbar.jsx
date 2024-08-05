import logo from "../media/sample-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { faHouse, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { IoClose } from "react-icons/io5";
import { FaGear } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaAngleDown } from "react-icons/fa";
import useLogout from "../hooks/useLogout";
import { useContext, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";

const Navbar = () => {
  const { inMobile } = useContext(CalendarContext);

  const logout = useLogout();

  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const [isBurger, setIsBurger] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  return (
    <>
      {inMobile ? (
        <>
          <div className="font-pops overflow-auto shadow-lg">
            <div className="flex justify-between pl-1 pr-4 py-1 items-center">
              <div className="border rounded-[50%] overflow-hidden grid place-items-center">
                <Link to="/">
                  <img src={logo} className="w-12" />
                </Link>
              </div>
              <div
                onClick={() => {
                  setIsBurger(true);
                }}
                className="flex justify-end cursor-pointer p-2 hover:border hover:border-light hover:bg-[#2222] hover:rounded-[50%]"
              >
                <GiHamburgerMenu className="text-3xl" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="font-pops overflow-auto shadow-lg">
            <div className="flex justify-between p-2">
              <div className="border rounded-[50%] overflow-hidden grid place-items-center">
                <Link to="/">
                  <img src={logo} className="w-12" />
                </Link>
              </div>
              <div className="grid place-items-center">
                <ul className="flex space-x-4 items-center">
                  <li>
                    <Link to="/">
                      <div className="flex space-x-1 items-center">
                        <GoHomeFill className="text-2xl text-greens hover:text-lgreens" />
                        <p className="font-bold text-lg text-lgreens hover:text-greens">
                          Home
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/summary" state={{ from: location.pathname }}>
                      <div className="flex space-x-1 items-center">
                        <FaChartLine className="text-2xl text-oranges hover:text-loranges" />
                        <p className="font-bold text-lg text-loranges hover:text-oranges">
                          Summary
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <div>
                      <div
                        onClick={() => {
                          if (accountMenu) {
                            setAccountMenu(false);
                          } else {
                            setAccountMenu(true);
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="text-3xl text-[#9F9F9F] cursor-pointer"
                        />
                        <div className="absolute cursor-pointer right-1 top-7 border-2 border-white bg-[#9F9F9F] rounded-[50%]">
                          <FaAngleDown className="text-base text-white" />
                        </div>
                      </div>
                      {/* Dropdown */}
                      {accountMenu && (
                        <div className="absolute right-2 px-2 py-2 border border-[#2222] bg-white shadow-lg rounded-md mt-2 text-lg font-semibold space-y-2">
                          <div className="flex items-center space-x-2 cursor-pointer hover:text-[#399CB4]">
                            <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                              <FaGear className="text-xl text-[#399CB4]" />
                            </div>
                            <div className="text-base font-semibold">
                              Settings
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 cursor-pointer hover:text-[red]">
                            <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                              <BiLogOut className="text-xl text-[red]" />
                            </div>
                            <div
                              onClick={signOut}
                              className="text-base font-semibold"
                            >
                              logout
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {isBurger && (
        <>
          <div className="font-pops h-s100 w-full fixed left-0 top-0 bg-light bg-opacity-70 rounded-lg">
            <div className="px-4 py-4 overflow-auto shadow-lg bg-white">
              <div
                onClick={() => {
                  setIsBurger(false);
                }}
                className="flex flex-col items-end"
              >
                <div className="cursor-pointer w-fit hover:border hover:border-light hover:bg-[#2222] hover:rounded-[50%]">
                  <IoClose className="text-4xl font-bold" />
                </div>
              </div>
              <div className="grid grid-rows-4 justify-center items-center mt-5">
                {/* Home */}
                <Link to="/">
                  <div className="py-1 row-span-1 flex space-x-3 items-center cursor-pointer hover:text-lgreens">
                    <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                      <GoHomeFill className="text-2xl text-greens" />
                    </div>
                    <div className="text-lg font-semibold">Home</div>
                  </div>
                </Link>
                {/* Summary */}
                <Link to="/summary">
                  <div className="py-1 row-span-1 flex space-x-3 items-center cursor-pointer hover:text-loranges">
                    <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                      <FaChartLine className="text-2xl text-oranges" />
                    </div>
                    <div className="text-lg font-semibold">Summary</div>
                  </div>
                </Link>
                {/* Settings */}
                <Link>
                  <div className="py-1 row-span-1 flex space-x-3 items-center cursor-pointer hover:text-[#399CB4]">
                    <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                      <FaGear className="text-2xl text-[#399CB4]" />
                    </div>
                    <div className="text-lg font-semibold">Settings</div>
                  </div>
                </Link>
                {/* Logout */}
                <div
                  onClick={signOut}
                  className="py-1 row-span-1 flex space-x-3 items-center cursor-pointer hover:text-[red]"
                >
                  <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                    <BiLogOut className="text-2xl text-[red]" />
                  </div>
                  <div className="text-lg font-semibold">Logout</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
