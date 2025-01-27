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
      };
    });
    setUserInfo(() => {
      return {
        avatar: response.data.avatar,
        instructions: response.data.instructions,
        foundUsername: response.data.foundUsername,
        email: response.data.email,
        provider: response.data.provider,
        personal_title: response.data.personal_title,
        business_title: response.data.business_title,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
