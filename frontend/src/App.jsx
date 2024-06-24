import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Personal from "./pages/Personal";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route path="login" element={<Auth />} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="personal" element={<Personal />} />
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
