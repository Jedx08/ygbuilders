import { useContext } from "react";
import dayjs from "dayjs";
import { CalendarContext } from "../../../context/CalendarContext";
import monGrossIcon from "../../../media/monpouch.png";
import monExpensesIcon from "../../../media/monexpenses.png";
import monNetIcon from "../../../media/monprofit.png";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";
import NumberFlow from "@number-flow/react";

const PersonalMonthlySummary = ({
  grossCount,
  expensesCount,
  monthlyExpenses,
}) => {
  const { monthIndex } = useContext(CalendarContext);

  return (
    <div>
      {/* Monthly Summary */}
      <div className="bg-white h-hfit rounded-lg shadow-sm">
        <div>
          <div
            className={`px-1 pt-3 pb-1 font-bold text-xl clg:py-1 sm:text-lg text-center`}
          >
            <div className="text-greens">Summary</div>
            <div className="font-medium text-base">
              {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-evenly py-2 px-5 gap-2 lg:px-2">
            {/* Monthly Gross */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Gross
              </div>
              <div className="flex items-center font-semibold">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monGrossIcon}
                    alt="mon_gross"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-oranges font-bold text-xl/[24px] mdd:text-lg">
                    <NumberFlow
                      value={grossCount}
                      trend={5}
                      spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                      format={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* Monthly Expenses */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Expenses
              </div>
              <div className="flex items-center font-semibold">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monExpensesIcon}
                    alt="mon_expenses"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-[red] font-bold text-xl/[24px] mdd:text-lg">
                    {/* {(expensesCount + monthlyExpenses).toLocaleString()} */}
                    <NumberFlow
                      value={expensesCount + monthlyExpenses}
                      trend={5}
                      spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                      format={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            {/* Monthly Net */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Net
              </div>
              <div className="flex items-center font-semibold">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monNetIcon}
                    alt="mon_net"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`font-bold text-xl/[24px] mdd:text-lg ${
                      grossCount - (expensesCount + monthlyExpenses) < 0
                        ? "text-[red]"
                        : "text-greens"
                    }`}
                  >
                    {/* {(
                      grossCount -
                      (expensesCount + monthlyExpenses)
                    ).toLocaleString()} */}
                    <NumberFlow
                      value={grossCount - (expensesCount + monthlyExpenses)}
                      trend={5}
                      spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                      format={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }}
                    />
                  </p>
                  {grossCount - (expensesCount + monthlyExpenses) < 0 ? (
                    <PiChartLineDown className="text-2xl text-[#ff3a33] mdd:text-lg" />
                  ) : (
                    <PiChartLineUp className="text-2xl text-[#32ca5b] mdd:text-lg" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalMonthlySummary;
