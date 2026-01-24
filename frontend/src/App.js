import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllBlogs from "./pages/AllBlogs";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import About from "./pages/About";
import CreateBlog from "./pages/CreateBlog";

// Simple ScrollTop component to ensure pages start at top
const ScrollToTopHelper = () => {
  const { useLocation } = require("react-router-dom");
  const { useEffect } = require("react");
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      {/* ScrollToTopHelper equivalent inline logic */}
      <ScrollToTopHelper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<AllBlogs />} />
        <Route path="/read/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/write" element={<CreateBlog />} />
        <Route path="/edit/:id" element={<CreateBlog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
