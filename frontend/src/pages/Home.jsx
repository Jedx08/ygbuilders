import Navbar from "../components/Navbar";
import PersonalHomeCard from "../components/PersonalHomeCard";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="w-[70%] grid grid-cols-2 gap-[5%] place-items-center h-s100 bg-light font-pops mx-auto">
          {/* Personal Income */}
          <PersonalHomeCard />

          {/* Business Income */}
          <div className="w-[90%] h-[60%] rounded-xl bg-white shadow-lg overflow-hidden text-white">
            <div className=" h-hfull content-center justify-items-center">
              <div className=" w-11/12 h-hfull mx-auto grid grid-rows-5 text-center bg-white rounded-lg p-2">
                <div className=" w-full text-center mx-auto place-content-center">
                  <div className=" w-full text-5xl text-loranges font-bold">
                    BUSINESS
                  </div>
                </div>

                {/* <div className="row-span-1 text-sm text-end h-[fit-content]">
                  <FontAwesomeIcon icon={faPen} />{" "}
                  <FontAwesomeIcon icon={faTrash} />
                </div> */}

                <div className="w-full mx-auto row-span-2 text-md font-bold place-content-center">
                  <div className="w-[80%] mx-auto text-loranges">
                    Track your Business{" "}
                    <span className="text-greens">INCOME</span>,{" "}
                    <span className="text-greens">EXPENSES</span>, and{" "}
                    <span className="text-greens">NETWORTH</span> with a
                    calendar like interface plus added features for an easier
                    Financial Management
                  </div>
                </div>
                <div className=" w-full mx-auto row-span-1 text-xs mt-2">
                  <div className=" mx-auto bg-loranges h-[50%] w-[50%] place-content-center rounded-lg">
                    <div className="text-white text-xl font-bold">
                      ADD BUSINESS
                    </div>
                  </div>
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
      </div>
    </>
  );
};

export default Home;
