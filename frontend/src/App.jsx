import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import Summary from "./pages/Summary";
import { useEffect, useContext } from "react";
import { CalendarContext } from "./context/CalendarContext";
import Settings from "./pages/Settings";
import LandingPage from "./landingpage/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermOfUse from "./pages/TermsOfUse";
import Calendar from "./pages/Calendar";
import Filter from "./pages/Filter";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/PasswordReset";
import Savings from "./pages/Savings";

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
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="login" element={<Auth />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* uncomment RequireAuth after ads added */}
            {/* <Route element={<RequireAuth />}> */}
            {/* Dashboard Page start */}
            <Route path="dashboard" element={<Summary />} />
            <Route
              path="dashboard"
              element={<Navigate to="/dashboard?tab=Personal" replace />}
            />
            {/* Dashboard Page start */}

            {/* Calendar Page start */}
            <Route path="income" element={<Calendar />} />
            <Route
              path="income"
              element={<Navigate to="/income?tab=Personal" replace />}
            />
            {/* Calendar Page end */}
            <Route path="savings" element={<Savings />} />
            <Route path="filter" element={<Filter />} />
            <Route path="settings" element={<Settings />} />
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
