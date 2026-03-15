import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";


export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

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
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("profilePicture");
    window.dispatchEvent(new Event("auth-change"));
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center max-w-6xl">
        {/* Logo / Home Link */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-700 flex items-center gap-2 group"
        >
          <img
            src="/plant.png"
            alt="logo"
            className="w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 animate-[bounce_3s_infinite]"
          />
          <span>Plant Swap</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/add-plant">
            <Button
              variant="outline"
              className="border-green-600 text-green-700"
            >
              Add Plant
            </Button>
          </Link>
          <Link to="/requests">
    <Button variant="ghost" className="text-slate-600">Swap Requests</Button>
          </Link>
          {isLoggedIn ? (
            <div className="relative profile-menu">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors"
                title="Profile Menu"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="bg-green-100 w-8 h-8 flex items-center justify-center rounded-full text-green-800 font-bold">
                    {userName ? (
                      userName.charAt(0).toUpperCase()
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                  {userName || "Profile"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showPopup && (
                <>
                  <style>{`
                    @keyframes popup {
                      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                      to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .animate-popup {
                      animation: popup 0.2s ease-out forwards;
                    }
                  `}</style>
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 transform origin-top-right animate-popup"
                    style={{
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setShowPopup(false)}
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
