import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import { FaCheck, FaXmark } from "react-icons/fa6";
import NavbarDefault from "../components/NavbarDefault";
import Footer from "../components/Footer";

const FORGOTPASS_URL = "/forgot-password";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successStyle, setSuccessStyle] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorStyle, setErrorStyle] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessStyle(false);

    if (!email) {
      return (
        setErrMsg("Username or Email are required"),
        setIsLoading(false),
        setErrorStyle(true)
      );
    }

    try {
      const response = await axios.post(
        FORGOTPASS_URL,
        JSON.stringify({ email: email, username: email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccessStyle(true);
        setSuccessMsg(response.data.message);
        setIsLoading(false);
        setEmail("");
        setEmailSent(true);
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Can't connect to the Server");
        setErrorStyle(true);
        setIsLoading(false);
      } else if (error.response?.status === 400) {
        setErrMsg(error.response?.data.message);
        setErrorStyle(true);
        setIsLoading(false);
      } else {
        setErrMsg("Can't connect to the Server, Please try again later");
        setErrorStyle(true);
        setIsLoading(false);
      }
    }
  };

  // email length validation
  const emailInput = (event) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setEmail(value);
    }

    setSuccessStyle(false);
    setErrorStyle(false);
  };

  return (
    <div className="h-s100 bg-light font-pops overflow-hidden">
      <NavbarDefault />
      <div className="w-fit bg-white mx-auto mt-32 shadow-md rounded-lg max-w-[500px] py-5 px-5">
        {emailSent && (
          <>
            <div className="font-bold text-2xl">Email Sent</div>
            <div className="text-xs mt-3">
              {`We've sent a password reset email to your registered email address.
          Please check your inbox and follow the instructions to reset your
          password. If you don't see the email, be sure to check your spam or
          junk folder.`}
            </div>
            <div className="flex justify-end">
              <div className="w-fit">
                <Link to="/Login">
                  <div className="py-1 mt-3 rounded-md px-6 bg-[#1877f2] hover:bg-[#3578E5] font-semibold text-white cursor-pointer w-fit">
                    Return to Login
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}

        {!emailSent && (
          <>
            <div className="font-bold text-2xl">Forgot Your Password?</div>
            <div className="text-xs mt-3">
              {
                "If you've forgotten your password, use this form to reset it. You'll receive an email with further instructions."
              }
            </div>
            <div className="mt-3 py-2">
              <input
                type="text"
                placeholder="Username or Email"
                onChange={emailInput}
                value={email}
                required
                className={`focus:outline-none pl-3 py-2 w-full border border-inputLight rounded-md placeholder:font-light placeholder:text-[#7d7d7d] placeholder:text-xs text-sm`}
              />
            </div>

            {errorStyle && (
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
                <Link to="/login">
                  <div className="py-2 rounded-md px-6 bg-[#e4e6eb] font-semibold cursor-pointer">
                    Cancel
                  </div>
                </Link>
                {isLoading && (
                  <div className="py-2 rounded-md px-6 bg-[#1877f2] font-semibold text-white cursor-pointer">
                    <ThreeDot
                      style={{ fontSize: "7px" }}
                      variant="pulsate"
                      color="#fff"
                      text=""
                      textColor=""
                    />
                  </div>
                )}
                {!isLoading && (
                  <div
                    onClick={handleSubmit}
                    className="py-2 rounded-md px-6 bg-[#1877f2] hover:bg-[#3578E5] font-semibold text-white cursor-pointer"
                  >
                    Reset
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bottom-0 absolute w-full">
        <Footer />
      </div>
    </div>
  );
};

export default ForgotPassword;
