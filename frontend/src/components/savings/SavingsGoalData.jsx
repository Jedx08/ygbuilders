import { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import target from "../../media/arrow.png";
import { GoChecklist } from "react-icons/go";
import dayjs from "dayjs";
import { BsBackspace } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { ThreeDot } from "react-loading-indicators";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import arrow from "../../media/arrow.png";
import arrowS from "../../media/arrow_savings.png";

const SavingsGoalData = ({ goals, savingsCurrentAmount }) => {
  const { dispatchGoalData, setGoalLoading } = useContext(CalendarContext);
  const axiosPrivate = useAxiosPrivate();

  const [remainingDays, setRemainingDays] = useState("");
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [congratsMsg, setCongratsMsg] = useState(true);
  const [congratsMsgStart, setCongratsMsgStart] = useState(false);
  const [errStyle, setErrStyle] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [updateAmount, setUpdateAmount] = useState(goals.amount);
  const [updateTitle, setUpdateTitle] = useState(goals.title);
  const [updateConfirm, setUpdateConfirm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    goals.startDate ? goals.startDate : null
  );
  const [endDate, setEndDate] = useState(goals.endDate ? goals.endDate : null);
  const [totalDays, setTotalDays] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (startDate && endDate) {
      const daysDiff = end.diff(start, "day");
      setTotalDays(daysDiff + 1);
    } else {
      setTotalDays("");
    }
  }, [startDate, endDate]);

  const handleUpdate = async () => {
    setUpdateLoading(true);

    const update = {
      title: updateTitle.toUpperCase(),
      amount: +updateAmount,
      startDate: startDate,
      endDate: endDate,
      totalDays: +totalDays,
    };

    if (!updateTitle || !updateAmount) {
      return (
        setErrMsg("Please fill out the fields"),
        setErrStyle(true),
        setUpdateLoading(false)
      );
    }

    if (totalDays < 0) {
      return (
        setErrMsg("End date is before start date. Please check the dates."),
        setErrStyle(true),
        setUpdateLoading(false)
      );
    }

    if (isNaN(updateAmount)) {
      return (
        setErrMsg("Invalid value, Amount must be a Number"),
        setErrStyle(true),
        setUpdateLoading(false)
      );
    }

    try {
      const response = await axiosPrivate.patch(
        "/api/goal/" + goals._id,
        JSON.stringify(update)
      );
      const json = await response.data;

      if (response.status === 200) {
        setShowStartDate(false);
        setShowEndDate(false);
        dispatchGoalData({ type: "update", payload: json });
        setGoalLoading(true);
        setUpdateLoading(false);
        setUpdateConfirm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      const response = await axiosPrivate.delete("/api/goal/" + goals._id);

      if (response.status === 200) {
        dispatchGoalData({
          type: "delete",
          payload: response.data,
        });
        setGoalLoading(true);
        setDeleteLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const start = dayjs();
    const end = dayjs(goals.endDate);

    const startEnd = end.diff(start, "day");

    const startOnly = dayjs().diff(dayjs(goals.startDate), "day");

    const endOnly = end.diff(start, "day");

    if (goals.startDate && goals.endDate) {
      return (
        setShowStartDate(false),
        setShowEndDate(false),
        setRemainingDays(startEnd + 1)
      );
    }

    if (goals.startDate && !goals.endDate) {
      return (
        setShowStartDate(true),
        setRemainingDays(startOnly + 1),
        setCongratsMsg(false),
        setCongratsMsgStart(true)
      );
    }

    if (!goals.startDate && goals.endDate) {
      return setShowEndDate(true), setRemainingDays(endOnly + 1);
    }
  }, [goals.startDate, goals.endDate, goals]);

  // goal title length validation
  const titleInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setUpdateTitle(value);
    }

    setErrStyle(false);
    setErrMsg("");
  };

  // goal amount length validation
  const amountInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setUpdateAmount(value);
    }
    setErrStyle(false);
    setErrMsg("");
  };

  return (
    <div className="px-5">
      <div>
        {!updateConfirm && (
          <div className="bg-subCon py-2 rounded-md">
            <div className="flex justify-center space-y-2 space-x-4">
              <div className="pl-3 flex justify-start items-center">
                <img src={target} alt="goal" className="w-11" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  <span
                    style={{
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      display: "-webkit-box",
                    }}
                  >
                    {goals.title}
                  </span>
                </div>
                <div className="font-bold text-greens text-xl/[24px] mdd:text-lg">
                  {goals.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* update data */}
      {updateConfirm && (
        <div className="bg-subCon py-2 rounded-md">
          <div className="flex flex-col justify-center items-center space-y-2">
            {/* title */}
            <div className="px-10 justify-center mt-5">
              <div
                className={`bg-white border border-inputLight rounded-md overflow-hidden flex items-center mx-auto w-[70%]`}
              >
                <div className="pl-2">
                  <img src={arrow} className={`w-10`} />
                </div>
                <input
                  type="text"
                  placeholder="Title"
                  value={updateTitle}
                  onChange={titleInput}
                  className={`focus:outline-none pl-3 py-2 w-full placeholder:text-sm`}
                />
              </div>
            </div>
            {/* amount */}
            <div className="px-10 justify-center mt-5">
              <div
                className={`bg-white border border-inputLight rounded-md overflow-hidden flex items-center mx-auto w-[70%]`}
              >
                <div className="pl-2">
                  <img src={arrowS} className={`w-10`} />
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={updateAmount}
                  onChange={amountInput}
                  className={`focus:outline-none pl-3 py-2 w-full placeholder:text-sm`}
                />
              </div>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex justify-center items-center space-x-2 mt-3">
                <DatePicker
                  showIcon
                  className="border border-inputLight w-32 font-medium rounded-md py-1 text-center cursor-pointer outline-none items text-sm placeholder:font-normal"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  dateFormat="MMM d, yyyy"
                />
              </div>
              <div className="flex justify-center items-center space-x-2 mt-3">
                <DatePicker
                  showIcon
                  className="border border-inputLight w-32 font-medium rounded-md py-1 text-center cursor-pointer outline-none items text-sm placeholder:font-normal"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={dayjs()}
                  placeholderText="End Date"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* button */}
      {!confirmDelete && (
        <>
          {!updateConfirm && (
            <div className="flex items-center justify-evenly mt-3">
              <div
                onClick={() => {
                  setUpdateConfirm(true);
                }}
                className="py-1 rounded-md px-6 bg-yellows text-base font-semibold text-white hover:bg-lyellows flex gap-2 items-center cursor-pointer border w-fit"
              >
                <span className="text-3xl">
                  <GoChecklist />
                </span>
                Edit
              </div>
              <div
                onClick={() => {
                  setConfirmDelete(true);
                }}
                className="flex gap-2 items-center border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md py-1 px-4 text-[#FF4242] hover:text-[red] text-base font-semibold w-fit"
              >
                <span className="text-3xl">
                  <FaRegTrashCan />
                </span>
                Delete
              </div>
            </div>
          )}
          {updateConfirm && (
            <>
              <div className="flex items-center justify-evenly mt-3">
                {updateLoading ? (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="">
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
                  </>
                ) : (
                  <>
                    <div
                      onClick={handleUpdate}
                      className="py-1 rounded-md px-6 bg-yellows text-sm font-semibold text-white hover:bg-lyellows flex gap-2 items-center cursor-pointer border w-fit"
                    >
                      <span className="text-2xl">
                        <GoChecklist />
                      </span>
                      Save
                    </div>
                  </>
                )}
                <div
                  onClick={() => {
                    if (updateLoading) {
                      location.reload();
                    } else {
                      setUpdateConfirm(false);
                      setUpdateAmount(goals.amount);
                      setUpdateTitle(goals.title);
                      setStartDate(goals.startDate);
                      setEndDate(goals.endDate);
                    }
                  }}
                  className="flex gap-2 items-center cursor-pointer rounded-md py-1 px-4 border border-[red] text-[#FF4242] hover:text-[red] text-sm font-semibold w-fit"
                >
                  <span className="text-2xl">
                    <BsBackspace />
                  </span>
                  Cancel
                </div>
              </div>
            </>
          )}
        </>
      )}

      {errStyle && <div className="text-center">{errMsg}</div>}

      {confirmDelete && (
        <div className="bg-subCon py-3 rounded-md mt-3">
          <div className="text-xs text-center">
            Confirm deletion for{" "}
            <span className="text-[red] text-base font-semibold">
              {goals.title}
            </span>{" "}
            savings ?
          </div>
          <div className="flex justify-center gap-6 mt-2 mb-1">
            {deleteLoading ? (
              <>
                <div>
                  <ThreeDot
                    style={{ fontSize: "7px" }}
                    variant="pulsate"
                    color="#ff0000"
                    text=""
                    textColor=""
                  />
                </div>
              </>
            ) : (
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
              </>
            )}

            <div
              className="text-yellows hover:text-lyellows font-bold cursor-pointer text-sm flex items-center gap-1"
              onClick={() => {
                if (deleteLoading) {
                  location.reload();
                } else {
                  setConfirmDelete(false);
                }
              }}
            >
              <span className={`text-xl`}>
                <BsBackspace />
              </span>{" "}
              Cancel
            </div>
          </div>
        </div>
      )}

      {/* info */}
      {!confirmDelete && !updateConfirm && (
        <div className="bg-subCon py-3 rounded-md mt-3">
          <div className="text-sm font-medium px-5 text-[#555]">
            {savingsCurrentAmount >= goals.amount ? (
              <></>
            ) : (
              <>
                {goals.startDate && goals.endDate && (
                  <>
                    You need to save atleast{" "}
                    <span className="text-greens font-bold text-base underline">
                      {(goals.amount / goals.totalDays).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>{" "}
                    amount everyday.
                  </>
                )}
              </>
            )}
          </div>
          <div className="text-sm font-medium px-5 text-[#555]">
            {savingsCurrentAmount >= goals.amount ? (
              <div className="text-center mt-5">
                {congratsMsg && <>Congratulations you reached your Goal</>}
                {congratsMsgStart && (
                  <>
                    Congratulations you reached your Goal in{" "}
                    <span className="text-base font-bold text-greens underline">
                      {remainingDays}
                    </span>{" "}
                    days
                  </>
                )}
              </div>
            ) : (
              <>
                Remaining amount:{" "}
                <span className="text-base font-bold text-[red] underline">
                  {(goals.amount - savingsCurrentAmount).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>{" "}
                amount
              </>
            )}
          </div>
          <div className="text-sm font-medium px-5 text-[#555]">
            {savingsCurrentAmount >= goals.amount ? (
              <></>
            ) : (
              <>
                {goals.startDate && goals.endDate && (
                  <>
                    Remaining days:{" "}
                    <span
                      className={`text-base font-bold underline ${
                        remainingDays > 0 ? "text-greens" : "text-[red]"
                      }`}
                    >
                      {remainingDays}
                    </span>
                  </>
                )}
                {showStartDate && (
                  <>
                    Days count:{" "}
                    <span className="text-base font-bold text-[red] underline">
                      {remainingDays}
                    </span>
                  </>
                )}
                {showEndDate && (
                  <>
                    Remaining days:{" "}
                    <span
                      className={`text-base font-bold underline ${
                        remainingDays > 0 ? "text-greens" : "text-[red]"
                      }`}
                    >
                      {remainingDays}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalData;
