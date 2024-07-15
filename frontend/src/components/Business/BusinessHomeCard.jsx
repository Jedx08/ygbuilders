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
import capitalIcon from "../../media/bus_pouch.png";
import salesIcon from "../../media/sales.png";
import expensesIcon from "../../media/bus_expenses.png";
import profitIcon from "../../media/bus_profit.png";
import { FcCalendar } from "react-icons/fc";

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
            <div className="bg-light rounded-lg">
              <div className="flex text-xs items-end justify-end font-semibold">
                <div
                  onClick={() => {
                    setBusinessEditButton(true);
                  }}
                  className="bg-loranges hover:bg-oranges flex rounded-md p-1 px-2 space-x-2 cursor-pointer"
                >
                  <div>
                    <FontAwesomeIcon className="text-light" icon={faPen} />
                  </div>
                  <p className="text-light">Edit</p>
                </div>
              </div>
              <div className="text-loranges w-full mx-auto text-5xl font-semibold content-end cursor-default">
                {title || updatedTitle}
              </div>
            </div>
          )}
          {hasTitle && !businessEditButton && (
            <div className=" w-full mx-auto row-span-1 justify-between place-content-center">
              <div className=" mb-2 text-oranges font-semibold text-sm mt-4">
                Overall Summary
              </div>
              {isLoading ? (
                <Skeleton className="w-full" height={20} />
              ) : (
                <>
                  <div className="flex place-content-center">
                    <div className="mr-5 flex gap-2">
                      <img
                        src={capitalIcon}
                        alt="capital"
                        title="capital"
                        className="h-2 w-9"
                      />
                      <span className="font-bold text-greens text-lg">
                        {capital.toLocaleString()}
                      </span>
                    </div>
                    <div className="mr-5 flex gap-2">
                      <img
                        src={salesIcon}
                        alt="sales"
                        title="sales"
                        className="h-2 w-9"
                      />
                      <span className="font-bold text-greens text-lg">
                        {sales.toLocaleString()}
                      </span>
                    </div>
                    <div className="mr-5 flex gap-2">
                      <img
                        src={expensesIcon}
                        alt="expenses"
                        title="expenses"
                        className="h-2 w-9"
                      />
                      <span className="font-bold text-[red] text-lg">
                        {(expenses + overallMonthlyExpenses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-3 items-center gap-2">
                    <img
                      src={profitIcon}
                      alt="profits"
                      title="profits"
                      className="-2 w-9"
                    />
                    <span
                      className={`font-bold text-lg ${
                        sales - expenses - overallMonthlyExpenses - capital > 0
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
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {hasTitle && !businessEditButton && (
            <div className=" w-full h-hfull mx-auto row-span-1 text-xs mt-2 place-content-center">
              <div className="mx-auto bg-loranges hover:bg-oranges h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                <Link to="/business" state={{ from: location.pathname }}>
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

          {!hasTitle && businessAddButton && (
            <div className="w-full mx-auto row-span-2 text-md font-bold place-content-center">
              <div className="w-[80%] mx-auto text-loranges bg-light rounded-lg p-10">
                Track your Business <span className="text-greens">INCOME</span>,{" "}
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
                  <ThreeDot color="#ffff" size="medium" text="" textColor="" />
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
    </div>
  );
};

export default BusinessHomeCard;
