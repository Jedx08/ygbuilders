import monthCapitalIcon from "../../../media/busmon_pouch.png";
import monthSalesIcon from "../../../media/busmon_sales.png";
import monthExpensesIcon from "../../../media/busmon_expenses.png";
import monthProfitIcon from "../../../media/busmon_net.png";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";

const BusinessMonthlySummary = ({
  capitalCount,
  salesCount,
  expensesCount,
  profitCount,
  monthlyExpenses,
  monthlyCapital,
}) => {
  return (
    <div>
      {/* Monthly Summary */}
      <div className="bg-white h-hfit shadow-sm rounded-lg">
        <div>
          <div
            className={`flex gap-3 justify-center items-center px-1 pt-3 pb-1 text-oranges font-bold text-xl clg:py-1 sm:text-lg`}
          >
            Summary
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-evenly py-2 px-5 gap-2 lg:px-2">
            {/* Monthly Capital */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Capital
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monthCapitalIcon}
                    alt="mon_capital"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-oranges font-bold text-xl/[24px] mdd:text-lg">
                    {(capitalCount + monthlyCapital).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Monthly Sales */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Sales
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monthSalesIcon}
                    alt="mon_sales"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-greens font-bold text-xl/[24px] mdd:text-lg">
                    {salesCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Monthly Expenses */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Expenses
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monthExpensesIcon}
                    alt="mon_expenses"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-[red] font-bold text-xl/[24px] mdd:text-lg">
                    {(expensesCount + monthlyExpenses).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Monthly Profit */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Profit
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
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
                    {(
                      profitCount -
                      (monthlyCapital + monthlyExpenses)
                    ).toLocaleString()}
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
