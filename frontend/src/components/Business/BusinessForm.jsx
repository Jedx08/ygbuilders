import { useContext, useState, useEffect } from "react";
import pouchIcon from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networthIcon from "../../media/networth.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../../context/CalendarContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";

const BusinessForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    setShowBusinessForm,
    businessFormSelectedDate,
    setBusinessFormSelectedDate,
    exactDaySelected,
    setBusinessIncomeLoading,
    dispatchBusinessIncomeData,
  } = useContext(CalendarContext);

  const [isData, setIsData] = useState(false);
  const [editData, setEditData] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  return (
    <div className="font-pops h-s100 w-full fixed left-0 top-0 flex justify-center items-center bg-light bg-opacity-70">
      <form className="rounded-md bg-white overflow-hidden w-80 px-5 shadow-lg">
        <div className="flex items-center justify-center relative w-full">
          <div className="text-center mt-6">
            <h1 className="font-bold text-2xl text-oranges">Business Income</h1>
            <p className="text-xs font-semibold">
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
            className="absolute right-0 pr-2 mb-5 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-xl text-loranges hover:text-oranges"
            />
          </div>
        </div>

        {/* Capital */}
        <div className="mb-2 mt-5 w-48 mx-auto">
          <div className="flex items-center justify-center">
            <label className="text-sm font-bold">Capital:</label>
          </div>
          {/* Capital show current data & input */}
          {isData && (
            <>
              {/* show input for update data */}
              {editData && (
                <div
                  className={`flex border col-span-2 rounded-md overflow-hidden ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img src={pouchIcon} className="w-8 mt-1" />
                  </div>
                  <div>
                    <input
                      type="number"
                      onChange={(e) => {
                        setNewCapital(e.target.value),
                          setError(""),
                          setErrorStyle(false);
                      }}
                      value={newCapital}
                      className="focus:outline-none pl-3 py-1 w-full"
                    />
                  </div>
                </div>
              )}
              {/* show current data */}
              {!editData && (
                <div className="flex py-1 bg-light rounded-md overflow-hidden">
                  <div className="pl-2">
                    <img src={pouchIcon} className="w-6" />
                  </div>
                  <div className="ml-3">
                    <p>
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {capital.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {/* show input for add data */}
          {!isData && (
            <div
              className={`flex border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={pouchIcon} className="w-8 mt-1" />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => {
                    setCapital(e.target.value),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  value={capital}
                  className="focus:outline-none pl-3 py-1 w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sales */}
        <div className="w-48 mx-auto mb-5">
          <div className="flex items-center justify-center">
            <label className="text-sm font-bold">Sales:</label>
          </div>
          {/* Sales show current data & input */}
          {isData && (
            <>
              {/* show input for update data */}
              {editData && (
                <div
                  className={`flex border col-span-2 rounded-md overflow-hidden ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img src={pouchIcon} className="w-8 mt-1" />
                  </div>
                  <div>
                    <input
                      type="number"
                      onChange={(e) => {
                        setNewSales(e.target.value),
                          setError(""),
                          setErrorStyle(false);
                      }}
                      value={newSales}
                      className="focus:outline-none pl-3 py-1 w-full"
                    />
                  </div>
                </div>
              )}
              {/* show current data */}
              {!editData && (
                <div className="flex py-1 bg-light rounded-md overflow-hidden">
                  <div className="pl-2">
                    <img src={pouchIcon} className="w-6" />
                  </div>
                  <div className="ml-3">
                    <p>
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {sales.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {/* show input for add data */}
          {!isData && (
            <div
              className={`flex border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={pouchIcon} className="w-8 mt-1" />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => {
                    setSales(e.target.value),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  value={sales}
                  className={`focus:outline-none pl-3 py-1 w-full`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expenses */}
        <div className="w-48 mx-auto mb-5">
          <div className="flex items-center justify-center">
            <label className="text-sm font-bold">Expenses:</label>
          </div>

          {isData && (
            <>
              {/* show input for update data */}
              {editData && (
                <div
                  className={`flex border col-span-2 rounded-md overflow-hidden ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <div className="pl-2">
                    <img src={expensesIcon} className="w-8 mt-1" />
                  </div>
                  <div>
                    <input
                      type="number"
                      onChange={(e) => {
                        setNewExpenses(e.target.value),
                          setError(""),
                          setErrorStyle(false);
                      }}
                      value={newExpenses}
                      className="focus:outline-none pl-3 py-1 w-full"
                    />
                  </div>
                </div>
              )}
              {/* show current data */}
              {!editData && (
                <div className="flex py-1 bg-light rounded-md overflow-hidden">
                  <div className="pl-2">
                    <img src={expensesIcon} className="w-6" />
                  </div>
                  <div className="ml-3">
                    <p>
                      <span className="text-[#2C2C2C] font-normal">
                        &#x20B1;{" "}
                      </span>
                      {expenses.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {/* show input for add data */}
          {!isData && (
            <div
              className={`flex border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={pouchIcon} className="w-8 mt-1" />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => {
                    setExpenses(e.target.value),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  value={expenses}
                  className="focus:outline-none pl-3 py-1 w-full"
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
                <p className="text-sm font-bold">Profit:</p>
              </div>
              <div className="flex bg-light rounded-md overflow-hidden">
                <div className="pl-2">
                  <img src={networthIcon} className="w-8" />
                </div>
                <div className="flex items-center ml-4">
                  <p
                    className={`font-bold ${
                      newSales - newExpenses - newCapital < 0
                        ? "text-[red]"
                        : "text-greens"
                    }`}
                  >
                    <span className="text-[#2C2C2C] font-normal">
                      &#x20B1;{" "}
                    </span>
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
                <p className="text-sm font-bold">Profit:</p>
              </div>
              <div className="flex bg-light rounded-md overflow-hidden">
                <div className="pl-2">
                  <img src={networthIcon} className="w-8" />
                </div>
                <div className="flex items-center ml-4">
                  <p
                    className={`font-bold ${
                      sales - expenses - capital < 0
                        ? "text-[red]"
                        : "text-greens"
                    }`}
                  >
                    <span className="text-[#2C2C2C] font-normal">
                      &#x20B1;{" "}
                    </span>
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
            <p className="text-xs text-center">
              Are you sure you want to remove{" "}
              <span className="text-xs text-[red] font-semibold">
                {exactDaySelected.format("MMMM D, YYYY")}
              </span>{" "}
              income ?
            </p>
            <div className="flex justify-center space-x-16 mt-2 mb-1">
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
                  <div onClick={handleDelete}>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-loranges cursor-pointer hover:text-oranges text-xl"
                    />
                  </div>
                  <div
                    onClick={() => {
                      setConfirmDelete(false),
                        setShowDeleteMsg(false),
                        setEditData(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="text-[#FF4242] hover:text-[red]  cursor-pointer text-xl"
                    />
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
                          <p className="text-white font-bold">Save changes</p>
                        </button>

                        <div
                          onClick={() => {
                            setEditData(false),
                              setError(""),
                              setErrorStyle(false);
                          }}
                          className="bg-[#FF4242] hover:bg-[red] cursor-pointer rounded-md px-4 py-1"
                        >
                          <p className="text-white font-bold">Back</p>
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
                      <p className="text-white font-bold">Edit</p>
                    </div>
                    <div
                      onClick={() => {
                        setShowDeleteMsg(true), setConfirmDelete(true);
                      }}
                      className="bg-[#FF4242] hover:bg-[red] cursor-pointer rounded-md px-4 py-1"
                    >
                      <p className="text-white font-bold">Delete</p>
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
                          onClick={handleSubmit}
                          className="mx-auto py-1 rounded-md px-6 bg-oranges font-bold text-white hover:bg-loranges"
                        >
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
