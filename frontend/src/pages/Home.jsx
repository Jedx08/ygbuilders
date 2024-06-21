import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 place-items-center h-s80 bg-light font-pops">
        <div className="w-1/3 rounded-lg bg-white shadow-lg overflow-hidden ">
          <div className="content-center justify-items-center mt-7">
            <div className="w-11/12 mx-auto h-h50 grid grid-rows-5 text-center bg-lgreens rounded-lg p-2">
              <div className="w-full flex text-center mx-auto relative">
                <div className="w-full">PERSONAL INCOME</div>
                <div className=" row-span-1 text-sm absolute right-0 text-end">
                  <FontAwesomeIcon icon={faPen} />{" "}
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
              <div className="w-full mx-auto row-span-2 text-5xl font-bold">
                IT SPECIALIST
              </div>
              <div className="w-full mx-auto row-span-1 text-xs mt-2">
                OVERALL SUMMARY
              </div>
              <div className="w-fit mx-auto row-span-1 flex justify-between">
                <div className="mr-5">G: 5000</div>
                <div className="mr-5">E: 3000</div>
                <div>N: 2000</div>
              </div>
            </div>
          </div>

          <div className="content-center justify-items-center mt-7 mb-7">
            <div className="w-11/12 mx-auto h-h50 grid grid-rows-5 text-center bg-loranges rounded-lg p-2">
              <div className="w-full flex text-center mx-auto relative">
                <div className="w-full">BUSINESS INCOME</div>
                <div className=" row-span-1 text-sm absolute right-0 text-end">
                  <FontAwesomeIcon icon={faPen} />{" "}
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
              <div className="w-full mx-auto row-span-2 text-5xl font-bold">
                SARI SARI STORE
              </div>
              <div className="w-full mx-auto row-span-1 text-xs mt-2">
                OVERALL SUMMARY
              </div>
              <div className="w-fit mx-auto row-span-1 flex justify-between">
                <div className="mr-5">G: 5000</div>
                <div className="mr-5">E: 3000</div>
                <div>N: 2000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
