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
import estab from "../../media/estab.png";
import { FcCalendar, FcStatistics } from "react-icons/fc";
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

  const [title, setTitle] = useState("");
  const [hasTitle, setHasTitle] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const [businessEditButton, setBusinessEditButton] = useState(false);

  const [overallMonthlyExpenses, setOVerallMonthlyExpenses] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setDataLoading(true);

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
      setDataLoading(false);
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

          if (jsonTitle && response.status === 200) {
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

    if (title === "") {
      return setErrMsg("Please fill out the form");
    }

    setAddButtonLoading(true);

    try {
      const response = await axiosPrivate.patch(
        "/user/title",
        JSON.stringify({ business_title: title })
      );
      if (response.status === 200) {
        setTitle(response.data.business_title);
        setAddButtonLoading(false);
        setHasTitle(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (updatedTitle === "") {
      return setErrMsg("Please fill out the form");
    }

    setSaveButtonLoading(true);

    try {
      const response = await axiosPrivate.patch(
        "/user/title",
        JSON.stringify({ business_title: updatedTitle })
      );
      console.log(response);

      if (response.status === 200) {
        setTitle(response.data.business_title);
        setBusinessEditButton(false);
        setSaveButtonLoading(false);
        setHasTitle(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrMsg("Bad Request");
      }
    }
  };

  return (
    <div className="content-center w-full h-[24rem] rounded-xl bg-white shadow-lg ">
      {isLoading ? (
        <div className="w-[380px] flex justify-center">
          <OrbitProgress color="#ff9f1c" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="w-full h-hfit text-center rounded-lg p-2">
          <div className="w-full text-loranges text-center text-xl font-bold">
            BUSINESS
          </div>

          {/* Title, edit title button and shows intro if there is no title */}
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
              {saveButtonLoading ? (
                <div className="bg-loranges flex rounded-md px-2 py-2 items-center">
                  <ThreeDot
                    style={{ fontSize: "8px" }}
                    variant="pulsate"
                    color="#fff"
                    text=""
                    textColor=""
                  />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    handleUpdate(e);
                  }}
                  className="bg-loranges hover:bg-oranges flex rounded-md p-1 px-2 space-x-2 cursor-pointer items-center"
                >
                  <p className="text-white">Save</p>
                </div>
              )}

              <div
                onClick={() => {
                  if (saveButtonLoading) {
                    location.reload();
                  }
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
                <img src={estab} alt="" className="w-[128px]" />
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
                          setUpdatedTitle(e.target.value);
                          setErrMsg("");
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
            {hasTitle && (
              <div className="text-start text-loranges text-sm font-semibold">
                Overview
              </div>
            )}
            {hasTitle ? (
              dataLoading ? (
                <Skeleton
                  className="w-full"
                  containerClassName="flex-1"
                  height={30}
                />
              ) : (
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
                    Total Profit
                  </div>
                </div>
              )
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
                    {addButtonLoading ? (
                      <div className="px-2 py-1 w-full bg-loranges rounded-lg">
                        <ThreeDot variant="pulsate" color="#ffff" size="10px" />
                      </div>
                    ) : (
                      <div
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        className="px-2 py-1 w-full bg-loranges hover:bg-oranges rounded-lg cursor-pointer"
                      >
                        <div className="text-sm font-bold text-white">
                          Add Business
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {hasTitle && (
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
            )}
          </div>

          {hasTitle && (
            <div className="flex justify-end w-fulltext-xs mt-2 pr-4">
              <div className="w-fit">
                <Link to="/business" state={{ from: location.pathname }}>
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
