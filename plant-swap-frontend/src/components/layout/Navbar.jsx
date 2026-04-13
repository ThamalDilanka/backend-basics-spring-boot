import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setUserName(localStorage.getItem("name") || "");
    setProfilePic(localStorage.getItem("profilePicture") || "");
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    // Also listen to storage events if changed from other tabs
    window.addEventListener("storage", checkAuth);

    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest(".profile-menu")) {
        setShowPopup(false);
      }
      if (
        isMobileMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".mobile-menu-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showPopup, isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowPopup(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("profilePicture");
    window.dispatchEvent(new Event("auth-change"));
    setShowPopup(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // Helper for active link styles
  const isActive = (path) => location.pathname === path;

  const NavLinks = ({ mobile }) => (
    <>
      <Link
        to="/plants"
        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center justify-center ${
          isActive("/plants")
            ? "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] bg-[#e8f5ee] text-[#2d6a4f]"
            : "text-[#1b4332] hover:bg-[#e8f5ee] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
        } ${mobile ? "w-full py-4 text-base" : ""}`}
      >
        Plants
      </Link>
      <Link
        to="/add-plant"
        className={`px-5 py-2.5 rounded-full font-bold text-sm bg-white border border-[#52b788]/40 shadow-[0_4px_10px_rgba(82,183,136,0.15),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_6px_15px_rgba(82,183,136,0.25),inset_0_1px_0_rgba(255,255,255,1)] hover:-translate-y-0.5 transition-all text-[#2d6a4f] flex items-center justify-center ${
          mobile ? "w-full py-4 text-base mt-2" : ""
        }`}
      >
        Add Plant
      </Link>
      <Link
        to="/requests"
        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center justify-center ${
          isActive("/requests")
            ? "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] bg-[#e8f5ee] text-[#2d6a4f]"
            : "text-[#1b4332] hover:bg-[#e8f5ee] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
        } ${mobile ? "w-full py-4 text-base mt-2" : ""}`}
      >
        Swap Requests
      </Link>
    </>
  );

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none">
      <style>{`
        .liquid-login {
          position: relative;
          overflow: hidden;
          background: white;
          color: #2d6a4f;
          box-shadow: 0 4px 10px rgba(82, 183, 136, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
          border: 1px solid rgba(255,255,255,0.9);
          z-index: 1;
        }
        .liquid-login::after {
          content: "";
          position: absolute;
          top: 100%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: #a6fcaf;
          border-radius: 40%;
          transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          animation: spinBtn 4s linear infinite;
          z-index: -1;
        }
        .liquid-login:hover::after {
          top: -20%;
        }
        .liquid-login:hover {
          color: #1b4332;
        }
        @keyframes spinBtn {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Navbar Pill */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`pointer-events-auto w-full max-w-[860px] rounded-[9999px] bg-[rgba(240,250,244,0.85)] backdrop-blur-2xl border border-white/90 flex items-center justify-between px-3 md:px-4 transition-all duration-300 ${
          scrolled
            ? "py-2 shadow-[0_12px_40px_rgba(82,183,136,0.18),0_4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.06)] scale-[0.98]"
            : "py-3 shadow-[0_8px_32px_rgba(82,183,136,0.15),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-extrabold text-[#1b4332] flex items-center gap-2 group tracking-tight ml-2"
        >
          <img
            src="/plant.png"
            alt="logo"
            className="w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 animate-[bounce_3s_infinite] drop-shadow-md"
          />
          <span className="hidden sm:block">Plant Swap</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-1.5 items-center flex-1 justify-center ml-4">
          <NavLinks mobile={false} />
        </div>

        {/* Right Section (Profile / Login + Mobile Toggle) */}
        <div className="flex items-center gap-3 mr-1">
          {isLoggedIn ? (
            <div className="relative profile-menu">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="flex items-center gap-2 bg-white/60 border border-white/80 p-1.5 pr-3.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_5px_rgba(0,0,0,0.05)] hover:shadow-[0_0_15px_rgba(82,183,136,0.3)] transition-all relative z-10 group"
                title="Profile Menu"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="bg-[#c9eed1] w-8 h-8 flex items-center justify-center rounded-full text-[#1b4332] font-bold shadow-inner border border-[#a6fcaf]">
                    {userName ? (
                      userName.charAt(0).toUpperCase()
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-bold text-[#1b4332] max-w-[100px] truncate">
                  {userName || "Profile"}
                </span>
                <ChevronDown
                  size={14}
                  className="text-[#52b788] group-hover:text-[#2d6a4f] transition-colors"
                />
              </button>

              <AnimatePresence>
                {showPopup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 bg-white/80 backdrop-blur-xl border border-white/90 rounded-[1.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] py-2 z-50 origin-top-right overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#1b4332] hover:bg-[#e8f5ee] transition-colors"
                      onClick={() => setShowPopup(false)}
                    >
                      <User size={18} className="text-[#52b788]" />
                      My Profile
                    </Link>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <button className="liquid-login px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all">
                <span className="relative z-10">Login</span>
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[#1b4332] rounded-full hover:bg-white/50 transition-colors mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto absolute top-[calc(100%+12px)] w-[calc(100%-32px)] max-w-[828px] md:hidden bg-[rgba(240,250,244,0.95)] backdrop-blur-3xl border border-white/90 rounded-[2rem] shadow-[0_20px_40px_rgba(82,183,136,0.25),inset_0_1px_0_rgba(255,255,255,1)] p-6 flex flex-col gap-2 overflow-hidden z-40 mobile-menu-container origin-top"
          >
            <NavLinks mobile={true} />
            {!isLoggedIn && (
              <Link to="/login" className="w-full mt-4">
                <button className="w-full liquid-login px-6 py-4 rounded-full font-bold text-base tracking-wide transition-all">
                  <span className="relative z-10">Login</span>
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
