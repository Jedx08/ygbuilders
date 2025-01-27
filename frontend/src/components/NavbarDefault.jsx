import { Link } from "react-router-dom";
import logo from "../media/YG_LOGO.png";
import { BiLogIn } from "react-icons/bi";

const NavbarDefault = () => {
  return (
    <div className="font-pops overflow-auto shadow-lg">
      <div className="flex justify-between items-center px-2 py-1 pl-2">
        <div>
          <Link to="/">
            <img src={logo} className="w-12" />
          </Link>
        </div>
        <div className="pr-3">
          <Link to="/Login">
            <div className="flex space-x-1 items-center hover:text-lgreens">
              <BiLogIn className="text-3xl text-greens hover:text-lgreens" />
              <p className="font-bold text-lg text-lgreens hover:text-greens">
                Login
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarDefault;
