import dayjs from "dayjs";
import { createContext, useEffect, useReducer, useState } from "react";

export const CalendarContext = createContext();

function personalIncomeDataReducer(state, { type, payload }) {
  switch (type) {
    case "set":
      return [...payload];
    case "create":
      return [...state, payload];
    case "update":
      return state.map((evnt) => (evnt.id === payload.id ? payload : evnt));
    case "delete":
      return state.filter((evnt) => evnt.id !== payload.id);
    default:
      throw new Error();
  }
}

export const CalendarContextProvider = (props) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [formSelectedDate, setFormSelectedDate] = useState(null);
  const [exactDaySelected, setExactDaySelected] = useState(dayjs());
  const [personalIncomeData, dispatchPersonalIncomeData] = useReducer(
    personalIncomeDataReducer,
    []
  );

  useEffect(() => {
    if (!showPersonalForm) {
      setFormSelectedDate(null);
    }
  }, [showPersonalForm]);

  return (
    <CalendarContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        showPersonalForm,
        setShowPersonalForm,
        formSelectedDate,
        setFormSelectedDate,
        exactDaySelected,
        setExactDaySelected,
        personalIncomeData,
        dispatchPersonalIncomeData,
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
};
