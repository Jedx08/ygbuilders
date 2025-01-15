import monGrossIcon from "../../../media/monpouch.png";
import monExpensesIcon from "../../../media/monexpenses.png";
import monNetIcon from "../../../media/monprofit.png";
import { PiChartLineUp, PiChartLineDown } from "react-icons/pi";

const PersonalMonthlySummary = ({
  grossCount,
  expensesCount,
  monthlyExpenses,
}) => {
  return (
    <div>
      {/* Monthly Summary */}
      <div className="bg-white h-hfit rounded-lg">
        <div>
          <div
            className={`flex gap-3 justify-center items-center px-1 pt-3 pb-1 text-greens font-bold text-xl clg:py-1 sm:text-lg`}
          >
            Summary
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-evenly py-2 px-5 gap-2 lg:px-2">
            {/* Monthly Gross */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Gross
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
                <div className={`flex space-x-1 items-center justify-center`}>
                  <img
                    src={monGrossIcon}
                    alt="mon_gross"
                    className={`w-14 mdd:w-10`}
                  />
                  <p className="ml-1 text-[#D0D0D0]">:</p>
                  <p className="text-greens font-bold text-xl/[24px] mdd:text-lg">
                    {grossCount.toLocaleString()}
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
                    src={monExpensesIcon}
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
            {/* Monthly Net */}
            <div>
              <div className="text-base font-semibold text-center mdd:text-sm sm:text-xs">
                Net
              </div>
              <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
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
                    {(
                      grossCount -
                      (expensesCount + monthlyExpenses)
                    ).toLocaleString()}
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
