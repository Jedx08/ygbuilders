import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";

const Footer = () => {
  return (
    <>
    <footer>
        <div className="flex justify-center space-x-2 w-8/12 mx-auto font-pops">
          <div className="w-4/12">
            <p className="text-sm">Follow us:</p>
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
  )
}

export default Footer

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
