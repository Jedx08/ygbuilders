import icon from "../media/404.png";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-s100 bg-gradient-to-b from-[#000000] via-[#313131] to-[#3e3e3e]">
      <div className="justify-center items-center flex flex-col">
        <div className="mt-60">
          <img src={icon} className="w-60" />
        </div>
        <div className="font-bold text-3xl mt-5 text-white">
          404 - Page not found
        </div>
        <div className="text-sm font-medium mt-2 text-[gray]">
          The page you are looking for doesn’t exist
        </div>
        <Link to="/home">
          <div className="w-fit cursor-pointer text-[#f0eded] text-lg bg-oranges hover:bg-loranges px-3 py-1 rounded-md font-semibold mt-5">
            Back to Home
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
