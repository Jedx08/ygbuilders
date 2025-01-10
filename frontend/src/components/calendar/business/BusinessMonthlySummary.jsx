import React from "react";
import monthCapitalIcon from "../../../media/busmon_pouch.png";
import monthSalesIcon from "../../../media/busmon_sales.png";
import monthExpensesIcon from "../../../media/busmon_expenses.png";
import monthProfitIcon from "../../../media/busmon_net.png";

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
      <div className="bg-white h-hfit rounded-lg">
        <div>
          <div
            className={`flex gap-3 justify-center items-center px-1 pt-3 pb-1 text-oranges font-bold text-xl clg:py-1`}
          >
            Summary
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-evenly py-2 px-5 md:gap-2 mmd:px-2 mmd:justify-center">
            {/* Monthly Capital */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthCapitalIcon}
                  alt="mon_capital"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-oranges font-bold text-xl/[24px]">
                  {(capitalCount + monthlyCapital).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Sales */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthSalesIcon}
                  alt="mon_sales"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-greens font-bold text-xl/[24px]">
                  {salesCount.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Expenses */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthExpensesIcon}
                  alt="mon_expenses"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p className="text-[red] font-bold text-xl/[24px]">
                  {(expensesCount + monthlyExpenses).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Monthly Profit */}
            <div className="flex items-center font-semibold px-5 py-2 rounded-md bg-subCon">
              <div className={`flex space-x-1 items-center justify-center`}>
                <img
                  src={monthProfitIcon}
                  alt="mon_profit"
                  className={`w-14 md:w-10`}
                />
                <p className="ml-1 text-[#D0D0D0]">:</p>
                <p
                  className={`font-bold text-xl/[24px] ${
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessMonthlySummary;
