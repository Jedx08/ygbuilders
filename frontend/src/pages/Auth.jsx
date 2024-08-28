import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import logo from "../media/YG_LOGO.png";
import login_img from "../media/login_img.png";

const Auth = () => {
  const { auth } = useAuth();

  const [authToken, setAuthToken] = useState(false);

  const [inMobile, setInMobile] = useState(false);

  useEffect(() => {
    const token = auth?.accessToken;

    if (token) {
      setAuthToken(true);
    }
  }, []);

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      setInMobile(true);
    } else {
      // false for not mobile device
      setInMobile(false);
    }
  }, []);

  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: false,
  };
  return (
    <>
      {authToken ? (
        <Navigate to="/" />
      ) : (
        <>
          {inMobile ? (
            <>
              <div className="min-h-[80vh] bg-light font-pops border border-light">
                <div className="shadow-lg rounded-md mt-20 overflow-hidden bg-gradient-to-br from-[#1c1d1d] to-greens w-[380px] mx-auto xs:w-[90vw]">
                  <Slider
                    ref={(slider) => {
                      sliderRef = slider;
                    }}
                    {...settings}
                    className="h-hfull"
                  >
                    <div className="px-7 " key={1}>
                      <LoginForm next={next} inMobile={inMobile} />
                    </div>
                    <div className="px-7" key={2}>
                      <RegisterForm previous={previous} inMobile={inMobile} />
                    </div>
                  </Slider>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 place-items-center min-h-[95vh] bg-light font-pops relative">
                <div className="grid grid-cols-3 w-1/2 mt-20 mb-20 h-hfit rounded-lg bg-white shadow-lg overflow-hidden 2xl:w-[60vw] xl:w-[70vw] lg:w-[90vw] md:w-[50vw] md:grid-cols-1 sm:w-[60vw]">
                  {/* Introduction */}
                  <div className="col-span-2 p-3 text-white bg-gradient-to-br from-[#1c1d1d] to-greens bg-center bg-cover md:hidden">
                    <div className="mt-5 flex text-center mb-10 items-center justify-center gap-4">
                      <img src={logo} className="w-14" />
                      <h1 className="font-extrabold text-3xl text-greens">
                        Your <span className="text-oranges">Gross</span>
                      </h1>
                    </div>
                    <div className="">
                      <h1 className="font-bold text-5xl ml-5 text-center">
                        Track Your{" "}
                        <span className="text-oranges">Earnings</span>
                      </h1>
                      <img
                        src={login_img}
                        alt=""
                        className="w-[27rem] mx-auto md:hidden"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 md:row-span-2 md:order-1 md:overflow-hidden md:bg-gradient-to-br md:from-[#1c1d1d] md:to-greens">
                    <Slider
                      ref={(slider) => {
                        sliderRef = slider;
                      }}
                      {...settings}
                      className="h-hfull"
                    >
                      <div className="px-7" key={1}>
                        <LoginForm next={next} />
                      </div>
                      <div className="px-7" key={2}>
                        <RegisterForm previous={previous} />
                      </div>
                    </Slider>
                  </div>
                </div>
              </div>
            </>
          )}
          <Footer />
        </>
      )}
    </>
  );
};

export default Auth;
