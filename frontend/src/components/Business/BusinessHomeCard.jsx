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
      setIsLoading(true);
      const _id = await auth?._id;
      if (_id) {
        try {
          const response = await axiosPrivate.get("/user/" + _id);
          const jsonTitle = await response.data.business_title;
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
    <div className="grid content-center w-full h-[24rem] rounded-xl bg-white shadow-lg ">
      {isLoading ? (
        <div className="w-[380px] flex justify-center">
          <OrbitProgress color="#ff9f1c" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="w-full h-hfit text-center rounded-lg p-2 ">
          <div className="w-full text-loranges text-center text-xl font-bold">
            BUSINESS
          </div>

          {/* Show Title and Data if there is any */}
          {hasTitle && !businessEditButton && (
            <div className="flex text-xs items-end justify-end font-semibold px-4">
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
          )}

          {businessEditButton && (
            <div className="flex gap-2 text-xs items-end justify-end font-semibold px-4">
              <div
                onClick={(e) => {
                  handleUpdate(e);
                }}
                className="bg-loranges hover:bg-oranges flex rounded-md p-1 px-2 space-x-2 cursor-pointer items-center"
              >
                <p className="text-white">Save</p>
              </div>
              <div
                onClick={() => {
                  setBusinessEditButton(false);
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
                <FcLibrary />
              </div>
              <div className="w-[70%]">
                {hasTitle ? (
                  businessEditButton ? (
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
                        className="text-center w-full text-2xl h-[50%] mx-auto rounded-xl border border-loranges font-bold outline-none"
                        onChange={(e) => {
                          setErrMsg("");
                          setUpdatedTitle(e.target.value);
                        }}
                        value={updatedTitle}
                      />
                      <div className="text-xs text-oranges">
                        {errMsg.toLocaleUpperCase()}
                      </div>
                    </div>
                  ) : (
                    <div className=" text-oranges text-4xl underline font-semibold cursor-default xl:text-3xl md:text-3xl">
                      {title}
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg p-[10%]">
                      Track your Business assets <br /> with a calendar like
                      interface <br /> plus added features for an easier
                      Financial Management
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 w-full mx-auto row-span-1 justify-between place-content-center">
            {isLoading ? (
              <Skeleton className="w-full" height={20} />
            ) : hasTitle ? (
              <>
                <div className="text-start text-loranges text-sm font-semibold">
                  Overview
                </div>
                <div className="flex place-content-start gap-5">
                  <div className="items-center place-content-center">
                    <img
                      src={profitIcon}
                      alt="net"
                      title="net"
                      className=" w-[30px] md:w-[30px]"
                    />
                  </div>
                  <div
                    className={`font-bold text-3xl sm:text-3xl ${
                      sales - expenses - overallMonthlyExpenses - capital > 0
                        ? "text-oranges"
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
                    Total Net
                  </div>
                </div>

                <div className="w-full text-xs mt-2">
                  <div className="w-fit">
                    <Link to="/summary" state={{ from: location.pathname }}>
                      <div className="bg-loranges hover:bg-oranges text-center text-white text-[0.8vw] font-semibold px-5 py-2 rounded-md">
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
                    className="px-3 py-2 w-[60%] text-xl text-[#050505] rounded-lg border border-loranges font-bold outline-none"
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
                        setBusinessAddbutton(false);
                      }}
                      className="px-2 py-1 w-full bg-loranges hover:bg-oranges rounded-lg cursor-pointer"
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
                  <div className="bg-loranges hover:bg-oranges text-center text-white text-[0.8vw] font-semibold px-5 py-2 rounded-md">
                    <span className="flex justify-center items-center gap-2">
                      <FcCalendar className="text-lg" />
                      <span className="text-sm">Calendar</span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Adding Personal Income */}
        </div>
      )}
    </div>
  );
};

export default BusinessHomeCard;
