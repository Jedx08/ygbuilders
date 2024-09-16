import logo from "../media/YG_LOGO.png";
import { Link } from "react-router-dom";
import { BiLogIn } from "react-icons/bi";

const Navbar = () => {
  return (
    <>
      <div className="font-pops overflow-auto">
        <div className="flex justify-between p-2 px-10 mmd:px-2 mmd:bg-dark mmd:bg-opacity-75">
          <Link to="Login">
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
                <Link to="Login">
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
