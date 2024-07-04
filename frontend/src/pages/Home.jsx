import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { ThreeDot } from "react-loading-indicators";

const Home = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [title, setTitle] = useState("");
  const [hasTitle, setHasTitle] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [personalAddButton, setPersonalAddbutton] = useState(true);
  const [personalProceedButton, setPersonalProceedButton] = useState(false);
  const [personalEditButton, setPersonalEditButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const titleRef = useRef();

  useEffect(() => {
    const getTitle = async () => {
      const _id = await auth?._id;

      try {
        if (_id) {
          const response = await axiosPrivate.get("/user/" + _id);
          const jsonTitle = await response.data.personal_title;

          if (jsonTitle && response.status === 200) {
            setUpdatedTitle(jsonTitle);
            setTitle(jsonTitle);
            setHasTitle(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTitle();
  }, [hasTitle]);

  useEffect(() => {
    if ((personalEditButton, personalProceedButton)) {
      titleRef.current.focus();
    }
  }, [personalEditButton, personalProceedButton]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (title === "") {
        return setErrMsg("Please fill out the form");
      }
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify({ personal_title: title })
      );
      if (response.status === 200) {
        setTitle(response.data.personal_title);
        setPersonalProceedButton(false);
        setHasTitle(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (updatedTitle === "") {
        return setErrMsg("Please fill out the form");
      }
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify({ personal_title: updatedTitle })
      );

      if (response.status === 200) {
        setTitle(response.data.personal_title);
        setPersonalEditButton(false);
        setHasTitle(true);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrMsg("Bad Req");
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.patch(
        "/user",
        JSON.stringify({ personal_title: "" })
      );
      if (response.status === 200) {
        setPersonalAddbutton(true);
        setPersonalEditButton(false);
        setHasTitle(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="w-[70%] grid grid-cols-2 gap-[5%] place-items-center h-s100 bg-light font-pops mx-auto">
          <div className="w-[90%] h-[60%] rounded-xl bg-white shadow-lg ">
            {/* Personal Income */}
            <div className=" h-hfull content-center justify-items-center">
              <div className=" w-11/12 mx-auto h-hfull grid grid-rows-5 text-center rounded-lg p-2 ">
                <div className="w-full text-center mx-auto place-content-center">
                  <div className="w-full text-lgreens text-5xl font-bold">
                    PERSONAL
                  </div>
                </div>
                {/* {console.log(title)} */}

                {/* Show Title and Data if there is any */}
                {hasTitle && !personalEditButton && (
                  <div className="">
                    <div className="flex space-x-2 justify-end text-sm text-end h-[fit-content] cursor-pointer mb-2">
                      <FontAwesomeIcon
                        onClick={() => {
                          setPersonalEditButton(true);
                        }}
                        icon={faPen}
                      />{" "}
                      <FontAwesomeIcon
                        onClick={() => {
                          setConfirmDelete(true);
                        }}
                        icon={faTrash}
                      />
                    </div>
                    <div className="text-oranges w-full mx-auto text-6xl font-bold content-end cursor-default">
                      {title}
                    </div>
                    <div className="w-fit mx-auto row-span-1 justify-between place-content-center">
                      <div className="flex ">
                        <div className="mr-5">G: 5000</div>
                        <div className="mr-5">E: 3000</div>
                        <div>N: 2000</div>
                      </div>
                    </div>
                  </div>
                )}

                {confirmDelete && (
                  <div className=" place-content-center">
                    <div className="mb-2">Are You Sure?</div>
                    <div className="flex justify-center space-x-2">
                      <div
                        className="bg-lgreens p-2 text-white rounded-lg cursor-pointer"
                        onClick={(e) => {
                          handleDelete(e);
                          setHasTitle(false);
                          setConfirmDelete(false);
                        }}
                      >
                        Proceed
                      </div>
                      <div
                        className="p-2 bg-[#ff4242] text-white rounded-lg cursor-pointer"
                        onClick={() => {
                          setConfirmDelete(false);
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                  </div>
                )}
                {hasTitle && !personalEditButton && (
                  <div className=" w-full h-hfull mx-auto row-span-1 text-xs mt-2 place-content-center">
                    <div className="mx-auto bg-lgreens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                      <Link to="/personal" state={{ from: location.pathname }}>
                        <div className="h-hfull text-xl font-bold text-white place-content-center">
                          To Calendar
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Adding Personal Income */}
                {!hasTitle && personalAddButton && (
                  <div className="w-full mx-auto row-span-3 text-md font-bold place-content-center">
                    <div className="w-[80%] mx-auto text-lgreens">
                      Track your Personal{" "}
                      <span className="text-oranges">INCOME</span>,{" "}
                      <span className="text-oranges">EXPENSES</span>, and{" "}
                      <span className="text-oranges">NETWORTH</span> with a
                      calendar like interface
                    </div>
                  </div>
                )}

                {!hasTitle && personalAddButton && (
                  <div className="w-full mx-auto row-span-1 text-xs mt-2 ">
                    <div
                      onClick={() => {
                        setPersonalAddbutton(false);
                        setPersonalProceedButton(true);
                      }}
                      className="mx-auto bg-lgreens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
                    >
                      <div className="text-xl font-bold text-white">
                        ADD PERSONAL
                      </div>
                    </div>
                  </div>
                )}

                {/* Submitting Personal Income Title */}
                {personalProceedButton && (
                  <div>
                    <div className="text-xl font-bold text-lgreens">
                      Add a Title
                    </div>
                    <input
                      ref={titleRef}
                      required
                      type="text"
                      className="text-center w-full h-[50%] mx-auto rounded-xl border border-lgreens font-bold outline-none"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      onFocus={() => {
                        setErrMsg("");
                      }}
                      value={title}
                    />
                  </div>
                )}

                {personalProceedButton && (
                  <div className="boder w-full mx-auto row-span-1 text-xs mt-2 ">
                    {isLoading ? (
                      <div className="mx-auto bg-lgreens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer">
                        <ThreeDot
                          color="#ffff"
                          size="medium"
                          text=""
                          textColor=""
                        />
                      </div>
                    ) : (
                      <div
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        className="mx-auto bg-lgreens h-[50%] w-[50%] place-content-center rounded-lg cursor-pointer"
                      >
                        <div className="text-xl font-bold text-white">
                          PROCEED
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Updating Personal Income Title */}
                {personalEditButton && (
                  <div className="space-y-2">
                    <div>
                      <div className="text-xl font-bold text-lgreens">
                        Update Title
                      </div>
                    </div>
                    <input
                      ref={titleRef}
                      required
                      type="text"
                      className="text-center w-full h-[50%] mx-auto rounded-xl border border-lgreens font-bold outline-none"
                      onChange={(e) => {
                        setUpdatedTitle(e.target.value);
                      }}
                      value={updatedTitle}
                    />
                  </div>
                )}

                {personalEditButton && (
                  <div>
                    <div className="flex justify-center space-x-3">
                      <div
                        className="bg-greens p-2 text-white rounded-lg cursor-pointer"
                        onClick={(e) => {
                          handleUpdate(e);
                        }}
                      >
                        Save Changes
                      </div>
                      <div
                        className="p-2 bg-[#ff4242] text-white rounded-lg cursor-pointer"
                        onClick={() => {
                          setPersonalEditButton(false);
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                    {errMsg && (
                      <p className="text-sm text-semibold text-oranges text-center mt-2">
                        {errMsg}
                      </p>
                    )}
                  </div>
                )}

                {/* Error message */}
                {errMsg && (
                  <p className="text-sm text-semibold text-oranges text-center mt-2">
                    {errMsg}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Business Income */}
          <div className="w-[90%] h-[60%] rounded-xl bg-white shadow-lg overflow-hidden text-white">
            <div className=" h-hfull content-center justify-items-center">
              <div className=" w-11/12 h-hfull mx-auto grid grid-rows-5 text-center bg-white rounded-lg p-2">
                <div className=" w-full text-center mx-auto place-content-center">
                  <div className=" w-full text-5xl text-loranges font-bold">
                    BUSINESS
                  </div>
                </div>

                <div className=" row-span-1 text-sm text-end h-[fit-content]">
                  <FontAwesomeIcon icon={faPen} />{" "}
                  <FontAwesomeIcon icon={faTrash} />
                </div>

                <div className="w-full mx-auto row-span-2 text-md font-bold place-content-center">
                  <div className="w-[80%] mx-auto text-loranges">
                    Track your Business{" "}
                    <span className="text-greens">INCOME</span>,{" "}
                    <span className="text-greens">EXPENSES</span>, and{" "}
                    <span className="text-greens">NETWORTH</span> with a
                    calendar like interface plus added features for an easier
                    Financial Management
                  </div>
                </div>
                <div className=" w-full mx-auto row-span-1 text-xs mt-2">
                  <div className=" mx-auto bg-loranges h-[50%] w-[50%] place-content-center rounded-lg">
                    <div className="text-white text-xl font-bold">
                      ADD BUSINESS
                    </div>
                  </div>
                </div>

                <div className="w-fit mx-auto row-span-1 flex justify-between">
                  <div className="mr-5">G: 5000</div>
                  <div className="mr-5">E: 3000</div>
                  <div>N: 2000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
