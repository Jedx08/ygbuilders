import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Personal from "./pages/Personal";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import Business from "./pages/Business";
import Summary from "./pages/Summary";
import { useEffect, useContext } from "react";
import { CalendarContext } from "./context/CalendarContext";
import Settings from "./pages/Settings";
import LandingPage from "./landingpage/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermOfUse from "./pages/TermsOfUse";
import Calendar from "./pages/Calendar";
import Filter from "./pages/Filter";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/PasswordReset";

function App() {
  const { setInMobile } = useContext(CalendarContext);

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      setInMobile(true);
    } else {
      // false for not mobile device
      setInMobile(false);
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermOfUse />} />

          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="login" element={<Auth />} />

            {/* uncomment RequireAuth after ads added */}
            {/* <Route element={<RequireAuth />}> */}
            <Route exact path="/home" element={<Home />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="business" element={<Business />} />
            <Route path="summary" element={<Summary />} />
            <Route path="settings" element={<Settings />} />
            <Route path="filter" element={<Filter />} />
            <Route path="tab1/" element={<Tab1 />} />
            <Route path="tab1/tab2" element={<Tab2 />} />
            {/* </Route> */}
          </Route>
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
