import { useEffect, useRef, useContext, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { BsBackspace } from "react-icons/bs";
import { MdOutlinePostAdd } from "react-icons/md";
import expensesIcon from "../../../media/expenses.png";
import dayjs from "dayjs";
import { ThreeDot } from "react-loading-indicators";

const PMonthlyExpensesAdd = () => {
  const {
    monthIndex,
    setShowPersonalExpensesInput,
    dispatchPersonalExpensesData,
    setPersonalExpensesLoading,
    setLoadPage,
  } = useContext(CalendarContext);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [errorStyle, setErrorStyle] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const expensesRef = useRef();

  useEffect(() => {
    expensesRef.current.focus();
  }, []);

  useEffect(() => {
    setError("");
    setErrorStyle(false);
  }, [title, amount]);

  async function handleSubmit(e) {
    e.preventDefault();

    const numAmount = Number(amount);

    const data = {
      title: title.toUpperCase(),
      amount: +amount,
      month: dayjs().month(monthIndex).format("MMMM YYYY"),
    };

    if (!title || !amount) {
      return setErrorStyle(true), setError("Please fill out all of the fields");
    }

    if (isNaN(numAmount)) {
      return setError("Invalid value, Amount must be a number");
    }

    setAddLoading(true);
    setLoadPage(true);

    // Create data
    try {
      const response = await axiosPrivate.post(
        "/api/personal-expenses",
        JSON.stringify(data)
      );

      if (response.status === 200) {
        dispatchPersonalExpensesData({
          type: "create",
          payload: response.data,
        });
        setShowPersonalExpensesInput(false);
        setPersonalExpensesLoading(true);
        setLoadPage(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Invalid value, Amount must be a number");
      }
    }
  }

  // expenses title length validation
  const titleInput = (event) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setTitle(value);
    }
  };

  // expenses amount length validation
  const amountInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setAmount(value);
    }
  };

  return (
    <>
      <div className="px-5 pt-5 font-pops py-4 rounded-md bg-white shadow-md">
        <div className="text-greens text-center font-semibold">
          Add monthly expenses
        </div>
        <div className="mb-2 flex space-x-2 justify-center pt-2">
          <div
            className={`flex border rounded-md overflow-hidden items-center pl-2 ${
              errorStyle ? "border-[red]" : "border-inputLight"
            }`}
          >
            <img src={expensesIcon} className="w-8 mr-2 py-1" />
            <input
              type="text"
              placeholder="Title"
              ref={expensesRef}
              onChange={titleInput}
              value={title}
              className="w-36 focus:outline-none focus:border-oranges pl-2 py-1 placeholder:text-xs"
            />
          </div>
          <div
            className={`border rounded-md overflow-hidden flex items-center ${
              errorStyle ? "border-[red]" : "border-inputLight"
            }`}
          >
            <input
              type="number"
              placeholder="Amount"
              onChange={amountInput}
              value={amount}
              className="w-36 focus:outline-none focus:border-oranges pl-2 py-1 placeholder:text-xs"
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-2 text-xs text-center text-[red]">{error}</div>

        <div className="flex items-center mx-auto gap-3 px-2 h-2 mt-4 w-fit rounded-md overflow-hidden">
          {addLoading ? (
            <div className="mt-2">
              <ThreeDot
                style={{ fontSize: "7px" }}
                variant="pulsate"
                color="#2ec4b6"
                text=""
                textColor=""
              />
            </div>
          ) : (
            <>
              <div
                onClick={handleSubmit}
                className="text-sm text-white flex items-center gap-2 rounded-md px-2 py-1 cursor-pointer bg-greens hover:bg-lgreens font-semibold"
              >
                <button>
                  <MdOutlinePostAdd className="text-2xl" />
                </button>
                Add
              </div>
              <div
                onClick={() => setShowPersonalExpensesInput(false)}
                className="text-sm text-[#FF4242] hover:text-[red] flex items-center gap-2 border border-[#FF4242] hover:border-[red] rounded-md px-2 py-1 cursor-pointer font-semibold"
              >
                <div>
                  <BsBackspace className="text-[#FF4242] hover:text-[red] text-lg" />
                </div>
                Back
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PMonthlyExpensesAdd;
