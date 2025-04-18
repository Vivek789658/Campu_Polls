import React, { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaClipboardList,
  FaChartBar,
  FaEnvelope,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";
import profile from "./profile.jpg";

const SideBar = ({ darkMode = false, onClose }) => {
  const pathname = window.location.pathname;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const name = userData?.name;
  const userType = userData?.type;
  const profileImage = localStorage.getItem("profileImage") || profile;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("userData");
      localStorage.removeItem("profileImage");
      window.location.href = "/";
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaHome size={20} />,
      path: "/student"
    },
    {
      title: "Analytics",
      icon: <FaChartBar size={20} />,
      path: "/student/analytics"
    },
    {
      title: "Contact",
      icon: <FaEnvelope size={20} />,
      path: "/student/contact"
    }
  ];

  // Determine the sidebar background gradient based on dark mode
  const sidebarBg = darkMode
    ? "bg-gradient-to-b from-gray-900 to-black"
    : "bg-gradient-to-b from-gray-800 to-gray-900";

  // Determine hover and active states based on dark mode
  const hoverBg = darkMode ? "hover:bg-gray-800/70" : "hover:bg-gray-800";
  const activeBg = darkMode ? "bg-blue-800/80" : "bg-blue-600/90";

  return (
    <aside className={`w-64 h-full ${sidebarBg} text-white shadow-xl`}>
      {/* Close button - visible only on mobile */}
      <div className="lg:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-1 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close sidebar"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="relative px-6 py-6 sm:py-8 border-b border-gray-700/50">
        <div
          ref={dropdownRef}
          className="flex flex-col items-center cursor-pointer relative"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="relative group">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 ${darkMode ? 'border-blue-500' : 'border-blue-400'} p-1 transition-all duration-300 group-hover:border-blue-500`}>
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-white/90">{name}</h2>
          <p className="text-xs sm:text-sm text-white/60 capitalize">{userType}</p>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 ${darkMode ? 'bg-gray-900/95' : 'bg-gray-800/95'} backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 overflow-hidden z-[100]`}>
              <a href={"/user/" + userData?._id} className="block">
                <div className={`px-4 py-3 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-700/50'} flex items-center gap-3 transition-colors`}>
                  <FaUser className={`${darkMode ? 'text-blue-400' : 'text-blue-400'}`} />
                  <span className="text-white/90">View Profile</span>
                </div>
              </a>
              <div
                onClick={handleLogout}
                className={`px-4 py-3 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-700/50'} flex items-center gap-3 cursor-pointer transition-colors border-t border-gray-700/50`}
              >
                <FaSignOutAlt className="text-red-400" />
                <span className="text-red-400">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group ${pathname === item.path
                ? `${activeBg} text-white shadow-md`
                : `text-white/70 ${hoverBg} hover:text-white`
                }`}
            >
              <span className={`text-lg sm:text-xl transition-transform duration-200 group-hover:scale-110 ${pathname === item.path ? "text-white" : darkMode ? "text-blue-300" : "text-blue-400"
                }`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm sm:text-base">{item.title}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-700/50">
        <a
          href="/student/settings"
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white/70 ${hoverBg} hover:text-white transition-all duration-200 group`}
        >
          <span className={`${darkMode ? 'text-blue-300' : 'text-blue-400'} transition-transform text-lg duration-200 group-hover:scale-110`}>
            <FaCog size={20} />
          </span>
          <span className="font-medium text-sm sm:text-base">Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default SideBar;
