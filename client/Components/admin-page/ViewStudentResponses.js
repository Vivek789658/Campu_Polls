import React, { useState, useEffect } from 'react';
import './ViewStudentResponses.css';
import { FaSearch, FaDownload, FaUserGraduate, FaStar, FaChartBar, FaCalendarAlt, FaEye, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// Update BASE_URL based on environment
const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://pr-01.onrender.com/api/v1'
    : 'http://localhost:4000/api/v1';

// Update the checkServerStatus function to be more robust
const checkServerStatus = async () => {
    try {
        // Try multiple endpoints to ensure server is truly accessible
        const healthCheck = await fetch(`${BASE_URL}/health-check`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
            timeout: 5000 // 5 second timeout
        });

        if (!healthCheck.ok) {
            // If health check fails, try the root endpoint
            const rootCheck = await fetch(`${BASE_URL}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
                timeout: 5000
            });
            return rootCheck.ok;
        }
        return true;
    } catch (error) {
        console.error('Server check failed:', error);
        return false;
    }
};

// Response Modal Component
const ResponseModal = ({ response, onClose }) => {
    if (!response) return null;

    const getRatingColor = (rating) => {
        if (!rating) return '#666';
        const numRating = Number(rating);
        if (numRating >= 4) return '#4caf50';
        if (numRating >= 3) return '#ff9800';
        return '#f44336';
    };

    const getRatingLabel = (rating) => {
        const numRating = Number(rating);
        if (numRating >= 4) return 'Excellent';
        if (numRating >= 3) return 'Good';
        if (numRating >= 2) return 'Fair';
        if (numRating > 0) return 'Needs Improvement';
        return 'Not Rated';
    };

    return (
        <div className="modal-overlay">
            <div className="response-modal">
                <div className="modal-header">
                    <h2>Response Details</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-content">
                    <div className="response-section">
                        <h3>Student Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Name:</label>
                                <span>{response.studentName || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>ID:</label>
                                <span>{response.studentId || 'ID: N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Subject:</label>
                                <span>{response.subject || response.formName || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Submission Date:</label>
                                <span>{response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'Not recorded'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="response-section">
                        <h3>Feedback Details</h3>
                        <div className="rating-details">
                            <div className="rating-display">
                                <label>Overall Rating:</label>
                                <div className="rating-stars-large">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            style={{
                                                color: index < (response.rating || 0)
                                                    ? getRatingColor(response.rating)
                                                    : '#e0e0e0'
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="rating-number" style={{ color: getRatingColor(response.rating) }}>
                                    {response.rating ? `${response.rating}/5` : 'Not Rated'}
                                </span>
                            </div>
                            <div className="rating-label">
                                {getRatingLabel(response.rating)}
                            </div>
                        </div>
                        <div className="feedback-content-modal">
                            <label>Feedback Comments:</label>
                            {response.feedback ? (
                                <div className="feedback-text-container">
                                    <p className="feedback-text">{response.feedback}</p>
                                    {response.submittedAt && (
                                        <span className="feedback-timestamp">
                                            Submitted on {new Date(response.submittedAt).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="no-feedback">No feedback provided</p>
                            )}
                        </div>
                    </div>

                    {response.answers && response.answers.length > 0 && (
                        <div className="response-section">
                            <h3>Detailed Responses</h3>
                            <div className="answers-list">
                                {response.answers.map((answer, index) => (
                                    <div key={index} className="answer-item">
                                        <p className="question">Q{index + 1}: {answer.question}</p>
                                        <p className="answer">{answer.response}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ViewStudentResponses = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [stats, setStats] = useState({
        totalResponses: 0,
        averageRating: 0,
        recentSubmissions: 0,
        lastUpdateTime: new Date()
    });

    const fetchAllResponses = async () => {
        try {
            setLoading(true);
            setError(null);

            // Enhanced server status check with retry
            let serverAvailable = false;
            for (let i = 0; i < 3; i++) {
                serverAvailable = await checkServerStatus();
                if (serverAvailable) break;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            if (!serverAvailable) {
                throw new Error('Server is currently unavailable. Please check your connection and try again.');
            }

            const response = await fetch(`${BASE_URL}/getAllFeedbackResponses`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            // Process and validate the response data
            const processedResponses = data.map(response => ({
                ...response,
                rating: response.rating ? Number(response.rating) : null,
                feedback: response.feedback || null,
                answers: Array.isArray(response.answers) ? response.answers.map(answer => ({
                    question: answer.question || 'Question not available',
                    response: answer.response || 'Response not available'
                })) : [],
                studentName: response.studentName || 'Name not available',
                studentId: response.studentId || 'ID not available',
                subject: response.subject || response.formName || 'Subject not available',
                submittedAt: response.submittedAt || null
            }));

            setResponses(processedResponses);
            updateStats(processedResponses);
        } catch (error) {
            console.error('Error fetching responses:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (responseData) => {
        const totalResponses = responseData.length;
        let totalRating = 0;
        let ratingCount = 0;

        responseData.forEach(response => {
            if (response.rating) {
                totalRating += parseFloat(response.rating);
                ratingCount++;
            }
        });

        setStats({
            totalResponses,
            averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0",
            recentSubmissions: responseData.filter(r =>
                r.submittedAt && new Date(r.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            lastUpdateTime: new Date()
        });
    };

    const exportToExcel = () => {
        if (!responses.length) {
            alert("No data available to export!");
            return;
        }

        const exportData = responses.map(response => ({
            'Student Name': response.studentName || 'N/A',
            'Student ID': response.studentId || 'N/A',
            'Subject': response.subject || response.formName || 'N/A',
            'Submitted Date': response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'N/A',
            'Rating': response.rating || 'N/A',
            'Feedback': response.feedback || 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Feedback");
        XLSX.writeFile(workbook, "student_feedback_responses.xlsx");
    };

    const exportIndividualResponse = (response) => {
        if (!response) {
            alert("No data available to export!");
            return;
        }

        // Format answers if they exist
        let formattedAnswers = '';
        if (response.answers && response.answers.length > 0) {
            formattedAnswers = response.answers.map((answer, index) => {
                const questionText = answer.question || 'Question not available';
                const responseText = answer.response || 'Response not available';
                return `Q${index + 1}: ${questionText}\nA${index + 1}: ${responseText}`;
            }).join('\n\n');
        }

        const exportData = [{
            'Student Name': response.studentName || 'Not Available',
            'Student ID': response.studentId || 'Not Available',
            'Subject/Form': response.subject || response.formName || 'Not Available',
            'Submission Date': response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'Not Available',
            'Rating': response.rating ? `${response.rating}/5` : 'Not Rated',
            'Feedback': response.feedback || 'No Feedback',
            'Detailed Responses': formattedAnswers || 'No Detailed Responses Available'
        }];

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        // Adjust column widths
        const maxWidth = 50;
        worksheet['!cols'] = [
            { wch: 20 }, // Student Name
            { wch: 15 }, // Student ID
            { wch: 15 }, // Subject
            { wch: 20 }, // Date
            { wch: 10 }, // Rating
            { wch: 40 }, // Feedback
            { wch: maxWidth } // Detailed Responses
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Response");

        // Generate filename with student info and date
        const filename = `feedback_${response.studentId || 'unknown'}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, filename);
    };

    const handleViewResponse = (response) => {
        setSelectedResponse(response);
    };

    const filteredResponses = responses.filter(response => {
        const searchLower = searchTerm.toLowerCase();
        return searchTerm === '' ||
            (response.studentName && response.studentName.toLowerCase().includes(searchLower)) ||
            (response.studentId && response.studentId.toLowerCase().includes(searchLower)) ||
            (response.subject && response.subject.toLowerCase().includes(searchLower)) ||
            (response.formName && response.formName.toLowerCase().includes(searchLower));
    });

    // Enhanced retry mechanism with better error handling
    const handleRetry = async () => {
        const maxRetries = 3;
        const baseDelay = 2000; // Start with 2 seconds
        let retryCount = 0;

        const attemptFetch = async () => {
            try {
                await fetchAllResponses();
            } catch (error) {
                retryCount++;
                if (retryCount < maxRetries) {
                    const delay = baseDelay * Math.pow(2, retryCount - 1);
                    console.log(`Retry attempt ${retryCount} of ${maxRetries} after ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return attemptFetch();
                }
                throw error;
            }
        };

        try {
            setLoading(true);
            setError(null);
            await attemptFetch();
        } catch (error) {
            console.error('All retry attempts failed:', error);
            setError('Unable to connect to the server after multiple attempts. Please try again later or contact support if the problem persists.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllResponses();

        // Set up periodic refresh
        const intervalId = setInterval(fetchAllResponses, 300000); // 5 minutes

        // Cleanup
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading responses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <div className="error-icon">❌</div>
                <h3>Error Loading Responses</h3>
                <p>{error}</p>
                <button onClick={handleRetry} className="retry-button">
                    Try Again
                </button>
                <p className="error-help">
                    If the problem persists, please contact support.
                </p>
            </div>
        );
    }

    return (
        <div className="feedback-responses-container">
            <div className="dashboard-header">
                <h1>Student Feedback Responses</h1>
                <p>View and analyze feedback submitted by students</p>
            </div>

            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaUserGraduate />
                    </div>
                    <div className="stat-info">
                        <h3>Total Responses</h3>
                        <p>{stats.totalResponses}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaStar />
                    </div>
                    <div className="stat-info">
                        <h3>Average Rating</h3>
                        <p>{stats.averageRating}/5.0</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="stat-info">
                        <h3>Recent Submissions</h3>
                        <p>{stats.recentSubmissions} (last 7 days)</p>
                    </div>
                </div>
            </div>

            <div className="responses-header">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by student name, ID, or subject"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="export-btn" onClick={exportToExcel} disabled={!responses.length}>
                    <FaDownload /> Export to Excel
                </button>
            </div>

            {responses.length === 0 ? (
                <div className="no-responses">
                    <FaChartBar className="icon" />
                    <h3>No Responses Available</h3>
                    <p>There are currently no feedback responses in the system.</p>
                </div>
            ) : (
                <div className="responses-table-container">
                    <table className="responses-table">
                        <thead>
                            <tr>
                                <th>Student Details</th>
                                <th>Subject/Form</th>
                                <th>Submission Date</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResponses.map((response, index) => (
                                <tr key={response._id || index}>
                                    <td>
                                        <div className="student-info">
                                            <span className="student-name">
                                                {response.studentName || response.studentId || 'Student Info Not Available'}
                                            </span>
                                            <span className="student-id">
                                                {response.studentId && `ID: ${response.studentId}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="subject-cell">
                                        {response.subject || response.formName || 'Not Available'}
                                    </td>
                                    <td className="date-cell">
                                        {response.submittedAt
                                            ? new Date(response.submittedAt).toLocaleString()
                                            : 'Date Not Available'
                                        }
                                    </td>
                                    <td className="rating-display">
                                        <div className="rating-stars">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={index < (Number(response.rating) || 0) ? "star-filled" : "star-empty"}
                                                />
                                            ))}
                                            <span className="rating-number">
                                                {Number(response.rating) > 0 ? `${response.rating}/5` : 'Not rated'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="feedback-content">
                                            {response.feedback && response.feedback.trim() ? (
                                                <>
                                                    <p className="feedback-text">
                                                        {response.feedback.length > 100
                                                            ? `${response.feedback.substring(0, 100)}...`
                                                            : response.feedback}
                                                    </p>
                                                    {response.feedback.length > 100 && (
                                                        <span
                                                            className="read-more"
                                                            onClick={() => handleViewResponse(response)}
                                                        >
                                                            Read More
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="no-feedback">Feedback not provided</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            <button
                                                className="view-button"
                                                onClick={() => handleViewResponse(response)}
                                                title="View Details"
                                            >
                                                <FaEye /> View
                                            </button>
                                            <button
                                                className="export-single-button"
                                                onClick={() => exportIndividualResponse(response)}
                                                title="Export to Excel"
                                            >
                                                <FaDownload /> Export
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedResponse && (
                <ResponseModal
                    response={selectedResponse}
                    onClose={() => setSelectedResponse(null)}
                />
            )}

            <div className="responses-footer">
                <p>Showing {filteredResponses.length} of {responses.length} responses</p>
                <p className="last-updated">Last updated: {stats.lastUpdateTime.toLocaleTimeString()}</p>
            </div>
        </div>
    );
};

export default ViewStudentResponses; 