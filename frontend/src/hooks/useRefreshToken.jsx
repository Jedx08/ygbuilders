import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth, setUserInfo } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        _id: response.data._id,
        useremail: response.data.useremail,
      };
    });
    setUserInfo(() => {
      return {
        avatar: response.data.avatar,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
