import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const useBusinessExpenses = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchBusinessExpensesData, setBusinessExpensesLoading } =
    useContext(CalendarContext);

  const getMonthlyExpenses = async () => {
    try {
      const response = await axiosPrivate.get("/api/business-expenses");
      const json = await response.data;

      if (response.status === 200) {
        dispatchBusinessExpensesData({ type: "set", payload: json });
        setBusinessExpensesLoading(false);
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

export default useBusinessExpenses;
