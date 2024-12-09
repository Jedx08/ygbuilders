import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const usePersonalExpenses = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchPersonalExpensesData, setPersonalExpensesLoading } =
    useContext(CalendarContext);

  const getMonthlyExpenses = async () => {
    try {
      const response = await axiosPrivate.get("/api/personal-expenses");
      const json = await response.data;

      if (response.status === 200) {
        dispatchPersonalExpensesData({ type: "set", payload: json });
        setPersonalExpensesLoading(false);
        return json;
      } else {
        throw new Error("Error getting data");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return getMonthlyExpenses;
};

export default usePersonalExpenses;
