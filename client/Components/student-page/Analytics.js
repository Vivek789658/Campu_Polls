import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { FaCheckCircle, FaSpinner, FaFileAlt, FaCalendarAlt, FaClock, FaChartBar, FaBars } from "react-icons/fa";

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

const Analytics = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalForms: 0,
        recentSubmissions: 0,
        oldestSubmission: null,
        newestSubmission: null
    });

    useEffect(() => {
        fetchSubmissions();
    }, []);

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

    // Effect to handle clicks outside sidebar on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggle = document.querySelector('.sidebar-toggle');

            if (sidebarOpen && sidebar && !sidebar.contains(event.target) &&
                sidebarToggle && !sidebarToggle.contains(event.target)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const userDataString = localStorage.getItem("userData");

            if (!userDataString) {
                throw new Error("User data not found. Please login again.");
            }

            const userData = JSON.parse(userDataString);

            const response = await fetch(`${BASE_URL}/getStudentSubmissions/${userData._id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch submissions");
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to fetch submissions");
            }

            setSubmissions(data.submissions || []);

            // Calculate stats
            if (data.submissions && data.submissions.length > 0) {
                const sortedByDate = [...data.submissions].sort((a, b) =>
                    new Date(a.submittedAt) - new Date(b.submittedAt)
                );

                const now = new Date();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const recentSubmissions = data.submissions.filter(
                    sub => new Date(sub.submittedAt) > oneWeekAgo
                ).length;

                setStats({
                    totalForms: data.submissions.length,
                    recentSubmissions,
                    oldestSubmission: sortedByDate[0],
                    newestSubmission: sortedByDate[sortedByDate.length - 1]
                });
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            setError(error.message || "Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 sidebar`}>
                <SideBar darkMode={darkMode} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 rounded lg:hidden sidebar-toggle"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            <FaBars className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                        </button>

                        <div>
                            <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} flex items-center`}>
                                <FaChartBar className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                Feedback Analytics
                            </h1>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base mt-1`}>
                                View your feedback submission history and statistics
                            </p>
                        </div>
                    </div>

                    {/* Theme toggle button */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className={`${darkMode ? 'bg-gray-800 border-green-700' : 'bg-white border-green-500'} rounded-lg shadow-md p-4 md:p-6 border-l-4`}>
                        <div className="flex items-center">
                            <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-green-900 bg-opacity-40' : 'bg-green-100'} mr-3 md:mr-4`}>
                                <FaFileAlt className={`${darkMode ? 'text-green-400' : 'text-green-500'} text-lg sm:text-xl`} />
                            </div>
                            <div>
                                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Total Forms Submitted</p>
                                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{stats.totalForms}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-500'} rounded-lg shadow-md p-4 md:p-6 border-l-4`}>
                        <div className="flex items-center">
                            <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-blue-900 bg-opacity-40' : 'bg-blue-100'} mr-3 md:mr-4`}>
                                <FaCalendarAlt className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} text-lg sm:text-xl`} />
                            </div>
                            <div>
                                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Recent Submissions</p>
                                <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{stats.recentSubmissions}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${darkMode ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-500'} rounded-lg shadow-md p-4 md:p-6 border-l-4 sm:col-span-2 md:col-span-1`}>
                        <div className="flex items-center">
                            <div className={`p-2 sm:p-3 rounded-full ${darkMode ? 'bg-purple-900 bg-opacity-40' : 'bg-purple-100'} mr-3 md:mr-4`}>
                                <FaClock className={`${darkMode ? 'text-purple-400' : 'text-purple-500'} text-lg sm:text-xl`} />
                            </div>
                            <div>
                                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Latest Submission</p>
                                <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {stats.newestSubmission
                                        ? formatDate(stats.newestSubmission.submittedAt)
                                        : "No submissions yet"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions List */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                    <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} px-4 sm:px-6 py-4`}>
                        <h2 className={`text-base sm:text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Submission History</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-16 sm:py-20">
                            <FaSpinner className={`animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-500'} text-xl sm:text-2xl mr-2`} />
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading submissions...</p>
                        </div>
                    ) : error ? (
                        <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
                            <p className={`${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
                        </div>
                    ) : submissions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Status
                                        </th>
                                        <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Form
                                        </th>
                                        <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden md:table-cell`}>
                                            Subject
                                        </th>
                                        <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden md:table-cell`}>
                                            Section
                                        </th>
                                        <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden lg:table-cell`}>
                                            Questions
                                        </th>
                                        <th scope="col" className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {submissions.map((submission) => (
                                        <tr key={submission._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaCheckCircle className={`${darkMode ? 'text-green-400' : 'text-green-500'} mr-2`} />
                                                    <span className={`text-xs sm:text-sm ${darkMode ? 'text-green-400' : 'text-green-500'} font-medium hidden sm:inline`}>Completed</span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{submission.formName}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{submission.formData.subjectCode}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{submission.formData.section}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{submission.formData.questions}</div>
                                            </td>
                                            <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 sm:py-16 px-4 sm:px-6 text-center">
                            <div className="flex justify-center mb-4">
                                <FaFileAlt className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} text-4xl sm:text-5xl`} />
                            </div>
                            <h3 className={`text-base sm:text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>No Submissions Yet</h3>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm max-w-md mx-auto`}>
                                You haven't submitted any feedback forms yet. Once you complete and submit forms, they will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics; 