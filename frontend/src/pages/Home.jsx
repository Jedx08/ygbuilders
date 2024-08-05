import BusinessHomeCard from "../components/business/BusinessHomeCard";
import Navbar from "../components/Navbar";
import PersonalHomeCard from "../components/personal/PersonalHomeCard";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="w-fit flex gap-5 place-items-center  h-s100 bg-light font-pops mx-auto md:flex-col lg:py-[10%] md:py-[15%] sm:py-[20%]">
          {/* Personal Income */}
          <PersonalHomeCard />

          {/* Business Income */}
          <BusinessHomeCard />
        </div>
      </div>
    </>
  );
};

export default Home;
