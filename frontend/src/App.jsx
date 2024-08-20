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
          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route path="login" element={<Auth />} />
            <Route element={<RequireAuth />}>
              <Route exact path="home" element={<Home />} />
              <Route path="personal" element={<Personal />} />
              <Route path="business" element={<Business />} />
              <Route path="summary" element={<Summary />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
