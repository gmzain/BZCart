import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { store } from "./app/store.js";
import Navbar from "./compunent/Navbar.jsx";
import AnalyticsProvider from "./compunent/AnalyticsProvider.jsx";

// ✅ Custom wrapper component to handle conditional Navbar
function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/LoginProfile", "/auth", "/Profile"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AnalyticsProvider>
          <Layout />
        </AnalyticsProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
