import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

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

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center bg-light bg-opacity-70  h-s100 w-full">
          <></>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
