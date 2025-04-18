import React, { useEffect, useState } from "react";
require("dotenv").config();
const BASE_URL = "http://localhost:4000";

const AdminContactRequests = () => {
  const [adminContactRequests, setAdminContactRequests] = useState([]);

  const fetchAdminContactRequests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/professorQueries`);
      if (!response.ok) {
        throw new Error("Failed to fetch admin contact requests");
      }
      const data = await response.json();
      setAdminContactRequests(data);
    } catch (error) {
      console.error("Error fetching admin contact requests:", error);
    }
  };

  useEffect(() => {
    fetchAdminContactRequests();
  }, []);

  const handleStatusRequest = async (requestId, status) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/professorQueries/${requestId}/${status}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to ${status} request`);
      }
      setAdminContactRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Check Professor Queries related to Feedback Form
      </h2>

      <div className="space-y-4">
        {adminContactRequests.map((request) => (
          <div
            key={request._id}
            className="border-b border-gray-200 pb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700 font-medium">
                Professor ID: {request.professorId}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(request.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Student ID:</span> {request.studentId}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Form Name:</span> {request.formName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Question:</span> {request.question}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Answer:</span> {request.answer}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Reason:</span> {request.reason}
              </p>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleStatusRequest(request._id, "accepted")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-150"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusRequest(request._id, "rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-150"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {adminContactRequests.length === 0 && (
          <p className="text-gray-500 text-center py-4">No queries found</p>
        )}
      </div>
    </div>
  );
};

export default AdminContactRequests;
