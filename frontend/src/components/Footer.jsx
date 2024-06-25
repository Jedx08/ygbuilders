import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";

const Footer = () => {
  return (
    <>
      <footer className="bg-white font-pops">
        <div className="flex justify-center space-x-2 w-8/12 mx-auto py-4">
          <div className="w-4/12">
            <p className="text-sm font-semibold mb-1">Follow us:</p>
            <div className="flex space-x-4">
              <div className="rounded-full overflow-hidden bg-facebook text-white w-10 h-[2.5rem] text-center content-center">
                <FontAwesomeIcon
                  className="text-3xl align-middle"
                  icon={faFacebookF}
                />
              </div>
              <div className="rounded-full overflow-hidden bg-[#000] text-white w-10 h-[2.5rem] text-center content-center">
                <FontAwesomeIcon
                  className="text-2xl inline-block align-middle"
                  icon={faXTwitter}
                />
              </div>
              <Instagram>
                <div className="rounded-full overflow-hidden w-10 h-[2.5rem] text-center content-center">
                  <FontAwesomeIcon
                    className="text-3xl inline-block align-middle text-white"
                    icon={faInstagram}
                  />
                </div>
              </Instagram>
              <div className="rounded-full overflow-hidden bg-[#000] text-white w-10 h-[2.5rem] text-center content-center">
                <FontAwesomeIcon
                  className="text-2xl inline-block align-middle"
                  icon={faTiktok}
                />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold">Contact us:</p>
              <div className="flex space-x-2 items-center">
                <div className="text-2xl text-[#ff4343]">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="text-sm">email@yourgross.ph</div>
              </div>
            </div>
          </div>
          <div className="w-4/12">
            <div className="text-sm font-semibold mb-2">About Us</div>
            <div className="text-sm">
              kami pala ang Yourgross PH na binubuo ng 4 na miyembro na
              nagbibigay serbisyo para sa mga taong gustong ma-subaybayan ang
              kanilang pang araw araw na kita at gastusin.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

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
