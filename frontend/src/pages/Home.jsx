import BusinessHomeCard from "../components/business/BusinessHomeCard";
import Navbar from "../components/Navbar";
import PersonalHomeCard from "../components/personal/PersonalHomeCard";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="w-[60%] grid grid-cols-2 place-items-center h-s100 bg-light font-pops mx-auto">
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
