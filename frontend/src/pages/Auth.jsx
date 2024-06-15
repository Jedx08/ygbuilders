import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
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
  };
  return (
    <>
      <div className="grid grid-cols-1 place-items-center h-s80 bg-light font-pops">
        <div className="grid grid-cols-3 w-1/2 h-s60 rounded-lg bg-white shadow-lg overflow-hidden">
          {/* Introduction */}
          <div className="col-span-2 p-3 text-white bg-pouch bg-center bg-cover">
            <div className="text-center mb-10">
              <h1 className="font-black text-4xl mt-5">YOUR GROSS</h1>
            </div>
            <div className="">
              <h1 className="font-bold text-7xl ml-5">Track</h1>
              <h1 className="font-bold text-7xl ml-5">Your</h1>
              <h1 className="font-bold text-7xl ml-5">Earnings</h1>
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

      <footer>
        <div className="flex justify-center space-x-2 w-8/12 mx-auto font-pops">
          <div className="w-4/12">
            <p className="text-sm">Follow us:</p>
            <div className="flex space-x-4">
              <div className="rounded-full overflow-hidden bg-facebook text-white w-7 h-[1.75rem] text-center">
                <FontAwesomeIcon
                  className="text-lg inline-block align-middle"
                  icon={faFacebookF}
                />
              </div>
              <div className="rounded-full overflow-hidden bg-[#000] text-white w-7 h-[1.75rem] text-center">
                <FontAwesomeIcon
                  className="text-lg inline-block align-middle"
                  icon={faXTwitter}
                />
              </div>
              <Instagram>
                <div className="rounded-full overflow-hidden w-7 h-[1.75rem] text-center">
                  <FontAwesomeIcon
                    className="text-lg inline-block align-middle text-white"
                    icon={faInstagram}
                  />
                </div>
              </Instagram>
              <div className="rounded-full overflow-hidden bg-[#000] text-white w-7 h-[1.75rem] text-center">
                <FontAwesomeIcon
                  className="text-lg inline-block align-middle"
                  icon={faTiktok}
                />
              </div>
            </div>
          </div>
          <div className="w-4/12">
            <div>Your Gross @ 2024</div>
            <br />
            <div>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt
              cumque reiciendis, sit, odit autem deleniti atque nam ratione
              animi saepe perferendis placeat esse suscipit aut!
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Auth;

const Instagram = styled.div`
  border-radius: 9999px;
  vertical-align: middle;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background: #d6249f;
  background: radial-gradient(
    circle at 30% 107%,
    #fdf497 0%,
    #fdf497 5%,
    #fd5949 45%,
    #d6249f 60%,
    #285aeb 90%
  );
`;
