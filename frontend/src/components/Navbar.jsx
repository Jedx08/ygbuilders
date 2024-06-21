import logo from "../media/sample-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartLine,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <>
      <div className="flex justify-between p-2">
        <div className="border rounded-[50%] overflow-hidden grid place-items-center">
          <img src={logo} className="w-12" />
        </div>
        <div className="grid place-items-center">
          <ul className="flex space-x-3 items-center">
            <li>
              <div className="flex space-x-1">
                <FontAwesomeIcon
                  icon={faHouse}
                  className="text-2xl text-greens"
                />
                <p className="font-extrabold text-lgreens">Home</p>
              </div>
            </li>
            <li>
              <div className="flex space-x-1">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-2xl text-oranges"
                />
                <p className="font-extrabold text-loranges">Summary</p>
              </div>
            </li>
            <li>
              <div>
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-3xl text-[#9F9F9F]"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
