import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetSavingsData = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchSavingsData, setSavingsIncomeLoading } =
    useContext(CalendarContext);

  const getSavingData = async () => {
    try {
      const response = await axiosPrivate.get("/api/savings");
      const result = await response.data;

      if (response.status === 200) {
        dispatchSavingsData({ type: "set", payload: result });
        setSavingsIncomeLoading(false);
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return getSavingData;
};

export default useGetSavingsData;
