import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../media/YG_LOGO.png";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";

const LOGIN_URL = "/login";

const LoginForm = ({ next, inMobile }) => {
  const { setAuth, setUserInfo } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const _id = response?.data?._id;
      const useremail = response?.data?.useremail;
      const avatar = response?.data?.avatar;
      setAuth({ _id, accessToken, useremail });
      setUserInfo({ avatar });
      setUsername("");
      setPassword("");
      setSuccess("Success");
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Can't connect to the Server");
        setIsLoading(false);
      } else if (err.response?.status === 400) {
        setErrMsg("Username and Password are required");
        setIsLoading(false);
      } else if (err.response?.status === 401) {
        setErrMsg(
          "Your login credentials don't match an account in our system"
        );
        setIsLoading(false);
      } else {
        setErrMsg("Login Failed");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className={`mt-16 md:mt-10 items-center flex justify-center gap-3 ${
          inMobile ? "xs:gap-1" : ""
        }`}
      >
        <img src={logo} className="w-14" />
        <h1
          className={`font-extrabold text-3xl text-greens ${
            inMobile ? "" : "hidden md:block"
          }`}
        >
          Your <span className="text-oranges">Gross</span>
        </h1>
      </div>
      <div className="mt-5">
        <section>
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className={`text-sm ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
                Username or Email:
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  value={username}
                  required
                  className={`border border-inputLight w-full rounded-md focus:outline-none focus:border-greens py-1 pl-3 caret-greens placeholder:text-xs ${
                    inMobile
                      ? "bg-[inherit] text-white"
                      : "md:bg-[inherit] md:text-white"
                  }`}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className={`text-sm ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
                Password:
              </label>
              <div className="flex items-center justify-between md:justify-normal border border-inputLight rounded-md pl-3 pr-2">
                <input
                  type={!showPassword ? "password" : "text"}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  value={password}
                  required
                  className={`rounded-md focus:outline-none focus:border-greens py-1 caret-greens placeholder:text-xs  ${
                    inMobile
                      ? "bg-[inherit] text-white w-full"
                      : "md:bg-[inherit] md:text-white w-full md:w-full"
                  }`}
                />
                {password ? (
                  <>
                    {!showPassword ? (
                      <FaRegEyeSlash
                        onClick={() => {
                          setShowPassword(true);
                        }}
                        className={`cursor-pointer ${
                          inMobile ? "text-white" : "md:text-white"
                        }`}
                      />
                    ) : (
                      <FaRegEye
                        onClick={() => {
                          setShowPassword(false);
                        }}
                        className={`cursor-pointer ${
                          inMobile ? "text-white" : "md:text-white"
                        }`}
                      />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {errMsg && (
              <p
                className={`text-xs font-light text-[red] text-center mt-2 ${
                  inMobile
                    ? "text-white font-medium"
                    : "md:text-white md:font-medium"
                }`}
              >
                {errMsg}
              </p>
            )}
            {success && (
              <p
                className={`text-xs font-light text-greens text-center mt-2 ${
                  inMobile
                    ? "text-white font-medium"
                    : "md:text-white md:font-medium"
                }`}
              >
                {success}
              </p>
            )}

            <div className="flex flex-col items-center mt-5 mb-5">
              <div className="mb-2">
                {isLoading ? (
                  <div className="mx-auto py-1 rounded-md px-6 bg-lgreens font-bold text-white">
                    <ThreeDot color="#ffffff" style={{ fontSize: "8px" }} />
                  </div>
                ) : (
                  <button className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white hover:bg-lgreens">
                    Sign In
                  </button>
                )}
              </div>
              <div>
                <p
                  className={`text-sm ${
                    inMobile ? "text-white" : "md:text-white"
                  }`}
                >
                  Forgot Password?
                </p>
              </div>
            </div>
          </form>
        </section>
      </div>

      <hr className="text-inputLight" />

      <div
        className={`mt-10 flex flex-col items-center ${
          inMobile ? "mt-5" : "md:mt-5"
        }`}
      >
        <div className="mb-2">
          <p className={`text-sm ${inMobile ? "text-white" : "md:text-white"}`}>
            New to YourGross?
          </p>
        </div>
        <div className="mb-5">
          <button
            className="bg-oranges py-1 px-6 rounded-md font-bold text-white hover:bg-loranges"
            onClick={() => {
              setUsername("");
              setPassword("");
              next();
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
