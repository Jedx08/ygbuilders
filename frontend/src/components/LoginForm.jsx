const LoginForm = ({ next }) => {
  return (
    <>
      <div className="mt-28">
        <section>
          <form>
            <div>
              <label htmlFor="username" className="text-sm">
                Username:
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  id="username"
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
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-greens py-1 pl-3 caret-greens"
                />
              </div>
            </div>

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
