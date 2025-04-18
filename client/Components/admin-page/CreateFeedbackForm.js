import React, { useState } from "react";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaSave, FaClock, FaCalendarAlt, FaQuestionCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
require("dotenv").config();
const BASE_URL = "http://localhost:4000";

const CreateFeedbackForm = () => {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    description: "",
    type: "",
    options: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // "details" or "questions"

  const handleNameChange = (event) => {
    setName(event.target.value);
    setError(""); // Clear error when user types
  };

  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value);
    setError(""); // Clear error when user selects date
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    setError(""); // Clear error when user selects date
  };

  const handleInputChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const validateQuestion = () => {
    if (!newQuestion.description.trim()) {
      setError("Question description is required");
      return false;
    }
    if (!newQuestion.type) {
      setError("Question type is required");
      return false;
    }
    if (newQuestion.type === "multiple" && newQuestion.options.filter(opt => opt.trim()).length < 2) {
      setError("Multiple choice questions require at least 2 options");
      return false;
    }
    return true;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;

    const newQuestionWithId = {
      ...newQuestion,
      id: Math.random(),
      options: newQuestion.options.filter(opt => opt.trim()) // Remove empty options
    };
    setQuestions([...questions, newQuestionWithId]);
    setNewQuestion({ description: "", type: "", options: [] });
    setOpenModal(false);
    setError("");
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleMoveUp = (id) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index > 0) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index - 1]] = [newQuestions[index - 1], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const handleMoveDown = (id) => {
    const index = questions.findIndex((q) => q.id === id);
    if (index < questions.length - 1) {
      const newQuestions = [...questions];
      [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError("Form name is required");
      return false;
    }

    // Validate form name format (SUBJECTCODE_SECTION)
    const nameParts = name.trim().split('_');
    if (nameParts.length !== 2) {
      setError("Form name must follow the format: SUBJECTCODE_SECTION (e.g., CS101_A)");
      return false;
    }

    const [subjectCode, section] = nameParts;
    const subjectCodeRegex = /^[A-Z0-9]+$/;
    const sectionRegex = /^[A-Z0-9]+$/;

    if (!subjectCodeRegex.test(subjectCode) || !sectionRegex.test(section)) {
      setError("Subject code and section must contain only uppercase letters and numbers");
      return false;
    }

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

  const handleFormSubmit = async () => {
    try {
      if (!validateForm()) return;

      setLoading(true);
      setError("");

      // Ensure the form name is in the correct format (SUBJECTCODE_SECTION)
      const formattedName = name.trim().toUpperCase();
      const [extractedSubjectCode, extractedSection] = formattedName.split("_");

      console.log("Submitting form with data:", {
        name: formattedName,
        questions,
        deadline,
        startTime,
        subjectCode: extractedSubjectCode,
        section: extractedSection
      });

      const response = await fetch(`${BASE_URL}/api/v1/createFeedbackForm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formattedName,
          questions,
          deadline,
          startTime,
          subjectCode: extractedSubjectCode,
          section: extractedSection
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save feedback form");
      }

      setSuccessMessage("Feedback form created successfully!");

      // Reset form
      setName("");
      setQuestions([]);
      setNewQuestion({ description: "", type: "", options: [] });
      setStartTime("");
      setDeadline("");
      setOpenModal(false);
      setError("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (error) {
      console.error("Error saving feedback form:", error);
      setError(error.message || "Failed to save feedback form");
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = () => {
    switch (newQuestion.type) {
      case "text":
        return (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-700 text-sm flex items-center">
              <FaInfoCircle className="mr-2" />
              Text questions allow students to provide detailed written feedback
            </p>
          </div>
        );
      case "yesNo":
        return (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-700 text-sm flex items-center">
              <FaInfoCircle className="mr-2" />
              Yes/No questions are pre-defined with "Yes" and "No" options
            </p>
          </div>
        );
      case "rating":
        return (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-700 text-sm flex items-center">
              <FaInfoCircle className="mr-2" />
              Rating questions use a 1-5 scale (1 = Poor, 5 = Excellent)
            </p>
          </div>
        );
      case "multiple":
        return (
          <div className="mt-4 space-y-3">
            <p className="font-semibold text-gray-700">Multiple Choice Options:</p>
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 mr-2">
                  {index + 1}
                </span>
                <input
                  type="text"
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newQuestion.options[index] || ""}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case "text":
        return "📝";
      case "yesNo":
        return "✅";
      case "rating":
        return "⭐";
      case "multiple":
        return "🔘";
      default:
        return "❓";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Create Feedback Form</h1>
        <p className="text-blue-100 mt-1">Design a professional feedback form for your students</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "details"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setActiveTab("details")}
        >
          Form Details
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm ${activeTab === "questions"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setActiveTab("questions")}
        >
          Questions ({questions.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <FaSave className="mr-2" />
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

        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Form Name Input */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
                Form Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="SUBJECTCODE_SECTION"
                  className="w-full border-2 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <FaQuestionCircle />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <FaInfoCircle className="mr-1" />
                Format: SUBJECTCODE_SECTION (e.g., CS101_A)
              </p>
            </div>

            {/* Date Time Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label htmlFor="startTime" className="block text-lg font-semibold text-gray-700 mb-2">
                  Open Form On
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="w-full border-2 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <FaClock />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label htmlFor="deadline" className="block text-lg font-semibold text-gray-700 mb-2">
                  Close Form On
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="deadline"
                    name="deadline"
                    value={deadline}
                    onChange={handleDeadlineChange}
                    className="w-full border-2 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    <FaCalendarAlt />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab("questions")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md flex items-center"
              >
                Next: Add Questions
                <FaArrowDown className="ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Questions List */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Questions</h2>
                <button
                  onClick={() => setOpenModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-gray-500 mb-2">No questions added yet</p>
                  <p className="text-sm text-gray-400">Click "Add Question" to start building your feedback form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, idx) => (
                    <div
                      key={question.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-3 mt-1">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{question.description}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-2xl mr-2">{getQuestionTypeIcon(question.type)}</span>
                              <span className="text-sm text-gray-500 capitalize">{question.type}</span>
                            </div>
                            {question.type === "multiple" && question.options.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-2">
                                  {question.options.map((option, optIdx) => (
                                    <span key={optIdx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                      {option}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleMoveUp(question.id)}
                            disabled={idx === 0}
                            className={`p-1.5 rounded-md ${idx === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            title="Move Up"
                          >
                            <FaArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(question.id)}
                            disabled={idx === questions.length - 1}
                            className={`p-1.5 rounded-md ${idx === questions.length - 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            title="Move Down"
                          >
                            <FaArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100"
                            title="Delete Question"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveTab("details")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-md flex items-center"
              >
                <FaArrowUp className="mr-2" />
                Back to Details
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={loading}
                className={`${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                  } text-white font-medium py-2 px-6 rounded-md flex items-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Form...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Create Feedback Form
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Question Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Question</h2>
              <p className="text-gray-500 mt-1">Create a question for your feedback form</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  name="description"
                  value={newQuestion.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Enter your question here..."
                />
              </div>

              <div>
                <label htmlFor="type" className="block font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  name="type"
                  value={newQuestion.type}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="text">Text (Long Answer)</option>
                  <option value="yesNo">Yes/No</option>
                  <option value="rating">Rating (1-5)</option>
                  <option value="multiple">Multiple Choice</option>
                </select>
              </div>

              {renderOptions()}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFeedbackForm;
