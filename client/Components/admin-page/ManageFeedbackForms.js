import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    FaTrash, FaEdit, FaSearch, FaFilter, FaCalendarAlt, FaClock,
    FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaUserGraduate,
    FaChalkboardTeacher, FaBook, FaChartLine, FaBell, FaClipboardList,
    FaRegClock
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const ITEMS_PER_PAGE = 9; // Show 9 items per page for grid layout
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const ManageFeedbackForms = () => {
    const [feedbackForms, setFeedbackForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Memoize expensive computations
    const filteredForms = useMemo(() => {
        return feedbackForms.filter(form => {
            const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (form.subjectCode && form.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (form.section && form.section.toLowerCase().includes(searchTerm.toLowerCase()));

            if (filterStatus === "all") return matchesSearch;

            const status = getFormStatus(form).status;
            return matchesSearch && status.toLowerCase() === filterStatus.toLowerCase();
        });
    }, [feedbackForms, searchTerm, filterStatus]);

    // Memoize pagination calculation
    const paginatedForms = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredForms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredForms, currentPage]);

    const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);

    const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
        try {
            const response = await axios.get(url, options);
            return response;
        } catch (error) {
            if (retries > 0 && (error.code === 'ECONNABORTED' || !error.response)) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchWithRetry(url, options, retries - 1);
            }
            throw error;
        }
    };

    const fetchFeedbackForms = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetchWithRetry(`${API_BASE_URL}/getAllFeedbackForms`);

            if (!response.data) {
                throw new Error('Empty response received from server');
            }

            let feedbackFormsData;
            if (Array.isArray(response.data)) {
                feedbackFormsData = response.data;
            } else if (response.data.feedbackForms && Array.isArray(response.data.feedbackForms)) {
                feedbackFormsData = response.data.feedbackForms;
            } else {
                throw new Error('Invalid data format received from server');
            }

            // Validate and format each form object
            feedbackFormsData = feedbackFormsData.map(form => ({
                ...form,
                name: form.name || 'Untitled Form',
                startTime: form.startTime || null,
                deadline: form.deadline || null,
                questions: Array.isArray(form.questions) ? form.questions : [],
                subjectCode: form.subjectCode || '',
                section: form.section || ''
            }));

            setFeedbackForms(feedbackFormsData);
            setLoading(false);
            setError("");
        } catch (error) {
            let errorMessage = 'Failed to load feedback forms';

            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check if the server is running.';
            } else {
                errorMessage = error.message || errorMessage;
            }

            setError(errorMessage);
            setFeedbackForms([]);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeedbackForms();

        // Set up periodic refresh
        const refreshInterval = setInterval(fetchFeedbackForms, 30000); // Refresh every 30 seconds

        return () => {
            clearInterval(refreshInterval);
        };
    }, [fetchFeedbackForms]);

    // Reset to first page when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    // Memoize getFormStatus calculations
    const getFormStatus = useCallback((form) => {
        try {
            const now = new Date();
            const startTime = form.startTime ? new Date(form.startTime) : null;
            const deadline = form.deadline ? new Date(form.deadline) : null;

            if (!startTime || isNaN(startTime.getTime()) || !deadline || isNaN(deadline.getTime())) {
                return {
                    status: "Unknown",
                    class: "bg-gray-100 text-gray-800",
                    icon: <FaExclamationTriangle className="mr-1" />
                };
            }

            if (now < startTime) {
                return {
                    status: "Scheduled",
                    class: "bg-yellow-100 text-yellow-800",
                    icon: <FaClock className="mr-1" />
                };
            } else if (now >= startTime && now <= deadline) {
                return {
                    status: "Active",
                    class: "bg-green-100 text-green-800",
                    icon: <FaCheckCircle className="mr-1" />
                };
            } else {
                return {
                    status: "Closed",
                    class: "bg-red-100 text-red-800",
                    icon: <FaTimesCircle className="mr-1" />
                };
            }
        } catch (error) {
            console.error("Error in getFormStatus:", error);
            return {
                status: "Error",
                class: "bg-gray-100 text-gray-800",
                icon: <FaExclamationTriangle className="mr-1" />
            };
        }
    }, []);

    const handleDelete = async (formName) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/deleteFeedbackForm/${formName}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete feedback form");
            }

            setSuccessMessage(`Feedback form "${formName}" deleted successfully`);
            setFeedbackForms(feedbackForms.filter(form => form.name !== formName));

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error deleting feedback form:", error);
            setError(error.message || "Failed to delete feedback form");
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) {
                return "N/A";
            }

            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.warn("Invalid date string:", dateString);
                return "Invalid Date";
            }

            return date.toLocaleString();
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Error";
        }
    };

    if (loading && feedbackForms.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, Admin!</h1>
                            <p className="mt-2 text-blue-100">Manage your feedback system efficiently</p>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="bg-blue-500 bg-opacity-30 rounded-lg p-3">
                                <FaBell className="h-6 w-6" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white text-blue-600 flex items-center justify-center">
                                <FaUserGraduate className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaClipboardList className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Forms</p>
                                <h3 className="text-xl font-bold text-gray-900">{feedbackForms.length}</h3>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <FaChartLine className="mr-1" />
                            <span>12% increase</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <FaCheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Active Forms</p>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {feedbackForms.filter(form => getFormStatus(form).status === "Active").length}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <FaChartLine className="mr-1" />
                            <span>Active now</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <FaRegClock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {feedbackForms.filter(form => getFormStatus(form).status === "Scheduled").length}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-yellow-600">
                            <FaClock className="mr-1" />
                            <span>Upcoming</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <FaTimesCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Closed</p>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {feedbackForms.filter(form => getFormStatus(form).status === "Closed").length}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-600">
                            <FaCalendarAlt className="mr-1" />
                            <span>Past forms</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search forms by name, subject code, or section..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center min-w-[200px]">
                            <FaFilter className="text-gray-400 mr-2" />
                            <select
                                className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
                        <div className="flex items-center">
                            <FaCheckCircle className="mr-2" />
                            <p>{successMessage}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                        <div className="flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Forms Grid with Pagination */}
                {paginatedForms.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="text-5xl mb-4 text-gray-300">📝</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Forms Found</h3>
                        <p className="text-gray-600 mb-6">There are no feedback forms matching your search criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {paginatedForms.map((form) => {
                                const status = getFormStatus(form);
                                return (
                                    <div key={form._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[70%]">{form.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${status.class}`}>
                                                    {status.icon}
                                                    {status.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium mr-1">Subject:</span>
                                                    <span>{form.subjectCode || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium mr-1">Section:</span>
                                                    <span>{form.section || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium mr-1">Questions:</span>
                                                    <span>{form.questions?.length || 0}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaCalendarAlt className="mr-2 text-blue-500" />
                                                    <span className="truncate">{formatDate(form.startTime)}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaClock className="mr-2 text-red-500" />
                                                    <span className="truncate">{formatDate(form.deadline)}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-3 border-t border-gray-100">
                                                <div></div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/edit-feedback-form/${form.name}`)}
                                                        className="text-yellow-600 hover:text-yellow-800 p-1.5 rounded-full hover:bg-yellow-50 transition-colors"
                                                        title="Edit Form"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(form.name)}
                                                        className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Delete Form"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 my-6">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                                <FaTrash className="text-red-500 text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">Confirm Delete</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete the feedback form <span className="font-semibold">"{deleteConfirm}"</span>?
                                This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ManageFeedbackForms); 