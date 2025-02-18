import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import FooterNav from "../components/FooterNav";

const Layout = () => {
  return (
    <div className="App">
      <div className="flex lg:flex-col">
        <div className="lg:hidden">
          <Sidebar />
        </div>
        <div className="w-full bg-light">
          <Navbar />
          <Outlet />
          <div className="mt-20 lg:mb-[5rem]">
            <Footer />
          </div>
        </div>

        <div className="hidden lg:block">
          <FooterNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
