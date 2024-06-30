import logo from "../media/sample-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import {
  faHouse,
  faChartLine,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const logout = useLogout();

  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div className="flex justify-between p-2 font-pops">
        <div className="border rounded-[50%] overflow-hidden grid place-items-center">
          <Link to="/">
            <img src={logo} className="w-12" />
          </Link>
        </div>
        <div className="grid place-items-center">
          <ul className="flex space-x-3 items-center">
            <li>
              <Link to="/">
                <div className="flex space-x-1">
                  <FontAwesomeIcon
                    icon={faHouse}
                    className="text-2xl text-greens hover:text-lgreens"
                  />
                  <p className="font-extrabold text-lgreens hover:text-greens">
                    Home
                  </p>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/summary">
                <div className="flex space-x-1">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="text-2xl text-oranges hover:text-loranges"
                  />
                  <p className="font-extrabold text-loranges hover:text-oranges">
                    Summary
                  </p>
                </div>
              </Link>
            </li>
            <li>
              <div>
                <button onClick={signOut}>
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="text-3xl text-[#9F9F9F]"
                  />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
