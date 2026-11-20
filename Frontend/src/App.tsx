import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import useThemeStore, { type ThemeState } from "./store/useThemeStore";

function ScrollToTop(): null {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.slice(1);
      const element = document.getElementById(targetId);
      if (element && typeof element.scrollIntoView === "function") {
        try {
          element.scrollIntoView({ behavior: "auto", block: "start" });
        } catch {
          // Safe fallback for testing environments
        }
      }
      return;
    }

    if (typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, behavior: "auto" });
      } catch {
        // Safe fallback for testing environments
      }
    }
  }, [pathname, hash]);

  return null;
}

function App(): React.JSX.Element {
  const theme = useThemeStore((state: ThemeState) => state.theme);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme={theme} />
    </>
  );
}

export default App;
