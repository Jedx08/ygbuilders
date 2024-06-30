import { useEffect, useRef, useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";

const PersonalMonthlyExpenses = () => {
  const { setShowPersonalExpensesInput } = useContext(CalendarContext);
  const expensesRef = useRef();

  useEffect(() => {
    expensesRef.current.focus();
  });

  return (
    <>
      <div className="px-5 mb-5 mt-5">
        <label className="text-sm font-bold">Bills:</label>
        <div className="mb-2 flex border border-inputLight w-full rounded-md overflow-hidden">
          <div className="pl-2">
            <img className="w-6 mt-1" />
          </div>
          <div>
            <input
              type="number"
              placeholder="Add Total Bills"
              ref={expensesRef}
              className="focus:outline-none focus:border-oranges pl-4 py-1 caret-[red] placeholder:text-xs"
            />
          </div>
          <button onClick={() => setShowPersonalExpensesInput(false)}>
            submit
          </button>
        </div>
      </div>
    </>
  );
};

export default PersonalMonthlyExpenses;
