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

function businessIncomeDataReducer(state, { type, payload }) {
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

function businessExpensesDataReducer(state, { type, payload }) {
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

function businessCapitalDataReducer(state, { type, payload }) {
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

export const CalendarContextProvider = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loggedIn, setLoggedIn] = useState(true); // user login ?
  const [personalSummaryView, setPersonalSummaryView] = useState(true);
  const [inMobile, setInMobile] = useState(false);
  const [loadPage, setLoadPage] = useState(false); // load current page
  const [isAvatar, setIsAvatar] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [monthIndex, setMonthIndex] = useState(dayjs().month()); // to change month by index
  const [showPersonalForm, setShowPersonalForm] = useState(false); // show personal form
  const [showBusinessForm, setShowBusinessForm] = useState(false); // show business form
  const [formSelectedDate, setFormSelectedDate] = useState(null); // selected date for personal form with data
  const [businessFormSelectedDate, setBusinessFormSelectedDate] = // selected date for business form with data
    useState(null);
  const [isDataPersonal, setIsDataPersonal] = useState(true);
  const [isDataBusiness, setIsDataBusiness] = useState(true);
  const [exactDaySelected, setExactDaySelected] = useState(dayjs()); // selected date
  const [personalIncomeLoading, setPersonalIncomeLoading] = useState(true);
  const [personalExpensesLoading, setPersonalExpensesLoading] = useState(true);
  const [showPersonalExpenseForm, setShowPersonalExpensesForm] =
    useState(false);
  const [businessIncomeLoading, setBusinessIncomeLoading] = useState(true);
  const [businessExpensesLoading, setBusinessExpensesLoading] = useState(true);
  const [showBusinessExpenseForm, setShowBusinessExpensesForm] =
    useState(false);
  const [showBusinessCapitalForm, setShowBusinessCapitalForm] = useState(false);
  const [businessCapitalLoading, setBusinessCapitalLoading] = useState(true);
  const [showBusinessCapitalInput, setShowBusinessCapitalInput] =
    useState(false);
  const [showPersonalExpenseInput, setShowPersonalExpensesInput] =
    useState(false);
  const [showBusinessExpenseInput, setShowBusinessExpensesInput] =
    useState(false);
  const [personalIncomeData, dispatchPersonalIncomeData] = useReducer(
    personalIncomeDataReducer,
    []
  );
  const [personalExpensesData, dispatchPersonalExpensesData] = useReducer(
    personalExpensesDataReducer,
    []
  );
  const [businessIncomeData, dispatchBusinessIncomeData] = useReducer(
    businessIncomeDataReducer,
    []
  );
  const [businessExpensesData, dispatchBusinessExpensesData] = useReducer(
    businessExpensesDataReducer,
    []
  );
  const [businessCapitalData, dispatchBusinessCapitalData] = useReducer(
    businessCapitalDataReducer,
    []
  );

  useEffect(() => {
    if (!showPersonalForm) {
      setFormSelectedDate(null);
    }
  }, [showPersonalForm]);

  useEffect(() => {
    if (!showBusinessForm) {
      setFormSelectedDate(null);
    }
  }, [showBusinessForm]);

  return (
    <CalendarContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
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
        businessIncomeData,
        dispatchBusinessIncomeData,
        showBusinessForm,
        setShowBusinessForm,
        businessFormSelectedDate,
        setBusinessFormSelectedDate,
        businessIncomeLoading,
        setBusinessIncomeLoading,
        showBusinessExpenseForm,
        setShowBusinessExpensesForm,
        businessExpensesLoading,
        setBusinessExpensesLoading,
        businessExpensesData,
        dispatchBusinessExpensesData,
        showBusinessExpenseInput,
        setShowBusinessExpensesInput,
        showBusinessCapitalForm,
        setShowBusinessCapitalForm,
        businessCapitalLoading,
        setBusinessCapitalLoading,
        showBusinessCapitalInput,
        setShowBusinessCapitalInput,
        businessCapitalData,
        dispatchBusinessCapitalData,
        isDataPersonal,
        setIsDataPersonal,
        isDataBusiness,
        setIsDataBusiness,
        inMobile,
        setInMobile,
        isAvatar,
        setIsAvatar,
        avatarLoading,
        setAvatarLoading,
        personalSummaryView,
        setPersonalSummaryView,
        loggedIn,
        setLoggedIn,
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
};
