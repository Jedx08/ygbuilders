import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import logo from "../media/YG_LOGO.png";
import dayMsg from "../data/data";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        if (err.response.status === 403) {
          console.log("Please Login");
        } else if (err.response.status === 401) {
          console.log("Please Login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  function getRandomIndex(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex].message;
  }

  const randomMsg = getRandomIndex(dayMsg);

  return (
    <>
      {isLoading ? (
        <div className="bg-light flex flex-col items-center justify-center bg-opacity-70 h-s100 w-full font-pops">
          <img
            src={logo}
            alt="logo"
            className="w-28 shadow-lg rounded-full mx-auto"
          />
          <p className="mx-auto max-w-[436px] mt-2 text-base font-medium text-center">
            {randomMsg}
          </p>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
