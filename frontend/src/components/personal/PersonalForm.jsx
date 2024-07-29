import { useContext, useState, useEffect } from "react";
import pouchIcon from "../../media/pouch.png";
import expensesIcon from "../../media/expenses.png";
import networthIcon from "../../media/networth.png";
import { CalendarContext } from "../../context/CalendarContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { BsBackspace } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

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
      <form className="rounded-md bg-white overflow-hidden w-80 px-2 shadow-lg">
        <div className="flex items-center justify-center relative w-full">
          <div className="text-center mt-6">
            <h1 className="font-bold text-2xl text-greens">Personal Income</h1>
            <p className="text-sm font-semibold">
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
            className="absolute right-0 mb-5 cursor-pointer hover:bg-light hover:rounded-full p-1"
          >
            <IoClose className="text-2xl text-lgreens hover:text-greens" />
          </div>
        </div>

        {/* Gross */}
        <div className="mb-2 mt-5 w-48 mx-auto">
          <div className="flex items-center justify-center">
            <label className="text-sm font-bold">Gross:</label>
          </div>
          {editData || confirmDelete ? (
            <div className="flex py-1 justify-between items-center bg-light rounded-md overflow-hidden">
              <div className="pl-2">
                <img src={pouchIcon} className="w-7" />
              </div>
              <div className="text-oranges font-medium">
                <p>{gross.toLocaleString()}</p>
              </div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <></>
          )}
          {updateData ? (
            <div
              className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={pouchIcon} className="w-10" />
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
              className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <div className="pl-2">
                <img src={pouchIcon} className="w-10" />
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
            <div className="flex justify-between items-center py-1 col-span-2 bg-light rounded-md overflow-hidden">
              <div className="pl-2">
                <img src={expensesIcon} className="w-9" />
              </div>
              <div className="text-[red] font-medium">
                <p>{expenses.toLocaleString()}</p>
              </div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <></>
          )}
          {updateData ? (
            <div
              className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
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
              className={`flex items-center border col-span-2 rounded-md overflow-hidden ${
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
          <div className="flex items-center py-1 bg-light rounded-md overflow-hidden">
            <div className="pl-2">
              <img src={networthIcon} className="w-9" />
            </div>
            <div className="flex items-center ml-4">
              {editData || confirmDelete ? (
                <p
                  className={`font-bold ${
                    gross - expenses < 0 ? "text-[red]" : "text-greens"
                  }`}
                >
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
                  {(newGross - newExpenses).toLocaleString()}
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
              Confirm deletion for{" "}
              <span className="text-xs text-[red] font-semibold">
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
                    <span className="text-xl">
                      <FaRegTrashCan />
                    </span>
                    Delete
                  </div>
                  <div
                    onClick={() => {
                      setConfirmDelete(false), setEditData(true);
                    }}
                    className="text-greens hover:text-lgreens font-bold cursor-pointer text-sm flex items-center gap-1"
                  >
                    <span className="text-xl">
                      <BsBackspace />
                    </span>{" "}
                    Cancel
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
                className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white hover:bg-lgreens flex gap-2 items-center"
              >
                <span className="text-3xl">
                  <MdOutlinePostAdd />
                </span>
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
              <p className="text-white gap-2 font-bold flex items-center">
                <span className="text-xl">
                  <FaRegPenToSquare />
                </span>
                Edit
              </p>
            </div>
            <div
              onClick={() => {
                setEditData(false), setConfirmDelete(true);
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
                  <p className="text-white font-bold flex items-center gap-2">
                    <span className="text-2xl">
                      <GoChecklist />
                    </span>
                    Save
                  </p>
                </button>

                <div
                  onClick={() => {
                    setEditData(true),
                      setUpdateData(false),
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
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default PersonalForm;
