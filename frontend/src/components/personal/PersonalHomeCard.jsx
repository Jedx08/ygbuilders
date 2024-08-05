import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useGetData from "../../hooks/useGetPersonalData";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { ThreeDot, OrbitProgress } from "react-loading-indicators";
import Skeleton from "react-loading-skeleton";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import networth from "../../media/networth.png";
import { FcCalendar, FcBusinessman, FcStatistics } from "react-icons/fc";
import { FaRegPenToSquare } from "react-icons/fa6";

const PersonalHomeCard = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const getPersonalData = useGetData();
  const getMonthlyExpenses = usePersonalExpenses();

  const [gross, setGross] = useState(0);

  const [title, setTitle] = useState("");
  const [hasTitle, setHasTitle] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const [personalAddButton, setPersonalAddbutton] = useState(true);
  const [personalProceedButton, setPersonalProceedButton] = useState(false);
  const [personalEditButton, setPersonalEditButton] = useState(false);

  const [overallMonthlyExpenses, setOVerallMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const titleRef = useRef();

  useEffect(() => {
    let g = 0;
    let e = 0;
    let m_e = 0;

    //overall data
    const overallData = async () => {
      const overallData = await getPersonalData();
      const monthData = await getMonthlyExpenses();

      overallData.forEach((data) => {
        return (g += data.gross), (e += data.expenses);
      });

      monthData.forEach((data) => {
        m_e += data.amount;
      });

      setGross(g);
      setOVerallMonthlyExpenses(m_e + e);
    };

    overallData();
  }, []);

  useEffect(() => {
    const getTitle = async () => {
      setIsLoading(true);
      const _id = await auth?._id;

      if (_id) {
        try {
          const response = await axiosPrivate.get("/user/" + _id);
          const jsonTitle = await response.data.personal_title;

          if (response.status === 200) {
            setUpdatedTitle(jsonTitle);
            setTitle(jsonTitle);
            setHasTitle(true);
            setIsLoading(false);
          }
        } catch (err) {
          console.log(err);
        }
      }
      setIsLoading(false);
    };

    getTitle();
  }, [hasTitle]);

  useEffect(() => {
    if ((personalEditButton, personalProceedButton)) {
      titleRef.current.focus();
    }
  }, [personalEditButton, personalProceedButton]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (title === "") {
        return setErrMsg("Please fill out the form");
      }
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify({ personal_title: title })
      );
      if (response.status === 200) {
        setTitle(response.data.personal_title);
        setPersonalProceedButton(false);
        setHasTitle(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (updatedTitle === "") {
        return setErrMsg("Please fill out the form");
      }
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify({ personal_title: updatedTitle })
      );

      if (response.status === 200) {
        setTitle(response.data.personal_title);
        setPersonalEditButton(false);
        setHasTitle(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrMsg("Bad Request");
      }
    }
  };

  return (
    <div className="grid content-center justify-items-center w-full h-[24rem] rounded-xl bg-white shadow-lg">
      {isLoading ? (
        <div className="w-[380px] flex justify-center">
          <OrbitProgress color="#2ec4b6" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="h-hfit w-full text-center rounded-lg p-2">
          <div className="w-full text-lgreens text-xl font-bold">PERSONAL</div>

          {/* Title, edit title button and shows intro if there is no title */}
          {hasTitle && !personalEditButton && (
            <div className="flex text-xs items-end justify-end font-semibold px-4">
              <div
                onClick={() => {
                  setPersonalEditButton(true);
                }}
                className="bg-lgreens hover:bg-greens flex rounded-md p-1 px-2 space-x-2 cursor-pointer items-center"
              >
                <div>
                  <FaRegPenToSquare className="text-white text-lg" />
                </div>
                <p className="text-white">Edit</p>
              </div>
            </div>
          )}

          {personalEditButton && (
            <div className="flex gap-2 text-xs items-end justify-end font-semibold px-4">
              <div
                onClick={(e) => {
                  handleUpdate(e);
                }}
                className="bg-lgreens hover:bg-greens flex rounded-md p-1 px-2 space-x-2 cursor-pointer items-center"
              >
                <p className="text-white">Save</p>
              </div>
              <div
                onClick={() => {
                  setPersonalEditButton(false);
                }}
                className="bg-[red] flex rounded-md p-1 px-2 space-x-2 cursor-pointer items-center"
              >
                <p className="text-white">Cancel</p>
              </div>
            </div>
          )}

          <div className="">
            <div className="flex justify-center items-center px-5 xl:px-3">
              <div className="items-center text-9xl col-span-1 xl:text-7x lg:text-8xl">
                <FcBusinessman />
              </div>
              <div className="w-[70%]">
                {hasTitle ? (
                  personalEditButton ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-base font-bold text-lgreens">
                          Update Title
                        </div>
                      </div>
                      <input
                        ref={titleRef}
                        required
                        type="text"
                        className="border border-lgreens text-center w-full text-2xl h-[50%] mx-auto rounded-xl font-bold outline-none"
                        onChange={(e) => {
                          setErrMsg("");
                          setUpdatedTitle(e.target.value);
                        }}
                        value={updatedTitle}
                      />
                      <div className="text-xs text-greens">
                        {errMsg.toLocaleUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-greens text-4xl underline font-semibold cursor-default xl:text-3xl md:text-3xl">
                      {title}
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg text-[#050505] p-[10%]">
                      Monitor your Personal finances,
                      <br /> including Income, Expenses, <br /> and Net balance
                      using a Calendar like interface
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Net overview, calendar and summary page button. Shows add title button if there is no title */}
          <div className="p-5 w-full mx-auto row-span-1 justify-between place-content-center">
            {hasTitle ? (
              <>
                <div className="text-start text-lgreens text-sm font-semibold">
                  Overview
                </div>
                <div className="flex place-content-start gap-5">
                  <div className="items-center place-content-center">
                    <img
                      src={networth}
                      alt="net"
                      title="net"
                      className=" w-[30px] md:w-[30px]"
                    />
                  </div>
                  <div
                    className={`font-bold text-3xl sm:text-3xl ${
                      gross - overallMonthlyExpenses > 0
                        ? "text-greens"
                        : "text-[red]"
                    }`}
                  >
                    {(gross - overallMonthlyExpenses).toLocaleString()}
                  </div>
                  <div className="text-start text-lgreens text-sm font-semibold place-content-center">
                    Total Net
                  </div>
                </div>

                <div className="w-full text-xs mt-2">
                  <div className="w-fit">
                    <Link to="/summary" state={{ from: location.pathname }}>
                      <div className="bg-lgreens hover:bg-greens text-center text-white text-[0.8vw] font-semibold px-5 py-2 rounded-md">
                        <span className="flex justify-center items-center gap-2">
                          <FcStatistics className="text-lg" />
                          <span className="text-sm">Summary</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center items-center gap-2">
                  <input
                    ref={titleRef}
                    required
                    type="text"
                    placeholder="Add a Title"
                    className="px-3 py-2 w-[60%] text-xl text-[#050505] rounded-lg border border-lgreens font-bold outline-none"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    onFocus={() => {
                      setErrMsg("");
                    }}
                    value={title}
                  />
                  <div className="text-xs">
                    <div
                      onClick={(e) => {
                        handleSubmit(e);
                        setPersonalAddbutton(false);
                      }}
                      className="px-2 py-1 w-full bg-lgreens hover:bg-greens rounded-lg cursor-pointer"
                    >
                      <div className="text-sm font-bold text-white">
                        Add Personal
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {hasTitle && (
            <div className="flex justify-end w-fulltext-xs mt-2 pr-4">
              <div className="w-fit">
                <Link to="/personal" state={{ from: location.pathname }}>
                  <div className="bg-lgreens hover:bg-greens text-center text-white text-[0.8vw] font-semibold px-5 py-2 rounded-md">
                    <span className="flex justify-center items-center gap-2">
                      <FcCalendar className="text-lg" />
                      <span className="text-sm">Calendar</span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalHomeCard;
