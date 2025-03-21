import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetPersonalData = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchPersonalIncomeData, setPersonalIncomeLoading } =
    useContext(CalendarContext);

  const getPersonalData = async () => {
    try {
      const response = await axiosPrivate.get("/api/personal-income");
      const result = await response.data;

      if (response.status === 200) {
        dispatchPersonalIncomeData({ type: "set", payload: result });
        setPersonalIncomeLoading(false);
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return getPersonalData;
};

export default useGetPersonalData;
