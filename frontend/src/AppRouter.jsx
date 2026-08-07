import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DashboardShell from "./layout/DashboardShell.jsx";

// Dashboard Sub-Pages
import Overview from "./pages/dashboard/index.jsx";
import Projects from "./pages/dashboard/projects.jsx";
import Papers from "./pages/dashboard/papers.jsx";
import Researchers from "./pages/dashboard/researchers.jsx";
import Notifications from "./pages/dashboard/notifications.jsx";
import Settings from "./pages/dashboard/settings.jsx";
import UploadPaper from "./pages/UploadPaper.jsx";

// Public Pages
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Dashboard Routes (Nested) */}
        <Route path="/dashboard" element={<DashboardShell />}>
          <Route index element={<Overview />} />
          <Route path="projects" element={<Projects />} />
          <Route path="papers" element={<Papers />} />
          <Route path="researchers" element={<Researchers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="upload" element={<UploadPaper />} /> {/* ✅ রুট যুক্ত করা হয়েছে */}
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}