import { useNavigate, Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";
import useLogout from "../hooks/useLogout";
import { useContext, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAuth from "../hooks/useAuth";
import avatar1 from "../media/avatar1.png";
import avatar2 from "../media/avatar2.png";
import avatar3 from "../media/avatar3.png";
import { BiLogIn } from "react-icons/bi";

const Navbar = () => {
  const { loggedIn } = useContext(CalendarContext);
  const { userInfo } = useAuth();

  const logout = useLogout();

  // const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    location.reload();
    // navigate("/login") uncomment after ads added
  };

  const [accountMenu, setAccountMenu] = useState(false);

  function getAvatar(value) {
    if (value === "avatar1") {
      return avatar1;
    }

    if (value === "avatar2") {
      return avatar2;
    }

    if (value === "avatar3") {
      return avatar3;
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <div className="font-pops z-0">
        <div className="bg-white shadow-sm flex justify-end px-2 py-2 pl-2">
          <div>
            {loggedIn ? (
              <>
                <div
                  onClick={() => {
                    if (accountMenu) {
                      setAccountMenu(false);
                    } else {
                      setAccountMenu(true);
                    }
                  }}
                  className="cursor-pointer flex items-center space-x-1 pr-3"
                >
                  <p className="font-medium">
                    {capitalizeFirstLetter(userInfo.foundUsername)}
                  </p>
                  <div className="w-fit bg-[#c3c3c3] pt-[2px] rounded-full overflow-hidden">
                    <img
                      src={getAvatar(userInfo.avatar)}
                      alt="logo"
                      className="w-9"
                    />
                  </div>
                  <div className="absolute w-fit right-4 top-8 border-2 border-white bg-oranges rounded-full">
                    <FaAngleDown className="text-sm text-white" />
                  </div>
                </div>
                {/* Dropdown */}
                {accountMenu && (
                  <div className="absolute right-2 px-2 py-2 border border-[#2222] bg-white shadow-lg rounded-md mt-2 text-lg font-semibold space-y-2">
                    <Link to="/settings">
                      <div className="flex items-center space-x-2 cursor-pointer hover:text-[#1877f2]">
                        <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                          <FaGear className="text-xl text-[#1877f2]" />
                        </div>

                        <div className="text-base font-semibold">Settings</div>
                      </div>
                    </Link>
                    <div
                      onClick={signOut}
                      className="flex items-center space-x-2 cursor-pointer hover:text-[red]"
                    >
                      <div className="border border-light bg-[#2222] p-2 rounded-[50%]">
                        <BiLogOut className="text-xl text-[red]" />
                      </div>
                      <div className="text-base font-semibold">logout</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <div className="flex space-x-1 items-center hover:text-lgreens">
                  <BiLogIn className="text-3xl text-greens hover:text-lgreens" />
                  <p className="font-bold text-lg text-lgreens hover:text-greens">
                    Login
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
