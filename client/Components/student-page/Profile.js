import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { FaBars } from "react-icons/fa";

// SVG icons for theme toggle
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const Profile = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const type = userData?.type;
  const userId = userData?._id;
  const [subjects, setSubjects] = useState([]);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || null
  );
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle no user data case
  if (!userData) {
    window.location.href = '/';
    return null;
  }

  const BASE_URL = "http://localhost:4000";

  useEffect(() => {
    fetchSubjects(userId);

    // Add event listener to close sidebar when clicking outside on mobile
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userId, sidebarOpen]);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('darkMode', darkMode);
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchSubjects = async (userId) => {
    try {
      // Make a GET request to your backend API endpoint to fetch subjects
      const response = await fetch(`${BASE_URL}/api/v1/getSubjects/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File size should be less than 1 MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem("profileImage", base64String);
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
    window.location.href = `/user/${userId}`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar for all screen sizes */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 sidebar`}>
        <SideBar darkMode={darkMode} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className={`p-4 sm:p-6 md:p-8 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {/* Header with mobile toggle */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`sidebar-toggle mr-3 p-2 rounded-md lg:hidden ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}
                aria-label="Toggle sidebar"
              >
                <FaBars />
              </button>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} tracking-tight`}>
                Student Profile
              </h1>
            </div>

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex-shrink-0`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Profile content */}
          <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Profile header */}
            <div className={`px-4 sm:px-6 py-4 sm:py-6 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white`}>
              <h2 className="text-lg sm:text-xl font-semibold">Personal Information</h2>
            </div>

            {/* Profile details */}
            <div className="p-4 sm:p-6">
              {/* Profile image and name section */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                <div className="mb-4 sm:mb-0">
                  <div className={`text-base sm:text-lg mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-bold">Name:</span> {userData.name}
                  </div>
                  <div className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-medium">User ID:</span> {userId}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative group mb-2 sm:mb-3">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 ${darkMode ? 'border-blue-500' : 'border-blue-400'}`}
                      />
                    ) : (
                      <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <span className={`text-3xl sm:text-4xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {userData.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-md ${darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'} transition-colors`}
                  >
                    {profileImage ? "Change Image" : "Upload Image"}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Student specific details */}
              {type === "student" && (
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Course:</span>
                    <div className="text-base sm:text-lg">{userData.course}</div>
                  </div>

                  <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Semester:</span>
                    <div className="text-base sm:text-lg">{userData.semester}</div>
                  </div>

                  <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Section:</span>
                    <div className="text-base sm:text-lg">{userData.section}</div>
                  </div>
                </div>
              )}

              {/* Subjects section */}
              <div className="mt-6">
                <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Enrolled Subjects
                </h3>

                {subjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                      <div
                        key={subject._id}
                        className={`p-4 rounded-lg ${darkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'} transition-colors shadow-sm`}
                      >
                        <h4 className={`text-base sm:text-lg font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {subject.subjectName}
                        </h4>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <p className="mb-1"><span className="font-medium">Code:</span> {subject.subjectCode}</p>

                          {type !== "student" && (
                            <>
                              <p className="mb-1"><span className="font-medium">Section:</span> {subject.section}</p>
                              <p className="mb-1"><span className="font-medium">Course:</span> {subject.course}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No subjects enrolled
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
