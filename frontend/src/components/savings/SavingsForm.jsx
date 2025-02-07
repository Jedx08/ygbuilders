import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import piggy from "../../media/savings_logo.png";
import { MdOutlinePostAdd } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { BsBackspace } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { ThreeDot } from "react-loading-indicators";
import { FaExclamationCircle } from "react-icons/fa";

const SavingsForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    exactDaySelected,
    setSavingsIncomeLoading,
    dispatchSavingsData,
    showSavingsForm,
    setShowSavingsForm,
    savingsFormSelectedData,
    savingsButton,
    setSavingsButton,
  } = useContext(CalendarContext);

  const [showButton, setShowButton] = useState(false);
  const [toggleSaveButton, setToggleSaveButton] = useState(true);

  const [amount, setAmount] = useState(
    savingsFormSelectedData ? savingsFormSelectedData.amount : ""
  );

  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [errStyle, setErrStyle] = useState(false);
  const [errStyleAmount, setErrStyleAmount] = useState(false);

  const [savingsFormFloat, setSavingsFormFloat] = useState(false);

  useEffect(() => {
    if (savingsFormSelectedData) {
      setToggleSaveButton(false);
      setAmount(savingsFormSelectedData.amount);
    } else {
      setToggleSaveButton(true);
      setAmount("");
    }
    setErrMsg("");
    setErrStyle(false);
    setErrStyleAmount(false);
  }, [exactDaySelected, savingsFormSelectedData]);

  useEffect(() => {
    if (savingsButton) {
      setShowButton(true);
    }
  }, [savingsButton]);

  // Add data
  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      amount: +amount,
      day: exactDaySelected.valueOf(),
      id: savingsFormSelectedData ? savingsFormSelectedData.id : Date.now(),
    };

    if (!amount) {
      return (
        setErrMsg("Please fill out this field"),
        setErrStyleAmount(true),
        setErrStyle(true)
      );
    }

    setAddLoading(true);

    try {
      const response = await axiosPrivate.post(
        "/api/savings",
        JSON.stringify(data)
      );
      const json = await response.data;

      if (response.status === 200) {
        dispatchSavingsData({
          type: "create",
          payload: json,
        });
      }
      setErrMsg(null);
      setShowButton(false);
      setSavingsButton(false);
      setSavingsIncomeLoading(true);
      setAddLoading(false);
      setShowSavingsForm(false);
    } catch (err) {
      console.log(err);
    }
  }

  // Update data
  async function handleUpdate(e) {
    e.preventDefault();

    const update = {
      amount: +amount,
      day: exactDaySelected.valueOf(),
      id: savingsFormSelectedData ? savingsFormSelectedData.id : Date.now(),
    };

    if (!amount) {
      return (
        setErrMsg("Please fill out this field"),
        setErrStyleAmount(true),
        setErrStyle(true)
      );
    }

    setUpdateLoading(true);

    try {
      const response = await axiosPrivate.patch(
        "/api/savings/" + savingsFormSelectedData._id,
        JSON.stringify(update)
      );
      const json = await response.data;

      if (response.status === 200) {
        dispatchSavingsData({ type: "update", payload: json });
        setErrMsg(null);
        setSavingsButton(false);
        setSavingsIncomeLoading(true);
        setUpdateLoading(false);
        setShowSavingsForm(false);
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
        "/api/savings/" + savingsFormSelectedData._id
      );
      const json = await response.data;
      if (response.status === 200) {
        dispatchSavingsData({
          type: "delete",
          payload: json,
        });
        setShowButton(false);
        setSavingsButton(false);
        setSavingsIncomeLoading(true);
        setConfirmDelete(false);
        setDeleteLoading(false);
        setShowSavingsForm(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setErrMsg("Bad request");
        setErrStyle(true);
      }
    }
  }

  // amount length validation
  const amountInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setAmount(value);
    }

    setErrMsg("");
    setErrStyle(false);
    setErrStyleAmount(false);
  };

  useEffect(() => {
    const savingsFloat = () => {
      if (window.innerWidth <= 658) {
        setSavingsFormFloat(true);
      } else {
        setSavingsFormFloat(false);
        setShowSavingsForm(false);
      }
    };
    window.addEventListener("resize", savingsFloat);
    if (window.innerWidth <= 658) {
      setSavingsFormFloat(true);
    } else {
      setSavingsFormFloat(false);
      setShowSavingsForm(false);
    }
    return () => {
      window.removeEventListener("resize", savingsFloat);
    };
  }, []);

  return (
    <div
      className={`mx-auto ${
        savingsFormFloat && showSavingsForm
          ? "h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-50"
          : ""
      }`}
    >
      <div
        className={`text-center ${
          savingsFormFloat && showSavingsForm
            ? "rounded-md bg-white overflow-hidden shadow-lg w-80 px-2 py-5 relative"
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
            e.preventDefault(), setShowSavingsForm(false);
          }}
          className={`cursor-pointer hover:bg-light hover:rounded-full font-bold absolute top-1 right-0 mb-5 p-1 text-2xl ${
            savingsFormFloat && showSavingsForm ? "" : "hidden"
          }`}
        >
          <IoClose className="text-lyellows hover:text-yellows" />
        </div>
        <div className="text-base font-semibold">
          {exactDaySelected.format("MMMM D, YYYY")}
        </div>
        {/* Add Amount */}
        <div className="px-10 justify-center mt-5">
          <div className="font-semibold">Savings</div>
          <div
            className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
              errStyleAmount ? "border-[red]" : "border-inputLight"
            }`}
          >
            <div className="pl-2">
              <img src={piggy} className={`w-10`} />
            </div>
            <input
              type="number"
              value={amount}
              onChange={amountInput}
              className={`focus:outline-none pl-3 py-2 w-full`}
            />
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
                        onClick={handleSubmit}
                        className="mx-auto py-1 rounded-md px-6 bg-yellows text-base font-semibold text-white hover:bg-lyellows flex gap-1 items-center cursor-pointer"
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
                          <div className="mx-auto py-1 rounded-md px-6 bg-lyellows font-bold text-white">
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
                          className="mx-auto py-1 rounded-md px-6 bg-yellows text-base font-semibold text-white hover:bg-lyellows flex gap-2 items-center cursor-pointer"
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
                        <div className="mx-auto py-1 rounded-md px-6 bg-yellows font-bold text-white flex gap-2 items-center">
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
                savings ?
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
                      className="text-yellows hover:text-lyellows font-bold cursor-pointer text-sm flex items-center gap-1"
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
  );
};

export default SavingsForm;
