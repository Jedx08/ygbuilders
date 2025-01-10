import monGrossIcon from "../../../media/monpouch.png";
import monExpensesIcon from "../../../media/monexpenses.png";
import monNetIcon from "../../../media/monprofit.png";

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
            className={`flex gap-3 justify-center items-center px-1 pt-3 pb-1 text-greens font-bold text-xl clg:py-1`}
          >
            Summary
          </div>
        </div>
        <div>
          <div className="flex items-center justify-evenly py-2 px-5 mmd:px-2 mmd:justify-between">
            {/* Monthly Gross */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monGrossIcon}
                  alt="mon_gross"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-greens font-bold text-xl/[24px]">
                  {grossCount.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Expenses */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monExpensesIcon}
                  alt="mon_expenses"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-[red] font-bold text-xl/[24px]">
                  {(expensesCount + monthlyExpenses).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Net */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monNetIcon}
                  alt="mon_net"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p
                  className={`font-bold text-xl/[24px] ${
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalMonthlySummary;
