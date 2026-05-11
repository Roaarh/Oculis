import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import MovingDotsBackground from "./components/MovingDotsBackground";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import DreamInput from "./pages/DreamInput";
import Auth from "./pages/Auth";
import GeneratingPage from "./pages/Generating";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/Adminlogin";
import AdminPanel from "./pages/Adminpanel";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import Roadmap from "./pages/RoadmapOrbits";
import Dreams from "./pages/Dreams";
import Onboarding from "./pages/Onboarding";
import FloatingDotsBackground from "./components/FloatingDotsBackground";
import OnboardingDetails from "./pages/Onboardingdetails";

// Admin Route Protection Component
const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true, state: { from: location } });
    }
  }, [token, navigate, location]);

  return token ? children : null;
};

function App() {
  const themePrimary = "rgb(255, 255, 255)"; // later you can read from ThemeContext

  return (
    <>
      <FloatingDotsBackground color={themePrimary} />

      <div className="main-root">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/dream-input" element={<DreamInput />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/generating" element={<GeneratingPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/Onboarding" element={<Onboarding />} />
          <Route path="/onboarding-details" element={<OnboardingDetails />} />
          <Route path="/dreams" element={<Dreams />} />

          {/* Admin routes - PROTECTED */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin-panel" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin-panel/users" 
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
