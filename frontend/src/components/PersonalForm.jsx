import { useContext, useState, useEffect } from "react";
import pouchIcon from "../media/pouch.png";
import expensesIcon from "../media/expenses.png";
import networthIcon from "../media/networth.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarContext } from "../context/CalendarContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";

const PersonalForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    setShowPersonalForm,
    formSelectedDate,
    setFormSelectedDate,
    exactDaySelected,
    dispatchPersonalIncomeData,
    setPersonalIncomeLoading,
  } = useContext(CalendarContext);

  const [isData, setIsData] = useState(true);
  const [editData, setEditData] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (formSelectedDate) {
      setEditData(true);
    } else {
      setIsData(false);
    }
  }, [formSelectedDate]);

  const [gross, setGross] = useState(
    formSelectedDate ? formSelectedDate.gross : ""
  );
  const [expenses, setExpenses] = useState(
    formSelectedDate ? formSelectedDate.expenses : ""
  );
  const [error, setError] = useState("");

  const [newGross, setNewGross] = useState(gross);
  const [newExpenses, setNewExpenses] = useState(expenses);
  const [errorStyle, setErrorStyle] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      gross: +gross,
      expenses: +expenses,
      net: gross - expenses,
      day: exactDaySelected.valueOf(),
      id: formSelectedDate ? formSelectedDate.id : Date.now(),
    };

    const update = {
      gross: +newGross,
      expenses: +newExpenses,
      net: +newGross - +newExpenses,
      day: exactDaySelected.valueOf(),
      id: formSelectedDate ? formSelectedDate.id : Date.now(),
    };

    // Update data
    if (formSelectedDate) {
      if (!newGross && !newExpenses) {
        return (
          setError("Please fill out atleast one of the fields"),
          setErrorStyle(true)
        );
      }

      if (isNaN(newGross)) {
        return (
          setError("Invalid value, Gross and Expenses must be a Number"),
          setErrorStyle(true)
        );
      }

      if (isNaN(newExpenses)) {
        return (
          setError("Invalid value, Gross and Expenses must be a Number"),
          setErrorStyle(true)
        );
      }

      setSaveChangesLoading(true);

      try {
        const response = await axiosPrivate.patch(
          "/api/personal-income/" + formSelectedDate._id,
          JSON.stringify(update)
        );
        const json = await response.data;
        if (response.status === 200) {
          dispatchPersonalIncomeData({ type: "update", payload: json });
          setFormSelectedDate(null);
          setShowPersonalForm(false);
          setError(null);
          setPersonalIncomeLoading(true);
        }
      } catch (err) {
        setError(err);
      }
    } else {
      // Create data
      try {
        if (!gross && !expenses) {
          return (
            setError("Please fill out atleast one of the fields"),
            setErrorStyle(true)
          );
        }

        if (isNaN(gross)) {
          return (
            setError("Invalid value, Gross and Expenses must be a Number"),
            setErrorStyle(true)
          );
        }

        if (isNaN(expenses)) {
          return (
            setError("Invalid value, Gross and Expenses must be a Number"),
            setErrorStyle(true)
          );
        }

        setAddLoading(true);

        const response = await axiosPrivate.post(
          "/api/personal-income",
          JSON.stringify(data)
        );
        const json = await response.data;

        if (response.status === 200) {
          dispatchPersonalIncomeData({
            type: "create",
            payload: json,
          });
        }
        setFormSelectedDate(null);
        setError(null);
        setShowPersonalForm(false);
        setPersonalIncomeLoading(true);
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
        "/api/personal-income/" + formSelectedDate._id
      );
      const json = await response.data;
      if (response.status === 200) {
        dispatchPersonalIncomeData({
          type: "delete",
          payload: json,
        });
        setFormSelectedDate(null);
        setError(null);
        setShowPersonalForm(false);
        setPersonalIncomeLoading(true);
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
            <h1 className="font-bold text-2xl text-greens">Personal Income</h1>
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
                setShowPersonalForm(false),
                setFormSelectedDate(null);
            }}
            className="absolute right-0 pr-2 mb-5 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="text-xl text-loranges hover:text-oranges"
            />
          </div>
        </div>

        {/* Gross */}
        <div className="mb-2 mt-5 w-48 mx-auto">
          <div className="flex items-center justify-center">
            <label className="text-sm font-bold">Gross:</label>
          </div>
          {editData || confirmDelete ? (
            <div className="flex py-1 bg-light rounded-md overflow-hidden">
              <div className="pl-2">
                <img src={pouchIcon} className="w-6" />
              </div>
              <div className="ml-3">
                <p>
                  <span className="text-[#2C2C2C] font-normal">&#x20B1; </span>
                  {gross.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {updateData ? (
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
                    setNewGross(e.target.value),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  value={newGross}
                  className="focus:outline-none pl-3 py-1 w-full"
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {isData ? (
            <></>
          ) : (
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
                    setGross(e.target.value),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  value={gross}
                  className="focus:outline-none pl-3 py-1 w-full"
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
          {editData || confirmDelete ? (
            <div className="flex py-1 col-span-2 bg-light rounded-md overflow-hidden">
              <div className="pl-2">
                <img src={expensesIcon} className="w-6" />
              </div>
              <div className="ml-3">
                <p>
                  <span className="text-[#2C2C2C] font-normal">&#x20B1; </span>
                  {expenses.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {updateData ? (
            <div
              className={`flex border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={expensesIcon} className="w-12" />
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
                  className="focus:outline-none pl-2 py-1 w-full"
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {isData ? (
            <></>
          ) : (
            <div
              className={`flex border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={expensesIcon} className="w-12" />
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
                  className="focus:outline-none pl-2 py-1 w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Net Pay */}
        <div className="w-44 mx-auto px-4">
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm font-bold">Net:</p>
          </div>
          <div className="flex bg-light rounded-md overflow-hidden">
            <div className="pl-2">
              <img src={networthIcon} className="w-8" />
            </div>
            <div className="flex items-center ml-4">
              {editData || confirmDelete ? (
                <p
                  className={`font-bold ${
                    gross - expenses < 0 ? "text-[red]" : "text-greens"
                  }`}
                >
                  <span className="text-[#2C2C2C] font-normal">&#x20B1; </span>
                  {(gross - expenses).toLocaleString()}
                </p>
              ) : (
                <></>
              )}

              {updateData ? (
                <p
                  className={`font-bold ${
                    newGross - newExpenses < 0 ? "text-[red]" : "text-greens"
                  }`}
                >
                  {newGross - newExpenses}
                </p>
              ) : (
                <></>
              )}

              {isData ? (
                <></>
              ) : (
                <p
                  className={`font-bold ${
                    gross - expenses < 0 ? "text-[red]" : "text-greens"
                  }`}
                >
                  <span className="text-[#2C2C2C] font-normal">&#x20B1; </span>
                  {(gross - expenses).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-xs text-center text-[red] mt-2 mb-10">{error}</div>

        {confirmDelete ? (
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
                      className="text-lgreens cursor-pointer hover:text-greens text-xl"
                    />
                  </div>
                  <div
                    onClick={() => {
                      setConfirmDelete(false), setEditData(true);
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
        ) : (
          <></>
        )}

        {/* Add buttons */}
        {isData || addLoading ? (
          <></>
        ) : (
          <div className="flex flex-col items-center mb-10">
            <div className="mb-2">
              <button
                onClick={handleSubmit}
                className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white hover:bg-lgreens"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {addLoading ? (
          <div className="flex flex-col items-center mb-10">
            <div className="mb-2">
              <div className="mx-auto py-1 rounded-md px-6 bg-lgreens font-bold text-white">
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
        ) : (
          <></>
        )}

        {/* Edit and Delete Button */}
        {editData ? (
          <div className="flex justify-center space-x-4 mb-10">
            <div
              onClick={() => {
                setUpdateData(true), setEditData(false);
              }}
              className="bg-lgreens hover:bg-greens cursor-pointer rounded-md px-4 py-1"
            >
              <p className="text-white font-bold">Edit</p>
            </div>
            <div
              onClick={() => {
                setEditData(false), setConfirmDelete(true);
              }}
              className="bg-[#FF4242] hover:bg-[red] cursor-pointer rounded-md px-4 py-1"
            >
              <p className="text-white font-bold">Delete</p>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* Save changes and Cancel button */}
        {updateData ? (
          <div className="flex justify-center space-x-4 mb-10">
            {saveChangesLoading ? (
              <>
                <div className="bg-greens rounded-md px-4 py-1">
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
                  className="bg-lgreens hover:bg-greens cursor-pointer rounded-md px-4 py-1"
                >
                  <p className="text-white font-bold">Save changes</p>
                </button>

                <div
                  onClick={() => {
                    setEditData(true),
                      setUpdateData(false),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  className="bg-[#FF4242] hover:bg-[red] cursor-pointer rounded-md px-4 py-1"
                >
                  <p className="text-white font-bold">Back</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default PersonalForm;
