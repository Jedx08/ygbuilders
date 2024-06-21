import { useContext, useState } from "react";
import pouch from "../media/pouch.png";
import expenses from "../media/expenses.png";
import networth from "../media/networth.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../context/CalendarContext";

const PersonalForm = () => {
  const { setShowPersonalForm, formSelectedDate, exactDaySelected } =
    useContext(CalendarContext);

  return (
    <div className="h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-70">
      <form className="rounded-md bg-white overflow-hidden px-5">
        <div className="flex items-center justify-center relative w-full">
          <div className="text-center mt-6">
            <h1 className="font-bold text-2xl text-greens">Personal Income</h1>
            <p className="text-xs font-semibold">
              {exactDaySelected.format("MMMM D, YYYY")}
            </p>
          </div>
          <div className="absolute right-0 pr-2 mb-5">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPersonalForm(false);
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="text-xl text-loranges hover:text-oranges"
              />
            </button>
          </div>
        </div>
        <div className="px-5 mb-5 mt-5">
          <label className="text-sm font-bold">Gross:</label>
          <div className="mb-2 flex border border-inputLight w-full rounded-md overflow-hidden">
            <div className="pl-2">
              <img src={pouch} className="w-6 mt-1" />
            </div>
            <div>
              <input
                type="number"
                className="focus:outline-none focus:border-greens pl-4 py-1 caret-greens"
              />
            </div>
          </div>
        </div>
        <div className="px-5 mb-5">
          <label className="text-sm font-bold">Expenses:</label>
          <div className="mb-2 flex border border-inputLight w-full rounded-md overflow-hidden">
            <div className="pl-2">
              <img src={expenses} className="w-8" />
            </div>
            <div>
              <input
                type="number"
                className="focus:outline-none focus:border-greens pl-2 py-1 caret-greens"
              />
            </div>
          </div>
        </div>
        <div className="px-5 mb-5">
          <p className="text-sm font-bold">Networth:</p>
          <div className="border border-inputLight rounded-md py-1 text-center mx-auto w-fit">
            <div className="grid grid-cols-3">
              <div className="pl-2">
                <img src={networth} className="w-7 mr-3" />
              </div>
              <div className="mt-[0.15rem]">
                <p>10,000</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-10 mb-10">
          <div className="mb-2">
            <button className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white hover:bg-lgreens">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalForm;
