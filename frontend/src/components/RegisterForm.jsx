import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = "/register";

const RegisterForm = ({ previous, inMobile }) => {
  const navigate = useNavigate();

  const { setAuth, setUserInfo } = useAuth();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showMatchPassword, setShowMatchPassword] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [username, email, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validUsername) {
      return setErrMsg("Username must be valid"), setIsLoading(false);
    }
    if (!validEmail) {
      return setErrMsg("Email must be valid"), setIsLoading(false);
    }
    if (!validPassword) {
      return setErrMsg("Password must be valid"), setIsLoading(false);
    }
    if (!validMatch) {
      return setErrMsg("Password does not match"), setIsLoading(false);
    }

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password,
          avatar: "avatar1",
          instructions: {
            dashboard: true,
            income: true,
            savings: true,
            filter: true,
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = await response?.data?.accessToken;
      const _id = await response?.data?._id;
      const foundUsername = await response?.data?.foundUsername;
      const getEmail = await response?.data?.email;
      const avatar = await response?.data?.avatar;
      const instructions = await response?.data?.instructions;
      const provider = await response?.data?.provider;
      const personal_title = response?.data?.personal_title;
      const business_title = response?.data?.business_title;
      setAuth({ _id, accessToken });
      setUserInfo({
        avatar,
        instructions,
        provider,
        foundUsername,
        email: getEmail,
        personal_title,
        business_title,
      });
      setSuccess("Success");
      setUsername("");
      setEmail("");
      setPassword("");
      setMatchPassword("");
      setSuccess(false);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Can't connect to the Server");
        setIsLoading(false);
      } else if (err.response?.status === 409) {
        setErrMsg(err.response?.data.message);
        setIsLoading(false);
      } else {
        setErrMsg("Registration Failed");
        setIsLoading(false);
      }
    }
  };

  // username length validation
  const userInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setUsername(value);
    }
  };
  // email length validation
  const emailInput = (event) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setEmail(value);
    }
  };
  // password length validation
  const passInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
  };
  // confirm password length validation
  const confirmPassInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setMatchPassword(value);
    }
  };

  return (
    <>
      <div className="mt-10">
        <h1 className={`font-bold text-4xl mb-5 text-oranges`}>Sign Up</h1>
        <section>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label
                htmlFor="register_username"
                className={`${inMobile ? "text-sm flex" : "text-sm flex"}`}
              >
                Username:
                <FaCheck
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validUsername ? "valid" : "hidden"
                  }`}
                />
                <FaXmark
                  className={`ml-1 text-lg text-[red] font-bold mb-[-2px] ${
                    validUsername || !username ? "hidden" : "invalid"
                  }`}
                />
              </label>
              <div>
                <input
                  type="text"
                  id="register_username"
                  autoComplete="off"
                  onChange={userInput}
                  value={username}
                  required
                  aria-invalid={validUsername ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                  className={`border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2`}
                />
                <p
                  id="uidnote"
                  className={`text-xs bg-loranges p-2 rounded-md text-white ${
                    usernameFocus && username && !validUsername
                      ? "absolute"
                      : "hidden"
                  }`}
                >
                  <span className="flex items-center">
                    <FaInfoCircle className="mr-1" />4 to 24 characters.
                  </span>
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register_username" className={`text-sm flex`}>
                Email:
                <FaCheck
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validEmail ? "valid" : "hidden"
                  }`}
                />
                <FaXmark
                  className={`ml-1 text-lg text-[red] font-bold mb-[-2px] ${
                    validEmail || !email ? "hidden" : "invalid"
                  }`}
                />
              </label>
              <div>
                <input
                  type="email"
                  autoComplete="off"
                  onChange={emailInput}
                  value={email}
                  required
                  className={`border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register_password" className={`text-sm flex`}>
                Password:
                <FaCheck
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validPassword ? "valid" : "hidden"
                  }`}
                />
                <FaXmark
                  className={`ml-1 text-lg text-[red] font-bold mb-[-2px] ${
                    validPassword || !password ? "hidden" : "invalid"
                  }`}
                />
              </label>
              <div className="flex items-center justify-between md:justify-normal border border-inputLight rounded-md pl-3 pr-2 mb-2">
                <input
                  type={!showPassword ? "password" : "text"}
                  id="register_password"
                  onChange={passInput}
                  value={password}
                  required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className={`rounded-md w-full focus:outline-none focus:border-oranges py-1 caret-oranges`}
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
              <div>
                <p
                  id="pwdnote"
                  className={`text-xs bg-loranges p-2 rounded-md shadow-lg ${
                    inMobile ? "text-white" : "text-white"
                  } ${passwordFocus && !validPassword ? "absolute" : "hidden"}`}
                >
                  <span className="flex items-center">
                    <FaInfoCircle className="mr-1" />8 to 24 characters.
                  </span>
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className={`text-sm flex`}>
                Confirm Password:
                <FaCheck
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validMatch && matchPassword ? "valid" : "hidden"
                  }`}
                />
                <FaXmark
                  className={`ml-1 text-lg text-[red] font-bold mb-[-2px] ${
                    validMatch || !matchPassword ? "hidden" : "invalid"
                  }`}
                />
              </label>
              <div className="flex items-center justify-between md:justify-normal border border-inputLight rounded-md pl-3 pr-2 mb-2">
                <input
                  type={!showMatchPassword ? "password" : "text"}
                  id="confirm-password"
                  onChange={confirmPassInput}
                  value={matchPassword}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className={`border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 caret-oranges`}
                />
                {matchPassword ? (
                  <>
                    {!showMatchPassword ? (
                      <FaRegEyeSlash
                        onClick={() => {
                          setShowMatchPassword(true);
                        }}
                        className={`cursor-pointer`}
                      />
                    ) : (
                      <FaRegEye
                        onClick={() => {
                          setShowMatchPassword(false);
                        }}
                        className={`cursor-pointer`}
                      />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <p
                  id="confirmnote"
                  className={`text-xs bg-loranges p-2 rounded-md shadow-lg ${
                    inMobile ? "text-white" : "text-white"
                  } ${matchFocus && !validMatch ? "absolute" : "hidden"}`}
                >
                  <span className="flex items-center">
                    <FaInfoCircle className="mr-1" />
                    Must match the first
                  </span>
                  password input field.
                </p>
              </div>
            </div>
            {errMsg && (
              <p
                className={`text-xs text-semibold text-[red] text-center mt-2 flex justify-center items-center`}
              >
                {errMsg}
              </p>
            )}
            {success && (
              <p
                className={`text-xs text-semibold text-greens text-center mt-2 flex justify-center items-center`}
              >
                {success}
              </p>
            )}
            <div className="flex flex-col items-center mt-5 mb-5">
              {isLoading ? (
                <div className="mx-auto py-1 rounded-md px-6 bg-loranges font-bold text-white">
                  <ThreeDot color="#ffffff" style={{ fontSize: "8px" }} />
                </div>
              ) : (
                <>
                  <div className="w-full flex justify-center items-start text-xs gap-2 mb-2">
                    <span className="pt-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setIsChecked(e.target.checked);
                        }}
                      />
                    </span>
                    <p>
                      By checking this button, you agree to our{" "}
                      <Link to="/terms-of-use" target="_blank">
                        <span className="text-oranges underline font-medium">
                          Terms
                        </span>
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy-policy" target="_blank">
                        <span className="text-oranges underline font-medium">
                          Privacy Policy
                        </span>
                      </Link>{" "}
                    </p>
                  </div>
                  {isChecked ? (
                    <button
                      type="submit"
                      className="mx-auto bg-oranges py-1 px-6 rounded-md font-bold text-white hover:bg-loranges"
                    >
                      Register
                    </button>
                  ) : (
                    <button
                      disabled={!isChecked}
                      type="submit"
                      className="mx-auto bg-[#d1d1d1] py-1 px-6 rounded-md font-bold text-white"
                    >
                      Register
                    </button>
                  )}
                </>
                // <div className="mx-auto bg-oranges py-1 px-6 rounded-md font-bold text-white hover:bg-loranges cursor-not-allowed">
                //   Register
                // </div>
              )}
            </div>
          </form>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-1 justify-center mt-5 mb-5 md:mt-2">
        <p className="text-sm">Already have an account?</p>
        <div
          onClick={() => {
            setUsername("");
            setPassword("");
            setMatchPassword("");
            setEmail("");
            setSuccess(false);
            previous();
          }}
          className="text-greens hover:text-lgreens text-base font-semibold underline cursor-pointer"
        >
          Sign in
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
