import Footer from "../components/Footer.jsx";
import LandingNav from "./LandingNav";
import girlSavingMoney from "../media/girl-saving-money.png";
import boyTrackingMoney from "../media/boy-tracking-money.png";
import boyTrackingBusiness from "../media/boy-tracking-business.png";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import { useEffect } from "react";

function LandingPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="font-pops">
      <div className="bg-gradient-to-b from-[#26897e] to-[#3cd5c5]">
        <LandingNav />

        <div className="h-hfit py-[5%] flex flex-col items-center justify-center mmd:bg-dark mmd:bg-opacity-75 mmd:z-[-1]">
          <div className="items-center flex gap-[10%] lg:gap-0">
            <div className="flex items-center flex-col gap-5 text-center w-[35rem] lg:w-[30rem] md:w-[20rem] mmd:w-[30rem] mmd:py-[40%] mmd:flex mmd:relative mmd:z-[2] mmd:mx-auto xs:w-[20rem]">
              <p className="text-6xl mb-2 font-bold text-white lg:text-4xl md:text-4xl mmd:text-5xl xs:text-3xl">
                Tracking your earnings made easier.
              </p>
              <p className="text-white lg:text-sm">
                Enhance your financial journey <br /> with precision and clarity
              </p>
              <div className="flex items-center w-fit">
                <Link to="Login">
                  <div className="flex px-5 py-2 items-center bg-oranges hover:bg-loranges rounded-lg">
                    <p className="font-bold text-lg text-white lg:text-base">
                      Get Started
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <img
              src={boyTrackingMoney}
              alt="Gross Icon"
              className="w-[35rem] lg:w-[30rem] md:w-[25rem] mmd:absolute mmd:z-[1] mmd:w-[35rem] mmd:inset-x-0 mmd:mr-auto mmd:ml-auto mmd:opacity-10"
            />
          </div>
        </div>
      </div>
      <div className="bg-light h-[600px] flex flex-col items-center justify-center mmd:pt-0">
        <div className="items-center flex gap-[10%] lg:gap-[5%]">
          <div className="flex flex-row gap-[10%] lg:gap-[5%] mmd:gap-5 mmd:flex-col mmd:items-center">
            <img
              src={girlSavingMoney}
              alt="Gross Icon"
              className="w-[30rem] lg:w-[30rem] md:w-[25rem] mmd:order-2"
            />
            <div className="flex flex-col justify-center text-center gap-5 w-[30rem] lg:w-[30rem] md:w-[20rem] mmd:order-1">
              <p className="text-5xl font-semibold text-loranges lg:text-4xl md:text-3xl">
                Track, Analyze and take control of your{" "}
                <span className="text-lgreens">Personal</span> assets.
              </p>
              <p className="lg:text-sm mmd:hidden">
                &quot;Understanding your money is the key to <br /> mastering
                your future.&quot;
              </p>{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[550px] flex justify-center items-center mmd:h-[600px] bg-white">
        <div className="flex items-center gap-[10%] lg:gap-[5%] mmd:flex-col mmd:space-y-3">
          <div className="flex flex-col text-center w-[35rem] lg:w-[30rem] md:w-[20rem]">
            <p className="text-5xl mb-2 font-semibold text-greens lg:text-4xl mmd:text-3xl mmd:mb-0">
              Simplify your <span className="text-loranges">Business</span>{" "}
              finances effortlessly.
            </p>
            <p className="mb-2 lg:text-sm mmd:hidden">
              Manage, assess, and optimize your financial <br /> strategies with
              ease
            </p>
            <div className="flex justify-center w-full mmd:hidden">
              <Link to="Login">
                <div className="flex px-5 py-3 items-center bg-oranges hover:bg-loranges rounded-lg">
                  <p className="font-bold text-lg text-white">Start Tracking</p>
                </div>
              </Link>
            </div>
          </div>
          <img
            src={boyTrackingBusiness}
            alt="Gross Icon"
            className="w-[30rem] lg:w-[30rem] md:w-[25rem]"
          />
          {/* <p className="hidden text-5xl mb-2 font-semibold text-greens lg:text-4xl md:text-3xl mmd:w-[20rem] mmd:block mmd:absolute mmd:top-5 mmd:left-5 z-10">
            Simplify your <span className="text-loranges">Business</span>{" "}
            finances effortlessly.
          </p> */}
          <div className="hidden justify-center w-fit mmd:block">
            <Link to="Login">
              <div className="flex px-4 py-2 items-center bg-oranges hover:bg-loranges rounded-lg">
                <p className="font-bold text-base text-white">Start Tracking</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-light pt-20">
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
