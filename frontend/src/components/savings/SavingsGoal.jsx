import React, { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import arrow from "../../media/arrow.png";
import arrowMoney from "../../media/arrow_money.png";
import { MdOutlinePostAdd } from "react-icons/md";
import { ThreeDot } from "react-loading-indicators";
import { FaExclamationCircle } from "react-icons/fa";
import SavingsGoalData from "./SavingsGoalData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SavingsGoal = ({
  goalGetData,
  goalDataLoading,
  goalFloat,
  savingsCurrentAmount,
  goalInfoLoading,
}) => {
  const { showGoalForm, setShowGoalForm, dispatchGoalData, setGoalLoading } =
    useContext(CalendarContext);
  const axiosPrivate = useAxiosPrivate();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  const [totalDays, setTotalDays] = useState("");

  const [addLoading, setAddLoading] = useState(false);

  const [errStyle, setErrStyle] = useState(false);
  const [errMsg, setErrMsg] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    const data = {
      title: title.toUpperCase(),
      amount: +amount,
      startDate: startDate,
      endDate: endDate,
      totalDays: +totalDays,
    };

    if (!title || !amount) {
      return (
        setErrMsg("Please fill out Title and Amount fields"),
        setErrStyle(true),
        setAddLoading(false)
      );
    }

    if (totalDays < 0) {
      return (
        setErrMsg("End date is before start date. Please check the dates."),
        setErrStyle(true),
        setAddLoading(false)
      );
    }

    try {
      const response = await axiosPrivate.post(
        "api/goal",
        JSON.stringify(data)
      );

      if (response.status === 200) {
        dispatchGoalData({
          type: "create",
          payload: response.data,
        });
        setGoalLoading(true);
        setAddLoading(false);
        setTitle("");
        setAmount("");
        setStartDate(null);
        setEndDate(null);
      }
    } catch (error) {
      if (error.response.status) {
        console.log("Error");
      }
    }
  };

  // goal title length validation
  const titleInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setTitle(value);
    }

    setErrStyle(false);
    setErrMsg("");
  };

  // goal amount length validation
  const amountInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setAmount(value);
    }
    setErrStyle(false);
    setErrMsg("");
  };

  return (
    <div
      className={`bg-white rounded-lg py-5 h-hfull clg:mx-auto ${
        goalFloat && showGoalForm
          ? "h-s100 w-full fixed left-0 top-0 bg-light bg-opacity-50 flex justify-center items-center"
          : "relative"
      }`}
    >
      <div
        className={`${
          goalFloat && showGoalForm
            ? "rounded-md bg-white overflow-hidden px-5 shadow-lg w-fit mx-auto py-5 relative min-w-[441px]"
            : ""
        }`}
      >
        {/* Close button */}
        {goalFloat && showGoalForm ? (
          <div
            onClick={() => {
              setShowGoalForm(false);
            }}
            className={`cursor-pointer hover:bg-light hover:rounded-full font-bold absolute top-1 right-1 mb-5 p-1 text-2xl`}
          >
            <IoClose className="text-lyellows hover:text-yellows" />
          </div>
        ) : (
          <></>
        )}

        <div className="text-center">
          <h1 className="font-bold text-lg text-yellows mb-2">Target Goal</h1>
        </div>

        {/* Monthly Expenses Data */}
        <div className={`h-[158px] clg:mx-auto clg:max-w-[608px]`}>
          {goalDataLoading && (
            <div className="text-center mt-3 text-sm text-[#A6ACAF]">
              Getting data...
            </div>
          )}

          {!goalDataLoading && goalGetData.length === 0 && (
            <div className="text-center mt-3">
              {/* title */}
              <div className="px-10 justify-center mt-5">
                <div
                  className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                    errStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img src={arrow} className={`w-10`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={titleInput}
                    className={`focus:outline-none pl-3 py-2 w-full placeholder:text-sm`}
                  />
                </div>
              </div>
              {/* amount */}
              <div className="px-10 justify-center mt-5">
                <div
                  className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                    errStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img src={arrowMoney} className={`w-10`} />
                  </div>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={amountInput}
                    className={`focus:outline-none pl-3 py-2 w-full placeholder:text-sm`}
                  />
                </div>
              </div>
              {/* date */}
              <div className="flex justify-center items-center space-x-4">
                <div className="flex justify-center items-center space-x-2 mt-3">
                  <DatePicker
                    showIcon
                    toggleCalendarOnIconClick
                    className="border border-inputLight w-32 font-medium rounded-md py-1 text-center cursor-pointer outline-none text-sm placeholder:font-normal"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                <div className="flex justify-center items-center space-x-2 mt-3">
                  <DatePicker
                    showIcon
                    className="border border-inputLight w-32 font-medium rounded-md py-1 text-center cursor-pointer outline-none text-sm placeholder:font-normal"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={dayjs()}
                    placeholderText="End Date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
              </div>
              {/* error message */}
              {errStyle && (
                <div className="mt-3 text-sm text-[red] flex justify-center items-center space-x-2">
                  <div>
                    <FaExclamationCircle />
                  </div>
                  <div>{errMsg}</div>
                </div>
              )}
              {/* add button */}
              {addLoading ? (
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
              ) : (
                <div
                  onClick={handleSubmit}
                  className={`${
                    errStyle ? "mt-2" : "mt-9"
                  } mx-auto py-1 rounded-md px-6 bg-yellows text-base font-semibold text-white hover:bg-lyellows flex gap-1 items-center cursor-pointer w-fit`}
                >
                  <span className="text-3xl">
                    <MdOutlinePostAdd />
                  </span>
                  Add
                </div>
              )}

              <div className="text-xs px-5 mt-3 text-[#555]">
                Note: You can select a date to calculate amount you need to save
                every day.
              </div>
            </div>
          )}

          {goalGetData.map((d, i) => {
            return (
              <React.Fragment key={i}>
                <SavingsGoalData
                  goals={d}
                  savingsCurrentAmount={savingsCurrentAmount}
                  goalInfoLoading={goalInfoLoading}
                />
              </React.Fragment>
            );
          })}
        </div>

        {/* Total Expenses */}
        {/* <div className="bottom-2 w-full">
          <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
            <div className="border border-inputLight rounded-md py-1 text-center w-fit">
              <div className="grid grid-cols-3 items-center">
                <div className="pl-2">
                  <img src="" className="w-11 mr-2" />
                </div>
                <div className="mt-[0.15rem]">
                  <p className="text-yellows font-bold text-xl/[24px]">
                    {amountGoal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SavingsGoal;
