import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { IoClose } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import BMonthlyCapitalData from "./BMonthlyCapitalData";
import BMonthlyCapitalAdd from "./BMonthlyCapitalAdd";
import useBusinessCapital from "../../hooks/useBusinessCapital";
import profitIcon from "../../media/busmon_pouch.png";
import { useNavigate } from "react-router-dom";

const BMonthlyCapitalForm = ({ monthlyCapital }) => {
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

  const [capitalData, setCapitalData] = useState([]);
  const [capitalDataLoading, setCapitalDataLoading] = useState(true);
  const navigate = useNavigate();

  const getBusinessCapital = useBusinessCapital();

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
    if (!businessCapitalLoading) {
      const monthlyCapital = async () => {
        const data = await businessCapitalData.filter(
          (evnt) => evnt.month === dayjs().month(monthIndex).format("MMMM YYYY")
        );

        setCapitalData(data);
        setCapitalDataLoading(false);
      };
      monthlyCapital();
    } else {
      setCapitalDataLoading(true);
    }
  }, [businessCapitalData, monthIndex]);

  return (
    <div className="font-pops h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-70">
      <form className="rounded-md bg-white overflow-hidden px-5 shadow-lg">
        <div className="flex items-center justify-center relative w-full">
          <div className="text-center mt-6">
            <h1 className="font-bold text-2xl text-loranges mb-2">
              Monthly Capital
            </h1>
            <p className="text-md font-bold mb-2">
              {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </p>
          </div>
          <div
            onClick={(e) => {
              if (loadPage) {
                location.reload();
              }

              e.preventDefault(),
                setShowBusinessCapitalForm(false),
                setShowBusinessCapitalInput(false);
            }}
            className="absolute right-0 mb-8 cursor-pointer hover:bg-light hover:rounded-full p-1"
          >
            <IoClose className="text-2xl text-loranges hover:text-oranges" />
          </div>
        </div>

        <div className="text-sm font-bold mb-3 text-center">
          Capital:{" "}
          <span className="text-xs text-[#A6ACAF] font-normal">
            (Cash, Assets etc...)
          </span>
        </div>

        {capitalData.map((d, i) => (
          <React.Fragment key={i}>
            {capitalDataLoading ? (
              <div className="px-5">
                <Skeleton height={28} />
              </div>
            ) : (
              <BMonthlyCapitalData capitalData={d} />
            )}
          </React.Fragment>
        ))}

        <div className="flex justify-center">
          <div
            onClick={() => {
              if (!loggedIn) {
                navigate("/Login");
              } else {
                addCapital();
              }
            }}
            className={`cursor-pointer w-fit px-2 h-2 rounded-md overflow-hidden py-1 text-white flex items-center gap-1 border border-loranges bg-loranges hover:bg-oranges font-semibold my-2 ${
              showBusinessCapitalInput ? "hidden" : ""
            }`}
          >
            <MdOutlinePostAdd className="text-3xl" /> Add
          </div>
        </div>

        {/* Add button for monthly expenses */}
        <div>{showBusinessCapitalInput && <BMonthlyCapitalAdd />}</div>

        {/* Total Expenses */}
        <div className="px-5 mb-5 flex items-center space-x-2 justify-center mt-2">
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
      </form>
    </div>
  );
};

export default BMonthlyCapitalForm;
