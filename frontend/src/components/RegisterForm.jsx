import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

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
    if (!validUsername) {
      return setErrMsg("Username must valid");
    }
    if (!validEmail) {
      return setErrMsg("Email must valid");
    }
    if (!validPassword) {
      return setErrMsg("Password must valid");
    }
    if (!validMatch) {
      return setErrMsg("Password does not match");
    }

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username,
          email,
          password,
          avatar: "avatar1",
          instructions: {
            home: true,
            calendarP: true,
            calendarB: true,
            summary: true,
          },
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = await response?.data?.accessToken;
      const _id = await response?.data?._id;
      const useremail = await response?.data?.useremail;
      const avatar = await response?.data?.avatar;
      setAuth({ _id, accessToken, useremail });
      setUserInfo({ avatar });
      setSuccess("Success");
      setUsername("");
      setEmail("");
      setPassword("");
      setMatchPassword("");
      setSuccess(false);
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Can't connect to the Server");
      } else if (err.response?.status === 409) {
        setErrMsg(err.response?.data.message);
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };

  return (
    <>
      <div className="mt-5">
        <h1
          className={`font-bold text-4xl mb-5 ${
            inMobile ? "text-white" : "md:text-white"
          }`}
        >
          Sign Up
        </h1>
        <section>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label
                htmlFor="register_username"
                className={`${
                  inMobile
                    ? "text-sm flex text-white"
                    : "text-sm flex md:text-white"
                }`}
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
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  aria-invalid={validUsername ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUsernameFocus(true)}
                  onBlur={() => setUsernameFocus(false)}
                  className={`border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2  ${
                    inMobile
                      ? "bg-[inherit] text-white"
                      : "md:bg-[inherit] md:text-white"
                  }`}
                />
                <p
                  id="uidnote"
                  className={`text-xs bg-loranges p-2 rounded-md ${
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
              <label
                htmlFor="register_username"
                className={`text-sm flex  ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className={`border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2 ${
                    inMobile
                      ? "bg-[inherit] text-white"
                      : "md:bg-[inherit] md:text-white"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register_password"
                className={`text-sm flex ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
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
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className={`rounded-md w-full focus:outline-none focus:border-oranges py-1 caret-oranges ${
                    inMobile
                      ? "bg-[inherit] text-white"
                      : "md:bg-[inherit] md:text-white md:w-full"
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
              <div>
                <p
                  id="pwdnote"
                  className={`text-xs bg-loranges p-2 rounded-md shadow-lg ${
                    inMobile ? "text-white" : "md:text-white"
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
              <label
                htmlFor="confirm-password"
                className={`text-sm flex ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
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
                  onChange={(e) => setMatchPassword(e.target.value)}
                  value={matchPassword}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className={`border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 caret-oranges ${
                    inMobile
                      ? "bg-[inherit] text-white"
                      : "md:bg-[inherit] md:text-white"
                  }`}
                />
                {matchPassword ? (
                  <>
                    {!showMatchPassword ? (
                      <FaRegEyeSlash
                        onClick={() => {
                          setShowMatchPassword(true);
                        }}
                        className={`cursor-pointer ${
                          inMobile ? "text-white" : "md:text-white"
                        }`}
                      />
                    ) : (
                      <FaRegEye
                        onClick={() => {
                          setShowMatchPassword(false);
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
              <div>
                <p
                  id="confirmnote"
                  className={`text-xs bg-loranges p-2 rounded-md shadow-lg ${
                    inMobile ? "text-white" : "md:text-white"
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
                className={`text-xs text-semibold text-[red] text-center mt-2 flex justify-center items-center  ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
                {errMsg}
              </p>
            )}
            {success && (
              <p
                className={`text-xs text-semibold text-greens text-center mt-2 flex justify-center items-center ${
                  inMobile ? "text-white" : "md:text-white"
                }`}
              >
                {success}
              </p>
            )}
            <div className="flex flex-col items-center mt-5 mb-5">
              <button
                type="submit"
                className="mx-auto bg-oranges py-1 px-6 rounded-md font-bold text-white hover:bg-loranges"
              >
                Register
              </button>
            </div>
          </form>
        </section>
      </div>

      <hr className="text-inputLight" />

      <div className="flex flex-col items-center mt-5 mb-5 md:mt-2">
        <p className="text-sm md:text-white">Already have an account?</p>
        <button
          className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white mt-2 hover:bg-lgreens"
          onClick={() => {
            setUsername("");
            setPassword("");
            setMatchPassword("");
            setEmail("");
            setSuccess(false);
            previous();
          }}
        >
          Sign In
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
