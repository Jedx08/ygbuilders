import React, { useContext, useEffect, useState } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import capitalIcon from "../../../media/bus_pouch.png";
import salesIcon from "../../../media/sales.png";
import expensesIcon from "../../../media/bus_expenses.png";
import profitIcon from "../../../media/bus_profit.png";
import { ThreeDot } from "react-loading-indicators";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { BsBackspace } from "react-icons/bs";

const BusinessForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    exactDaySelected,
    businessFormSelectedDate,
    setBusinessIncomeLoading,
    dispatchBusinessIncomeData,
    businessButton,
    setBusinessButton,
  } = useContext(CalendarContext);

  const [showButton, setShowButton] = useState(false);
  const [toggleSaveButton, setToggleSaveButton] = useState(true);

  const [capital, setCapital] = useState(
    businessFormSelectedDate ? businessFormSelectedDate.capital : ""
  );
  const [sales, setSales] = useState(
    businessFormSelectedDate ? businessFormSelectedDate.sales : ""
  );
  const [expenses, setExpenses] = useState(
    businessFormSelectedDate ? businessFormSelectedDate.expenses : ""
  );

  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [errStyle, setErrStyle] = useState(false);
  const [errStyleCapital, setErrStyleCapital] = useState(false);
  const [errStyleSales, setErrStyleSales] = useState(false);
  const [errStyleExpenses, setErrStyleExpenses] = useState(false);

  useEffect(() => {
    if (businessFormSelectedDate) {
      setToggleSaveButton(false);
      setCapital(businessFormSelectedDate.capital);
      setSales(businessFormSelectedDate.sales);
      setExpenses(businessFormSelectedDate.expenses);
    } else {
      setToggleSaveButton(true);
      setCapital("");
      setSales("");
      setExpenses("");
    }
    setErrMsg("");
    setErrStyle(false);
    setErrStyleCapital(false);
    setErrStyleSales(false);
    setErrStyleExpenses(false);
  }, [exactDaySelected, businessFormSelectedDate]);

  useEffect(() => {
    if (businessButton) {
      setShowButton(true);
    }
  }, [businessButton]);

  // Create data
  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      capital: +capital,
      sales: +sales,
      expenses: +expenses,
      profit: sales - expenses - capital,
      day: exactDaySelected.valueOf(),
      id: businessFormSelectedDate ? businessFormSelectedDate.id : Date.now(),
    };

    if (!capital && !sales && !expenses) {
      return (
        setErrMsg("Please fill out atleast one of the fields"),
        setErrStyleCapital(true),
        setErrStyleSales(true),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    if (isNaN(capital)) {
      return (
        setErrMsg("Invalid value, Capital must be a Number"),
        setErrStyleCapital(true),
        setErrStyle(true)
      );
    }

    if (isNaN(sales)) {
      return (
        setErrMsg("Invalid value, Sales must be a Number"),
        setErrStyleSales(true),
        setErrStyle(true)
      );
    }

    if (isNaN(expenses)) {
      return (
        setErrMsg("Invalid value, Expenses must be a Number"),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    setAddLoading(true);

    try {
      const response = await axiosPrivate.post(
        "/api/business-income",
        JSON.stringify(data)
      );
      const json = await response.data;

      if (response.status === 200) {
        dispatchBusinessIncomeData({
          type: "create",
          payload: json,
        });
      }
      setErrMsg(null),
        setShowButton(false),
        setBusinessButton(false),
        setBusinessIncomeLoading(true);
      setAddLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const update = {
      capital: +capital,
      sales: +sales,
      expenses: +expenses,
      profit: sales - expenses - capital,
      day: exactDaySelected.valueOf(),
      id: businessFormSelectedDate ? businessFormSelectedDate.id : Date.now(),
    };

    if (!capital && !sales && !expenses) {
      return (
        setErrMsg("Please fill out atleast one of the fields"),
        setErrStyleCapital(true),
        setErrStyleSales(true),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    if (isNaN(capital)) {
      return (
        setErrMsg("Invalid value, Capital must be a Number"),
        setErrStyleCapital(true),
        setErrStyle(true)
      );
    }

    if (isNaN(sales)) {
      return (
        setErrMsg("Invalid value, Sales must be a Number"),
        setErrStyleSales(true),
        setErrStyle(true)
      );
    }

    if (isNaN(expenses)) {
      return (
        setErrMsg("Invalid value, Expenses must be a Number"),
        setErrStyleExpenses(true),
        setErrStyle(true)
      );
    }

    setUpdateLoading(true);

    try {
      const response = await axiosPrivate.patch(
        "/api/business-income/" + businessFormSelectedDate._id,
        JSON.stringify(update)
      );
      const json = await response.data;
      if (response.status === 200) {
        dispatchBusinessIncomeData({ type: "update", payload: json });
        setErrMsg(null);
        setBusinessIncomeLoading(true);
        setUpdateLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Delete Data
  async function handleDelete() {
    setDeleteLoading(true);

    try {
      const response = await axiosPrivate.delete(
        "/api/business-income/" + businessFormSelectedDate._id
      );
      const json = await response.data;
      if (response.status === 200) {
        dispatchBusinessIncomeData({
          type: "delete",
          payload: json,
        });
        setShowButton(false);
        setBusinessButton(false);
        setBusinessIncomeLoading(true);
        setConfirmDelete(false);
        setDeleteLoading(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setErrMsg("Bad request");
        setErrStyle(true);
      }
    }
  }

  // capital length validation
  const capitalInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setCapital(value);
    }
    setErrMsg("");
    setErrStyle(false);
    setErrStyleCapital(false);
    setErrStyleSales(false);
    setErrStyleExpenses(false);
  };

  // sales length validation
  const salesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setSales(value);
    }
    setErrMsg("");
    setErrStyle(false);
    setErrStyleCapital(false);
    setErrStyleSales(false);
    setErrStyleExpenses(false);
  };

  // expenses length validation
  const expensesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setExpenses(value);
    }
    setErrMsg("");
    setErrStyle(false);
    setErrStyleCapital(false);
    setErrStyleSales(false);
    setErrStyleExpenses(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg pt-8 max-w-[350px] h-[480px]">
        <div className="text-center">
          <div className="font-semibold">
            {exactDaySelected.format("MMMM D, YYYY")}
          </div>
          {/* Add Capital */}
          <div className="px-10 justify-center mt-5">
            <div className="font-semibold">
              Capital:{" "}
              <span className="text-xs text-[#A6ACAF] font-normal">
                (Optional)
              </span>
            </div>
            <div
              className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                errStyleCapital ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={capitalIcon} className={`w-10`} />
              </div>
              <input
                type="number"
                value={capital}
                onChange={capitalInput}
                className={`focus:outline-none pl-3 py-2 w-full`}
              />
            </div>
          </div>
          {/* Add Sales */}
          <div className="px-10 justify-center mt-3">
            <div className="font-semibold">Sales:</div>
            <div
              className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                errStyleSales ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={salesIcon} className={`w-10`} />
              </div>
              <input
                type="number"
                value={sales}
                onChange={salesInput}
                className={`focus:outline-none pl-3 py-2 w-full`}
              />
            </div>
          </div>
          {/* Add Expenses */}
          <div className="px-10 justify-center mt-3">
            <div className="font-semibold">Expenses:</div>
            <div
              className={`border rounded-md overflow-hidden flex items-center mx-auto w-[70%] ${
                errStyleExpenses ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={expensesIcon} className={`w-10`} />
              </div>
              <input
                type="number"
                value={expenses}
                onChange={expensesInput}
                className={`focus:outline-none pl-3 py-2 w-full`}
              />
            </div>
          </div>
          {/* Profit */}
          <div className="px-10 justify-center mt-3">
            <div className="font-semibold">Profit:</div>
            <div className="bg-light flex items-center rounded-md mx-auto py-2 w-[70%]">
              <div className="pl-2">
                <img src={profitIcon} className="w-9" />
              </div>
              <div className="">
                <p className="pl-3">
                  {(sales - expenses - capital).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errStyle && (
            <p className="text-center mt-2 text-[red] text-sm">{errMsg}</p>
          )}

          {!confirmDelete && (
            <div className="flex flex-col items-center">
              {showButton && (
                <div className={`${errStyle ? "mt-2" : "mt-9"}`}>
                  {toggleSaveButton && (
                    <>
                      {/* Add data */}
                      {!addLoading && (
                        <div className="flex flex-col items-center ">
                          <div onClick={handleSubmit}>
                            <button className="mx-auto py-1 rounded-md px-6 bg-oranges font-bold text-white hover:bg-loranges flex gap-2 items-center">
                              <span className="text-3xl">
                                <MdOutlinePostAdd />
                              </span>
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Add data loading */}
                      {addLoading && (
                        <div className="flex flex-col items-center ">
                          <div>
                            <div className="mx-auto py-1 rounded-md px-6 bg-loranges font-bold text-white">
                              <ThreeDot
                                style={{ fontSize: "7px" }}
                                variant="pulsate"
                                color="#fff"
                                text=""
                                textColor=""
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {!toggleSaveButton && (
                    <>
                      <div className="flex flex-wrap space-x-4 ">
                        {/* Edit and Delete data */}
                        {!updateLoading && (
                          <>
                            <div
                              onClick={handleUpdate}
                              className="mx-auto py-1 rounded-md px-6 bg-oranges font-bold text-white hover:bg-loranges flex gap-2 items-center cursor-pointer"
                            >
                              <span className="text-3xl">
                                <GoChecklist />
                              </span>
                              Save
                            </div>
                            <div
                              onClick={() => {
                                setConfirmDelete(true);
                              }}
                              className="flex gap-2 items-center border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md py-1 px-4 text-[#FF4242] hover:text-[red] font-bold"
                            >
                              <span className="text-3xl">
                                <FaRegTrashCan />
                              </span>
                              Delete
                            </div>
                          </>
                        )}

                        {/* Edit and Delete data loading */}
                        {updateLoading && (
                          <>
                            <div className="mx-auto py-1 rounded-md px-6 bg-loranges font-bold text-white flex gap-2 items-center">
                              <ThreeDot
                                style={{ fontSize: "7px" }}
                                variant="pulsate"
                                color="#fff"
                                text=""
                                textColor=""
                              />
                            </div>
                            <div
                              onClick={() => {
                                location.reload();
                              }}
                              className="flex gap-2 items-center border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md py-1 px-4 text-[#FF4242] hover:text-[red] font-bold"
                            >
                              <span className="text-3xl">
                                <BsBackspace />
                              </span>
                              Cancel
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Confirm Delete Data */}
          {confirmDelete && (
            <div className="px-4 mt-2">
              <div className="rounded-md p-2 bg-light">
                <p className={`text-center text-xs`}>
                  Confirm deletion for{" "}
                  <span className={`text-[red] font-semibold`}>
                    {exactDaySelected.format("MMMM D, YYYY")}
                  </span>{" "}
                  income ?
                </p>
                <div className="flex justify-center gap-6 mt-2 mb-1">
                  {deleteLoading && (
                    <div>
                      <ThreeDot
                        style={{ fontSize: "7px" }}
                        variant="pulsate"
                        color="#ff0000"
                        text=""
                        textColor=""
                      />
                    </div>
                  )}

                  {!deleteLoading && (
                    <>
                      <div
                        onClick={handleDelete}
                        className="text-[#FF4242] cursor-pointer hover:text-[red] text-sm font-bold flex items-center gap-1"
                      >
                        <span className={`text-xl`}>
                          <FaRegTrashCan />
                        </span>
                        Delete
                      </div>
                      <div
                        className="text-oranges hover:text-loranges font-bold cursor-pointer text-sm flex items-center gap-1"
                        onClick={() => {
                          setConfirmDelete(false);
                        }}
                      >
                        <span className={`text-xl`}>
                          <BsBackspace />
                        </span>{" "}
                        Cancel
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessForm;
