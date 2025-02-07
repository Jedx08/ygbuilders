import { useContext } from "react";
import dayjs from "dayjs";
import { CalendarContext } from "../../../context/CalendarContext";
import monthCapitalIcon from "../../../media/busmon_pouch.png";
import monthSalesIcon from "../../../media/busmon_sales.png";
import monthExpensesIcon from "../../../media/busmon_expenses.png";
import monthProfitIcon from "../../../media/busmon_net.png";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";
import NumberFlow from "@number-flow/react";

const BusinessMonthlySummary = ({
  capitalCount,
  salesCount,
  expensesCount,
  profitCount,
  monthlyExpenses,
  monthlyCapital,
}) => {
  const { monthIndex } = useContext(CalendarContext);

  return (
    <div>
      {/* Monthly Summary */}
      <div className="bg-white h-hfit shadow-sm rounded-lg">
        <div>
          <div
            className={`px-1 pt-3 pb-1 font-bold text-xl clg:py-1 sm:text-lg text-center`}
          >
            <div className="text-oranges">Summary</div>
            <div className="font-medium text-base">
              {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-evenly py-2 px-5 gap-2 lg:px-2">
            {/* Monthly Capital */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Capital
              </div>
              <div className="flex items-center font-semibold">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monthCapitalIcon}
                    alt="mon_capital"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-oranges font-bold text-xl/[24px] mdd:text-lg">
                    {/* {(capitalCount + monthlyCapital).toLocaleString()} */}
                    <NumberFlow
                      value={capitalCount + monthlyCapital}
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
            {/* Monthly Sales */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Sales
              </div>
              <div className="flex items-center font-semibold">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monthSalesIcon}
                    alt="mon_sales"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-[#399CB4] font-bold text-xl/[24px] mdd:text-lg">
                    <NumberFlow
                      value={salesCount}
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
                    src={monthExpensesIcon}
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
            {/* Monthly Profit */}
            <div className="border border-light shadow-sm px-5 py-2 rounded-lg">
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Profit
              </div>
              <div className="flex items-center font-semibold">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monthProfitIcon}
                    alt="mon_profit"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p
                    className={`font-bold text-xl/[24px] mdd:text-lg ${
                      profitCount - (monthlyCapital + monthlyExpenses) < 0
                        ? "text-[red]"
                        : "text-greens"
                    }`}
                  >
                    {/* {(
                      profitCount -
                      (monthlyCapital + monthlyExpenses)
                    ).toLocaleString()} */}
                    <NumberFlow
                      value={profitCount - (monthlyCapital + monthlyExpenses)}
                      trend={5}
                      spinTiming={{ duration: 1500, easing: "ease-in-out" }}
                      format={{
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }}
                    />
                  </p>
                  {profitCount - (monthlyCapital + monthlyExpenses) < 0 ? (
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

export default BusinessMonthlySummary;
