import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useGetData from "../../hooks/useGetPersonalData";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { ThreeDot } from "react-loading-indicators";
import Skeleton from "react-loading-skeleton";
import usePersonalExpenses from "../../hooks/usePersonalExpenses";
import pouch from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networth from "../../media/networth.png";
import { FcCalendar } from "react-icons/fc";

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

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const titleRef = useRef();

  useEffect(() => {
    let g = 0;
    let e = 0;
    let n = 0;
    let m_e = 0;

    setIsLoading(true);
    const overallData = async () => {
      const overallData = await getPersonalData();
      const monthData = await getMonthlyExpenses();

      overallData.forEach((data) => {
        return (g += data.gross), (e += data.expenses), (n += data.net);
      });

      monthData.forEach((data) => {
        m_e += data.amount;
      });

      setGross(g);
      setOVerallMonthlyExpenses(m_e + e);
      setIsLoading(false);
    };

    overallData();
  }, []);

  useEffect(() => {
    const getTitle = async () => {
      const _id = await auth?._id;

      try {
        if (_id) {
          const response = await axiosPrivate.get("/user/" + _id);
          const jsonTitle = await response.data.personal_title;

          if (jsonTitle && response.status === 200) {
            setUpdatedTitle(jsonTitle);
            setTitle(jsonTitle);
            setHasTitle(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
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
    <div className="w-[90%] h-[60%] rounded-xl bg-white shadow-lg ">
      <div className=" h-hfull content-center justify-items-center">
        <div className=" w-11/12 mx-auto h-hfull grid grid-rows-5 text-center rounded-lg p-2 ">
          <div className="w-full text-center mx-auto place-content-center">
            <div className="w-full text-lgreens text-5xl font-bold">
              PERSONAL
            </div>
          </div>

          {/* Show Title and Data if there is any */}
          {hasTitle && !personalEditButton && (
            <div className="bg-light rounded-lg">
              <div className="flex text-xs items-end justify-end font-semibold">
                <div
                  onClick={() => {
                    setPersonalEditButton(true);
                  }}
                  className="bg-lgreens hover:bg-greens flex rounded-md p-1 px-2 space-x-2 cursor-pointer"
                >
                  <div>
                    <FontAwesomeIcon className="text-light" icon={faPen} />
                  </div>
                  <p className="text-light">Edit</p>
                </div>
              </div>
              <div className="text-lgreens w-full mx-auto text-5xl font-semibold content-end cursor-default">
                {title}
              </div>
            </div>
          )}
          {hasTitle && !personalEditButton && (
            <div className=" w-full mx-auto row-span-1 justify-between place-content-center">
              <div className=" mb-2 text-greens text-sm font-semibold">
                Overall Summary
              </div>
              {isLoading ? (
                <Skeleton className="w-full" height={20} />
              ) : (
                <div className="flex place-content-center">
                  <div className="mr-5 flex gap-2">
                    <img
                      src={pouch}
                      alt="pouch"
                      title="gross"
                      className="h-2 w-7"
                    />{" "}
                    <span className="font-bold text-greens text-lg">
                      {gross.toLocaleString()}
                    </span>
                  </div>
                  <div className="mr-5 flex gap-2">
                    <img
                      src={expensesIcon}
                      alt="expenses"
                      title="expenses"
                      className="h-2 w-9"
                    />{" "}
                    <span className="font-bold text-lg text-[red]">
                      {overallMonthlyExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <img
                      src={networth}
                      alt="net"
                      title="net"
                      className="h-2 w-10"
                    />{" "}
                    <span
                      className={`font-bold text-lg ${
                        gross - overallMonthlyExpenses > 0
                          ? "text-greens"
                          : "text-[red]"
                      }`}
                    >
                      {(gross - overallMonthlyExpenses).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {hasTitle && !personalEditButton && (
            <div className=" w-full h-hfull mx-auto row-span-1 text-xs mt-2 place-content-center">
              <div className="mx-auto bg-lgreens hover:bg-greens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                <Link to="/personal" state={{ from: location.pathname }}>
                  <div className="h-hfull flex gap-3 items-center text-xl font-bold text-white place-content-center">
                    <span className="text-3xl">
                      <FcCalendar />
                    </span>{" "}
                    To Calendar
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Adding Personal Income */}
          {!hasTitle && personalAddButton && (
            <div className="w-full mx-auto row-span-2 text-md font-bold place-content-center">
              <div className="w-[80%] mx-auto text-lgreens bg-light p-10 rounded-lg">
                Track your Personal <span className="text-oranges">INCOME</span>
                ,{" "}
                <span className="text-oranges">
                  GROSS<span className="text-lgreens">,</span> EXPENSES
                </span>
                , and <span className="text-oranges">NET</span> with a calendar
                like interface
              </div>
            </div>
          )}

          {!hasTitle && personalAddButton && (
            <div className="w-full mx-auto row-span-1 text-xs mt-2 ">
              <div
                onClick={() => {
                  setPersonalAddbutton(false);
                  setPersonalProceedButton(true);
                }}
                className="mx-auto bg-lgreens hover:bg-greens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
              >
                <div className="text-xl font-bold text-white">ADD PERSONAL</div>
              </div>
            </div>
          )}

          {/* Submitting Personal Income Title */}
          {personalProceedButton && (
            <div>
              <div className="text-xl font-bold text-lgreens">Add a Title</div>
              <input
                ref={titleRef}
                required
                type="text"
                className="text-center w-full h-[50%] text-2xl mx-auto rounded-xl border border-lgreens font-bold outline-none"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onFocus={() => {
                  setErrMsg("");
                }}
                value={title}
              />
            </div>
          )}

          {personalProceedButton && (
            <div className="boder w-full mx-auto row-span-1 text-xs mt-2 ">
              {isLoading ? (
                <div className="mx-auto bg-greens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                  <ThreeDot color="#ffff" size="medium" text="" textColor="" />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                  className="mx-auto bg-lgreens hover:bg-greens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
                >
                  <div className="text-xl font-bold text-white">ADD</div>
                </div>
              )}
            </div>
          )}

          {/* Updating Personal Income Title */}
          {personalEditButton && (
            <div className="space-y-2">
              <div>
                <div className="text-xl font-bold text-lgreens">
                  Update Title
                </div>
              </div>
              <input
                ref={titleRef}
                required
                type="text"
                className="text-center w-full text-2xl h-[50%] mx-auto rounded-xl border border-lgreens font-bold outline-none"
                onChange={(e) => {
                  setErrMsg("");
                  setUpdatedTitle(e.target.value);
                }}
                value={updatedTitle}
              />
            </div>
          )}

          {personalEditButton && (
            <div>
              <div className="flex justify-center space-x-3">
                <div
                  className="bg-lgreens hover:bg-greens p-2 text-white font-bold rounded-lg cursor-pointer"
                  onClick={(e) => {
                    handleUpdate(e);
                  }}
                >
                  Save Changes
                </div>
                <div
                  className="p-2 bg-[#ff4242] hover:bg-[red] font-bold text-white rounded-lg cursor-pointer"
                  onClick={() => {
                    setPersonalEditButton(false);
                  }}
                >
                  Back
                </div>
              </div>
              {errMsg && (
                <p className="text-sm text-semibold text-oranges text-center mt-2">
                  {errMsg}
                </p>
              )}
            </div>
          )}

          {/* Error message */}
          {/* {errMsg && (
            <p className="text-sm text-semibold text-oranges text-center mt-2">
              {errMsg}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default PersonalHomeCard;
