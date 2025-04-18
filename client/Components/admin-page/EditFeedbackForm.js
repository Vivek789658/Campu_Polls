import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaExclamationTriangle, FaInfoCircle, FaQuestionCircle, FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from '../../config';

const EditFeedbackForm = () => {
    const { formName } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        fetchFormDetails();
    }, [formName]);

    const fetchFormDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/getFeedbackForm/${formName}`);
            if (!response.ok) {
                throw new Error("Failed to fetch form details");
            }
            const data = await response.json();
            const form = data.feedbackForm;

            setName(form.name);
            setQuestions(form.questions);
            setStartTime(new Date(form.startTime).toISOString().slice(0, 16));
            setDeadline(new Date(form.deadline).toISOString().slice(0, 16));
        } catch (error) {
            console.error("Error fetching form details:", error);
            setError("Failed to load form details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!startTime) {
            setError("Start time is required");
            return false;
        }
        if (!deadline) {
            setError("Deadline is required");
            return false;
        }
        if (new Date(startTime) >= new Date(deadline)) {
            setError("Start time must be before deadline");
            return false;
        }
        if (questions.length === 0) {
            setError("At least one question is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Format dates properly
            const formattedStartTime = new Date(startTime).toISOString();
            const formattedDeadline = new Date(deadline).toISOString();

            console.log("Submitting form update with data:", {
                name,
                questions,
                startTime: formattedStartTime,
                deadline: formattedDeadline
            });

            const response = await fetch(`${API_BASE_URL}/updateFeedbackForm/${formName}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    questions,
                    startTime: formattedStartTime,
                    deadline: formattedDeadline
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update feedback form");
            }

            setSuccessMessage("Feedback form updated successfully!");
            setTimeout(() => {
                navigate("/admin/manageFeedbackForms");
            }, 1500);
        } catch (error) {
            console.error("Error updating feedback form:", error);
            setError(error.message || "Failed to update feedback form");
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionUpdate = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setQuestions(updatedQuestions);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => {
                    navigate('/admin');
                    setTimeout(() => {
                        localStorage.setItem('activeAdminTab', 'manageFeedbackForms');
                        window.location.reload();
                    }, 100);
                }}
                className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
                <FaArrowLeft className="mr-2" />
                Back to Manage Forms
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">Edit Feedback Form</h1>
                    <p className="text-blue-100 mt-1">Update your feedback form details</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-6">
                        <div className="flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-6">
                        <div className="flex items-center">
                            <FaSave className="mr-2" />
                            <p>{successMessage}</p>
                        </div>
                    </div>
                )}

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Form Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    disabled
                                />
                                <p className="mt-1 text-sm text-gray-500">Form name cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                <input
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                            {questions.map((question, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <input
                                            type="text"
                                            value={question.description}
                                            onChange={(e) => handleQuestionUpdate(index, "description", e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteQuestion(index)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <select
                                        value={question.type}
                                        onChange={(e) => handleQuestionUpdate(index, "type", e.target.value)}
                                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="text">Text</option>
                                        <option value="yesNo">Yes/No</option>
                                        <option value="rating">Rating</option>
                                        <option value="multiple">Multiple Choice</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditFeedbackForm; 