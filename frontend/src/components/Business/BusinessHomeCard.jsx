import { useEffect, useState, useRef } from "react";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Skeleton from "react-loading-skeleton";
import { Link, useLocation } from "react-router-dom";
import { ThreeDot, OrbitProgress } from "react-loading-indicators";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";
import profitIcon from "../../media/bus_profit.png";
import { FcCalendar, FcLibrary, FcStatistics } from "react-icons/fc";
import { FaRegPenToSquare } from "react-icons/fa6";

const BusinessHomeCard = () => {
  const getBusinessData = useGetBusinessData();
  const getMonthlyCapital = useBusinessCapital();
  const getMonthlyExpenses = useBusinessExpenses();
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const titleRef = useRef();

  const [capital, setCapital] = useState(0);
  const [sales, setSales] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const [overallMonthlyExpenses, setOVerallMonthlyExpenses] = useState(0);

  const [title, setTitle] = useState("");
  const [hasTitle, setHasTitle] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const [businessAddButton, setBusinessAddbutton] = useState(true);
  const [businessProceedButton, setBusinessProceedButton] = useState(false);
  const [businessEditButton, setBusinessEditButton] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if ((businessEditButton, businessProceedButton)) {
      titleRef.current.focus();
    }
  }, [businessEditButton, businessProceedButton]);

  useEffect(() => {
    let c = 0;
    let s = 0;
    let e = 0;
    let m_e = 0;
    let m_c = 0;

    const overallData = async () => {
      const overallData = await getBusinessData();
      const monthCapital = await getMonthlyCapital();
      const overallMonthlyExpenses = await getMonthlyExpenses();

      overallData.forEach((data) => {
        return (c += data.capital), (s += data.sales), (e += data.expenses);
      });

      overallMonthlyExpenses.forEach((data) => {
        m_e += data.amount;
      });

      monthCapital.forEach((data) => {
        m_c += data.amount;
      });

      setCapital(c + m_c);
      setSales(s);
      setExpenses(e);
      setOVerallMonthlyExpenses(m_e);
    };

    overallData();
  }, []);

  useEffect(() => {
    const getTitle = async () => {
      const _id = await auth?._id;
      if (_id) {
        try {
          const response = await axiosPrivate.get("/user/" + _id);
          const jsonTitle = await response.data.business_title;
          if (jsonTitle && response.status === 200) {
            setUpdatedTitle(jsonTitle);
            setTitle(jsonTitle);
            setHasTitle(true);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getTitle();

    setIsLoading(false);
  }, [hasTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (title === "") {
        return setErrMsg("Please fill out the form");
      }
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify({ business_title: title })
      );
      if (response.status === 200) {
        setTitle(response.data.business_title);
        setBusinessProceedButton(false);
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
        JSON.stringify({ business_title: updatedTitle })
      );

      if (response.status === 200) {
        setTitle(response.data.business_title);
        setBusinessEditButton(false);
        setHasTitle(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrMsg("Bad Request");
      }
    }
  };

  return (
    <div className="w-[90%] h-hfit rounded-xl bg-white shadow-lg overflow-hidden">
      {isLoading ? (
        <div className="w-full h-fit flex justify-center items-center bg-light bg-opacity-70">
          <OrbitProgress color="#ff9f1c" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="h-hfull content-center justify-items-center">
          <div className="w-full h-hfull mx-auto text-center bg-white rounded-lg p-2">
            <div className=" w-full text-center mx-auto place-content-center">
              <div className=" w-full text-xl text-loranges font-bold">
                BUSINESS
              </div>
            </div>

            {/* Show Title and Data if there is any */}
            {hasTitle && !businessEditButton && (
              <div className="rounded-lg">
                <div className="flex text-xs justify-end font-semibold px-5">
                  <div
                    onClick={() => {
                      setBusinessEditButton(true);
                    }}
                    className="bg-loranges hover:bg-oranges flex rounded-md p-1 px-2 space-x-2 cursor-pointer items-center"
                  >
                    <div>
                      <FaRegPenToSquare className="text-white text-lg" />
                    </div>
                    <p className="text-white">Edit</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center justify-between px-5">
                  <div className="text-[7vw] col-span-1">
                    <FcLibrary />
                  </div>

                  <div className="text-loranges col-span-2 text-[2.5vw] underline font-semibold content-end cursor-default">
                    {title || updatedTitle}
                  </div>
                </div>
              </div>
            )}
            {hasTitle && !businessEditButton && (
              <div className="w-full mx-auto row-span-1 p-5 justify-between place-content-center">
                <div className="text-oranges font-semibold text-sm text-start">
                  Overview
                </div>
                {isLoading ? (
                  <Skeleton className="w-full" height={20} />
                ) : (
                  <>
                    <div className="flex place-content-start gap-5 items-center">
                      <img
                        src={profitIcon}
                        alt="profits"
                        title="profits"
                        className="h-[3vw] w-[3.2vw]"
                      />
                      <div
                        className={`font-bold text-[3vw] ${
                          sales - expenses - overallMonthlyExpenses - capital >
                          0
                            ? "text-greens"
                            : "text-[red]"
                        }`}
                      >
                        {(
                          sales -
                          expenses -
                          overallMonthlyExpenses -
                          capital
                        ).toLocaleString()}
                      </div>
                      <div className="text-start text-loranges text-sm font-semibold place-content-center">
                        Total Profit
                      </div>
                    </div>

                    <div className="w-full text-xs mt-2">
                      <div className="w-fit ">
                        <Link to="/summary" state={{ from: location.pathname }}>
                          <div className="bg-loranges text-center text-white text-[0.8vw] font-semibold px-5 py-2 rounded-md">
                            <span className="flex justify-center items-center gap-2">
                              <FcStatistics className="text-[1.5vw]" />
                              Summary
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {hasTitle && !businessEditButton && (
              <div className="flex justify-end w-fulltext-xs mt-2 pr-4">
                <div className="w-fit">
                  <Link to="/business" state={{ from: location.pathname }}>
                    <div className="bg-loranges text-center text-white text-[0.8vw] font-semibold px-5 py-2 rounded-md">
                      <span className="flex justify-center items-center gap-2">
                        <FcCalendar className="text-[1.5vw]" />
                        Calendar
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {!hasTitle && businessAddButton && (
              <div className="w-full mx-auto row-span-2 text-md font-bold place-content-center">
                <div className="w-[80%] mx-auto text-loranges bg-light rounded-lg p-10">
                  Track your Business{" "}
                  <span className="text-greens">INCOME</span>,{" "}
                  <span className="text-greens">
                    CAPITAL<span className="text-oranges">,</span> SALES
                  </span>
                  , and <span className="text-greens">PROFITS</span> with a
                  calendar like interface plus added features for an easier
                  Financial Management
                </div>
              </div>
            )}

            {!hasTitle && businessAddButton && (
              <div className="w-full mx-auto row-span-1 text-xs mt-2 ">
                <div
                  onClick={() => {
                    setBusinessAddbutton(false);
                    setBusinessProceedButton(true);
                  }}
                  className="mx-auto bg-loranges hover:bg-oranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
                >
                  <div className="text-xl font-bold text-white">
                    ADD BUSINESS
                  </div>
                </div>
              </div>
            )}

            {businessProceedButton && (
              <div>
                <div className="text-xl font-bold text-loranges">
                  Add a Title
                </div>
                <input
                  ref={titleRef}
                  required
                  type="text"
                  className="text-center text-2xl w-full h-[50%] mx-auto rounded-xl border border-loranges font-bold outline-none"
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

            {businessProceedButton && (
              <div className="boder w-full mx-auto row-span-1 text-xs mt-2 ">
                {isLoading ? (
                  <div className="mx-auto bg-oranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                    <ThreeDot
                      color="#ffff"
                      size="medium"
                      text=""
                      textColor=""
                    />
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                    className="mx-auto bg-loranges hover:bg-oranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
                  >
                    <div className="text-xl font-bold text-white">ADD</div>
                  </div>
                )}
              </div>
            )}

            {businessEditButton && (
              <div className="space-y-2">
                <div>
                  <div className="text-xl font-bold text-loranges">
                    Update Title
                  </div>
                </div>
                <input
                  ref={titleRef}
                  required
                  type="text"
                  className="text-center w-full h-[50%] mx-auto rounded-xl border border-loranges font-bold outline-none text-2xl"
                  onChange={(e) => {
                    setUpdatedTitle(e.target.value);
                  }}
                  value={updatedTitle}
                />
              </div>
            )}

            {businessEditButton && (
              <div>
                <div className="flex justify-center space-x-3">
                  <div
                    className="bg-loranges hover:bg-oranges p-2 text-white rounded-lg cursor-pointer font-bold"
                    onClick={(e) => {
                      handleUpdate(e);
                    }}
                  >
                    Save Changes
                  </div>
                  <div
                    className="p-2 bg-[#ff4242] hover:bg-[red] text-white rounded-lg cursor-pointer font-bold"
                    onClick={() => {
                      setBusinessEditButton(false);
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
      )}
    </div>
  );
};

export default BusinessHomeCard;
