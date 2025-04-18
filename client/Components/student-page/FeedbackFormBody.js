import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
require("dotenv").config();
const BASE_URL = "http://localhost:4000";

const FeedbackFormBody = ({ feedbackFormData, onSubmit }) => {
  const [formObject, setFormObject] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setFormObject(feedbackFormData?.feedbackForm);
    setStartTime(feedbackFormData?.feedbackForm?.startTime);
    setDeadline(feedbackFormData?.feedbackForm?.deadline);

    const checkSubmissionStatus = async () => {
      const userDataString = localStorage.getItem("userData");
      const { _id } = userDataString ? JSON.parse(userDataString) : null;

      if (_id && feedbackFormData?.feedbackForm?.name) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/v1/checkSubmissionStatus?studentId=${_id}&formId=${feedbackFormData.feedbackForm.name}`
          );
          if (!response.ok) {
            throw new Error("Failed to check submission status");
          }
          const result = await response.json();
          setIsSubmitted(result.isSubmitted);
        } catch (error) {
          console.error("Error checking submission status:", error);
          setErrorMessage("Failed to check submission status");
        }
      }
    };

    checkSubmissionStatus();
  }, [feedbackFormData]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
    setErrorMessage(""); // Clear any previous error messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate all questions are answered
    const unansweredQuestions = Object.values(answers).some(answer => !answer.trim());
    if (unansweredQuestions) {
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(Object.values(answers));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage(error.message || "Failed to submit feedback. Please try again later.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilStart = () => {
    const now = new Date();
    const start = new Date(startTime);
    const timeDiff = start - now;

    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-green-100 w-11/12">
          <h2 className="text-5xl font-semibold text-green-500 mb-2 text-center">
            Feedback Submitted
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            You have already submitted this feedback form. Thank you!
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  if (startTime && currentDate < new Date(startTime)) {
    const timeUntilStart = getTimeUntilStart();
    return (
      <div className="flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-yellow-100 w-11/12">
          <h2 className="text-5xl font-semibold text-yellow-500 mb-2 text-center">
            Form Not Available Yet
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            This form will be available in:
          </p>
          <p className="text-xl text-gray-700 mb-4">
            {timeUntilStart.days} days, {timeUntilStart.hours} hours,{" "}
            {timeUntilStart.minutes} minutes, and {timeUntilStart.seconds}{" "}
            seconds
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (deadline && currentDate > new Date(deadline)) {
    return (
      <div className="flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-red-100 w-11/12">
          <h2 className="text-5xl font-semibold text-red-500 mb-2 text-center">
            Deadline Passed
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            Sorry, this form is no longer accepting responses.
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!formObject) {
    return (
      <div className="flex items-center justify-center w-5/6">
        <div className="flex flex-col items-center mt-10 border p-10 rounded-md bg-blue-100 w-11/12">
          <h2 className="text-5xl font-semibold text-blue-500 mb-2 text-center">
            Form Not Found
          </h2>
          <p className="text-2xl text-gray-700 mb-4 text-center">
            Sorry, this feedback form does not exist or has not been created yet.
          </p>
          <button
            onClick={() => navigate("/student")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-2 w-5/6 md:w-5/6 h-[calc(100vh-15vh)] overflow-y-auto bg-cyan-50">
      <h3 className="px-5 py-2 text-xl md:text-2xl rounded-md bg-purple-400 font-bold text-white">
        Feedback Form
      </h3>

      {successMessage && (
        <div className="bg-green-200 text-green-800 p-4 rounded mt-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-200 text-red-800 p-4 rounded mt-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {errorMessage}
          </div>
        )}

        {formObject.questions.map((question, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-gray-700 text-lg font-semibold mb-3">
              Question {index + 1}: {question.description}
            </label>
            {question.type === "text" && (
              <textarea
                className="w-full px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                rows="4"
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Write your answer here..."
                required
              />
            )}
            {question.type === "yesNo" && (
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="Yes"
                    checked={answers[index] === "Yes"}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="form-radio h-5 w-5 text-blue-600"
                    required
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="No"
                    checked={answers[index] === "No"}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="form-radio h-5 w-5 text-blue-600"
                    required
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            )}
            {question.type === "rating" && (
              <div className="space-x-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={rating}
                      checked={answers[index] === rating.toString()}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                      required
                    />
                    <span className="ml-2 text-gray-700">{rating}</span>
                  </label>
                ))}
              </div>
            )}
            {question.type === "multiple" && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="block">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                      required
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackFormBody;
