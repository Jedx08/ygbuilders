import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PersonalSummary from "../components/personal/PersonalSummary";
import BusinessSummary from "../components/business/BusinessSummary";

const Summary = () => {
  const [personalSummary, setPersonalSummary] = useState(true);

  return (
    <>
      <Navbar />
      <div className=" bg-light font-pops">
        <div className="py-5 grid grid-flow-col justify-center place-items-center gap-5">
          <div
            className={`shadow-lg
             ${
               personalSummary
                 ? "px-5 py-3 rounded-lg bg-lgreens text-white font-bold cursor-default"
                 : "px-5 py-3 rounded-lg bg-white cursor-pointer font-bold hover:text-lgreens"
             }
            `}
            onClick={() => {
              setPersonalSummary(true);
            }}
          >
            Personal
          </div>
          <div
            className={`shadow-lg
              ${
                personalSummary
                  ? "px-5 py-3 rounded-lg bg-white cursor-pointer font-bold hover:text-loranges"
                  : "px-5 py-3 rounded-lg bg-loranges text-white font-bold cursor-default"
              }
            `}
            onClick={() => {
              setPersonalSummary(false);
            }}
          >
            Business
          </div>
        </div>

        {personalSummary ? <PersonalSummary /> : <BusinessSummary />}
      </div>

      <Footer />
    </>
  );
};

export default Summary;
