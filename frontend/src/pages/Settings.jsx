import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";
import { FaInfoCircle } from "react-icons/fa";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import SelectAvatar from "../components/SelectAvatar";
import { CalendarContext } from "../context/CalendarContext";
import avatar1 from "../media/avatar1.png";
import avatar2 from "../media/avatar2.png";
import avatar3 from "../media/avatar3.png";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Settings = () => {
  const { auth, userInfo } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const { isAvatar, setIsAvatar } = useContext(CalendarContext);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [validNewPassword, setValidNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function getAvatar(value) {
    if (value === "avatar1") {
      return avatar1;
    }

    if (value === "avatar2") {
      return avatar2;
    }

    if (value === "avatar3") {
      return avatar3;
    }
  }

  useEffect(() => {
    const result = PWD_REGEX.test(newPassword);
    setValidNewPassword(result);
  }, [newPassword]);

  useEffect(() => {
    const result = PWD_REGEX.test(newPassword);
    setValidNewPassword(result);
    const match = newPassword === confirmPassword;
    setValidConfirmPassword(match);
  }, [newPassword, confirmPassword]);

  async function handleUpdate(e) {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      password,
      newPassword,
      confirmPassword,
    };

    if (!password) {
      return setErrMsg("Current password required"), setIsLoading(false);
    }
    if (!validNewPassword) {
      return setErrMsg("New password must valid"), setIsLoading(false);
    }
    if (!validConfirmPassword) {
      return setErrMsg("New password does not match"), setIsLoading(false);
    }

    try {
      const response = await axiosPrivate.patch("/user", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const json = await response.data;

      if (response.status === 200) {
        setSuccessMsg(json.message);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsLoading(false);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Can't connect to the Server");
        setIsLoading(false);
      } else if (err.response?.status === 409) {
        setErrMsg(err.response?.data?.message);
        setIsLoading(false);
      } else if (err.response?.status === 400) {
        setErrMsg(err.response?.data?.message);
        setIsLoading(false);
      } else {
        setErrMsg("Can't connect to the Server");
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <div className="bg-light h-s100 font-pops overflow-hidden">
        <Navbar />
        <div className="mt-10">
          <div className="text-center">
            <h1 className="font-bold text-2xl">Account Settings</h1>
          </div>
          <div className="bg-white mt-5 px-10 py-5 overflow-hidden w-fit h-hfit mx-auto shadow-lg rounded-md">
            <div
              onClick={() => {
                setIsAvatar(true);
              }}
              className="cursor-pointer overflow-hidden w-fit pt-2 px-2 border border-light rounded-[50%] mx-auto bg-[#2222]"
            >
              <img src={getAvatar(userInfo.avatar)} className="w-20" />
            </div>
            <div
              onClick={() => {
                setIsAvatar(true);
              }}
              className="cursor-pointer w-fit mx-auto text-xs mt-1 bg-greens px-2 rounded-md text-white font-medium"
            >
              Change Avatar
            </div>
            <div className=" grid grid-rows-4 place-content-center mt-5 xs:px-6">
              {/* show email */}
              <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1">
                <div className="text-sm font-semibold xs:font-medium">
                  Email:
                </div>
                <div className="bg-light rounded-md text-center py-1 text-xs">
                  {auth?.useremail}
                </div>
              </div>

              {/* current password */}
              <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1 xs:mt-2">
                <div className="text-sm font-semibold xs:font-medium">
                  Current password:
                </div>
                <div className="flex items-center border border-inputLight rounded-md pr-2 min-w-[218px]">
                  <input
                    type={!showPassword ? "password" : "text"}
                    autoComplete="off"
                    placeholder="Current Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    onFocus={() => {
                      setErrMsg("");
                      setSuccessMsg("");
                    }}
                    value={password}
                    className="text-sm rounded-md focus:outline-none px-2 placeholder:text-xs py-1"
                  />

                  {password ? (
                    <>
                      {!showPassword ? (
                        <FaRegEyeSlash
                          onClick={() => {
                            setShowPassword(true);
                          }}
                          className="cursor-pointer"
                        />
                      ) : (
                        <FaRegEye
                          onClick={() => {
                            setShowPassword(false);
                          }}
                          className="cursor-pointer"
                        />
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* new password */}
              <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1 xs:mt-2">
                <label
                  htmlFor="new_password"
                  className="text-sm font-semibold flex gap-1 xs:font-medium"
                >
                  New password:
                  <FaCheck
                    className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                      validNewPassword ? "valid" : "hidden"
                    }`}
                  />
                  <FaXmark
                    className={`ml-1 text-lg text-[red] font-bold mb-[-2px] ${
                      validNewPassword || !newPassword ? "hidden" : "invalid"
                    }`}
                  />
                </label>
                <div>
                  <div className="flex items-center border border-inputLight rounded-md pr-2 min-w-[218px]">
                    <input
                      type={!showNewPassword ? "password" : "text"}
                      id="new_password"
                      autoComplete="off"
                      placeholder="New Password"
                      aria-invalid={validNewPassword ? "false" : "true"}
                      aria-describedby="newpwd"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                      onFocus={() => {
                        setNewPasswordFocus(true);
                        setErrMsg("");
                        setSuccessMsg("");
                      }}
                      onBlur={() => setNewPasswordFocus(false)}
                      value={newPassword}
                      className="rounded-md focus:outline-none px-2 placeholder:text-xs py-1 text-sm"
                    />

                    {newPassword && (
                      <>
                        {!showNewPassword ? (
                          <FaRegEyeSlash
                            onClick={() => {
                              setShowNewPassword(true);
                            }}
                            className="cursor-pointer"
                          />
                        ) : (
                          <FaRegEye
                            onClick={() => {
                              setShowNewPassword(false);
                            }}
                            className="cursor-pointer"
                          />
                        )}
                      </>
                    )}
                  </div>

                  <p
                    id="newpwd"
                    className={`text-xs bg-[#eceef2] p-2 rounded-md shadow-lg ${
                      newPasswordFocus && !validNewPassword
                        ? "absolute"
                        : "hidden"
                    }`}
                  >
                    <span className="flex items-center">
                      <FaInfoCircle className="mr-1" />8 to 24 characters.
                    </span>
                    Must include uppercase and lowercase <br />
                    <span>letters, a number and a</span>
                    special
                    <br />
                    character. <br /> Allowed special characters:{" "}
                    <span aria-label="exclamation mark">!</span>{" "}
                    <span aria-label="at symbol">@</span>{" "}
                    <span aria-label="hashtag">#</span>{" "}
                    <span aria-label="dollar sign">$</span>{" "}
                    <span aria-label="percent">%</span>
                  </p>
                </div>
              </div>

              {/* confirm new password */}
              <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1 xs:mt-2">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-semibold flex gap-1 xs:font-medium"
                >
                  Confirm password:
                  <FaCheck
                    className={`ml-1 text-lg text-greens font-bold mb-[-2px] ${
                      validConfirmPassword && confirmPassword
                        ? "valid"
                        : "hidden"
                    }`}
                  />
                  <FaXmark
                    className={`ml-1 text-lg text-[red] font-bold mb-[-2px] ${
                      validConfirmPassword || !confirmPassword
                        ? "hidden"
                        : "invalid"
                    }`}
                  />
                </label>
                <div>
                  <div className="flex items-center border border-inputLight rounded-md pr-2 min-w-[218px]">
                    <input
                      type={!showConfirmPassword ? "password" : "text"}
                      id="confirm_password"
                      autoComplete="off"
                      placeholder="Confirm new password"
                      aria-invalid={validConfirmPassword ? "false" : "true"}
                      aria-describedby="confirmpwd"
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      onFocus={() => {
                        setConfirmPasswordFocus(true);
                        setErrMsg("");
                        setSuccessMsg("");
                      }}
                      onBlur={() => setConfirmPasswordFocus(false)}
                      value={confirmPassword}
                      className="text-sm rounded-md focus:outline-none px-2 placeholder:text-xs py-1"
                    />

                    {confirmPassword && (
                      <>
                        {!showConfirmPassword ? (
                          <FaRegEyeSlash
                            onClick={() => {
                              setShowConfirmPassword(true);
                            }}
                            className="cursor-pointer"
                          />
                        ) : (
                          <FaRegEye
                            onClick={() => {
                              setShowConfirmPassword(false);
                            }}
                            className="cursor-pointer"
                          />
                        )}
                      </>
                    )}
                  </div>
                  <p
                    id="confirmpwd"
                    className={`text-xs bg-[#eceef2] p-2 rounded-md ${
                      confirmPasswordFocus && !validConfirmPassword
                        ? "absolute"
                        : "hidden"
                    }`}
                  >
                    <span className="flex items-center">
                      <FaInfoCircle className="mr-1" />
                      Must match the new password
                    </span>
                    input field.
                  </p>
                </div>
              </div>

              {successMsg && (
                <div className="text-greens text-xs text-center mt-2">
                  {successMsg}
                </div>
              )}

              {errMsg && (
                <div className="text-[red] text-xs text-center mt-2">
                  {errMsg}
                </div>
              )}

              {/* Update Button */}
              <div className="mt-5 mx-auto">
                {isLoading ? (
                  <div className="w-fit rounded-md px-6 py-1 font-semibold text-white bg-[#1a849f]">
                    <div>
                      <ThreeDot
                        style={{ fontSize: "7px" }}
                        variant="pulsate"
                        color="#ffffff"
                        text=""
                        textColor=""
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleUpdate}
                    className="w-fit rounded-md px-3 py-[2px] font-semibold cursor-pointer text-white bg-[#399CB4] hover:bg-[#1a849f]"
                  >
                    Update
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAvatar && <SelectAvatar />}
    </>
  );
};

export default Settings;
