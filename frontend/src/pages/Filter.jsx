import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarContext } from "../context/CalendarContext";
import dayjs from "dayjs";
import Sidebar from "../components/Sidebar";
import FooterNav from "../components/FooterNav";
import Footer from "../components/Footer";
import BusinessDateRange from "../components/calendar/business/BusinessDateRange";
import PersonalDateRange from "../components/calendar/personal/PersonalDateRange";
import Navbar from "../components/Navbar";
import DatePicker from "react-datepicker";
import { FaExclamationCircle } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const DateRange = () => {
  const { auth, userInfo, setUserInfo } = useAuth();
  const { setLoggedIn } = useContext(CalendarContext);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");

  const axiosPrivate = useAxiosPrivate();

  const [totalDays, setTotalDays] = useState(0);
  const [errStyle, setErrStyle] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!tab) {
      navigate("/filter?tab=Personal", { replace: true });
    }
  }, [tab, navigate]);

  const changeTab = (tabName) => {
    navigate(`?tab=${tabName}`, { replace: true });
  };

  useEffect(() => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (startDate && endDate) {
      const daysDiff = end.diff(start, "day");
      setTotalDays(daysDiff);

      if (totalDays < 0) {
        setErrStyle(true);
        setErrMsg("End date is before start date. Please check the dates.");
      } else {
        setErrStyle(false);
        setErrMsg("");
      }
    } else {
      setTotalDays(0);
      setErrStyle(false);
      setErrMsg("");
    }
  }, [startDate, endDate, totalDays]);

  // identifier if instructions is already shown
  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);
        if (userInfo?.instructions?.filter) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, []);

  // saving instructions to db
  useEffect(() => {
    const toggleInstructions = async () => {
      try {
        if (instructions) {
          await axiosPrivate.patch(
            "/user/instructions",
            JSON.stringify({ instructions: instructions })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    toggleInstructions();
  }, [instructions]);

  // driver js tour content
  const showTour = async () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#datePicker",
          popover: {
            title: "Date Picker",
            description: "In this section, you can select a range of date",
          },
        },
        {
          element: "#summary",
          popover: {
            title: "Monthly Income",
            description:
              "After selecting a date here you can view the summary of your gross, expenses, and net income within the range of that date",
          },
        },
        {
          element: "#dataOverview",
          popover: {
            title: "Data Overview",
            description:
              "Also, in this section, you can see every detail within the range of the date selected.",
          },
        },
        {
          element: "#instructions",
          popover: {
            description:
              "You can always come back in this button to run the instructions again",
          },
        },
      ],
    });

    driverObj.drive();

    setUserInfo((prev) => ({
      ...prev,
      instructions: { ...prev.instructions, filter: false },
    }));
  };

  return (
    // <div className="flex lg:flex-col">
    //   <div className="lg:hidden">
    //     <Sidebar />
    //   </div>
    //   <div className="w-full bg-light">
    //     <Navbar />
    //     {/* filter components */}
    //     <div className="mt-20 lg:mb-[5rem]">
    //       <Footer />
    //     </div>
    //   </div>

    //   <div className="hidden lg:block">
    //     <FooterNav />
    //   </div>
    // </div>

    <div className="font-pops  min-h-[100vh]">
      {/* Calendar Switch View */}
      <div className="flex justify-center space-x-5 pt-5">
        <div
          onClick={() => {
            changeTab("Personal");
          }}
          className={`px-5 py-3 rounded-md font-bold
      ${
        tab === "Personal" || !params.get("tab")
          ? "bg-lgreens text-white cursor-default"
          : "bg-white cursor-pointer hover:text-lgreens shadow-md"
      }
   `}
        >
          Personal
        </div>
        <div
          onClick={() => {
            changeTab("Business");
          }}
          className={`px-5 py-3 rounded-md font-bold
      ${
        tab === "Business"
          ? "bg-loranges text-white cursor-default"
          : "bg-white cursor-pointer hover:text-loranges shadow-md"
      }
  `}
        >
          Business
        </div>
      </div>

      {/* instructions */}
      <div
        id="instructions"
        onClick={() => {
          showTour();
        }}
        className={`bg-white flex items-center gap-2 w-fit px-3 py-2 shadow-sm rounded-md mt-5 cursor-pointer border border-white text-sm mmd:text-xs md:py-1 mx-auto ${
          tab === "Personal" ? "hover:border-lgreens" : "hover:border-loranges"
        }`}
      >
        <BsInfoCircle className={`text-oranges text-2xl mmd:text-xl`} />
        <p>
          How to use? <span className="font-bold">Instructions</span>
        </p>
      </div>

      {/* Date range */}
      <div className="mt-8 px-5 xl:pl-24 lg:pl-5">
        <div id="datePicker" className="bg-white rounded-lg shadow-sm py-5">
          <div className="flex justify-center space-x-10 sm:space-x-3">
            <div className="flex justify-center items-center space-x-2">
              <p>From:</p>
              <DatePicker
                showIcon
                toggleCalendarOnIconClick
                className="border border-inputLight w-40 font-medium rounded-md py-1 text-center cursor-pointer outline-none text-base placeholder:font-normal"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                dateFormat="MMM d, yyyy"
              />
            </div>
            <div className="flex justify-center items-center space-x-2">
              <p>To:</p>
              <DatePicker
                showIcon
                className="border border-inputLight w-40 font-medium rounded-md py-1 text-center cursor-pointer outline-none text-base placeholder:font-normal"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
          <div>
            {errStyle && (
              <div className="pt-2 text-sm text-[red] font-medium flex justify-center items-center space-x-2">
                <div>
                  <FaExclamationCircle />
                </div>
                <div>{errMsg}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Display Personal/Business */}
      <div>
        {tab === "Personal" && (
          <PersonalDateRange startDate={startDate} endDate={endDate} />
        )}
        {tab === "Business" && (
          <BusinessDateRange startDate={startDate} endDate={endDate} />
        )}
      </div>
    </div>
  );
};

export default DateRange;
