import React, { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:4000/api/v1";

const FeedbackNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        // Fetch notifications every 5 minutes
        const interval = setInterval(fetchNotifications, 300000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const userDataString = localStorage.getItem("userData");
            if (!userDataString) {
                throw new Error("User data not found");
            }

            const userData = JSON.parse(userDataString);
            const response = await fetch(`${BASE_URL}/getStudentNotifications/${userData._id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptNotification = async (notificationId) => {
        try {
            const response = await fetch(`${BASE_URL}/acceptNotification/${notificationId}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to accept notification");
            }

            setNotifications(notifications.filter(notification => notification._id !== notificationId));
            if (notifications.length === 1) {
                setShowNotifications(false);
            }
        } catch (error) {
            console.error("Error accepting notification:", error);
            setError("Failed to accept notification");
        }
    };

    const handleViewForm = (formName) => {
        navigate(`/student/give-feedback/${formName}`);
        setShowNotifications(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays <= 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getTimeRemaining = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return "Expired";
        } else if (diffDays === 0) {
            return "Due today";
        } else if (diffDays === 1) {
            return "Due tomorrow";
        } else {
            return `${diffDays} days left`;
        }
    };

    const getUnreadCount = () => {
        return notifications.filter(notification => !notification.accepted).length;
    };

    if (loading) {
        return null;
    }

    if (error) {
        return null;
    }

    const unreadCount = getUnreadCount();

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200"
                aria-label="Notifications"
            >
                <FaBell size={20} className={unreadCount > 0 ? "animate-bounce" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-in-out">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <FaBell className="mr-2" /> Notifications
                        </h3>
                        <button
                            onClick={() => setShowNotifications(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                            aria-label="Close notifications"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                                <FaCheckCircle className="text-4xl mb-2 text-green-500" />
                                <p className="text-lg">All caught up!</p>
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notification) => {
                                    const timeRemaining = getTimeRemaining(notification.deadline);
                                    const isExpired = timeRemaining === "Expired";
                                    const isUrgent = !isExpired && timeRemaining === "Due today";

                                    return (
                                        <li key={notification._id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${isExpired ? 'bg-red-100 text-red-800' :
                                                                    isUrgent ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {timeRemaining}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 mt-2">
                                                            {notification.formName}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Received {formatDate(notification.createdAt)}
                                                        </p>
                                                    </div>
                                                    {!notification.accepted && !isExpired && (
                                                        <button
                                                            onClick={() => handleAcceptNotification(notification._id)}
                                                            className="ml-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-full transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            Accept
                                                        </button>
                                                    )}
                                                </div>
                                                {!isExpired && (
                                                    <button
                                                        onClick={() => handleViewForm(notification.formName)}
                                                        className="w-full mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-1 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <span>View Feedback Form</span>
                                                        <span>→</span>
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackNotification; 