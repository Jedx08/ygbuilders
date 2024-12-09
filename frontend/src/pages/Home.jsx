import { useEffect, useState, useContext } from "react";
import BusinessHomeCard from "../components/Business/BusinessHomeCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PersonalHomeCard from "../components/personal/PersonalHomeCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { CalendarContext } from "../context/CalendarContext";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { userInfo, auth } = useAuth();
  const { setLoggedIn } = useContext(CalendarContext);

  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const showInstructions = async () => {
      try {
        setInstructions(userInfo.instructions);

        if (userInfo.instructions.home) {
          showTour();
        }
      } catch (err) {
        console.log(err);
      }
    };

    showInstructions();
  }, []);

  useEffect(() => {
    const toggleInstructions = async () => {
      try {
        if (instructions) {
          await axiosPrivate.patch(
            "/user/instructions",
            JSON.stringify({ instructions: instructions })
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    toggleInstructions();
  }, [instructions]);

  const showTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#personalHomeCard",
          popover: {
            title: "Personal Income",
            description:
              "Here you can track and manage your personal finances.",
          },
        },
        {
          element: "#addPersonal",
          popover: {
            title: "Personal Title",
            description:
              "You can start by creating a title. It can still be changed later.",
          },
        },
        {
          element: "#businessHomeCard",
          popover: {
            title: "Business Income",
            description:
              "Much like the first one but with added features for your business.",
          },
        },
        {
          element: "#addBusiness",
          popover: {
            title: "Business Title",
            description:
              "Here you can name the business you're managing. It can still be changed later.",
          },
        },
      ],
    });

    driverObj.drive();

    setInstructions((prev) => ({ ...prev, home: false }));
  };
  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="w-fit flex gap-5 place-items-center min-h-[90vh] bg-light font-pops mx-auto md:flex-col lg:py-[10%] md:py-[15%] sm:py-[20%] xs:h-[max]">
          {/* Personal Income */}
          <PersonalHomeCard />

          {/* Business Income */}
          <BusinessHomeCard />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
