import { useRef, useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import dayjs from "dayjs";
import PersonalMonthlyExpenses from "./PersonalMonthlyExpenses";

const PersonalExpenses = () => {
  const {
    monthIndex,
    setShowPersonalExpenses,
    dispatchPersonalExpensesData,
    showPersonalExpenseInput,
    setShowPersonalExpensesInput,
  } = useContext(CalendarContext);
  const [bills, setBills] = useState("");
  const [loans, setLoans] = useState("");
  const [insurance, setInsurance] = useState("");
  const [tuition, setTuition] = useState("");
  const [rent, setRent] = useState("");
  const [other, setOther] = useState("");
  // async function handleSubmit(e) {
  //   e.preventDefault();

  //   const data = {
  //     bills: +bills,
  //     loans: +loans,
  //     insurance: +insurance,
  //     tuition: +tuition,
  //     other: +other,
  //     total_expenses: bills + loans + insurance + tuition + other,
  //     month: dayjs().month(monthIndex).format("MMMM YYYY"),
  //
  //   };

  //   if (!gross && !expenses) {
  //     return setError("Please fill atleast one of the fields");
  //   }

  //   // Update data
  //   if (formSelectedDate) {
  //     try {
  //       const response = await axiosPrivate.patch(
  //         "/api/personal-income/" + formSelectedDate._id,
  //         JSON.stringify(data)
  //       );
  //       if (response.status === 200) {
  //         dispatchPersonalIncomeData({ type: "update", payload: data });
  //         setError(null);
  //         setShowPersonalForm(false);
  //         setDataLoading(true);
  //       }
  //     } catch (err) {
  //       setError(err);
  //     }
  //   } else {
  //     // Create data
  //     try {
  //       const response = await axiosPrivate.post(
  //         "/api/personal-income",
  //         JSON.stringify(data)
  //       );

  //       if (response.status === 200) {
  //         dispatchPersonalIncomeData({
  //           type: "create",
  //           payload: response.data,
  //         });
  //         setFormSelectedDate(null);
  //         setError(null);
  //         setShowPersonalForm(false);
  //         setDataLoading(true);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }

  function addExpenses() {
    setShowPersonalExpensesInput(true);
  }

  console.log();

  return (
    <>
      <div className="font-pops h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-70">
        <form className="rounded-md bg-white overflow-hidden px-5">
          <div className="flex items-center justify-center relative w-full">
            <div className="text-center mt-6">
              <h1 className="font-bold text-2xl text-oranges">
                Monthly Expenses
              </h1>
              <p className="text-xs font-semibold">
                {dayjs(new Date(dayjs().year(), monthIndex)).format(
                  "MMMM YYYY"
                )}
              </p>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault(), setShowPersonalExpenses(false);
              }}
              className="absolute right-0 pr-2 mb-5 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-xl text-loranges hover:text-oranges"
              />
            </div>
          </div>

          <div
            onClick={addExpenses}
            className={`${showPersonalExpenseInput ? "hidden" : ""}`}
          >
            +
          </div>

          <div>{showPersonalExpenseInput && <PersonalMonthlyExpenses />}</div>

          {/* Total Expenses */}
          <div className="px-5 mb-5">
            <p className="text-sm font-bold">Total Expenses:</p>
            <div className="border border-inputLight rounded-md py-1 text-center mx-auto w-fit">
              <div className="grid grid-cols-3">
                <div className="pl-2">
                  <img className="w-7 mr-3" />
                </div>
                <div className="mt-[0.15rem]">
                  <p className="text-[red]">
                    {+bills + +rent + +loans + +insurance + +tuition + +other}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-10 mb-10">
            <div className="mb-2">
              <button className="mx-auto py-1 rounded-md px-6 bg-oranges font-bold text-white hover:bg-lgreens">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PersonalExpenses;
