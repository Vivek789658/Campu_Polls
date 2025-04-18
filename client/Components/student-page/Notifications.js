import React, { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { FaBell, FaRegClock, FaRegQuestionCircle, FaRegCommentAlt, FaRegCheckCircle } from "react-icons/fa";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userDataString = localStorage.getItem("userData");
  const { _id } = JSON.parse(userDataString);
  require("dotenv").config();
  const BASE_URL = "http://localhost:4000";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/v1/getReply/${_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [_id]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex md:p-3 bg-gray-50">
        <SideBar />
        <div className="flex-1 ml-64 px-5 py-2 h-[calc(100vh-15vh)] overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="text-3xl text-purple-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path>
              </svg>
              <h1 className="text-2xl font-bold text-gray-800">Feedback Notifications</h1>
            </div>
            <p className="text-gray-600">
              View all your feedback responses and professor replies here
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="text-5xl text-gray-400 mb-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notifications Yet</h3>
            <p className="text-gray-500">
              You don't have any feedback responses at the moment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;
