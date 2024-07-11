import { useState, useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";

const PMonthlyExpensesData = ({ expensesData }) => {
  const {
    setPersonalExpensesLoading,
    dispatchPersonalExpensesData,
    setLoadPage,
  } = useContext(CalendarContext);
  const [editButton, setEditButton] = useState(false);
  const [title, setTitle] = useState(expensesData ? expensesData.title : "");
  const [amount, setAmount] = useState(expensesData ? expensesData.amount : "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteStyle, setDeleteStyle] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(title);
  const [updateAmount, setUpdateAmount] = useState(amount);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errorStyle, setErrorStyle] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  async function handleDelete() {
    setDeleteLoading(true);
    setLoadPage(true);

    try {
      const response = await axiosPrivate.delete(
        "/api/personal-expenses/" + expensesData._id
      );

      if (response.status === 200) {
        dispatchPersonalExpensesData({
          type: "delete",
          payload: response.data,
        });
        setPersonalExpensesLoading(true);
        setLoadPage(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const amountNumber = Number(updateAmount);

    const data = {
      title: updateTitle,
      amount: +updateAmount,
    };

    if (!updateTitle || !updateAmount) {
      return setError("Please fill out all of the fields"), setErrorStyle(true);
    }

    if (isNaN(amountNumber)) {
      return (
        setError("Invalid value, Amount must be a number"), setErrorStyle(true)
      );
    }

    setUpdateLoading(true);
    setLoadPage(true);

    try {
      const response = await axiosPrivate.patch(
        "/api/personal-expenses/" + expensesData._id,
        JSON.stringify(data)
      );
      if (response.status === 200) {
        dispatchPersonalExpensesData({
          type: "update",
          payload: response.data,
        });
        setEditButton(false);
        setPersonalExpensesLoading(true);
        setLoadPage(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Bad request");
      }
    }
  }

  return (
    <div
      className={`px-5 mb-2 font-pops ${
        deleteStyle ? "border border-[red] py-3" : ""
      }`}
    >
      <div className=" flex space-x-2 justify-center">
        {/* Update Data */}
        {!editButton ? (
          <>
            <div className="rounded-md overflow-hidden py-1 items-center w-36 bg-light flex pl-2">
              {title}
            </div>
            <div className="text-[red] rounded-md overflow-hidden py-1 items-center w-36 bg-light flex pl-2">
              {amount}
            </div>
          </>
        ) : (
          <>
            <div
              className={`border rounded-md overflow-hidden items-center ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <input
                type="text"
                placeholder="Add Title"
                onChange={(e) => {
                  setUpdateTitle(e.target.value),
                    setError(""),
                    setErrorStyle(false);
                }}
                value={updateTitle}
                className="w-36 focus:outline-none focus:border-oranges pl-2 py-1 caret-inputLight  placeholder:text-xs"
              />
            </div>
            <div
              className={`border rounded-md overflow-hidden items-center ${
                errorStyle ? "border-[red]" : "border-inputLight"
              }`}
            >
              <input
                type="number"
                placeholder="Add Amount"
                onChange={(e) => {
                  setUpdateAmount(e.target.value),
                    setError(""),
                    setErrorStyle(false);
                }}
                value={updateAmount}
                className="w-36 focus:outline-none focus:border-oranges pl-2 py-1 caret-inputLight placeholder:text-xs"
              />
            </div>
          </>
        )}

        {/* Update Button On and Off */}
        {!editButton ? (
          <>
            {!confirmDelete && (
              <div className="flex space-x-4 items-center px-2 h-2 w-fit rounded-md overflow-hidden">
                <div onClick={() => setEditButton(true)}>
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-greens hover:text-lgreens cursor-pointer text-xl"
                  />
                </div>

                <div
                  onClick={() => {
                    setConfirmDelete(true),
                      setDeleteStyle(true),
                      setErrorStyle(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-[#FF4242] hover:text-[red] cursor-pointer text-xl"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {updateLoading ? (
              <div className="flex items-center space-x-2 px-2 h-2 w-fit rounded-md overflow-hidden">
                <ThreeDot
                  style={{ fontSize: "7px" }}
                  variant="pulsate"
                  color="#2ec4b6"
                  text=""
                  textColor=""
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-2 h-2 w-fit rounded-md overflow-hidden">
                <button onClick={handleUpdate}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-greens cursor-pointer hover:text-lgreens text-2xl"
                  />
                </button>
                <div
                  onClick={() => {
                    setEditButton(false), setError(""), setErrorStyle(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="text-[#FF4242] hover:text-[red]  cursor-pointer text-2xl"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Message */}
      <div className="mt-2 text-xs text-center text-[red]">{error}</div>

      {/* Delete Data */}
      {confirmDelete && (
        <div className=" rounded-md mt-1 pt-1 bg-light">
          <p className="text-xs text-center">
            Are you sure you want to remove{" "}
            <span className="text-xs text-[red] font-semibold">{title}</span>{" "}
            expenses ?
          </p>
          <div className="flex justify-center space-x-16 mt-1 py-1">
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
                    setConfirmDelete(false), setDeleteStyle(false);
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
    </div>
  );
};

export default PMonthlyExpensesData;
