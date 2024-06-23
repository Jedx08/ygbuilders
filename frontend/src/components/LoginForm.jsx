import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const LOGIN_URL = "/login";

const LoginForm = ({ next }) => {
  const { setAuth } = useAuth();

  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      setAuth({ username, password, accessToken });
      console.log(username, password, accessToken);
      setUsername("");
      setPassword("");
      setSuccess("Success");
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Can't connect to the Server");
      } else if (err.response?.status === 400) {
        setErrMsg("Username and Password are required");
      } else if (err.response?.status === 401) {
        setErrMsg(
          "Your login credentials don't match an account in our system"
        );
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <div className="mt-28">
        <section>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="text-sm">
                Username:
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  value={username}
                  required
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-greens py-1 pl-3 caret-greens"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm">
                Password:
              </label>
              <div className="">
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  value={password}
                  required
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-greens py-1 pl-3 caret-greens"
                />
              </div>
            </div>

            {errMsg && (
              <p
                ref={errRef}
                className="text-sm text-semibold text-oranges text-center mt-2"
              >
                {errMsg}
                <FontAwesomeIcon
                  icon={faExclamation}
                  className="text-sm text-oranges font-extrabold ml-1"
                />
              </p>
            )}
            {success && (
              <p className="text-sm text-semibold text-greens text-center mt-2">
                {success}
                <FontAwesomeIcon
                  icon={faExclamation}
                  className="text-sm text-greens font-extrabold ml-1"
                />
              </p>
            )}

            <div className="flex flex-col items-center mt-5 mb-5">
              <div className="mb-2">
                <button className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white hover:bg-lgreens">
                  Sign In
                </button>
              </div>
              <div>
                <p className="text-sm">Forgot Password?</p>
              </div>
            </div>
          </form>
        </section>
      </div>

      <hr className="text-inputLight" />

      <div className="mt-10 flex flex-col items-center">
        <div className="mb-2">
          <p className="text-sm">New to YourGross?</p>
        </div>
        <div>
          <button
            className="bg-oranges py-1 px-6 rounded-md font-bold text-white hover:bg-loranges"
            onClick={next}
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
