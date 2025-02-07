import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import FooterNav from "../components/FooterNav";
import Sidebar from "../components/Sidebar";
import SavingsComponent from "../components/savings/SavingsComponent";

const Savings = () => {
  return (
    <div className="flex lg:flex-col">
      <div className="lg:hidden">
        <Sidebar />
      </div>
      <div className="w-full bg-light">
        <Navbar />
        <div className="font-pops  min-h-[100vh]">
          <SavingsComponent />
        </div>
        <div className="mt-20 lg:mb-[5rem]">
          <Footer />
        </div>
      </div>

      <div className="hidden lg:block">
        <FooterNav />
      </div>
    </div>
  );
};

export default Savings;
