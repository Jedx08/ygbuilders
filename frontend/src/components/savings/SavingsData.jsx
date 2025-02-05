import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import dayjs from "dayjs";
import piggy from "../../media/savings_logo.png";

const SavingsData = ({ savingsDataLoading, monthData }) => {
  const {
    setSavingsFormSelectedData,
    setExactDaySelected,
    setShowSavingsForm,
  } = useContext(CalendarContext);

  return (
    <div>
      {/* Income Data */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className={`border border-light font-bold rounded-md py-2`}>
          <div
            className={`flex gap-3 justify-center items-center py-1 px-1 text-yellows font-bold text-xl/[24px] sm:text-lg`}
          >
            Savings
          </div>
        </div>
        {savingsDataLoading && (
          <div className="bg-white border border-light py-3 text-center rounded-md text-sm text-[#A6ACAF]">
            Getting Data...
          </div>
        )}
        {!savingsDataLoading && (
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
                      setShowSavingsForm(true);
                    }
                    setExactDaySelected(dayjs(d.day));
                    setSavingsFormSelectedData(d);
                  }}
                  key={i}
                  className="bg-white border border-light cursor-pointer hover:border-lgreens rounded-sm"
                >
                  <div className="text-base font-medium text-center">
                    {dayjs(d.day).format("MMMM D")}
                  </div>
                  <div
                    className={`flex font-medium justify-center text-sm py-2`}
                    key={i}
                  >
                    <div
                      className={`flex flex-wrap items-center justify-evenly gap-2 w-full`}
                    >
                      {/* gross */}
                      <div className="flex items-center font-semibold">
                        <div
                          className={`flex space-x-1 items-center justify-center`}
                        >
                          <img
                            src={piggy}
                            alt="gross"
                            className={`w-8 sm:w-6`}
                          />
                          <p className="ml-1 text-[#D0D0D0]">:</p>
                          <p className="text-oranges text-base font-semibold">
                            {d.amount.toLocaleString()}
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

export default SavingsData;
