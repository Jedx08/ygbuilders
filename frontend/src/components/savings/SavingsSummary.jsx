import { useContext } from "react";
import piggyMonth from "../../media/savings_month.png";
import piggyYear from "../../media/savings_year.png";
import piggyTotal from "../../media/savings_total.png";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";

const SavingsSummary = ({
  savingsCurrentAmount,
  savingsAmountMonth,
  savingsAmountYear,
}) => {
  const { monthIndex } = useContext(CalendarContext);

  return (
    <div>
      {/* Monthly Summary */}
      <div className="bg-white h-hfit rounded-lg shadow-sm">
        <div>
          <div
            className={`flex gap-3 justify-center items-center px-1 pt-3 pb-1 text-yellows font-bold text-xl clg:py-1 sm:text-lg`}
          >
            Summary
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-evenly py-5 px-5 gap-2 lg:px-2">
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")}
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={piggyMonth}
                    alt="mon_gross"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-greens font-bold text-xl/[24px] mdd:text-lg">
                    {savingsAmountMonth.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                {dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")}
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={piggyYear}
                    alt="mon_expenses"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-greens font-bold text-xl/[24px] mdd:text-lg">
                    {savingsAmountYear.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Total
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={piggyTotal}
                    alt="mon_net"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`font-bold text-greens text-xl/[24px] mdd:text-lg`}
                  >
                    {savingsCurrentAmount.toLocaleString("en-US", {
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

export default SavingsSummary;
