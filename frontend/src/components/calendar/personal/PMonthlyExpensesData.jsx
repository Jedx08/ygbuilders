import { useState, useEffect, useContext } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { BsBackspace } from "react-icons/bs";
import expensesIcon from "../../../media/expenses.png";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";
import { FaExclamationCircle } from "react-icons/fa";

const PMonthlyExpensesData = ({ expensesData }) => {
  const {
    setPersonalExpensesLoading,
    dispatchPersonalExpensesData,
    setLoadPage,
  } = useContext(CalendarContext);

  const [editButton, setEditButton] = useState(false);
  const [title, setTitle] = useState(expensesData ? expensesData.title : "");
  const [amount, setAmount] = useState(expensesData ? expensesData.amount : "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteStyle, setDeleteStyle] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(title);
  const [updateAmount, setUpdateAmount] = useState(amount);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errorStyle, setErrorStyle] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setTitle(expensesData.title);
    setAmount(expensesData.amount);
  }, [expensesData]);

  useEffect(() => {
    setUpdateTitle(title);
    setUpdateAmount(amount);
  }, [title, amount]);

  useEffect(() => {
    setError("");
    setErrorStyle(false);
  }, [updateTitle, updateAmount]);

  async function handleUpdate(e) {
    e.preventDefault();

    const amountNumber = Number(updateAmount);

    const data = {
      title: updateTitle.toUpperCase(),
      amount: +updateAmount,
    };

    if (!updateTitle || !updateAmount) {
      return setError("Please fill out all of the fields"), setErrorStyle(true);
    }

    if (isNaN(amountNumber)) {
      return (
        setError("Invalid value, Amount must be a number"), setErrorStyle(true)
      );
    }

    setUpdateLoading(true);
    setLoadPage(true);

    try {
      const response = await axiosPrivate.patch(
        "/api/personal-expenses/" + expensesData._id,
        JSON.stringify(data)
      );
      if (response.status === 200) {
        dispatchPersonalExpensesData({
          type: "update",
          payload: response.data,
        });
        setEditButton(false);
        setPersonalExpensesLoading(true);
        setUpdateLoading(false);
        setLoadPage(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Bad request");
        setErrorStyle(true);
      }
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    setLoadPage(true);

    try {
      const response = await axiosPrivate.delete(
        "/api/personal-expenses/" + expensesData._id
      );

      if (response.status === 200) {
        dispatchPersonalExpensesData({
          type: "delete",
          payload: response.data,
        });
        setPersonalExpensesLoading(true);
        setConfirmDelete(false);
        setLoadPage(false);
        setDeleteLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // update title length validation
  const updateTitleInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setUpdateTitle(value);
    }
  };

  // update amount length validation
  const updateAmountInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setUpdateAmount(value);
    }
  };

  return (
    <div className="px-5 font-pops bg-white py-[1px] clg:px-0">
      <div
        className={` ${
          editButton
            ? "space-x-2 justify-center items-center"
            : "grid grid-cols-2 gap-2 grid-flow-col"
        }`}
      >
        {/* show current data & update input form */}
        {!editButton ? (
          <>
            {/* show current data */}
            <div className="rounded-md overflow-hidden py-1 items-center flex px-2 col-span-1 font-medium bg-light">
              <img src={expensesIcon} className="w-8 mr-2" />
              <span
                style={{
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  display: "-webkit-box",
                }}
              >
                {title}
              </span>
            </div>
            <div className="text-[red] font-semibold text-base rounded-md overflow-hidden py-1 items-center justify-center flex px-2 col-span-1 bg-light">
              {amount.toLocaleString()}
            </div>
          </>
        ) : (
          <div className="absolute top-0 left-0 pt-[7rem] bg-light bg-opacity-70 h-hfull w-full">
            {/* Show input for update data / updating data */}
            <div className="bg-white py-4 rounded-md shadow-md">
              <div className="text-greens text-center font-semibold">
                Edit monthly expenses
              </div>
              <div className="flex justify-center gap-2 mt-2 px-2">
                <div
                  className={`col-span-1 flex border rounded-md overflow-hidden items-center pl-2 py-1 ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <img src={expensesIcon} className="w-8 mr-2" />
                  <input
                    type="text"
                    placeholder="Title"
                    onChange={updateTitleInput}
                    value={updateTitle}
                    className={`focus:outline-none pl-2 py-1 placeholder:text-xs ${
                      editButton ? "w-full" : ""
                    }`}
                  />
                </div>
                <div
                  className={`col-span-1 border rounded-md overflow-hidden flex items-center ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <input
                    type="number"
                    placeholder="Amount"
                    onChange={updateAmountInput}
                    value={updateAmount}
                    className={`focus:outline-none pl-2 py-1 placeholder:text-xs text-center ${
                      editButton ? "w-full" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorStyle && (
                <div className="mt-2 text-xs text-center text-[red] flex justify-center items-center space-x-2">
                  <div>
                    <FaExclamationCircle />
                  </div>
                  <div>{error}</div>
                </div>
              )}

              {updateLoading ? (
                <div className="mt-6 mb-3 w-full flex justify-center items-center space-x-2 px-2 h-2 rounded-md overflow-hidden">
                  <ThreeDot
                    style={{ fontSize: "7px" }}
                    variant="pulsate"
                    color="#2ec4b6"
                    text=""
                    textColor=""
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center mt-5">
                  <div className="flex items-center space-x-2 px-2 h-2 w-fit rounded-md overflow-hidden">
                    <div
                      className="flex gap-2 rounded-md border border-greens bg-greens hover:bg-lgreens px-2 py-1 cursor-pointer text-white font-semibold text-sm"
                      onClick={handleUpdate}
                    >
                      <button>
                        <GoChecklist className="text-lg" />
                      </button>
                      <span>Save</span>
                    </div>
                    <div
                      className="flex gap-2 rounded-md border border-[#FF4242] hover:border-[red] text-[#FF4242] hover:text-[red] px-2 py-1 cursor-pointer text-sm font-semibold"
                      onClick={() => {
                        setEditButton(false),
                          setError(""),
                          setErrorStyle(false);
                      }}
                    >
                      <div>
                        <BsBackspace className="text-lg" />
                      </div>
                      <span>Back</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Update & delete to show form */}
        {!editButton && (
          <>
            {!confirmDelete && (
              <div className="flex items-center w-fit rounded-md overflow-hidden">
                <div
                  onClick={() => setEditButton(true)}
                  className="p-2 rounded-[50%] cursor-pointer hover:text-greens hover:bg-btnHov active:bg-btnAct"
                >
                  <FaRegPenToSquare className="text-lgreens text-xl" />
                </div>

                <div
                  onClick={() => {
                    setConfirmDelete(true),
                      setDeleteStyle(true),
                      setErrorStyle(false);
                  }}
                  className="p-2 rounded-[50%] cursor-pointer hover:text-[red] hover:bg-btnHov active:bg-btnAct"
                >
                  <FaRegTrashCan className="text-[#FF4242] text-xl" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Data */}
      {confirmDelete && (
        <div className="absolute top-0 left-0 pt-[7rem] bg-light bg-opacity-70 h-hfull w-full">
          <div className="bg-white rounded-md shadow-md py-4">
            <div className="text-[red] text-center font-semibold">
              Delete monthly expenses
            </div>
            <div className="grid grid-cols-2 gap-2 grid-flow-col px-5 mt-2 clg:max-w-[608px] clg:mx-auto">
              <div className="border border-inputLight rounded-md overflow-hidden py-1 items-center flex px-2 col-span-1 font-medium space-x-3">
                <img src={expensesIcon} className="w-8 mr-2" />
                <div
                  style={{
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    display: "-webkit-box",
                  }}
                >
                  {title}
                </div>
              </div>
              <div className="border border-inputLight text-[red] font-semibold rounded-md overflow-hidden py-1 items-center justify-center flex px-2 col-span-1">
                {amount.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="mt-2 pt-1 px-2">
              <p className="text-xs text-center">
                Confirm deletion for{" "}
                <span className="text-xs text-[red] font-semibold">
                  {title}
                </span>{" "}
                expenses ?
              </p>
              <div className="flex justify-center space-x-16 mt-2 py-1">
                {deleteLoading ? (
                  <div>
                    <ThreeDot
                      style={{ fontSize: "7px" }}
                      variant="pulsate"
                      color="#ff0000"
                      text=""
                      textColor=""
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex gap-4">
                      <div
                        className="flex gap-2 border border-[#FF4242] hover:border-[red] text-[#FF4242] hover:text-[red] rounded-md px-2 py-1 items-center cursor-pointer font-semibold"
                        onClick={handleDelete}
                      >
                        <div>
                          <FaRegTrashCan className="text-lg" />
                        </div>
                        <span className="text-sm">Delete</span>
                      </div>
                      <div
                        className="flex gap-2 rounded-lg border border-greens hover:border-lgreens bg-greens hover:bg-lgreens  font-semibold px-2 py-1 items-center cursor-pointer"
                        onClick={() => {
                          setConfirmDelete(false), setDeleteStyle(false);
                        }}
                      >
                        <div>
                          <BsBackspace className="text-white text-lg" />
                        </div>
                        <span className="text-white text-sm">Cancel</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PMonthlyExpensesData;
