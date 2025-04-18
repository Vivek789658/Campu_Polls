import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { FaClipboardList, FaCalendarAlt, FaClock, FaQuestion, FaBook, FaUsers, FaExternalLinkAlt, FaSpinner, FaBars, FaTimes } from "react-icons/fa";

const BASE_URL = "http://localhost:4000/api/v1";

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

const StudentPage = () => {
  const [feedbackForms, setFeedbackForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAdminFeedbackForms();

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
  }, [sidebarOpen]);

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

  const fetchAdminFeedbackForms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/getAllFeedbackForms`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedback forms");
      }
      const data = await response.json();
      console.log("Fetched feedback forms:", data);
      setFeedbackForms(data.feedbackForms || []);
    } catch (error) {
      console.error("Error fetching feedback forms:", error);
      setError("Failed to load feedback forms");
    } finally {
      setLoading(false);
    }
  };

  // Function to check if deadline is approaching (within 2 days)
  const isDeadlineApproaching = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  // Function to check if deadline has passed
  const isDeadlinePassed = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return now > deadlineDate;
  };

  // Function to format date in a more readable format
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
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
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <div className="flex items-center">
                <FaClipboardList className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-2xl sm:text-3xl mr-2 sm:mr-3 flex-shrink-0`} />
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} tracking-tight`}>
                  Available Forms
                </h1>
              </div>
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

          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 sm:mb-8 max-w-3xl text-sm sm:text-base`}>
            Complete feedback forms for your courses. Your feedback helps improve the quality of education and course content.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-16">
              <FaSpinner className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} text-xl sm:text-2xl animate-spin mr-3`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-base sm:text-lg`}>Loading feedback forms...</p>
            </div>
          ) : error ? (
            <div className={`${darkMode ? 'bg-red-900 bg-opacity-20 border-red-800' : 'bg-red-50 border-red-500'} p-4 sm:p-6 rounded-lg border-l-4 mb-6 sm:mb-8`}>
              <p className={`${darkMode ? 'text-red-300' : 'text-red-600'} font-medium text-sm sm:text-base`}>{error}</p>
              <button
                onClick={fetchAdminFeedbackForms}
                className={`mt-2 sm:mt-3 text-xs sm:text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}
              >
                Try Again
              </button>
            </div>
          ) : feedbackForms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {feedbackForms.map((form) => {
                const deadlinePassed = isDeadlinePassed(form.deadline);
                const deadlineApproaching = isDeadlineApproaching(form.deadline);

                return (
                  <div
                    key={form._id}
                    className={`${darkMode
                      ? 'bg-gray-800 border-gray-700 hover:shadow-md hover:shadow-gray-700/30'
                      : 'bg-white border-gray-200 hover:shadow-md'
                      } rounded-lg sm:rounded-xl shadow-sm border overflow-hidden transition-all duration-300`}
                  >
                    <div className={`p-4 sm:p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} pr-2`}>
                          {form.name}
                        </h3>
                        {deadlinePassed ? (
                          <span className={`px-2 py-1 ${darkMode ? 'bg-red-900 bg-opacity-50 text-red-300' : 'bg-red-100 text-red-700'} text-xs rounded-full font-medium flex-shrink-0`}>Expired</span>
                        ) : deadlineApproaching ? (
                          <span className={`px-2 py-1 ${darkMode ? 'bg-yellow-900 bg-opacity-50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'} text-xs rounded-full font-medium flex-shrink-0`}>Urgent</span>
                        ) : (
                          <span className={`px-2 py-1 ${darkMode ? 'bg-green-900 bg-opacity-50 text-green-300' : 'bg-green-100 text-green-700'} text-xs rounded-full font-medium flex-shrink-0`}>Active</span>
                        )}
                      </div>

                      {form.subjectCode && form.section && (
                        <div className={`flex items-center text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 sm:mb-4`}>
                          <FaBook className={`mr-1.5 sm:mr-2 text-xs sm:text-sm ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <span className="truncate">{form.subjectCode} • Section {form.section}</span>
                        </div>
                      )}
                    </div>

                    <div className={`p-4 sm:p-5 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex items-start">
                          <FaClock className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 text-xs sm:text-sm`} />
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Start Time</p>
                            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate max-w-[100px] sm:max-w-full`}>{formatDate(form.startTime)}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <FaCalendarAlt className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mt-0.5 sm:mt-1 mr-1.5 sm:mr-2 text-xs sm:text-sm`} />
                          <div>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Deadline</p>
                            <p className={`text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-full ${deadlinePassed
                              ? darkMode ? 'text-red-400' : 'text-red-600'
                              : deadlineApproaching
                                ? darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                : darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              {formatDate(form.deadline)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <FaQuestion className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-1.5 sm:mr-2 text-xs sm:text-sm`} />
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">{form.questions?.length || 0}</span> questions to answer
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/feedback/${form.name}`)}
                        disabled={deadlinePassed}
                        className={`w-full flex justify-center items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-white text-sm font-medium transition-colors ${deadlinePassed
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : darkMode
                            ? 'bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-gray-900'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          }`}
                      >
                        {deadlinePassed ? 'Deadline Passed' : (
                          <>
                            Fill Form <FaExternalLinkAlt className="ml-2 text-xs" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 text-center`}>
              <FaClipboardList className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} text-5xl mx-auto mb-4`} />
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>No Forms Available</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md mx-auto text-sm sm:text-base`}>
                There are no feedback forms available at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
