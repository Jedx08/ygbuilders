import { useEffect, useContext, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import dayjs from "dayjs";
import capitalIcon from "../../../media/bus_pouch.png";
import expensesIcon from "../../../media/bus_expenses.png";
import salesIcon from "../../../media/sales.png";
import profitIcon from "../../../media/bus_profit.png";

const BusinessData = ({ businessDataLoading, monthData }) => {
  const {
    setExactDaySelected,
    setBusinessFormSelectedDate,
    setShowBusinessForm,
  } = useContext(CalendarContext);

  return (
    <div>
      {/* Income Data */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className={`border border-light font-bold rounded-md py-2`}>
          <div
            className={`flex gap-3 justify-center items-center px-1 py-1 text-oranges font-bold text-xl/[24px] sm:text-lg`}
          >
            <p>Daily Income</p>
          </div>
          <div className="flex items-center justify-evenly py-1">
            <div className="flex space-x-1 items-center justify-center">
              <img src={capitalIcon} alt="capital" className={`w-8 sm:w-6`} />
              <p className="text-sm font-normal">Capital</p>
            </div>
            <div className="flex space-x-1 items-center justify-center">
              <img src={salesIcon} alt="sales" className={`w-8 sm:w-6`} />
              <p className="text-sm font-normal">Sales</p>
            </div>
            <div className="flex space-x-1 items-center justify-center">
              <img src={expensesIcon} alt="expenses" className={`w-8 sm:w-6`} />
              <p className="text-sm font-normal">Expenses</p>
            </div>
            <div className="flex space-x-1 items-center justify-center">
              <img src={profitIcon} alt="profit" className={`w-8 sm:w-6`} />
              <p className="text-sm font-normal">Profit</p>
            </div>
          </div>
        </div>
        {businessDataLoading && (
          <div className="bg-white border border-light py-3 text-center rounded-md text-sm text-[#A6ACAF]">
            Getting Data...
          </div>
        )}
        {!businessDataLoading && (
          <div className="h-[406px] overflow-auto">
            {monthData.length === 0 ? (
              <div className="bg-white border border-light py-3 text-center rounded-md text-sm text-[#A6ACAF]">
                No data to show
              </div>
            ) : (
              ""
            )}
            {monthData.map((d, i) => {
              return (
                <div
                  onClick={() => {
                    if (window.innerWidth <= 658) {
                      setShowBusinessForm(true);
                    }
                    setExactDaySelected(dayjs(d.day));
                    setBusinessFormSelectedDate(d);
                  }}
                  key={i}
                  className="bg-white border border-light cursor-pointer hover:border-loranges rounded-md"
                >
                  <div className="text-base font-medium text-center">
                    {dayjs(d.day).format("MMMM D")}
                  </div>
                  <div
                    className={`flex font-medium justify-center text-sm py-2`}
                  >
                    <div
                      className={`flex flex-wrap items-center justify-evenly gap-2 w-full`}
                    >
                      {/* capital */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={capitalIcon}
                            alt="capital"
                            className={`w-8 sm:w-6`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-oranges text-base font-semibold">
                            {d.capital.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* sales */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={salesIcon}
                            alt="sales"
                            className={`w-8 sm:w-6`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-[#399CB4] text-base font-semibold">
                            {d.sales.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* expenses */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={expensesIcon}
                            alt="expenses"
                            className={`w-8 sm:w-6`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-[red] text-base font-semibold">
                            {d.expenses.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {/* profit */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={profitIcon}
                            alt="profit"
                            className={`w-8 sm:w-6`}
                          />
                          <p className="ml-1 font-semibold text-[#D0D0D0]">:</p>
                          <p
                            className={`text-base font-semibold ${
                              d.profit < 0 ? "text-[red]" : "text-greens"
                            }`}
                          >
                            {d.profit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessData;
