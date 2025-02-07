import { useContext, useState } from "react";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ThreeDot } from "react-loading-indicators";
import avatar1 from "../media/avatar1.png";
import avatar2 from "../media/avatar2.png";
import avatar3 from "../media/avatar3.png";

const SelectAvatar = () => {
  const { setIsAvatar } = useContext(CalendarContext);
  const axiosPrivate = useAxiosPrivate();
  const { userInfo, setUserInfo } = useAuth();

  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function handleUpdate() {
    setIsLoading(true);
    if (!selectedAvatar) {
      return setErrMsg("Please select an avatar "), setIsLoading(false);
    }

    const data = { avatar: selectedAvatar };

    try {
      const response = await axiosPrivate.patch(
        "/user/avatar",
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const json = await response.data;

      if (response.status === 200) {
        setUserInfo((prev) => {
          return {
            ...prev,
            avatar: json.avatar,
          };
        });
        setIsLoading(false);
        setIsAvatar(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setErrMsg(err.response?.data?.message);
      }
    }
  }

  return (
    <div className="font-pops h-s100 w-full fixed left-0 top-0 flex bg-light bg-opacity-70">
      <div className="bg-white rounded-md shadow-lg h-hfit mx-auto mt-36 pt-1 z-10">
        <div className="flex justify-end h-hfit">
          <div
            onClick={() => {
              setIsAvatar(false);
            }}
            className="cursor-pointer text-2xl mr-1 rounded-full text-greens w-fit p-1 hover:bg-light hover:text-lgreens"
          >
            <IoClose />
          </div>
        </div>
        <div className="px-7 pb-5">
          <div className="text-center font-semibold text-lg text-greens">
            Select Avatar
          </div>
          <div className="flex flex-wrap justify-center gap-5 mt-3">
            <div
              onClick={() => {
                if (userInfo.avatar !== "avatar1") {
                  setSelectedAvatar("avatar1");
                  setErrMsg("");
                }
              }}
              className={`px-1 pt-1 rounded-md border-2 relative ${
                selectedAvatar === "avatar1" ? "border-greens" : "border-light"
              } ${
                userInfo.avatar === "avatar1"
                  ? ""
                  : "cursor-pointer hover:border-greens"
              }`}
            >
              <img src={avatar1} className="w-20" />
              {selectedAvatar === "avatar1" ? (
                <div className="absolute top-0 right-0 text-lg text-[green]">
                  <IoIosCheckmarkCircle />
                </div>
              ) : (
                <></>
              )}
            </div>
            <div
              onClick={() => {
                if (userInfo.avatar !== "avatar2") {
                  setSelectedAvatar("avatar2");
                  setErrMsg("");
                }
              }}
              className={`px-1 pt-1 rounded-md border-2 relative ${
                selectedAvatar === "avatar2" ? "border-greens" : "border-light"
              } ${
                userInfo.avatar === "avatar2"
                  ? ""
                  : "cursor-pointer hover:border-greens"
              }`}
            >
              <img src={avatar2} className="w-20" />
              {selectedAvatar === "avatar2" ? (
                <div className="absolute top-0 right-0 text-lg text-[green]">
                  <IoIosCheckmarkCircle />
                </div>
              ) : (
                <></>
              )}
            </div>
            <div
              onClick={() => {
                if (userInfo.avatar !== "avatar3") {
                  setSelectedAvatar("avatar3");
                  setErrMsg("");
                }
              }}
              className={`px-1 pt-1 rounded-md border-2 relative ${
                selectedAvatar === "avatar3" ? "border-greens" : "border-light"
              } ${
                userInfo.avatar === "avatar3"
                  ? ""
                  : "cursor-pointer hover:border-greens"
              }`}
            >
              <img src={avatar3} className="w-20" />
              {selectedAvatar === "avatar3" ? (
                <div className="absolute top-0 right-0 text-lg text-[green]">
                  <IoIosCheckmarkCircle />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          {errMsg && (
            <p className="text-xs text-center text-[red] mt-2">{errMsg}</p>
          )}

          {isLoading ? (
            <div className="mx-auto py-[2px] mt-5 rounded-md px-4 bg-[#3578E5] font-bold text-white w-fit">
              <ThreeDot
                style={{ fontSize: "7px" }}
                variant="pulsate"
                color="#fff"
                text=""
                textColor=""
              />
            </div>
          ) : (
            <div
              onClick={handleUpdate}
              className="rounded-md bg-[#1877f2] hover:bg-[#3578E5] text-white mx-auto w-fit px-3 py-[2px] mt-5 cursor-pointer font-medium"
            >
              Save
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectAvatar;
