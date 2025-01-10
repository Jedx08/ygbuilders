import { useState, useContext, useEffect } from "react";
import { CalendarContext } from "../../../context/CalendarContext";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { GoChecklist } from "react-icons/go";
import { BsBackspace } from "react-icons/bs";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ThreeDot } from "react-loading-indicators";
import profitIcon from "../../../media/bus_pouch.png";

const BMonthlyCapitalData = ({ capitalData }) => {
  const {
    setBusinessCapitalLoading,
    dispatchBusinessCapitalData,
    setLoadPage,
  } = useContext(CalendarContext);

  const [editButton, setEditButton] = useState(false);
  const [title, setTitle] = useState(capitalData ? capitalData.title : "");
  const [amount, setAmount] = useState(capitalData ? capitalData.amount : "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteStyle, setDeleteStyle] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(title);
  const [updateAmount, setUpdateAmount] = useState(amount);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errorStyle, setErrorStyle] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setTitle(capitalData.title);
    setAmount(capitalData.amount);
  }, [capitalData]);

  useEffect(() => {
    setUpdateTitle(title);
    setUpdateAmount(amount);
  }, [title, amount]);

  useEffect(() => {
    setError("");
    setErrorStyle(false);
  }, [updateTitle, updateAmount]);

  async function handleUpdate(e) {
    e.preventDefault();

    const amountNumber = Number(updateAmount);

    const data = {
      title: updateTitle.toUpperCase(),
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
        "/api/business-capital/" + capitalData._id,
        JSON.stringify(data)
      );
      const json = response.data;
      if (response.status === 200) {
        dispatchBusinessCapitalData({
          type: "update",
          payload: json,
        });
        setEditButton(false);
        setBusinessCapitalLoading(true);
        setUpdateLoading(false);
        setLoadPage(false);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Bad request");
      }
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    setLoadPage(true);

    try {
      const response = await axiosPrivate.delete(
        "/api/business-capital/" + capitalData._id
      );

      if (response.status === 200) {
        dispatchBusinessCapitalData({
          type: "delete",
          payload: response.data,
        });
        setBusinessCapitalLoading(true);
        setConfirmDelete(false);
        setLoadPage(false);
        setDeleteLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // capital update title length validation
  const updateTitleInput = (event) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setUpdateTitle(value);
    }
  };

  // capital update anmount length validation
  const updateAmountInput = (event) => {
    const value = event.target.value;
    if (value.length <= 50) {
      setUpdateAmount(value);
    }
  };

  return (
    <div className="px-5 font-pops bg-white py-[1px]">
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
            <div className="rounded-md overflow-hidden py-1 items-center bg-light flex px-2 col-span-1 font-medium">
              <img src={profitIcon} className="w-8 mr-2" />
              <span
                style={{
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  display: "-webkit-box",
                }}
              >
                {title.toUpperCase()}
              </span>
            </div>
            <div className="text-[red] font-semibold rounded-md overflow-hidden py-1 items-center justify-center bg-light flex px-2 col-span-1">
              {amount.toLocaleString()}
            </div>
          </>
        ) : (
          <div className="absolute top-0 left-0 pt-[7rem] bg-light bg-opacity-70 h-hfull w-full">
            <div className="bg-white py-4 rounded-md shadow-md">
              {/* Show input for update data */}
              <div className="text-oranges text-center font-semibold">
                Edit monthly capital
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <div
                  className={`col-span-1 flex border rounded-md overflow-hidden items-center pl-2 py-1 ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <img src={profitIcon} className="w-8 mr-2" />
                  <input
                    type="text"
                    placeholder="Title"
                    onChange={updateTitleInput}
                    value={updateTitle}
                    className={`focus:outline-none focus:border-oranges pl-2 py-1 placeholder:text-xs ${
                      editButton ? "w-32" : ""
                    }`}
                  />
                </div>
                <div
                  className={`col-span-1 border rounded-md overflow-hidden flex items-center ${
                    errorStyle ? "border-[red]" : "border-inputLight"
                  }`}
                >
                  <input
                    type="number"
                    placeholder="Amount"
                    onChange={updateAmountInput}
                    value={updateAmount}
                    className={`focus:outline-none focus:border-oranges pl-2 py-1 placeholder:text-xs text-center ${
                      editButton ? "w-32" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Error Message */}
              <div className="mt-2 text-xs text-center text-[red]">{error}</div>

              {updateLoading ? (
                <div className="mt-6 mb-3 w-full flex justify-center items-center space-x-2 px-2 h-2 rounded-md overflow-hidden">
                  <ThreeDot
                    style={{ fontSize: "7px" }}
                    variant="pulsate"
                    color="#ff9f1c"
                    text=""
                    textColor=""
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center mt-5">
                  <div className="flex items-center space-x-2 px-2 h-2 w-fit rounded-md overflow-hidden">
                    <div
                      className="flex gap-2 rounded-md border border-loranges bg-loranges hover:bg-oranges px-2 py-1 cursor-pointer text-white font-semibold text-sm"
                      onClick={handleUpdate}
                    >
                      <button>
                        <GoChecklist className="text-lg" />
                      </button>
                      <span>Save</span>
                    </div>
                    <div
                      className="flex gap-2 rounded-md border border-[#FF4242] hover:border-[red] text-[#FF4242] hover:text-[red] px-2 py-1 cursor-pointer text-sm font-semibold"
                      onClick={() => {
                        setEditButton(false),
                          setError(""),
                          setErrorStyle(false);
                      }}
                    >
                      <div>
                        <BsBackspace className="text-lg" />
                      </div>
                      <span>Back</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Update & delete to show form */}
        {!editButton && (
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
                  <FaRegTrashCan className="text-[#ff4242] hover:text-[red] cursor-pointer text-xl" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Data */}
      {confirmDelete && (
        <div className="absolute top-0 left-0 pt-[7rem] bg-light bg-opacity-70 h-hfull w-full">
          <div className="bg-white rounded-md shadow-md py-4">
            <div className="text-[red] text-center font-semibold">
              Delete monthly capital
            </div>
            <div className="grid grid-cols-2 gap-2 grid-flow-col px-5 mt-2">
              <div className="border border-inputLight rounded-md overflow-hidden py-1 items-center flex px-2 col-span-1 font-medium space-x-3">
                <img src={profitIcon} className="w-8 mr-2" />
                <div
                  style={{
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    display: "-webkit-box",
                  }}
                >
                  {title}
                </div>
              </div>
              <div className="border border-inputLight text-[red] font-semibold rounded-md overflow-hidden py-1 items-center justify-center flex px-2 col-span-1">
                {amount.toLocaleString()}
              </div>
            </div>
            <div className="mt-2 pt-1">
              <p className="text-xs text-center">
                Confirm deletion for{" "}
                <span className="text-xs text-[red] font-semibold">
                  {title}
                </span>{" "}
                capital ?
              </p>
              <div className="flex justify-center space-x-16 mt-2 py-1">
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
                        className="flex gap-2 rounded-lg border border-loranges bg-loranges hover:bg-oranges font-semibold px-2 py-1 items-center cursor-pointer"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BMonthlyCapitalData;
