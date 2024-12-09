import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const useBusinessCapital = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchBusinessCapitalData, setBusinessCapitalLoading } =
    useContext(CalendarContext);

  const getMonthlyCapital = async () => {
    try {
      const response = await axiosPrivate.get("/api/business-capital");
      const json = await response.data;

      if (response.status === 200) {
        dispatchBusinessCapitalData({ type: "set", payload: json });
        setBusinessCapitalLoading(false);
        return json;
      } else {
        throw new Error("Error getting data");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return getMonthlyCapital;
};

export default useBusinessCapital;
