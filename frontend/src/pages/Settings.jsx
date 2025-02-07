import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ThreeDot, OrbitProgress } from "react-loading-indicators";
import { FaCheck, FaXmark } from "react-icons/fa6";
import {
  FaRegEyeSlash,
  FaRegEye,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";
import { PiArrowFatLeftFill } from "react-icons/pi";
import SelectAvatar from "../components/SelectAvatar";
import { CalendarContext } from "../context/CalendarContext";
import avatar1 from "../media/avatar1.png";
import avatar2 from "../media/avatar2.png";
import avatar3 from "../media/avatar3.png";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Settings = () => {
  const { userInfo, setAuth, setUserInfo } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  // const navigate = useNavigate();

  const {
    isAvatar,
    setIsAvatar,
    setPersonalIncomeLoading,
    setPersonalExpensesLoading,
    setBusinessIncomeLoading,
    setBusinessCapitalLoading,
    setBusinessExpensesLoading,
    setSavingsIncomeLoading,
    setGoalLoading,
  } = useContext(CalendarContext);

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

  const [confirmDelForm, setConfirmDelForm] = useState(false);
  const [delMsg, setDelMsg] = useState("");
  const [errMsgDelAcc, setErrMsgDelAcc] = useState("");

  const [delAccLoading, setDelAccLoading] = useState(false);
  const [delAccStatus, setDelAccStatus] = useState(false);

  const [clearDataErrMsg, setClearDataErrMsg] = useState("");
  const [clearDataLoading, setClearDataLoading] = useState(false);
  const [clearDataStatus, setClearDataStatus] = useState(false);
  const [clearData, setClearData] = useState(false);
  const [clearDataInput, setClearDataInput] = useState("");

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

  // update password
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

  // delete account
  const handleDelete = async () => {
    if (delMsg === "DELETE") {
      setDelAccLoading(true);
      try {
        const response = await axiosPrivate.delete("/user/deleteUser", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setAuth({});
          setUserInfo({});
          setDelAccStatus(true);
          setTimeout(() => {
            // navigate("/login");
            location.reload();
          }, 2000);
        }
      } catch (err) {
        if (err) {
          setErrMsgDelAcc(err.response?.data?.message);
        } else {
          setErrMsgDelAcc("Server timeout");
        }
      }
    } else {
      return setErrMsgDelAcc(
        "Please type DELETE in all capital letters to confirm account deletion."
      );
    }
  };

  // clear data
  const handleClearData = async (e) => {
    e.preventDefault();

    const clearDataFnc = async () => {
      try {
        const response = await axiosPrivate.delete(
          "/user/clear-data/" + clearDataInput,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setClearDataStatus(true);
          setPersonalIncomeLoading(true);
          setPersonalExpensesLoading(true);
          setBusinessIncomeLoading(true);
          setBusinessCapitalLoading(true);
          setBusinessExpensesLoading(true);
          setSavingsIncomeLoading(true);
          setGoalLoading(true);
          setTimeout(() => {
            setClearDataLoading(false);
            setClearDataStatus(false);
            setClearData(false);
            setClearDataInput("");
          }, 2000);
        }
      } catch (err) {
        if (err) {
          setClearDataErrMsg(err.response?.data?.message);
          setClearDataLoading(false);
        } else {
          setClearDataErrMsg("Server timeout");
          setClearDataLoading(false);
        }
      }
    };

    if (clearDataInput === "PERSONAL") {
      setClearDataLoading(true);
      clearDataFnc();
    } else if (clearDataInput === "BUSINESS") {
      setClearDataLoading(true);
      clearDataFnc();
    } else if (clearDataInput === "SAVINGS") {
      setClearDataLoading(true);
      clearDataFnc();
    } else {
      return (
        setClearDataErrMsg(
          "Invalid input. Please type one of the following: PERSONAL, BUSINESS or SAVINGS"
        ),
        setClearDataLoading(false)
      );
    }
  };

  const currentPassInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
  };

  const newPassInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setNewPassword(value);
    }
  };

  const confirmPassInput = (event) => {
    const value = event.target.value;
    if (value.length <= 24) {
      setConfirmPassword(value);
    }
  };

  const deleteAccInput = (event) => {
    const value = event.target.value;
    if (value.length <= 30) {
      setDelMsg(value);
    }
    setErrMsgDelAcc("");
  };

  const clearDataInputVal = (event) => {
    const value = event.target.value;
    if (value.length <= 30) {
      setClearDataInput(value);
    }
    setClearDataErrMsg("");
  };

  return (
    <>
      <div className="bg-light h-s100 font-pops overflow-hidden">
        <Navbar />
        <div className="mt-10">
          <div className="text-center">
            <h1 className="font-bold text-2xl">Account Settings</h1>
          </div>
          <div className="bg-white mt-5 px-10 py-5 overflow-hidden w-fit h-hfit mx-auto shadow-lg rounded-md xs:px-0">
            <Link to="/dashboard">
              <div className="ml-[-30px] mb-3 flex items-center space-x-2 text-oranges font-medium underline cursor-pointer xs:ml-0">
                <div className="text-2xl">
                  <PiArrowFatLeftFill />
                </div>
                <div>Back to dashboard</div>
              </div>
            </Link>
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

            <div
              className={`grid  place-content-center mt-5 xs:px-6 ${
                userInfo.provider === "facebook" ? "grid-rows-2" : "grid-rows-4"
              }`}
            >
              {/* Status */}
              <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1">
                <div className="text-sm font-semibold xs:font-medium">
                  Account type:
                </div>
                <div className="bg-light rounded-md text-center py-1 text-xs">
                  {userInfo?.provider}
                </div>
              </div>
              {/* show email */}
              <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1">
                <div className="text-sm font-semibold xs:font-medium">
                  Email:
                </div>
                <div className="bg-light rounded-md text-center py-1 text-xs">
                  {userInfo?.email}
                </div>
              </div>

              {/* show change password */}
              {userInfo.provider === "facebook" ? (
                <></>
              ) : (
                <>
                  <div className="text-lg flex items-end justify-center font-bold xs:font-semibold">
                    YourGross account
                  </div>

                  {/* current password */}
                  <div className="grid grid-cols-2 py-1 items-center xs:grid-cols-1 mt-1">
                    <div className="text-sm font-semibold xs:font-medium">
                      Current password:
                    </div>
                    <div className="flex items-center border border-inputLight rounded-md pr-2 min-w-[218px]">
                      <input
                        type={!showPassword ? "password" : "text"}
                        autoComplete="off"
                        placeholder="Current Password"
                        onChange={currentPassInput}
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
                          validNewPassword || !newPassword
                            ? "hidden"
                            : "invalid"
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
                          onChange={newPassInput}
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
                          onChange={confirmPassInput}
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
                    <div className="text-greens text-sm text-center mt-2 flex justify-center items-center space-x-2">
                      <div>
                        <FaCheckCircle />
                      </div>
                      <div>{successMsg}</div>
                    </div>
                  )}

                  {errMsg && (
                    <div className="text-[red] text-sm text-center mt-2 flex justify-center items-center space-x-2">
                      <div>
                        <FaExclamationCircle />
                      </div>
                      <div>{errMsg}</div>
                    </div>
                  )}

                  {/* Update Button */}
                  <div className="mt-5 mx-auto">
                    {isLoading ? (
                      <div className="w-fit rounded-md px-6 py-1 font-semibold text-white bg-[#3578E5]">
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
                      <div className="flex space-x-6">
                        <div
                          onClick={handleUpdate}
                          className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer text-white bg-[#1877f2] hover:bg-[#3578E5]"
                        >
                          Update
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* Delete account & Clear data */}
              <div className="flex space-x-6 justify-center mt-3">
                <div
                  onClick={() => {
                    setConfirmDelForm(true);
                  }}
                  className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer text-white bg-[#FF4242] hover:bg-[red] text-center"
                >
                  Delete account
                </div>
                <div
                  onClick={() => {
                    setClearData(true);
                  }}
                  className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer hover:bg-inputLight bg-[#e0e1e4] text-center"
                >
                  Clear data
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAvatar && <SelectAvatar />}

      {confirmDelForm && (
        <>
          <div className="font-pops h-s100 w-full fixed left-0 top-0 flex bg-light bg-opacity-60">
            <div className="bg-white rounded-md shadow-lg h-hfit max-w-[500px] mx-auto mt-36 z-10 px-10 py-5">
              <div className="text-sm">
                <div className="text-center font-bold text-2xl text-[red]">
                  Confirm Account Deletion
                </div>
                <div className="bg-subCon py-1 px-3 mt-3 rounded-md">
                  <div>
                    Are you sure you want to delete your account? This action
                    cannot be undone, and all your data will be permanently
                    removed.
                  </div>
                  <div className="mt-3">
                    To confirm, please type{" "}
                    <span className="font-bold text-base text-[red]">
                      DELETE
                    </span>{" "}
                    in the box below and click the &quot;Confirm&quot; button.
                  </div>
                </div>
              </div>
              <div>
                <div className="border border-inputLight rounded-md mt-3">
                  <input
                    type="text"
                    onChange={deleteAccInput}
                    value={delMsg}
                    className="w-full rounded-md focus:outline-none px-2 placeholder:text-xs py-1 text-center font-bold text-[red]"
                  />
                </div>
              </div>
              <div className="mt-3 text-xs text-center text-[red]">
                {errMsgDelAcc}
              </div>
              <div className="flex justify-center items-center space-x-6 mt-5">
                <div
                  onClick={handleDelete}
                  className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer text-white bg-[#FF4242] hover:bg-[red]"
                >
                  Confirm
                </div>
                <div
                  onClick={() => {
                    setConfirmDelForm(false);
                    setErrMsgDelAcc("");
                    setDelMsg("");
                  }}
                  className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer bg-[#e4e6eb]"
                >
                  Cancel
                </div>
              </div>
              <div className="text-xs mt-3">
                Note: Once you delete your account, there is no way to recover
                your data.
              </div>
            </div>
          </div>
        </>
      )}

      {delAccLoading && (
        <>
          <div className="font-pops h-s100 w-full fixed left-0 top-0 flex bg-light bg-opacity-80">
            <div className="mx-auto mt-56 h-hfit flex flex-col justify-center">
              {!delAccStatus && (
                <>
                  <div className="mx-auto w-fit">
                    <OrbitProgress
                      color="red"
                      size="large"
                      text=""
                      textColor=""
                      speedPlus="1"
                    />
                  </div>
                  <div className="text-lg font-semibold mt-3">
                    Deleting your account, please wait...
                  </div>
                </>
              )}
              {delAccStatus && (
                <>
                  <div className="mx-auto w-fit">
                    <FaCheckCircle className="text-9xl text-[#32ca5b]" />
                  </div>
                  <div className="text-lg font-semibold mt-3">
                    Account Successfully Deleted
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {clearData && (
        <>
          <div className="font-pops h-s100 w-full fixed left-0 top-0 flex bg-light bg-opacity-60">
            <div className="bg-white rounded-md shadow-lg h-hfit max-w-[500px] mx-auto mt-36 z-10 px-10 py-5">
              <div className="text-center font-bold text-2xl text-[red]">
                Are you sure you want to clear your data?
              </div>
              <div className="bg-subCon py-1 px-3 mt-3 rounded-md">
                <div>Please type the name of the data you want to delete:</div>
                <div className="pl-6 py-1 mt-1">
                  <ul className="list-disc">
                    <li>
                      <span className="font-bold text-[red]">PERSONAL</span>{" "}
                      <span className="text-sm">
                        (for personal income data included monthly expenses
                        data)
                      </span>
                    </li>
                    <li>
                      <span className="font-bold text-[red]">BUSINESS</span>{" "}
                      <span className="text-sm">
                        (for business income data included monthly capital data
                        and monthly expenses data)
                      </span>
                    </li>
                    <li>
                      <span className="font-bold text-[red]">SAVINGS</span>{" "}
                      <span className="text-sm">
                        (for savings data included target goal data)
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-1">
                  Type <span className="font-bold text-[red]">PERSONAL</span>,{" "}
                  <span className="font-bold text-[red]">BUSINESS</span>, or{" "}
                  <span className="font-bold text-[red]">SAVINGS</span> to
                  confirm the deletion of that specific data.
                </div>
              </div>
              <div className="border border-inputLight rounded-md mt-3">
                <input
                  value={clearDataInput}
                  onChange={clearDataInputVal}
                  type="text"
                  className="w-full rounded-md focus:outline-none px-2 placeholder:text-xs py-1 text-center font-bold text-[red]"
                />
              </div>

              <div className="mt-3 text-xs text-center text-[red]">
                {clearDataErrMsg}
              </div>

              <div className="flex justify-center items-center space-x-6 mt-5">
                <div
                  onClick={handleClearData}
                  className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer text-white bg-[#FF4242] hover:bg-[red]"
                >
                  Confirm
                </div>
                <div
                  onClick={() => {
                    setClearData(false);
                    setClearDataErrMsg("");
                    setClearDataInput("");
                  }}
                  className="w-fit rounded-md px-3 py-2 font-semibold cursor-pointer bg-[#e4e6eb]"
                >
                  Cancel
                </div>
              </div>
              <div className="text-xs mt-3">
                Note: Once you delete your data, there is no way to recover your
                data.
              </div>
            </div>
          </div>
        </>
      )}

      {clearDataLoading && (
        <>
          <div className="font-pops h-s100 w-full fixed left-0 top-0 flex bg-light bg-opacity-90">
            <div className="mx-auto mt-56 h-hfit flex flex-col justify-center">
              {!clearDataStatus && (
                <>
                  <div className="mx-auto w-fit">
                    <OrbitProgress
                      color="red"
                      size="large"
                      text=""
                      textColor=""
                      speedPlus="1"
                    />
                  </div>
                  <div className="text-lg font-semibold mt-3">
                    Please wait while we process your request. This may take a
                    moment.
                  </div>
                </>
              )}
              {clearDataStatus && (
                <>
                  <div className="mx-auto w-fit">
                    <FaCheckCircle className="text-9xl text-[#32ca5b]" />
                  </div>
                  <div className="text-lg font-semibold mt-3">
                    {clearDataInput === "PERSONAL" && (
                      <>PERSONAL income data has been successfully deleted.</>
                    )}
                    {clearDataInput === "BUSINESS" && (
                      <>BUSINESS income data has been successfully deleted.</>
                    )}
                    {clearDataInput === "SAVINGS" && (
                      <>SAVINGS data has been successfully deleted.</>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Settings;
