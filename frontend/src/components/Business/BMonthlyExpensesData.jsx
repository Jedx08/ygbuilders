import { useState, useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { BsBackspace } from "react-icons/bs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";
import expensesIcon from "../../media/bus_expenses.png";

const BMonthlyExpensesData = ({ expensesData }) => {
  const {
    setBusinessExpensesLoading,
    dispatchBusinessExpensesData,
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
        "/api/business-expenses/" + expensesData._id
      );

      if (response.status === 200) {
        dispatchBusinessExpensesData({
          type: "delete",
          payload: response.data,
        });
        setBusinessExpensesLoading(true);
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
        "/api/business-expenses/" + expensesData._id,
        JSON.stringify(data)
      );
      const json = response.data;
      if (response.status === 200) {
        dispatchBusinessExpensesData({
          type: "update",
          payload: json,
        });
        setEditButton(false);
        setBusinessExpensesLoading(true);
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
        deleteStyle ? "border border-[#ffa1a1] py-3 rounded-md" : ""
      } ${editButton ? "border border-loranges pt-2 rounded-md" : ""}`}
    >
      <div
        className={` ${
          editButton
            ? "space-x-2 justify-center items-center"
            : "grid grid-cols-2 gap-2 grid-flow-col"
        }`}
      >
        {/* Update Data */}
        {!editButton ? (
          <>
            {/* show current data */}
            <div className="rounded-md overflow-hidden py-1 items-center bg-light flex px-2 col-span-1">
              <img src={expensesIcon} className="w-7 mr-2" />
              {title}
            </div>
            <div className="text-[red] font-semibold rounded-md overflow-hidden py-1 items-center justify-center bg-light flex px-2 col-span-1">
              {amount.toLocaleString()}
            </div>
          </>
        ) : (
          <>
            {/* Show input for update data */}
            <div className="flex justify-center gap-2">
              <div
                className={`col-span-1 flex border rounded-md overflow-hidden items-center pl-2 ${
                  errorStyle ? "border-[red]" : "border-inputLight"
                }`}
              >
                <img src={expensesIcon} className="w-7 mr-2" />
                <input
                  type="text"
                  placeholder="Add Title"
                  onChange={(e) => {
                    setUpdateTitle(e.target.value),
                      setError(""),
                      setErrorStyle(false);
                  }}
                  value={updateTitle}
                  className={`focus:outline-none focus:border-oranges pl-2 py-1 caret-inputLight placeholder:text-xs ${
                    editButton ? "w-32" : ""
                  }`}
                />
              </div>
              <div
                className={`col-span-1 border rounded-md overflow-hidden items-center ${
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
                  className={`focus:outline-none focus:border-oranges pl-2 py-1 caret-inputLight placeholder:text-xs text-center ${
                    editButton ? "w-32" : ""
                  }`}
                />
              </div>
            </div>
          </>
        )}

        {/* Update Button On and Off */}
        {!editButton ? (
          <>
            {!confirmDelete && (
              <div className="flex space-x-4 items-center px-2 h-2 w-fit rounded-md overflow-hidden">
                <div onClick={() => setEditButton(true)}>
                  <FaRegPenToSquare className="text-oranges hover:text-loranges cursor-pointer text-xl" />
                </div>

                <div
                  onClick={() => {
                    setConfirmDelete(true),
                      setDeleteStyle(true),
                      setErrorStyle(false);
                  }}
                >
                  <FaRegTrashCan className="text-[#FF4242] hover:text-[red] cursor-pointer text-xl" />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {updateLoading ? (
              <div className="pt-2 w-full flex justify-center items-center space-x-2 px-2 h-2 rounded-md overflow-hidden">
                <ThreeDot
                  style={{ fontSize: "7px" }}
                  variant="pulsate"
                  color="#ff9f1c"
                  text=""
                  textColor=""
                />
              </div>
            ) : (
              <div className="flex justify-center items-center py-2">
                <div className="flex items-center space-x-2 px-2 h-2 w-fit rounded-md overflow-hidden">
                  <div
                    className="flex gap-2 rounded-md border border-oranges bg-oranges hover:bg-loranges px-2 py-1 cursor-pointer text-white font-semibold"
                    onClick={handleUpdate}
                  >
                    <button>
                      <GoChecklist className=" text-2xl" />
                    </button>
                    <span>Save</span>
                  </div>
                  <div
                    className="flex gap-2 rounded-md border border-[#FF4242] hover:border-[red] text-[#FF4242] hover:text-[red] px-2 py-1 cursor-pointer"
                    onClick={() => {
                      setEditButton(false), setError(""), setErrorStyle(false);
                    }}
                  >
                    <div>
                      <BsBackspace className="text-2xl" />
                    </div>
                    <span>Back</span>
                  </div>
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
                <div className="flex gap-4">
                  <div
                    className="flex gap-2 border border-[#FF4242] hover:border-[red] text-[#FF4242] hover:text-[red] rounded-md px-2 py-1 items-center cursor-pointer font-semibold"
                    onClick={handleDelete}
                  >
                    <div>
                      <FaRegTrashCan className="text-lg" />
                    </div>
                    <span className="text-sm">Delete</span>
                  </div>
                  <div
                    className="flex gap-2 rounded-lg border border-oranges bg-oranges hover:bg-loranges font-semibold px-2 py-1 items-center cursor-pointer"
                    onClick={() => {
                      setConfirmDelete(false), setDeleteStyle(false);
                    }}
                  >
                    <div>
                      <BsBackspace className="text-white text-lg" />
                    </div>
                    <span className="text-white text-sm">Cancel</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BMonthlyExpensesData;
