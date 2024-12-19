import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import { IoClose } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import BMonthlyCapitalData from "./BMonthlyCapitalData";
import BMonthlyCapitalAdd from "./BMonthlyCapitalAdd";
import useBusinessCapital from "../../../hooks/useBusinessCapital";
import profitIcon from "../../../media/busmon_pouch.png";
import { useNavigate } from "react-router-dom";

const BMonthlyCapitalForm = () => {
  const {
    monthIndex,
    loadPage,
    setShowBusinessCapitalForm,
    setShowBusinessCapitalInput,
    showBusinessCapitalInput,
    businessCapitalLoading,
    setBusinessCapitalLoading,
    businessCapitalData,
    loggedIn,
  } = useContext(CalendarContext);

  const getBusinessCapital = useBusinessCapital();
  const navigate = useNavigate();

  const [capitalData, setCapitalData] = useState([]);
  const [capitalDataLoading, setCapitalDataLoading] = useState(true);
  const [monthlyCapital, setMonthlyCapital] = useState("");

  function addCapital() {
    setShowBusinessCapitalInput(true);
  }

  useEffect(() => {
    if (businessCapitalLoading) {
      getBusinessCapital();
      setBusinessCapitalLoading(false);
    }
  }, [businessCapitalLoading]);

  useEffect(() => {
    let mCapital = 0;
    if (!businessCapitalLoading) {
      const monthlyCapital = async () => {
        const data = await businessCapitalData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );

        setCapitalData(data);
        setCapitalDataLoading(false);
      };
      monthlyCapital();

      const getData = () => {
        businessCapitalData.forEach((data) => {
          if (data.month === dayjs().month(monthIndex).format("MMMM YYYY"))
            return (mCapital += data.amount);
        });
      };

      getData();
      setMonthlyCapital(mCapital);
    } else {
      setCapitalDataLoading(true);
    }
  }, [businessCapitalData, monthIndex]);

  return (
    <div className="font-pops bg-white shadow-lg rounded-lg py-5 min-w-[420px] h-[406px] relative">
      <div className="flex items-center justify-center relative w-full">
        <div className="text-center">
          <h1 className="font-bold text-xl text-loranges mb-2">
            Monthly Capital
          </h1>
          <p className="text-md font-semibold mb-2">
            {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
          </p>
        </div>
      </div>

      <div className="text-sm font-bold mb-3 text-center">
        <span className="text-xs text-[#A6ACAF] font-normal">
          (Cash, Assets etc...)
        </span>
      </div>

      {/* Monthly Capital Data */}
      <div
        className={`h-[158px] ${
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

      <div className="flex justify-center">
        <div
          onClick={() => {
            if (!loggedIn) {
              navigate("/Login");
            } else {
              addCapital();
            }
          }}
          className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1 text-white flex items-center gap-1 border border-loranges bg-loranges hover:bg-oranges font-bold my-2 ${
            showBusinessCapitalInput ? "hidden" : ""
          }`}
        >
          <MdOutlinePostAdd className="text-3xl" /> Add
        </div>
      </div>

      {/* Add button for monthly expenses */}
      {showBusinessCapitalInput && (
        <div className="absolute top-0 pt-[25%] bg-light bg-opacity-70 h-hfull w-full">
          <BMonthlyCapitalAdd />
        </div>
      )}

      {/* Total Expenses */}
      <div className="absolute bottom-2 w-full">
        <div className="px-5 mb-2 flex items-center space-x-2 justify-center mt-2">
          <div>
            <p className="text-sm font-bold">Total:</p>
          </div>
          <div className="border border-inputLight rounded-md py-1 text-center w-fit">
            <div className="grid grid-cols-3 items-center">
              <div className="pl-2">
                <img src={profitIcon} className="w-11 mr-2" />
              </div>
              <div className="mt-[0.15rem]">
                <p className="text-[red] font-bold">
                  {monthlyCapital.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMonthlyCapitalForm;
