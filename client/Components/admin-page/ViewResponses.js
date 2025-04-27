import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaDownload, FaSync, FaEye, FaStar, FaComment } from 'react-icons/fa';
import './ViewResponses.css';

const ViewResponses = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    const fetchResponses = async (retry = 0) => {
        setLoading(true);
        setError(null);
        try {
            // Configure axios with proper settings
            const axiosConfig = {
                baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Adjust this to your API URL
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            const response = await axios.get('/api/getAllResponses', axiosConfig);

            if (response.data && Array.isArray(response.data)) {
                setResponses(response.data);
                setLoading(false);
                setRetryCount(0); // Reset retry count on success
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching responses:', err);

            // Handle different types of errors
            if (err.code === 'ECONNABORTED') {
                setError('Request timed out. Please try again.');
            } else if (err.response) {
                // Server responded with error status
                setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
            } else if (err.request) {
                // Request made but no response received
                if (retry < MAX_RETRIES) {
                    // Implement exponential backoff
                    const backoffDelay = Math.min(1000 * Math.pow(2, retry), 8000);
                    setTimeout(() => {
                        fetchResponses(retry + 1);
                    }, backoffDelay);
                    setRetryCount(retry + 1);
                    setError(`Attempt ${retry + 1}/${MAX_RETRIES}: Retrying...`);
                    return;
                }
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, []);

    const handleRetry = () => {
        setRetryCount(0);
        fetchResponses();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilter = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleExport = () => {
        // Add export functionality here
        console.log('Exporting data...');
    };

    const handleViewFeedback = (response) => {
        setSelectedResponse(response);
        setShowFeedbackModal(true);
    };

    const handleCloseFeedback = () => {
        setSelectedResponse(null);
        setShowFeedbackModal(false);
    };

    const FeedbackModal = ({ response, onClose }) => {
        if (!response) return null;

        return (
            <div className="modal-overlay">
                <div className="feedback-modal">
                    <div className="modal-header">
                        <h3>Feedback Details</h3>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-content">
                        <div className="student-info">
                            <h4>Student Information</h4>
                            <p><strong>Name:</strong> {response.studentName}</p>
                            <p><strong>Subject:</strong> {response.subject}</p>
                            <p><strong>Submission Date:</strong> {new Date(response.submissionDate).toLocaleDateString()}</p>
                        </div>

                        <div className="feedback-section">
                            <h4>Feedback Summary</h4>
                            <div className="rating-section">
                                <div className="rating-item">
                                    <FaStar className="star-icon" />
                                    <span>Overall Rating: {response.score || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="comments-section">
                                <h4>Professor's Comments</h4>
                                <div className="comment-box">
                                    <FaComment className="comment-icon" />
                                    <p>{response.professorFeedback || 'No comments provided'}</p>
                                </div>
                            </div>

                            <div className="questions-section">
                                <h4>Question Responses</h4>
                                {response.answers && response.answers.map((answer, index) => (
                                    <div key={index} className="question-item">
                                        <p className="question-text">Q{index + 1}: {answer.question}</p>
                                        <p className="answer-text">A: {answer.answer}</p>
                                        <p className="rating-text">Rating: {answer.rating}/5</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const filteredResponses = responses.filter(response => {
        const matchesSearch = response.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            response.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || response.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="responses-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>{retryCount > 0 ? `Retry attempt ${retryCount}/${MAX_RETRIES}...` : 'Loading responses...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="responses-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={handleRetry} className="retry-button">
                        <FaSync /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="responses-container">
            <div className="responses-header">
                <h2>Student Responses</h2>
                <div className="header-actions">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by student or subject..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter className="filter-icon" />
                        <select value={filterStatus} onChange={handleFilter}>
                            <option value="all">All Status</option>
                            <option value="submitted">Submitted</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                        </select>
                    </div>
                    <button className="export-button" onClick={handleExport}>
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            {filteredResponses.length === 0 ? (
                <div className="no-responses">
                    <p>No responses found</p>
                </div>
            ) : (
                <div className="responses-table-wrapper">
                    <table className="responses-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Subject</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResponses.map((response, index) => (
                                <tr key={index}>
                                    <td>{response.studentName}</td>
                                    <td>{response.subject}</td>
                                    <td>{new Date(response.submissionDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${response.status}`}>
                                            {response.status}
                                        </span>
                                    </td>
                                    <td>{response.score || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="view-button"
                                            onClick={() => handleViewFeedback(response)}
                                        >
                                            <FaEye /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showFeedbackModal && (
                <FeedbackModal
                    response={selectedResponse}
                    onClose={handleCloseFeedback}
                />
            )}
        </div>
    );
};

export default ViewResponses; 