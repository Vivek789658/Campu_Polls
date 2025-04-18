import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FeedbackFormBody from "./FeedbackFormBody";

const BASE_URL = "http://localhost:4000/api/v1";

const GiveFeedback = () => {
  const { formName } = useParams();
  const navigate = useNavigate();
  const [feedbackForm, setFeedbackForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userDataString = localStorage.getItem("userData");
  const { _id, section } = userDataString ? JSON.parse(userDataString) : {};

  useEffect(() => {
    const fetchFeedbackForm = async () => {
      try {
        console.log("Fetching feedback form:", formName);
        const response = await fetch(`${BASE_URL}/getFeedbackForm/${formName}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch feedback form");
        }
        const data = await response.json();
        console.log("Received feedback form data:", data);
        setFeedbackForm(data.feedbackForm);
      } catch (error) {
        console.error("Error fetching feedback form:", error);
        setError(error.message || "Failed to load feedback form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackForm();
  }, [formName]);

  const handleSubmit = async (answers) => {
    try {
      const response = await fetch(`${BASE_URL}/submitFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formName,
          studentId: _id,
          section,
          answers,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit feedback");
      }

      navigate("/student");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError(error.message || "Failed to submit feedback. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => navigate("/student")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!feedbackForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold">Feedback form not found</p>
          <p className="text-sm mt-2">Form name: {formName}</p>
          <button
            onClick={() => navigate("/student")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {feedbackForm.name}
        </h1>
        <div className="mb-6">
          <p className="text-gray-600">
            Start Time: {new Date(feedbackForm.startTime).toLocaleString()}
          </p>
          <p className="text-gray-600">
            Deadline: {new Date(feedbackForm.deadline).toLocaleString()}
          </p>
        </div>
        <FeedbackFormBody
          questions={feedbackForm.questions}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default GiveFeedback;
