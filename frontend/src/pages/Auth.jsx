import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Footer from "../components/Footer";

const Auth = () => {
  const { auth } = useAuth();

  const [authToken, setAuthToken] = useState(false);

  useEffect(() => {
    const token = auth?.accessToken;

    if (token) {
      setAuthToken(true);
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
        <Navigate to="/home" />
      ) : (
        <>
          <div className="grid grid-cols-1 place-items-center h-s80 bg-light font-pops">
            <div className="grid grid-cols-3 w-1/2 h-s60 rounded-lg bg-white shadow-lg overflow-hidden">
              {/* Introduction */}
              <div className="col-span-2 p-3 text-white bg-dark bg-center bg-cover">
                <div className="text-center mb-10">
                  <h1 className="font-extrabold text-5xl mt-5 text-greens">
                    Your Gross
                  </h1>
                </div>
                <div className="">
                  <h1 className="font-bold text-7xl ml-5">Track</h1>
                  <h1 className="font-bold text-7xl ml-5">Your</h1>
                  <h1 className="font-bold text-7xl ml-5 text-oranges">
                    Earnings
                  </h1>
                </div>
              </div>

              <div>
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
          <Footer />
        </>
      )}
    </>
  );
};

export default Auth;
