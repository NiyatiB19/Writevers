import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import AllBlogs from "./pages/AllBlogs";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import About from "./pages/About";
import CreateBlog from "./pages/CreateBlog";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const ScrollToTopHelper = () => {
  const { useLocation } = require("react-router-dom");
  const { useEffect } = require("react");
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AdminRoute({ children }) {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(userStr);
    if (!user.isAdmin) return <Navigate to="/" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

// Strict Authentication Wrapper
function ProtectedRoute({ children }) {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "dark"; // default to dark
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    // Save preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <BrowserRouter>
      <ScrollToTopHelper />
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/explore" element={<ProtectedRoute><AllBlogs theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>} />
        <Route path="/read/:id" element={<ProtectedRoute><BlogDetail theme={theme} toggleTheme={toggleTheme} /></ProtectedRoute>} />
        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/signup" element={<Signup theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/profile" element={<Profile theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/about" element={<About theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/write" element={<CreateBlog theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/edit/:id" element={<CreateBlog theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/admin" element={<AdminRoute><Admin theme={theme} toggleTheme={toggleTheme} /></AdminRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/reset-password/:token" element={<ResetPassword theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
