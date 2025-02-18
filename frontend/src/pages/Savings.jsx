import { CalendarContext } from "../context/CalendarContext";
import useAuth from "../hooks/useAuth";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import FooterNav from "../components/FooterNav";
import Sidebar from "../components/Sidebar";
import SavingsComponent from "../components/savings/SavingsComponent";
import { useContext, useEffect } from "react";

const Savings = () => {
  const { auth } = useAuth();
  const { setLoggedIn } = useContext(CalendarContext);

  useEffect(() => {
    if (!auth.accessToken && !auth._id) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, []);

  return (
    // <div className="flex lg:flex-col">
    //   <div className="lg:hidden">
    //     <Sidebar />
    //   </div>
    //   <div className="w-full bg-light">
    //     <Navbar />
    //     {/* income components */}
    //     <div className="mt-20 lg:mb-[5rem]">
    //       <Footer />
    //     </div>
    //   </div>

    //   <div className="hidden lg:block">
    //     <FooterNav />
    //   </div>
    // </div>

    <div className="font-pops  min-h-[100vh]">
      <SavingsComponent />
    </div>
  );
};

export default Savings;
