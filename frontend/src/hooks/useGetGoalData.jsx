import { useContext } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetGoalData = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dispatchGoalData, setGoalLoading } = useContext(CalendarContext);

  const getGoal = async () => {
    try {
      const response = await axiosPrivate.get("/api/goal");
      const json = await response.data;

      if (response.status === 200) {
        dispatchGoalData({ type: "set", payload: json });
        setGoalLoading(false);
        return json;
      } else {
        throw new Error("Error getting data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return getGoal;
};

export default useGetGoalData;
