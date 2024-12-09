import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetBusinessData = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchBusinessIncomeData, setBusinessIncomeLoading } =
    useContext(CalendarContext);

  const getBusinessData = async () => {
    try {
      const response = await axiosPrivate.get("/api/business-income");
      const result = await response.data;
      if (response.status === 200) {
        dispatchBusinessIncomeData({ type: "set", payload: result });
        setBusinessIncomeLoading(false);
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return getBusinessData;
};

export default useGetBusinessData;
