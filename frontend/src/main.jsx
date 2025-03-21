import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CalendarContextProvider } from "./context/CalendarContext.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

// if (process.env.NODE_ENV === 'production') {
disableReactDevTools();
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CalendarContextProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </CalendarContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
