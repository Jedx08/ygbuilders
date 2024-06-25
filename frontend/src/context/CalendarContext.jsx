import dayjs from "dayjs";
import { createContext, useEffect, useState } from "react";

export const CalendarContext = createContext();

export const CalendarContextProvider = (props) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [formSelectedDate, setFormSelectedDate] = useState(null);
  const [exactDaySelected, setExactDaySelected] = useState(dayjs());

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
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
};
