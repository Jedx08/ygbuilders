import logo from "../media/YG_LOGO.png";
import { Link } from "react-router-dom";
import { BiLogIn } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { FaAddressBook } from "react-icons/fa6";

const Navbar = () => {
  return (
    <>
      <div className="font-pops overflow-auto">
        <div className="flex flex-wrap justify-between p-2 px-10 gap-2 mmd:px-2 mmd:bg-dark mmd:bg-opacity-75 ssm:justify-center">
          <Link to="/">
            <div className="flex items-center gap-4">
              <div className="rounded-[50%] overflow-hidden grid place-items-center">
                <img src={logo} className="w-12" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-greens">Your</span>{" "}
                <span className="text-oranges">Gross</span>
              </span>
            </div>
          </Link>

          <div className="grid place-items-center">
            <ul className="flex space-x-4 items-center">
              <li>
                <Link to="/home">
                  <div className="flex space-x-1 items-center text-white hover:text-lgreens">
                    <GoHomeFill className="text-3xl" />
                    <p className="font-bold text-lg">Home</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="login" state={{ toReg: "register" }}>
                  <div className="flex space-x-1 items-center text-white hover:text-lgreens">
                    <FaAddressBook className="text-2xl" />
                    <p className="font-bold text-lg">Register</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="login" state={{ toReg: "login" }}>
                  <div className="flex space-x-1 items-center text-white hover:text-lgreens">
                    <BiLogIn className="text-3xl" />
                    <p className="font-bold text-lg">Login</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
