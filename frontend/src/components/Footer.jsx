import styled from "styled-components";
import { Link } from "react-router-dom";
import Logo from "../media/YG_LOGO.png";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-white font-pops px-5 border-t border-[#ebebeb]">
        <div className="flex flex-wrap space-x-4 justify-between items-center text-sm pt-5 pb-2 px-32 lg:px-0 md:justify-center md:space-y-3">
          <div className="w-96">
            <img src={Logo} alt="Logo" className="w-28 mx-auto" />
            <div className="text-sm py-4 text-center">
              Take control of your earnings with YourGross PH! Track your income
              effortlessly, gain insights into your finances, and stay on top of
              your financial goals—all in one place.
            </div>
          </div>
          <div className="flex flex-col space-y-4 font-medium">
            <div className="text-[#737373]">Services</div>
            <div className="cursor-pointer hover:text-loranges">Dashboard</div>
            <div className="cursor-pointer hover:text-loranges">Income</div>
            <div className="cursor-pointer hover:text-loranges">Savings</div>
            <div className="cursor-pointer hover:text-loranges">
              Filter Data
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="font-medium">
              <p className="text-[#737373]">Contact us:</p>
              <a
                href="mailto:support@yourgross.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1877f2] hover:underline"
              >
                support@yourgross.ph
              </a>
            </div>
            <div>
              <p className="font-medium text-[#737373]">Follow us:</p>
              <div className="flex space-x-4 py-1">
                <Link
                  to="https://www.facebook.com/people/YourGross/61567060986135/"
                  target="_blank"
                >
                  <div className="rounded-full overflow-hidden bg-facebook text-white w-10 h-[2.5rem] text-center content-center">
                    <FaFacebookF className="text-3xl align-middle mx-auto mt-2" />
                  </div>
                </Link>
                <div className="rounded-full overflow-hidden bg-[#000] text-white w-10 h-[2.5rem] text-center content-center">
                  <FaXTwitter className="text-2xl inline-block align-middle" />
                </div>
                <Instagram>
                  <div className="rounded-full overflow-hidden w-10 h-[2.5rem] text-center content-center">
                    <FaInstagram className="text-3xl inline-block align-middle text-white" />
                  </div>
                </Instagram>
                <div className="rounded-full overflow-hidden bg-[#000] text-white w-10 h-[2.5rem] text-center content-center">
                  <FaTiktok className="text-2xl inline-block align-middle" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-32 lg:px-0">
          <hr className="text-[#dedede]" />
        </div>

        <div className="flex flex-wrap items-center justify-between font-medium text-sm text-[#737373] space-x-5 py-5 px-32 lg:px-0 md:justify-center xxs:space-y-3">
          <div className="flex items-center">
            <div>&#169;YourGross 2024</div>
          </div>
          <div className="flex space-x-8 items-center">
            <div>
              <Link
                to="/privacy-policy"
                target="_blank"
                className="hover:text-lgreens"
              >
                Privacy Policy
              </Link>
            </div>
            <div>
              <Link
                to="/terms-of-use"
                target="_blank"
                className="hover:text-loranges"
              >
                Terms of Use
              </Link>
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
