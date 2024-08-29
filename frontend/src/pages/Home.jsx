import { useEffect, useState } from "react";
import BusinessHomeCard from "../components/business/BusinessHomeCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PersonalHomeCard from "../components/personal/PersonalHomeCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [instructions, setInstructions] = useState(null);

  useEffect(() => {
    const showInstructions = async () => {
      try {
        const _id = await auth?._id;

        if (_id) {
          const response = await axiosPrivate.get("/user/" + _id);
          setInstructions(response.data.instructions);

          if (response.data.instructions.home) {
            showTour();
          }
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
            side: "left",
          },
        },
        {
          element: "#addPersonal",
          popover: {
            title: "Personal Title",
            description:
              "You can start by creating a title. It can still be changed later.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#businessHomeCard",
          popover: {
            title: "Business Income",
            description:
              "Much like the first one but with added features for your business.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#addBusiness",
          popover: {
            title: "Business Title",
            description:
              "Here you can name the business you're managing. It can still be changed later.",
            side: "left",
            align: "start",
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
