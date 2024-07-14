import { useEffect, useState, useRef } from "react";
import useGetBusinessData from "../../hooks/useGetBusinessData";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { Link, useLocation } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import useBusinessExpenses from "../../hooks/useBusinessExpenses";

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

  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

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
          const jsonTitle = await response.data.business_title;

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
    <div className="w-[90%] h-[60%] rounded-xl bg-white shadow-lg overflow-hidden">
      <div className=" h-hfull content-center justify-items-center">
        <div className=" w-11/12 h-hfull mx-auto grid grid-rows-5 text-center bg-white rounded-lg p-2">
          <div className=" w-full text-center mx-auto place-content-center">
            <div className=" w-full text-5xl text-loranges font-bold">
              BUSINESS
            </div>
          </div>

          {/* Show Title and Data if there is any */}
          {hasTitle && !businessEditButton && (
            <div className="">
              <div className="flex space-x-2 justify-end text-sm text-end h-[fit-content] cursor-pointer mb-2">
                <FontAwesomeIcon
                  className="text-lgreens"
                  onClick={() => {
                    setBusinessEditButton(true);
                  }}
                  icon={faPen}
                />
              </div>
              <div className="text-greens w-full mx-auto text-6xl font-bold content-end cursor-default">
                {title || updatedTitle}
              </div>
            </div>
          )}
          {hasTitle && !businessEditButton && (
            <div className=" w-full mx-auto row-span-1 justify-between place-content-center">
              <div className=" mb-2 text-oranges text-sm">Overall Summary</div>
              {isLoading ? (
                <Skeleton className="w-full" height={20} />
              ) : (
                <div className="flex place-content-center">
                  <div className="mr-5">
                    C:{" "}
                    <span className="font-bold text-oranges text-lg">
                      {capital.toLocaleString()}
                    </span>
                  </div>
                  <div className="mr-5">
                    S:{" "}
                    <span className="font-bold text-oranges text-lg">
                      {sales.toLocaleString()}
                    </span>
                  </div>
                  <div className="mr-5">
                    E:{" "}
                    <span className="font-bold text-oranges text-lg">
                      {(expenses + overallMonthlyExpenses).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    P:{" "}
                    <span className="font-bold text-oranges text-lg">
                      {(
                        sales -
                        expenses -
                        overallMonthlyExpenses -
                        capital
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {hasTitle && !businessEditButton && (
            <div className=" w-full h-hfull mx-auto row-span-1 text-xs mt-2 place-content-center">
              <div className="mx-auto bg-loranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                <Link to="/business" state={{ from: location.pathname }}>
                  <div className="h-hfull text-xl font-bold text-white place-content-center">
                    To Calendar
                  </div>
                </Link>
              </div>
            </div>
          )}

          {!hasTitle && businessAddButton && (
            <div className="w-full mx-auto row-span-2 text-md font-bold place-content-center">
              <div className="w-[80%] mx-auto text-loranges">
                Track your Business <span className="text-greens">INCOME</span>,{" "}
                <span className="text-greens">EXPENSES</span>, and{" "}
                <span className="text-greens">NETWORTH</span> with a calendar
                like interface plus added features for an easier Financial
                Management
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
                className="mx-auto bg-loranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
              >
                <div className="text-xl font-bold text-white">ADD BUSINESS</div>
              </div>
            </div>
          )}

          {businessProceedButton && (
            <div>
              <div className="text-xl font-bold text-loranges">Add a Title</div>
              <input
                ref={titleRef}
                required
                type="text"
                className="text-center w-full h-[50%] mx-auto rounded-xl border border-loranges font-bold outline-none"
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
                <div className="mx-auto bg-lgreens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                  <ThreeDot color="#ffff" size="medium" text="" textColor="" />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                  className="mx-auto bg-loranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
                >
                  <div className="text-xl font-bold text-white">PROCEED</div>
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
                className="text-center w-full h-[50%] mx-auto rounded-xl border border-loranges font-bold outline-none"
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
                  className="bg-oranges p-2 text-white rounded-lg cursor-pointer"
                  onClick={(e) => {
                    handleUpdate(e);
                  }}
                >
                  Save Changes
                </div>
                <div
                  className="p-2 bg-[#ff4242] text-white rounded-lg cursor-pointer"
                  onClick={() => {
                    setBusinessEditButton(false);
                  }}
                >
                  Discard
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

export default BusinessHomeCard;
