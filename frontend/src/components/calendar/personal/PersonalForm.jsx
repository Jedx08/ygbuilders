import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarContext } from "../../../context/CalendarContext";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import pouchIcon from "../../../media/pouch.png";
import expensesIcon from "../../../media/expenses.png";
import networthIcon from "../../../media/networth.png";
import { MdOutlinePostAdd } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BsBackspace } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { ThreeDot } from "react-loading-indicators";
import { FaExclamationCircle } from "react-icons/fa";

const PersonalForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    exactDaySelected,
    formSelectedDate,
    setPersonalIncomeLoading,
    dispatchPersonalIncomeData,
    personalButton,
    setPersonalButton,
    showPersonalForm,
    setShowPersonalForm,
    loggedIn,
  } = useContext(CalendarContext);

  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);
  const [toggleSaveButton, setToggleSaveButton] = useState(true);

  const [gross, setGross] = useState(
    formSelectedDate ? formSelectedDate.gross : ""
  );
  const [expenses, setExpenses] = useState(
    formSelectedDate ? formSelectedDate.expenses : ""
  );

  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [errStyle, setErrStyle] = useState(false);
  const [errStyleGross, setErrStyleGross] = useState(false);
  const [errStyleExpenses, setErrStyleExpenses] = useState(false);

  const [personalFormFloat, setPersonalFormFloat] = useState(false);

  const [dateStyle, setDateStyle] = useState(false);

  useEffect(() => {
    if (formSelectedDate) {
      setToggleSaveButton(false);
      setGross(formSelectedDate.gross);
      setExpenses(formSelectedDate.expenses);
    } else {
      setToggleSaveButton(true);
      setGross("");
      setExpenses("");
    }
    setErrMsg("");
    setErrStyle(false);
    setErrStyleGross(false);
    setErrStyleExpenses(false);
  }, [exactDaySelected, formSelectedDate]);

  useEffect(() => {
    setDateStyle(true);
    setTimeout(() => {
      setDateStyle(false);
    }, 1000);
  }, [exactDaySelected]);

  useEffect(() => {
    if (personalButton) {
      setShowButton(true);
    }
  }, [personalButton]);

  // Add data
  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      gross: +gross,
      expenses: +expenses,
      net: gross - expenses,
      day: exactDaySelected.valueOf(),
      id: formSelectedDate ? formSelectedDate.id : Date.now(),
    };

    if (!gross && !expenses) {
      return (
        setErrMsg("Please fill out atleast one of the fields"),
        setErrStyleGross(true),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    if (isNaN(gross)) {
      return (
        setErrMsg("Invalid value, Gross must be a Number"),
        setErrStyleGross(true),
        setErrStyle(true)
      );
    }

    if (isNaN(expenses)) {
      return (
        setErrMsg("Invalid value, Expenses must be a Number"),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    setAddLoading(true);

    try {
      const response = await axiosPrivate.post(
        "/api/personal-income",
        JSON.stringify(data)
      );
      const json = await response.data;

      if (response.status === 200) {
        dispatchPersonalIncomeData({
          type: "create",
          payload: json,
        });
      }
      setErrMsg(null);
      setShowButton(false);
      setPersonalButton(false);
      setPersonalIncomeLoading(true);
      setAddLoading(false);
      setShowPersonalForm(false);
    } catch (err) {
      console.log(err);
    }
  }

  // Update data
  async function handleUpdate(e) {
    e.preventDefault();

    const update = {
      gross: +gross,
      expenses: +expenses,
      net: gross - expenses,
      day: exactDaySelected.valueOf(),
      id: formSelectedDate ? formSelectedDate.id : Date.now(),
    };

    if (!gross && !expenses) {
      return (
        setErrMsg("Please fill out atleast one of the fields"),
        setErrStyleGross(true),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    if (isNaN(gross)) {
      return (
        setErrMsg("Invalid value, Gross must be a Number"),
        setErrStyleGross(true),
        setErrStyle(true)
      );
    }

    if (isNaN(expenses)) {
      return (
        setErrMsg("Invalid value, Expenses must be a Number"),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    setUpdateLoading(true);

    try {
      const response = await axiosPrivate.patch(
        "/api/personal-income/" + formSelectedDate._id,
        JSON.stringify(update)
      );
      const json = await response.data;

      if (response.status === 200) {
        dispatchPersonalIncomeData({ type: "update", payload: json });
        setErrMsg(null);
        setPersonalButton(false);
        setPersonalIncomeLoading(true);
        setUpdateLoading(false);
        setShowPersonalForm(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Delete data
  async function handleDelete() {
    setDeleteLoading(true);

    try {
      const response = await axiosPrivate.delete(
        "/api/personal-income/" + formSelectedDate._id
      );
      const json = await response.data;
      if (response.status === 200) {
        dispatchPersonalIncomeData({
          type: "delete",
          payload: json,
        });
        setShowButton(false);
        setPersonalButton(false);
        setPersonalIncomeLoading(true);
        setConfirmDelete(false);
        setDeleteLoading(false);
        setShowPersonalForm(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setErrMsg("Bad request");
        setErrStyle(true);
      }
    }
  }

  // gross length validation
  const grossInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setGross(value);
    }

    setErrMsg("");
    setErrStyle(false);
    setErrStyleGross(false);
    setErrStyleExpenses(false);
  };

  // expenses length validation
  const expensesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setExpenses(value);
    }

    setErrMsg("");
    setErrStyle(false);
    setErrStyleGross(false);
    setErrStyleExpenses(false);
  };

  useEffect(() => {
    const personalFloat = () => {
      if (window.innerWidth <= 658) {
        setPersonalFormFloat(true);
      } else {
        setPersonalFormFloat(false);
        setShowPersonalForm(false);
      }
    };
    window.addEventListener("resize", personalFloat);
    if (window.innerWidth <= 658) {
      setPersonalFormFloat(true);
    } else {
      setPersonalFormFloat(false);
      setShowPersonalForm(false);
    }
    return () => {
      window.removeEventListener("resize", personalFloat);
    };
  }, []);

  return (
    <>
      <div
        className={`mx-auto ${
          personalFormFloat && showPersonalForm
            ? "h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`text-center ${
            personalFormFloat && showPersonalForm
              ? "rounded-md bg-white overflow-hidden shadow-lg w-80 px-2 py-5 relative border border-[#ebebeb]"
              : ""
          }`}
        >
          {/* Close button */}
          <div
            onClick={(e) => {
              if (addLoading) {
                location.reload();
              }
              if (updateLoading) {
                location.reload();
              }
              if (deleteLoading) {
                location.reload();
              }
              e.preventDefault(), setShowPersonalForm(false);
            }}
            className={`cursor-pointer hover:bg-light hover:rounded-full font-bold absolute top-1 right-0 mb-5 p-1 text-2xl ${
              personalFormFloat && showPersonalForm ? "" : "hidden"
            }`}
          >
            <IoClose className="text-lgreens hover:text-greens" />
          </div>
          <div
            className={`text-base w-fit mx-auto ${
              dateStyle
                ? "bg-lgreens font-bold text-white px-3 rounded-sm"
                : "font-semibold"
            }`}
          >
            {exactDaySelected.format("MMMM D, YYYY")}
          </div>
          {/* Add Gross */}
          <div className="px-10 justify-center mt-5">
            <div className="font-semibold">Gross:</div>
            <div
              className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                errStyleGross ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={pouchIcon} className={`w-10`} />
              </div>
              <input
                type="number"
                value={gross}
                onChange={grossInput}
                className={`focus:outline-none pl-3 py-2 w-full`}
              />
            </div>
          </div>
          {/* Add Expenses */}
          <div className="px-10 justify-center mt-3">
            <div className="font-semibold">Expenses:</div>
            <div
              className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                errStyleExpenses ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={expensesIcon} className={`w-10`} />
              </div>
              <input
                type="number"
                value={expenses}
                onChange={expensesInput}
                className={`focus:outline-none pl-3 py-2 w-full`}
              />
            </div>
          </div>
          {/* Net Pay */}
          <div className="px-10 justify-center mt-3">
            <div className="font-semibold">Net:</div>
            <div className="bg-light flex items-center rounded-md mx-auto py-2 w-[70%]">
              <div className="pl-2">
                <img src={networthIcon} className="w-8" />
              </div>
              <div className="">
                <p className="pl-3">
                  {(gross - expenses).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errStyle && (
            <div className="text-center mt-2 text-[red] text-sm flex justify-center items-center space-x-2">
              <div>
                <FaExclamationCircle />
              </div>
              <div>{errMsg}</div>
            </div>
          )}

          {!confirmDelete && (
            <div className="flex flex-col items-center">
              {showButton && (
                <div className={`${errStyle ? "mt-2" : "mt-9"}`}>
                  {toggleSaveButton ? (
                    <>
                      {/* Add data */}
                      {!addLoading && (
                        <div
                          onClick={(e) => {
                            if (!loggedIn) {
                              navigate("/login");
                            } else {
                              handleSubmit(e);
                            }
                          }}
                          className="mx-auto py-1 rounded-md px-6 bg-greens text-base font-semibold text-white hover:bg-lgreens flex gap-1 items-center cursor-pointer"
                        >
                          <span className="text-3xl">
                            <MdOutlinePostAdd />
                          </span>
                          Add
                        </div>
                      )}

                      {/* Add Data loading */}
                      {addLoading && (
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            <div className="mx-auto py-1 rounded-md px-6 bg-lgreens font-bold text-white">
                              <ThreeDot
                                style={{ fontSize: "7px" }}
                                variant="pulsate"
                                color="#fff"
                                text=""
                                textColor=""
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap space-x-4">
                      {/* Edit and Delete data */}
                      {!updateLoading && (
                        <>
                          <div
                            onClick={handleUpdate}
                            className="mx-auto py-1 rounded-md px-6 bg-greens text-base font-semibold text-white hover:bg-lgreens flex gap-2 items-center cursor-pointer"
                          >
                            <span className="text-3xl">
                              <GoChecklist />
                            </span>
                            Save
                          </div>
                          <div
                            onClick={() => {
                              setConfirmDelete(true);
                            }}
                            className="flex gap-2 items-center border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md py-1 px-4 text-[#FF4242] hover:text-[red] text-base font-semibold"
                          >
                            <span className="text-3xl">
                              <FaRegTrashCan />
                            </span>
                            Delete
                          </div>
                        </>
                      )}

                      {updateLoading && (
                        <>
                          <div className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white flex gap-2 items-center">
                            <ThreeDot
                              style={{ fontSize: "7px" }}
                              variant="pulsate"
                              color="#fff"
                              text=""
                              textColor=""
                            />
                          </div>
                          <div
                            onClick={() => {
                              location.reload();
                            }}
                            className="flex gap-2 items-center border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md py-1 px-4 text-[#FF4242] hover:text-[red] font-bold"
                          >
                            <span className="text-3xl">
                              <BsBackspace />
                            </span>
                            Cancel
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Confirm Delete Data */}
          {confirmDelete && (
            <div className="px-4 mt-2">
              <div className="rounded-md p-2 bg-light">
                <p className={`text-center text-xs`}>
                  Confirm deletion for{" "}
                  <span className={`text-[red] font-semibold`}>
                    {exactDaySelected.format("MMMM D, YYYY")}
                  </span>{" "}
                  income ?
                </p>
                <div className="flex justify-center gap-6 mt-2 mb-1">
                  {deleteLoading && (
                    <div>
                      <ThreeDot
                        style={{ fontSize: "7px" }}
                        variant="pulsate"
                        color="#ff0000"
                        text=""
                        textColor=""
                      />
                    </div>
                  )}

                  {!deleteLoading && (
                    <>
                      <div
                        onClick={handleDelete}
                        className="text-[#FF4242] cursor-pointer hover:text-[red] text-sm font-bold flex items-center gap-1"
                      >
                        <span className={`text-xl`}>
                          <FaRegTrashCan />
                        </span>
                        Delete
                      </div>
                      <div
                        className="text-greens hover:text-lgreens font-bold cursor-pointer text-sm flex items-center gap-1"
                        onClick={() => {
                          setConfirmDelete(false);
                        }}
                      >
                        <span className={`text-xl`}>
                          <BsBackspace />
                        </span>{" "}
                        Cancel
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalForm;
