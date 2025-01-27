import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../media/YG_LOGO.png";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ThreeDot, OrbitProgress } from "react-loading-indicators";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

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
        JSON.stringify({ username: username.toLowerCase(), password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const _id = response?.data?._id;
      const foundUsername = response?.data?.foundUsername;
      const email = response?.data?.email;
      const avatar = response?.data?.avatar;
      const instructions = response?.data?.instructions;
      const provider = response?.data?.provider;
      const personal_title = response?.data?.personal_title;
      const business_title = response?.data?.business_title;
      setAuth({ _id, accessToken });
      setUserInfo({
        avatar,
        instructions,
        foundUsername,
        email,
        provider,
        personal_title,
        business_title,
      });
      setUsername("");
      setPassword("");
      setSuccess("Success");
      navigate("/home");
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
  const userInput = (event) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setUsername(value);
    }
  };
  const passInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
  };

  return (
    <>
      <div className="">
        {/* logo */}
        <div
          className={`mt-10 mb-8 items-center flex justify-center gap-3 md:mb-0 ${
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

        {/* login input */}
        <div className="mt-10 min-h-[288px] flex justify-center items-center">
          {isLoading ? (
            <OrbitProgress
              dense
              color="#2ec4b6"
              size="small"
              text=""
              textColor=""
            />
          ) : (
            <section>
              <form onSubmit={handleSubmit}>
                <LoginSocialFacebook
                  appId="1272021290875971"
                  onResolve={async (fbresponse) => {
                    setIsLoading(true);

                    const result = await fbresponse.data;

                    if (!result) {
                      return setErrMsg("Login failed"), setIsLoading(false);
                    }

                    try {
                      const response = await axios.post(
                        "/auth/facebook",
                        JSON.stringify({
                          username: result.email,
                          email: result.email,
                          facebookId: result.id,
                          firstname: result.first_name,
                          lastname: result.last_name,
                          instructions: {
                            home: true,
                            calendarP: true,
                            calendarB: true,
                            summary: true,
                            savings: true,
                          },
                        }),
                        {
                          headers: { "Content-Type": "application/json" },
                          withCredentials: true,
                        }
                      );
                      if (response.status === 200) {
                        const accessToken = response?.data?.accessToken;
                        const _id = response?.data?._id;
                        const email = response?.data?.email;
                        const avatar = response?.data?.avatar;
                        const instructions = response?.data?.instructions;
                        const provider = response?.data?.provider;
                        const personal_title = response?.data?.personal_title;
                        const business_title = response?.data?.business_title;
                        setAuth({ _id, accessToken });
                        setUserInfo({
                          email,
                          avatar,
                          instructions,
                          provider,
                          personal_title,
                          business_title,
                        });
                        setSuccess("Success");
                        navigate("/home");
                      }
                    } catch (error) {
                      if (!error?.response) {
                        setErrMsg("Can't connect to the Server");
                        setIsLoading(false);
                      }
                      if (error.response?.status === 400) {
                        setErrMsg(error.response?.data.message);
                        setIsLoading(false);
                      } else if (error.response?.status === 401) {
                        setErrMsg(error.response?.data.message);
                        setIsLoading(false);
                      } else {
                        setErrMsg("Login Failed");
                        setIsLoading(false);
                      }
                    }
                  }}
                  onReject={(error) => {
                    if (error) {
                      setErrMsg("Login Failed");
                      setIsLoading(false);
                    }
                  }}
                >
                  <FacebookLoginButton
                    className="text-sm h-hfit py-1 mb-2 shadow-none"
                    iconSize={"20px"}
                  />
                </LoginSocialFacebook>

                <div className="text-sm font-medium text-center text-[#bbbbbb] py-1">
                  or
                </div>

                {/* Username Email */}
                <div>
                  <label htmlFor="username" className="text-sm">
                    Username or Email:
                  </label>
                  <div className="mb-2">
                    <input
                      type="text"
                      id="username"
                      onChange={userInput}
                      autoComplete="off"
                      value={username}
                      required
                      className={`border border-greens w-full rounded-md focus:outline-none py-1 pl-3 caret-greens placeholder:text-xs ${
                        inMobile ? "bg-[inherit]" : "md:bg-[inherit]"
                      }`}
                    />
                  </div>
                </div>
                {/* Password */}
                <div>
                  <label htmlFor="password" className="text-sm">
                    Password:
                  </label>
                  <div className="flex items-center justify-between md:justify-normal border border-greens rounded-md pl-3 pr-2">
                    <input
                      type={!showPassword ? "password" : "text"}
                      id="password"
                      onChange={passInput}
                      autoComplete="off"
                      value={password}
                      required
                      className={`rounded-md focus:outline-none focus:border-greens py-1 caret-greens placeholder:text-xs  ${
                        inMobile
                          ? "bg-[inherit] w-full"
                          : "md:bg-[inherit] md: w-full md:w-full"
                      }`}
                    />
                    {password ? (
                      <>
                        {!showPassword ? (
                          <FaRegEyeSlash
                            onClick={() => {
                              setShowPassword(true);
                            }}
                            className={`cursor-pointer`}
                          />
                        ) : (
                          <FaRegEye
                            onClick={() => {
                              setShowPassword(false);
                            }}
                            className={`cursor-pointer`}
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
                      inMobile ? "font-medium" : "md:font-medium"
                    }`}
                  >
                    {errMsg}
                  </p>
                )}
                {success && (
                  <p
                    className={`text-xs font-light text-greens text-center mt-2 ${
                      inMobile ? "font-medium" : "md:font-medium"
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
                    <Link to="/forgot-password">
                      <p className="text-sm hover:text-[#1877f2] hover:underline">
                        Forgot password?
                      </p>
                    </Link>
                  </div>
                </div>
              </form>
            </section>
          )}
        </div>

        {/* to register page */}
        <div
          className={`mt-10 flex flex-col items-center ${
            inMobile ? "mt-5" : "md:mt-5"
          }`}
        >
          <div className="mb-2 flex flex-wrap items-center justify-center text-sm gap-1">
            <p className="">New to YourGross?</p>
            <div
              onClick={() => {
                setUsername("");
                setPassword("");
                next();
              }}
              className="text-oranges hover:text-loranges font-semibold underline cursor-pointer"
            >
              Register
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
