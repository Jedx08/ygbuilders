import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import NavbarDefault from "../components/NavbarDefault";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ThreeDot } from "react-loading-indicators";
import Footer from "../components/Footer";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const VERIFY_RESET_TOKEN = "verify-resetToken";
const RESET_PASSWORD_URL = "reset-password";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showMatchPassword, setShowMatchPassword] = useState(false);

  const [errStyle, setErrStyle] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [successStyle, setSuccessStyle] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [tokenVerified, setTokenVerified] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [pageInfo, setPageInfo] = useState("");
  const [tokenExpiredMsg, setTokenExpiredMsg] = useState(false);

  const [resetPassSuccess, setResetPassSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("resetToken");

      try {
        setResetToken(token);
        const response = await axios.post(VERIFY_RESET_TOKEN, { token });

        if (response.status === 200) {
          setTokenVerified(true);
        }
      } catch (error) {
        if (!error.response) {
          setPageInfo("Server time out");
        } else if (error.response?.status === 400) {
          navigate("/forgot-password");
        } else if (error.response?.status === 401) {
          setPageInfo(error.response.data.message);
          setTokenExpiredMsg(true);
        } else if (error.response?.status === 500) {
          setPageInfo(error.response.data.message);
        } else {
          setPageInfo("Server time out");
        }
        setTokenVerified(false);
      }
    };

    verify();
  }, [searchParams]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
    setErrStyle(false);
  }, [password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validPassword) {
      return (
        setErrMsg("Password must be valid"),
        setErrStyle(true),
        setIsLoading(false)
      );
    }

    if (!validMatch) {
      return (
        setErrMsg("Password does not match"),
        setErrStyle(true),
        setIsLoading(false)
      );
    }

    try {
      const response = await axios.post(
        RESET_PASSWORD_URL,
        JSON.stringify({ token: resetToken, password: password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setResetToken("");
        setResetPassSuccess(true);
        setSuccessStyle(true);
        setSuccessMsg(response.data.message);
        setPassword("");
        setMatchPassword("");
        setIsLoading(false);
      }
    } catch (error) {
      if (!error.response) {
        setPageInfo("Server time out");
      } else if (error.response?.status === 400) {
        setPageInfo(error.response.data.message);
      } else if (error.response?.status === 401) {
        setPageInfo(error.response.data.message);
      } else if (error.response?.status === 500) {
        setPageInfo(error.response.data.message);
      } else {
        setPageInfo("Server time out");
      }
      setTokenVerified(false);
    }
  };

  // password length validation
  const passInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
    setSuccessMsg("");
    setSuccessStyle(false);
  };
  // confirm password length validation
  const confirmPassInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setMatchPassword(value);
    }
    setSuccessMsg("");
    setSuccessStyle(false);
  };

  return (
    <div className="h-s100 bg-light font-pops overflow-hidden">
      <NavbarDefault />
      <div className="bg-white mx-auto mt-32 shadow-md rounded-lg max-w-[500px] py-5 px-5 relative">
        {/* unverified token */}
        {!tokenVerified && (
          <>
            <div className="font-bold text-2xl">{pageInfo}</div>
            {tokenExpiredMsg && (
              <>
                <div className="text-xs mt-3">
                  It looks like your password reset link has expired. For
                  security reasons, tokens are only valid for a limited time.
                </div>
                <div className="text-xs mt-3">
                  Please request a new password reset link.
                </div>
                <div className="w-fit">
                  <Link to="/forgot-password">
                    <div className="py-1 rounded-md px-6 bg-[#1877f2] hover:bg-[#3578E5] font-semibold text-white cursor-pointer  w-fit mt-3">
                      Request New Link
                    </div>
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        {/* token verified */}
        {tokenVerified && (
          <>
            {resetPassSuccess && (
              <>
                <div className="font-bold text-2xl">
                  Password Reset Successful
                </div>
                <div className="text-xs mt-3">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </div>
                <div className="flex justify-end">
                  <div className="w-fit">
                    <Link to="/Login">
                      <div className="py-1 mt-3 rounded-md px-6 bg-[#1877f2] hover:bg-[#3578E5] font-semibold text-white cursor-pointer w-fit">
                        Login
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {!resetPassSuccess && (
              <>
                <div className="font-bold text-2xl">Reset Your Password</div>

                {/* New password */}
                <div className="mt-3">
                  <label htmlFor="register_password" className={`text-xs flex`}>
                    New Password:
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
                      className={`rounded-md w-full focus:outline-none py-1 text-sm`}
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
                      className={`text-xs bg-inputLight p-2 rounded-md shadow-lg mr-5  ${
                        passwordFocus && !validPassword ? "absolute" : "hidden"
                      }`}
                    >
                      <span className="flex items-center">
                        <FaInfoCircle className="mr-1" />8 to 24 characters.
                      </span>
                      Must include uppercase and lowercase letters, a number and
                      a special character.
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
                <div className="mt-3">
                  <label htmlFor="confirm-password" className={`text-xs flex`}>
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
                      className={`border-inputLight w-full rounded-md focus:outline-none py-1 text-sm`}
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
                      className={`text-xs bg-inputLight p-2 rounded-md shadow-lg ${
                        matchFocus && !validMatch ? "absolute" : "hidden"
                      }`}
                    >
                      <span className="flex items-center">
                        <FaInfoCircle className="mr-1" />
                        Must match the first
                      </span>
                      password input field.
                    </p>
                  </div>
                </div>

                {errStyle && (
                  <div className="text-center mt-2 text-xs text-[#ff3a33] flex items-center justify-center space-x-2">
                    <div className="text-base">
                      <FaXmark />
                    </div>
                    <div>{errMsg}</div>
                  </div>
                )}

                {successStyle && (
                  <div className="text-center mt-2 text-xs text-[#32ca5b] flex items-center justify-center space-x-2">
                    <div className="text-base">
                      <FaCheck />
                    </div>
                    <div>{successMsg}</div>
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <div className="flex space-x-3">
                    <div
                      onClick={handleSubmit}
                      className="py-2 rounded-md px-6 bg-[#1877f2] hover:bg-[#3578E5] font-semibold text-white cursor-pointer"
                    >
                      {isLoading && (
                        <ThreeDot
                          style={{ fontSize: "7px" }}
                          variant="pulsate"
                          color="#fff"
                          text=""
                          textColor=""
                        />
                      )}

                      {!isLoading && <>Reset</>}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="bottom-0 absolute w-full">
        <Footer />
      </div>
    </div>
  );
};

export default PasswordReset;
