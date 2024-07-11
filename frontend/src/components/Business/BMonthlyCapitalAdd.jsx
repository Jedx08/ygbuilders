import { useEffect, useRef, useContext, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { ThreeDot } from "react-loading-indicators";

const BMonthlyCapitalAdd = () => {
  const {
    monthIndex,
    setShowBusinessCapitalInput,
    dispatchBusinessCapitalData,
    setBusinessCapitalLoading,
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

  async function handleSubmit(e) {
    e.preventDefault();

    const numAmount = Number(amount);

    const data = {
      title: title,
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
        "/api/business-capital",
        JSON.stringify(data)
      );

      if (response.status === 200) {
        dispatchBusinessCapitalData({
          type: "create",
          payload: response.data,
        });
        setShowBusinessCapitalInput(false);
        setBusinessCapitalLoading(true);
        setLoadPage(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Invalid value, Amount must be a number");
      }
    }
  }

  return (
    <>
      <div className="px-5 font-pops">
        <div className="mb-2 flex space-x-2 justify-center">
          <div
            className={`border rounded-md overflow-hidden items-center ${
              errorStyle ? "border-[red]" : "border-inputLight"
            }`}
          >
            <input
              type="text"
              placeholder="Add Title"
              ref={expensesRef}
              onChange={(e) => {
                setTitle(e.target.value), setError(""), setErrorStyle(false);
              }}
              value={title}
              className="w-36 focus:outline-none focus:border-oranges pl-2 py-1 caret-inputLight placeholder:text-xs"
            />
          </div>
          <div
            className={`border rounded-md overflow-hidden items-center ${
              errorStyle ? "border-[red]" : "border-inputLight"
            }`}
          >
            <input
              type="number"
              placeholder="Add Amount"
              onChange={(e) => {
                setAmount(e.target.value), setError(""), setErrorStyle(false);
              }}
              value={amount}
              className="w-36 focus:outline-none focus:border-oranges pl-2 py-1 caret-inputLight placeholder:text-xs"
            />
          </div>
          <div className="flex items-center space-x-2 px-2 h-2 w-fit rounded-md overflow-hidden">
            {addLoading ? (
              <ThreeDot
                style={{ fontSize: "7px" }}
                variant="pulsate"
                color="#ff9f1c"
                text=""
                textColor=""
              />
            ) : (
              <>
                <button onClick={handleSubmit}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className=" text-oranges hover:text-loranges text-2xl"
                  />
                </button>
                <div onClick={() => setShowBusinessCapitalInput(false)}>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className=" text-[#FF4242] hover:text-[red] cursor-pointer text-2xl"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mb-2 text-xs text-center text-[red]">{error}</div>
      </div>
    </>
  );
};

export default BMonthlyCapitalAdd;
