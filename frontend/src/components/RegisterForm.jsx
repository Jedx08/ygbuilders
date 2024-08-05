import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faTimes,
  faExclamation,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const RegisterForm = ({ previous }) => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validUsername) {
      return setErrMsg("Username must valid");
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
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      setAuth({ username, accessToken });
      setSuccess("Success");

      setTimeout(() => {
        setUsername("");
        setPassword("");
        setMatchPassword("");
        setSuccess(false);
        navigate("/home");
      }, 1300);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Can't connect to the Server");
      } else if (err.response?.status === 409) {
        setErrMsg(`Username is already in used`);
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };

  return (
    <>
      <div className="mt-5">
        <h1 className="font-bold text-4xl mb-5">Sign Up</h1>
        <section>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="register_username" className="text-sm">
                Username:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validUsername ? "valid" : "hidden"
                  }`}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={`ml-1 text-lg text-oranges font-bold mb-[-2px] ${
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
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2"
                />
                <p
                  id="uidnote"
                  className={`text-xs bg-loranges p-2 rounded-md ${
                    usernameFocus && username && !validUsername
                      ? "relative"
                      : "hidden"
                  }`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register_password" className="text-sm">
                Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validPassword ? "valid" : "hidden"
                  }`}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={`ml-1 text-lg text-oranges font-bold mb-[-2px] ${
                    validPassword || !password ? "hidden" : "invalid"
                  }`}
                />
              </label>
              <div>
                <input
                  type="password"
                  id="register_password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2"
                />
                <p
                  id="pwdnote"
                  className={`text-xs bg-loranges p-2 rounded-md ${
                    passwordFocus && !validPassword ? "relative" : "hidden"
                  }`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  8 to 24 characters.
                  <br />
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
              <label htmlFor="confirm-password" className="text-sm">
                Confirm Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                    validMatch && matchPassword ? "valid" : "hidden"
                  }`}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={`ml-1 text-lg text-oranges font-bold mb-[-2px] ${
                    validMatch || !matchPassword ? "hidden" : "invalid"
                  }`}
                />
              </label>
              <div>
                <input
                  type="password"
                  id="confirm-password"
                  onChange={(e) => setMatchPassword(e.target.value)}
                  value={matchPassword}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges"
                />
                <p
                  id="confirmnote"
                  className={`text-xs bg-loranges p-2 rounded-md ${
                    matchFocus && !validMatch ? "relative" : "hidden"
                  }`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  Must match the first password input field.
                </p>
              </div>
            </div>
            {errMsg && (
              <p className="text-sm text-semibold text-oranges text-center mt-2">
                {errMsg}
                <FontAwesomeIcon
                  icon={faExclamation}
                  className="text-sm text-oranges font-extrabold ml-1"
                />
              </p>
            )}
            {success && (
              <p className="text-sm text-semibold text-greens text-center mt-2">
                {success}
                <FontAwesomeIcon
                  icon={faExclamation}
                  className="text-sm text-greens font-extrabold ml-1"
                />
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

      <div className="flex flex-col items-center mt-5">
        <p className="text-sm">Already have an account?</p>
        <button
          className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white mt-2 hover:bg-lgreens"
          onClick={() => {
            setUsername("");
            setPassword("");
            setMatchPassword("");
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
