import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

const BASE_URL = "http://localhost:4000/api/v1";

const FormDetailsPage = () => {
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { formName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFormDetails();
    }, [formName]);

    const fetchFormDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/getFeedbackForm/${formName}`);

            if (!response.ok) {
                throw new Error("Failed to fetch form details");
            }

            const data = await response.json();
            setFormDetails(data.form);
        } catch (error) {
            console.error("Error fetching form details:", error);
            setError("Failed to load form details");
        } finally {
            setLoading(false);
        }
    };

    const handleStartFeedback = () => {
        navigate(`/give-feedback/${formName}`);
    };

    const renderFormBasicInfo = () => {
        const [subjectCode, section] = formName.split('_');
        const userDataString = localStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        const currentNotification = notifications.find(n => n.formName === formName);

        const formatDate = (dateString) => {
            if (!dateString) return "Not specified";
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date)
                ? date.toLocaleString()
                : "Not specified";
        };

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Feedback Form Details
                </h1>
                <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Form Name</h2>
                            <p className="text-gray-600">
                                {formName}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Subject Code</h2>
                            <p className="text-gray-600">
                                {subjectCode}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Section</h2>
                            <p className="text-gray-600">
                                {section}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Start Time</h2>
                            <p className="text-gray-600">
                                {formatDate(currentNotification?.startTime)}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Deadline</h2>
                            <p className="text-gray-600">
                                {formatDate(currentNotification?.deadline)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="flex md:p-3 bg-cyan-50 p-1">
                    <SideBar />
                    <div className="w-5/6 h-[calc(100vh-15vh)] overflow-y-auto p-6">
                        {renderFormBasicInfo()}
                        <div className="flex items-center justify-center mt-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !formDetails) {
        return (
            <div>
                <Header />
                <div className="flex md:p-3 bg-cyan-50 p-1">
                    <SideBar />
                    <div className="w-5/6 h-[calc(100vh-15vh)] overflow-y-auto p-6">
                        {renderFormBasicInfo()}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                            <div className="text-red-500 text-xl text-center">
                                {error || "Form details not found. Please try again later."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isFormOpen = () => {
        const now = new Date();
        const startTime = new Date(formDetails.startTime);
        const deadline = new Date(formDetails.deadline);
        return now >= startTime && now <= deadline;
    };

    return (
        <div>
            <Header />
            <div className="flex md:p-3 bg-cyan-50 p-1">
                <SideBar />
                <div className="w-5/6 h-[calc(100vh-15vh)] overflow-y-auto p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {formDetails.name}
                        </h1>

                        <div className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Start Time</h2>
                                    <p className="text-gray-600">
                                        {new Date(formDetails.startTime).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Deadline</h2>
                                    <p className="text-gray-600">
                                        {new Date(formDetails.deadline).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions Overview</h2>
                            <div className="space-y-4">
                                {formDetails.questions.map((question, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-800 font-medium">
                                            {index + 1}. {question.description}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Type: {question.type}
                                        </p>
                                        {question.type === "multiple" && question.options && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600">Options:</p>
                                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                                    {question.options.map((option, optIndex) => (
                                                        <li key={optIndex}>{option}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleStartFeedback}
                                disabled={!isFormOpen()}
                                className={`px-6 py-3 rounded-md text-white font-semibold flex items-center ${isFormOpen()
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isFormOpen() ? 'Start Feedback' : 'Form Not Open'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormDetailsPage; 