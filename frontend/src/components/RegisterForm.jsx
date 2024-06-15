const RegisterForm = ({ previous }) => {
  return (
    <>
      <div className="mt-14">
        <h1 className="font-bold text-4xl mb-5">Sign Up</h1>
        <section>
          <form>
            <div>
              <label htmlFor="username" className="text-sm">
                Username:
              </label>
              <div>
                <input
                  type="text"
                  id="register-username"
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm">
                Password:
              </label>
              <div>
                <input
                  type="password"
                  id="register-password"
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges mb-2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="text-sm">
                Confirm Password:
              </label>
              <div>
                <input
                  type="password"
                  id="confirm-password"
                  className="border border-inputLight w-full rounded-md focus:outline-none focus:border-oranges py-1 pl-3 caret-oranges"
                />
              </div>
            </div>

            <div className="flex flex-col items-center mt-5 mb-5">
              <button className="mx-auto bg-oranges py-1 px-6 rounded-md font-bold text-white hover:bg-loranges">
                Register
              </button>
            </div>
          </form>
        </section>
      </div>

      <hr className="text-inputLight" />

      <div className="flex flex-col items-center mt-5">
        <p className="text-sm">Already have an account?</p>
        <button
          className="mx-auto py-1 rounded-md px-6 bg-greens font-bold text-white mt-2 hover:bg-lgreens"
          onClick={previous}
        >
          Sign In
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
