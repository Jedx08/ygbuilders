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
      return state.filter((evnt) => evnt._id !== payload._id);
    default:
      throw new Error();
  }
}

function personalExpensesDataReducer(state, { type, payload }) {
  switch (type) {
    case "set":
      return [...payload];
    case "create":
      return [...state, payload];
    case "update":
      return state.map((evnt) => (evnt._id === payload._id ? payload : evnt));
    case "delete":
      return state.filter((evnt) => evnt._id !== payload._id);
    default:
      throw new Error();
  }
}

export const CalendarContextProvider = (props) => {
  const [loadPage, setLoadPage] = useState(false);
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [formSelectedDate, setFormSelectedDate] = useState(null);
  const [exactDaySelected, setExactDaySelected] = useState(dayjs());
  const [personalIncomeLoading, setPersonalIncomeLoading] = useState(true);
  const [personalExpensesLoading, setPersonalExpensesLoading] = useState(false);
  const [showPersonalExpenseForm, setShowPersonalExpensesForm] =
    useState(false);
  const [showPersonalExpenseInput, setShowPersonalExpensesInput] =
    useState(false);
  const [personalIncomeData, dispatchPersonalIncomeData] = useReducer(
    personalIncomeDataReducer,
    []
  );
  const [personalExpensesData, dispatchPersonalExpensesData] = useReducer(
    personalExpensesDataReducer,
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
        personalIncomeLoading,
        setPersonalIncomeLoading,
        showPersonalExpenseForm,
        setShowPersonalExpensesForm,
        personalExpensesData,
        dispatchPersonalExpensesData,
        showPersonalExpenseInput,
        setShowPersonalExpensesInput,
        personalExpensesLoading,
        setPersonalExpensesLoading,
        loadPage,
        setLoadPage,
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
};
