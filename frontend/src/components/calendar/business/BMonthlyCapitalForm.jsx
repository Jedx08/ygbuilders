import dayjs from "dayjs";
import React, { useContext, useRef, useEffect } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import { IoClose } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import BMonthlyCapitalData from "./BMonthlyCapitalData";
import BMonthlyCapitalAdd from "./BMonthlyCapitalAdd";
import profitIcon from "../../../media/busmon_pouch.png";
import { useNavigate } from "react-router-dom";

const BMonthlyCapitalForm = ({
  capitalDataLoading,
  capitalData,
  monthlyCapital,
}) => {
  const {
    monthIndex,
    setShowBusinessCapitalForm,
    setShowBusinessCapitalInput,
    showBusinessCapitalInput,
    loggedIn,
    inMobile,
  } = useContext(CalendarContext);

  const navigate = useNavigate();

  function addCapital() {
    setShowBusinessCapitalInput(true);
  }

  // to close form when clicked outside form
  const childRef = useRef(null);

  const handleClickOutside = (event) => {
    if (childRef.current && !childRef.current.contains(event.target)) {
      setShowBusinessCapitalForm(false), setShowBusinessCapitalInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickInside = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-50 z-20">
      <div
        ref={childRef}
        onMouseDown={handleClickInside}
        className="rounded-md bg-white overflow-hidden px-5 py-5 shadow-lg relative border border-[#ebebeb] max-w-[441px] w-full"
      >
        {/* close button */}
        <div
          onClick={() => {
            setShowBusinessCapitalForm(false);
          }}
          className={`cursor-pointer hover:bg-btnHov active:bg-btnAct hover:rounded-full font-bold absolute top-1 mb-5 p-1 text-2xl ${
            inMobile ? "right-2" : "right-1"
          }`}
        >
          <IoClose className="text-oranges" />
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <h1 className="font-bold text-lg text-loranges mb-2">
              Monthly Capital
            </h1>
            <p className="text-sm font-normal mb-2">
              {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs text-[#A6ACAF] font-normal">
            (Cash, Assets etc...)
          </span>
        </div>

        {/* Monthly Capital Data */}
        <div
          className={`h-[158px] mx-auto w-full ${
            showBusinessCapitalInput ? "" : "overflow-auto"
          }`}
        >
          {capitalDataLoading && (
            <div className="text-center mt-3 text-sm text-[#A6ACAF]">
              Getting data...
            </div>
          )}

          {!capitalDataLoading && capitalData.length === 0 && (
            <div className="text-center mt-3 text-sm text-[#A6ACAF]">
              No data to show
            </div>
          )}

          {capitalData.map((d, i) => {
            return (
              <React.Fragment key={i}>
                <BMonthlyCapitalData capitalData={d} />
              </React.Fragment>
            );
          })}
        </div>

        <div
          className={`flex justify-center ${
            showBusinessCapitalInput ? "h-[56px]" : ""
          }`}
        >
          <div
            onClick={() => {
              if (!loggedIn) {
                navigate("/Login");
              } else {
                addCapital();
              }
            }}
            className={`mx-auto py-1 rounded-md px-6 text-base font-semibold text-white flex gap-1 items-center cursor-pointer my-2 border-loranges bg-loranges hover:bg-oranges ${
              showBusinessCapitalInput ? "hidden" : ""
            }`}
          >
            <MdOutlinePostAdd className="text-3xl" /> Add
          </div>
        </div>

        {/* Add button for monthly expenses */}
        {showBusinessCapitalInput && (
          <div className="absolute top-0 left-0 pt-[25%] bg-light bg-opacity-70 h-hfull w-full">
            <BMonthlyCapitalAdd />
          </div>
        )}

        {/* Total Expenses */}
        <div className="bottom-2 w-full">
          <div className="px-5 mb-2 flex items-center space-x-2 justify-center">
            <div className="border border-inputLight rounded-md py-1 text-center w-fit">
              <div className="grid grid-cols-3 items-center">
                <div className="pl-2">
                  <img src={profitIcon} className="w-11 mr-2" />
                </div>
                <div className="mt-[0.15rem]">
                  <p className="text-[red] font-bold text-xl/[24px]">
                    {monthlyCapital.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMonthlyCapitalForm;
