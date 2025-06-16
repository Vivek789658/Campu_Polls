import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = "https://campu-polls.onrender.com/api/v1";

// Simple SVG icons to replace react-icons
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
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const FeedbackForm = () => {
    const { formName } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        fetchFormDetails();
    }, [formName]);

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

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const fetchFormDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate form name
            if (!formName) {
                throw new Error('Invalid form name');
            }

            const response = await fetch(`${BASE_URL}/getFeedbackForm/${formName}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch form details');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch form details');
            }

            // Validate form data
            if (!data.feedbackForm || !Array.isArray(data.feedbackForm.questions) || data.feedbackForm.questions.length === 0) {
                throw new Error('Invalid form data received from server');
            }

            // Update form data with consistent property names
            const formWithConsistentProps = {
                ...data.feedbackForm,
                questions: data.feedbackForm.questions.map(q => ({
                    ...q,
                    text: q.text || q.description // Ensure we have a text property, falling back to description
                }))
            };

            setForm(formWithConsistentProps);

            // Initialize responses object with empty values for each question
            const initialResponses = {};
            data.feedbackForm.questions.forEach((q, index) => {
                // Set default values based on question type
                if (q.type === 'yesNo') {
                    initialResponses[index] = ''; // Empty for required validation
                } else if (q.type === 'rating') {
                    initialResponses[index] = ''; // Empty for required validation
                } else if (q.type === 'multiple') {
                    initialResponses[index] = ''; // Empty for required validation
                } else {
                    initialResponses[index] = ''; // Default empty for text
                }
            });

            setResponses(initialResponses);
        } catch (error) {
            console.error('Error fetching form:', error);
            setError(error.message || 'Failed to load form details');
        } finally {
            setLoading(false);
        }
    };

    const handleResponseChange = (questionIndex, value) => {
        setResponses(prev => ({
            ...prev,
            [questionIndex]: value
        }));
        // Clear any error message when user starts answering
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Check for user data
            const userDataString = localStorage.getItem('userData');
            if (!userDataString) {
                throw new Error('User data not found. Please login again.');
            }

            const userData = JSON.parse(userDataString);
            if (!userData._id) {
                throw new Error('Invalid user data. Please login again.');
            }

            // Validate that all questions have been answered
            const unansweredQuestions = form.questions.filter((_, index) =>
                responses[index] === undefined ||
                responses[index] === null ||
                responses[index] === ''
            );

            if (unansweredQuestions.length > 0) {
                setError('Please answer all questions before submitting.');
                setSubmitting(false);
                return;
            }

            // Convert responses to array format expected by backend
            // The backend expects an array of strings, not objects with answer property
            const answers = form.questions.map((_, index) => responses[index].toString());

            // Log submission payload for debugging
            console.log('Submitting feedback with payload:', {
                formName,
                studentId: userData._id,
                answers
            });

            const response = await fetch(`${BASE_URL}/submitFeedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formName,
                    studentId: userData._id,
                    answers
                }),
            });

            // Parse response as JSON
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('Error parsing response:', jsonError);
                throw new Error('Invalid server response. Please try again.');
            }

            // Check if response was not successful
            if (!response.ok) {
                const errorMessage = data && data.message ? data.message : 'Failed to submit feedback';
                console.error('Server responded with error:', errorMessage, data);
                throw new Error(errorMessage);
            }

            console.log('Submission successful:', data);
            setSuccessMessage('Feedback submitted successfully! Redirecting to dashboard...');

            // Show success message for 2 seconds before redirecting
            setTimeout(() => {
                navigate('/student/analytics');
            }, 2000);
        } catch (error) {
            // Safe error handling
            let errorMessage = 'Failed to submit feedback. Please try again.';

            if (error && typeof error === 'object') {
                if (error.message) {
                    errorMessage = error.message;
                } else if (error.toString) {
                    try {
                        errorMessage = error.toString();
                    } catch (e) {
                        console.error('Error converting error to string:', e);
                    }
                }
            }

            console.error('Error submitting feedback:', errorMessage);
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Add the renderQuestionContent function to make questions responsive
    const renderQuestionContent = (question, index) => {
        switch (question.type) {
            case 'text':
                return (
                    <textarea
                        value={responses[index] || ''}
                        onChange={(e) => handleResponseChange(index, e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg shadow-sm ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-700 focus:border-blue-500'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        rows="3"
                        placeholder="Type your answer here..."
                        required
                    />
                );

            case 'rating':
                return (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleResponseChange(index, rating)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md ${responses[index] === rating
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                    } flex items-center justify-center text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                );

            case 'yesNo':
                return (
                    <div className="flex flex-wrap gap-3">
                        {['Yes', 'No'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleResponseChange(index, option)}
                                className={`px-4 sm:px-5 py-2 rounded-md ${responses[index] === option
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                    } text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );

            case 'multiple':
                return (
                    <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                            <button
                                key={optionIndex}
                                type="button"
                                onClick={() => handleResponseChange(index, option)}
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left rounded-md ${responses[index] === option
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : darkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                    } text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md max-w-md w-full`}>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/student')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Form not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Back navigation and info bar */}
            <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3 md:py-4">
                        <button
                            onClick={() => navigate('/student')}
                            className={`flex items-center space-x-1 text-sm sm:text-base font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </button>

                        <div className="flex items-center">
                            {form && form.deadline && (
                                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-3 sm:mr-4`}>
                                    <span className="hidden sm:inline">Deadline:</span> {new Date(form.deadline).toLocaleDateString()}
                                </div>
                            )}

                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {darkMode ? <SunIcon /> : <MoonIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form header with gradient background */}
            {form && !loading && !error && (
                <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{form.title}</h1>
                            {form.description && (
                                <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">{form.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
                {loading ? (
                    <div className={`flex justify-center items-center py-16 sm:py-24 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-t-2 border-blue-500 mr-3"></div>
                        <p>Loading form...</p>
                    </div>
                ) : error ? (
                    <div className={`rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 ${darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`${darkMode ? 'text-red-400' : 'text-red-600'} text-center`}>{error}</p>
                    </div>
                ) : successMessage ? (
                    <div className={`rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 ${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                        <p className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-center`}>{successMessage}</p>
                    </div>
                ) : form ? (
                    <div className={`rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
                            {form.questions.map((question, index) => (
                                <div
                                    key={index}
                                    className={`mb-6 sm:mb-8 pb-6 sm:pb-8 ${index < form.questions.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                                >
                                    <div className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
                                        {index + 1}. {question.text}
                                    </div>

                                    {/* Question content based on type */}
                                    {renderQuestionContent(question, index)}
                                </div>
                            ))}

                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-white ${submitting
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : darkMode
                                            ? 'bg-blue-600 hover:bg-blue-500'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        } transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FeedbackForm; 
