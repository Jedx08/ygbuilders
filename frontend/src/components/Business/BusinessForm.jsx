import { useContext, useState, useEffect } from "react";
import capitalIcon from "../../media/bus_pouch.png";
import salesIcon from "../../media/sales.png";
import expensesIcon from "../../media/bus_expenses.png";
import profitIcon from "../../media/bus_profit.png";
import { CalendarContext } from "../../context/CalendarContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { BsBackspace } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BusinessForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    setShowBusinessForm,
    businessFormSelectedDate,
    setBusinessFormSelectedDate,
    exactDaySelected,
    setBusinessIncomeLoading,
    dispatchBusinessIncomeData,
    inMobile,
    loggedIn,
  } = useContext(CalendarContext);

  const [isData, setIsData] = useState(false);
  const [editData, setEditData] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (businessFormSelectedDate) {
      setIsData(true);
    }
  }, [businessFormSelectedDate]);

  const [capital, setCapital] = useState(
    businessFormSelectedDate ? businessFormSelectedDate.capital : ""
  );
  const [sales, setSales] = useState(
    businessFormSelectedDate ? businessFormSelectedDate.sales : ""
  );
  const [expenses, setExpenses] = useState(
    businessFormSelectedDate ? businessFormSelectedDate.expenses : ""
  );
  const [error, setError] = useState("");

  const [newCapital, setNewCapital] = useState(capital);
  const [newSales, setNewSales] = useState(sales);
  const [newExpenses, setNewExpenses] = useState(expenses);
  const [errorStyle, setErrorStyle] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

    const update = {
      capital: +newCapital,
      sales: +newSales,
      expenses: +newExpenses,
      profit: newSales - newExpenses - newCapital,
      day: exactDaySelected.valueOf(),
      id: businessFormSelectedDate ? businessFormSelectedDate.id : Date.now(),
    };

    // Update data
    if (businessFormSelectedDate) {
      if (!newCapital && !newSales && !newExpenses) {
        return (
          setError("Please fill out atleast one of the fields"),
          setErrorStyle(true)
        );
      }

      if (isNaN(newCapital)) {
        return (
          setError("Invalid value, Gross, Sales and Expenses must be a Number"),
          setErrorStyle(true)
        );
      }

      if (isNaN(newSales)) {
        return (
          setError("Invalid value, Gross, Sales and Expenses must be a Number"),
          setErrorStyle(true)
        );
      }

      if (isNaN(newExpenses)) {
        return (
          setError("Invalid value, Gross, Sales and Expenses must be a Number"),
          setErrorStyle(true)
        );
      }

      setSaveChangesLoading(true);

      try {
        const response = await axiosPrivate.patch(
          "/api/business-income/" + businessFormSelectedDate._id,
          JSON.stringify(update)
        );
        const json = await response.data;
        if (response.status === 200) {
          dispatchBusinessIncomeData({ type: "update", payload: json });
          setBusinessFormSelectedDate(null);
          setShowBusinessForm(false);
          setError(null);
          setBusinessIncomeLoading(true);
        }
      } catch (err) {
        setError(err);
      }
    } else {
      // Create data
      try {
        if (!capital && !sales && !expenses) {
          return (
            setError("Please fill out atleast one of the fields"),
            setErrorStyle(true)
          );
        }

        if (isNaN(capital)) {
          return (
            setError(
              "Invalid value, Gross, Sales and Expenses must be a Number"
            ),
            setErrorStyle(true)
          );
        }

        if (isNaN(sales)) {
          return (
            setError(
              "Invalid value, Gross, Sales and Expenses must be a Number"
            ),
            setErrorStyle(true)
          );
        }

        if (isNaN(expenses)) {
          return (
            setError(
              "Invalid value, Gross, Sales and Expenses must be a Number"
            ),
            setErrorStyle(true)
          );
        }

        setAddLoading(true);

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
        setBusinessFormSelectedDate(null);
        setError(null);
        setShowBusinessForm(false);
        setBusinessIncomeLoading(true);
      } catch (err) {
        console.log(err);
      }
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
        setBusinessFormSelectedDate(null);
        setError(null);
        setShowBusinessForm(false);
        setBusinessIncomeLoading(true);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Bad request");
      }
    }
  }

  useEffect(() => {
    setError("");
    setErrorStyle(false);
  }, [capital, sales, expenses, newCapital, newSales, newExpenses]);

  // capital length validation
  const capitalInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setCapital(value);
    }
  };

  // sales length validation
  const salesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setSales(value);
    }
  };

  // expenses length validation
  const expensesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setExpenses(value);
    }
  };

  // update capital length validation
  const updateCapitalInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setNewCapital(value);
    }
  };

  // update sales length validation
  const updateSalesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setNewSales(value);
    }
  };

  // update expenses length validation
  const updateExpensesInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setNewExpenses(value);
    }
  };

  return (
    <div className="font-pops h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-70">
      <form
        className={`rounded-md bg-white overflow-hidden shadow-lg ${
          inMobile ? "w-auto pl-5 pr-1" : "w-80 px-2"
        }`}
      >
        <div
          className={`flex justify-center relative w-full ${
            inMobile ? "" : "items-center"
          }`}
        >
          <div className="text-center mt-6">
            <h1
              className={`font-bold text-oranges ${
                inMobile ? "text-4xl xs:text-2xl" : "text-2xl items-center"
              }`}
            >
              Business Income
            </h1>
            <p className={`font-semibold ${inMobile ? "text-xl" : "text-sm"}`}>
              {exactDaySelected.format("MMMM D, YYYY")}
            </p>
          </div>

          {/* Close button */}
          <div
            onClick={(e) => {
              if (addLoading) {
                location.reload();
              }
              if (saveChangesLoading) {
                location.reload();
              }
              if (deleteLoading) {
                location.reload();
              }
              e.preventDefault(),
                setShowBusinessForm(false),
                setBusinessFormSelectedDate(null);
            }}
            className={`cursor-pointer hover:bg-light hover:rounded-full ${
              inMobile
                ? "text-3xl font-bold py-1"
                : "font-bold absolute right-0 mb-5 p-1 text-2xl"
            }`}
          >
            <IoClose className="text-loranges hover:text-oranges" />
          </div>
        </div>

        {/* Capital */}
        <div className="mb-2 mt-5 w-48 mx-auto">
          <div className="flex items-center justify-center">
            <label className={` font-bold ${inMobile ? "text-lg" : "text-sm"}`}>
              Capital:{" "}
              <span className="text-xs text-[#A6ACAF] font-normal">
                (Optional)
              </span>
            </label>
          </div>
          {/* Capital show current data & input */}
          {isData && (
            <>
              {/* show input for update data */}
              {editData && (
                <div
                  className={`flex items-center justify-between border col-span-2 rounded-md overflow-hidden ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img
                      src={capitalIcon}
                      className={`${inMobile ? "w-16" : "w-12"}`}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      onChange={updateCapitalInput}
                      value={newCapital}
                      className={`focus:outline-none pl-3 py-2 w-full ${
                        inMobile ? "text-xl" : ""
                      }`}
                    />
                  </div>
                </div>
              )}
              {/* show current data */}
              {!editData && (
                <div
                  className={`flex items-center justify-between py-1 bg-light rounded-md overflow-hidden ${
                    inMobile ? "text-xl" : ""
                  }`}
                >
                  <div className="pl-2">
                    <img
                      src={capitalIcon}
                      className={`${inMobile ? "w-10" : "w-8"}`}
                    />
                  </div>
                  <div className="text-oranges font-medium">
                    <p>{capital.toLocaleString()}</p>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </>
          )}
          {/* show input for add data */}
          {!isData && (
            <div
              className={`flex border items-center col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img
                  src={capitalIcon}
                  className={`${inMobile ? "w-16" : "w-12"}`}
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={capitalInput}
                  value={capital}
                  className={`focus:outline-none pl-3 py-2 w-full ${
                    inMobile ? "text-xl" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sales */}
        <div className="w-48 mx-auto mb-2">
          <div className="flex items-center justify-center">
            <label className={` font-bold ${inMobile ? "text-lg" : "text-sm"}`}>
              Sales:
            </label>
          </div>
          {/* Sales show current data & input */}
          {isData && (
            <>
              {/* show input for update data */}
              {editData && (
                <div
                  className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img
                      src={salesIcon}
                      className={`${inMobile ? "w-16" : "w-12"}`}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      onChange={updateSalesInput}
                      value={newSales}
                      className={`focus:outline-none pl-3 py-2 w-full ${
                        inMobile ? "text-xl" : ""
                      }`}
                    />
                  </div>
                </div>
              )}
              {/* show current data */}
              {!editData && (
                <div
                  className={`flex items-center justify-between py-1 bg-light rounded-md overflow-hidden ${
                    inMobile ? "text-xl" : ""
                  }`}
                >
                  <div className="pl-2">
                    <img
                      src={salesIcon}
                      className={`${inMobile ? "w-10" : "w-8"}`}
                    />
                  </div>
                  <div className="text-greens font-medium">
                    <p>{sales.toLocaleString()}</p>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </>
          )}
          {/* show input for add data */}
          {!isData && (
            <div
              className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img
                  src={salesIcon}
                  className={`${inMobile ? "w-16" : "w-12"}`}
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={salesInput}
                  value={sales}
                  className={`focus:outline-none pl-3 py-2 w-full ${
                    inMobile ? "text-xl" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expenses */}
        <div className="w-48 mx-auto mb-5">
          <div className="flex items-center justify-center">
            <label className={` font-bold ${inMobile ? "text-lg" : "text-sm"}`}>
              Expenses:
            </label>
          </div>

          {isData && (
            <>
              {/* show input for update data */}
              {editData && (
                <div
                  className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img
                      src={expensesIcon}
                      className={`${inMobile ? "w-16" : "w-12"}`}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      onChange={updateExpensesInput}
                      value={newExpenses}
                      className={`focus:outline-none pl-3 py-2 w-full ${
                        inMobile ? "text-xl" : ""
                      }`}
                    />
                  </div>
                </div>
              )}
              {/* show current data */}
              {!editData && (
                <div
                  className={`flex items-center justify-between py-1 bg-light rounded-md overflow-hidden ${
                    inMobile ? "text-xl" : ""
                  }`}
                >
                  <div className="pl-2">
                    <img
                      src={expensesIcon}
                      className={`${inMobile ? "w-10" : "w-8"}`}
                    />
                  </div>
                  <div className="text-[red] font-medium">
                    <p>{expenses.toLocaleString()}</p>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </>
          )}
          {/* show input for add data */}
          {!isData && (
            <div
              className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img
                  src={capitalIcon}
                  className={`${inMobile ? "w-16" : "w-12"}`}
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={expensesInput}
                  value={expenses}
                  className={`focus:outline-none pl-3 py-2 w-full ${
                    inMobile ? "text-xl" : ""
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Profit */}
        <div className="w-44 mx-auto px-4">
          {/* show new profit */}
          {editData && (
            <>
              <div className="col-span-1 flex items-center justify-center">
                <p className={` font-bold ${inMobile ? "text-lg" : "text-sm"}`}>
                  Profit:
                </p>
              </div>
              <div className="flex bg-light rounded-md overflow-hidden pt-2 pb-1">
                <div className="pl-2">
                  <img
                    src={profitIcon}
                    className={`${inMobile ? "w-10" : "w-8"}`}
                  />
                </div>
                <div
                  className={`flex items-center ml-4 ${
                    inMobile ? "text-xl" : ""
                  }`}
                >
                  <p
                    className={`font-bold ${
                      newSales - newExpenses - newCapital < 0
                        ? "text-[red]"
                        : "text-greens"
                    }`}
                  >
                    {newSales || newExpenses
                      ? (newSales - newExpenses - newCapital).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* show current data */}
          {!editData && (
            <>
              <div className="col-span-1 flex items-center justify-center">
                <p className={` font-bold ${inMobile ? "text-lg" : "text-sm"}`}>
                  Profit:
                </p>
              </div>
              <div className="flex bg-light rounded-md overflow-hidden pt-2 pb-1">
                <div className="pl-2">
                  <img
                    src={profitIcon}
                    className={`${inMobile ? "w-10" : "w-8"}`}
                  />
                </div>
                <div
                  className={`flex items-center ml-4 ${
                    inMobile ? "text-xl" : ""
                  }`}
                >
                  <p
                    className={`font-bold ${
                      sales - expenses - capital < 0
                        ? "text-[red]"
                        : "text-greens"
                    }`}
                  >
                    {sales || expenses
                      ? (sales - expenses - capital).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        <div className="text-xs text-center text-[red] mt-2 mb-10">{error}</div>

        {/* Confirm Delete */}
        {confirmDelete && (
          <div className=" rounded-md mt-1 p-2 bg-light mb-3">
            <p className={`text-center ${inMobile ? "text-lg" : "text-xs"}`}>
              Confirm deletion for{" "}
              <span
                className={`text-[red] font-semibold ${
                  inMobile ? "text-lg" : "text-xs"
                }`}
              >
                {exactDaySelected.format("MMMM D, YYYY")}
              </span>{" "}
              income ?
            </p>
            <div className="flex justify-center gap-6 mt-2 mb-1">
              {deleteLoading ? (
                <div>
                  <ThreeDot
                    style={{ fontSize: "7px" }}
                    variant="pulsate"
                    color="#ff0000"
                    text=""
                    textColor=""
                  />
                </div>
              ) : (
                <>
                  <div
                    onClick={handleDelete}
                    className="text-[#FF4242] cursor-pointer hover:text-[red] text-sm font-bold flex items-center gap-1"
                  >
                    <span className={`${inMobile ? "text-3xl" : "text-xl"}`}>
                      <FaRegTrashCan />
                    </span>
                    Delete
                  </div>
                  <div
                    onClick={() => {
                      setConfirmDelete(false),
                        setShowDeleteMsg(false),
                        setEditData(false);
                    }}
                    className="text-oranges hover:text-loranges font-bold cursor-pointer text-sm flex items-center gap-1"
                  >
                    <span className={`${inMobile ? "text-3xl" : "text-xl"}`}>
                      <BsBackspace />
                    </span>{" "}
                    Cancel
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!showDeleteMsg && (
          <>
            {/* Add, Edit & Delete button */}
            {isData && (
              <div className="flex justify-center space-x-4 mb-10">
                {/* show save changes & back button */}
                {editData && (
                  <>
                    {saveChangesLoading ? (
                      <>
                        <div className="bg-oranges rounded-md px-4 py-1">
                          <p className="text-white font-bold">
                            <ThreeDot
                              style={{ fontSize: "7px" }}
                              variant="pulsate"
                              color="#fff"
                              text=""
                              textColor=""
                            />
                          </p>
                        </div>

                        <div
                          onClick={() => {
                            location.reload();
                          }}
                          className="bg-[#FF4242] hover:bg-[red] cursor-pointer rounded-md px-4 py-1"
                        >
                          <p className="text-white font-bold">Cancel</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSubmit}
                          className="bg-loranges hover:bg-oranges cursor-pointer rounded-md px-4 py-1"
                        >
                          <p className="text-white font-bold flex items-center gap-2">
                            <span className="text-2xl">
                              <GoChecklist />
                            </span>
                            Save
                          </p>
                        </button>

                        <div
                          onClick={() => {
                            setEditData(false),
                              setError(""),
                              setErrorStyle(false);
                          }}
                          className="border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md text-[#FF4242] hover:text-[red] px-4 py-1"
                        >
                          <p className="font-bold flex items-center gap-2">
                            <span className="text-xl">
                              <BsBackspace />
                            </span>
                            Back
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
                {/* show edit & delete button */}
                {!editData && (
                  <>
                    <div
                      onClick={() => {
                        setEditData(true);
                      }}
                      className="bg-loranges hover:bg-oranges cursor-pointer rounded-md px-4 py-1"
                    >
                      <p className="text-white gap-2 font-bold flex items-center">
                        <span className="text-xl">
                          <FaRegPenToSquare />
                        </span>
                        Edit
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        setShowDeleteMsg(true), setConfirmDelete(true);
                      }}
                      className="border border-[#FF4242] hover:border-[red] cursor-pointer rounded-md px-4 py-1 text-[#FF4242] hover:text-[red]"
                    >
                      <p className="font-bold flex gap-2 items-center">
                        <span className="text-xl">
                          <FaRegTrashCan />
                        </span>
                        Delete
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {/* show add button */}
            {!isData && (
              <>
                {addLoading ? (
                  <>
                    <div className="flex flex-col items-center mb-10">
                      <div className="mb-2">
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
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center mb-10">
                      <div className="mb-2">
                        <button
                          onClick={(e) => {
                            if (!loggedIn) {
                              navigate("/Login");
                            } else {
                              handleSubmit(e);
                            }
                          }}
                          className="mx-auto py-1 rounded-md px-6 bg-oranges font-bold text-white hover:bg-loranges flex gap-2 items-center"
                        >
                          <span className="text-3xl">
                            <MdOutlinePostAdd />
                          </span>
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default BusinessForm;
