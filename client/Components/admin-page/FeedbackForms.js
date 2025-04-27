import React, { useState, useEffect } from 'react';
import { FaRegClock, FaRegQuestionCircle, FaExternalLinkAlt, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaStar, FaChartBar, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import './FeedbackForms.css';

const FeedbackForms = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [showDetailedResponse, setShowDetailedResponse] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchFeedbackForms();
    }, []);

    const fetchFeedbackForms = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/feedback-forms');
            const data = await response.json();
            setForms(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch feedback forms');
            console.error('Error fetching forms:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewResponses = (form) => {
        setSelectedForm(form);
        setShowResponseModal(true);
    };

    const handleExportResponses = (responses) => {
        const csvContent = responses.map(response => {
            return {
                'Student Name': response.studentName,
                'Subject': response.subject,
                'Submission Date': new Date(response.submissionDate).toLocaleDateString(),
                'Status': response.status,
                'Average Rating': calculateAverageRating(response.answers),
                ...response.answers.reduce((acc, ans, idx) => {
                    acc[`Question ${idx + 1}`] = ans.answer;
                    if (ans.rating) acc[`Rating ${idx + 1}`] = ans.rating;
                    return acc;
                }, {})
            };
        });

        const csvString = [
            Object.keys(csvContent[0]),
            ...csvContent.map(item => Object.values(item))
        ].map(e => e.join(",")).join("\\n");

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `feedback_responses_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateAverageRating = (answers) => {
        const ratings = answers.filter(a => a.rating !== null).map(a => a.rating);
        return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
    };

    const handleDeleteForm = async (formId) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            try {
                await fetch(`/api/feedback-forms/${formId}`, {
                    method: 'DELETE'
                });
                fetchFeedbackForms(); // Refresh the list
            } catch (err) {
                console.error('Error deleting form:', err);
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'expired':
                return <span className="status-badge expired">Expired</span>;
            case 'urgent':
                return <span className="status-badge urgent">Urgent</span>;
            default:
                return <span className="status-badge active">Active</span>;
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const handleCheckResponse = (response) => {
        setSelectedResponse(response);
        setShowDetailedResponse(true);
    };

    const DetailedResponseView = ({ response, onClose }) => {
        const getAverageRating = () => {
            const ratings = response.answers.filter(a => a.rating !== null).map(a => a.rating);
            return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
        };

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content detailed-response" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="response-header-content">
                            <h2>Feedback Response Details</h2>
                            <div className="response-meta">
                                <span className="student-name">{response.studentName}</span>
                                <span className="submission-date">
                                    Submitted: {new Date(response.submissionDate).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="response-summary">
                            <div className="summary-card">
                                <FaStar className="summary-icon" />
                                <div className="summary-content">
                                    <span className="summary-label">Average Rating</span>
                                    <span className="summary-value">{getAverageRating()}</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <FaChartBar className="summary-icon" />
                                <div className="summary-content">
                                    <span className="summary-label">Questions Answered</span>
                                    <span className="summary-value">{response.answers.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="answers-section">
                            <h3>Responses</h3>
                            {response.answers.map((answer, index) => (
                                <div key={index} className="answer-item">
                                    <div className="question-text">{answer.question}</div>
                                    <div className="answer-content">
                                        <div className="answer-text">{answer.answer}</div>
                                        {answer.rating !== null && (
                                            <div className="rating-display">
                                                <span className="rating-label">Rating:</span>
                                                <div className="stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={i < answer.rating ? 'star filled' : 'star'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ResponseModal = ({ form, onClose }) => {
        const [responses, setResponses] = useState([]);
        const [loadingResponses, setLoadingResponses] = useState(true);
        const [filteredResponses, setFilteredResponses] = useState([]);

        useEffect(() => {
            const fetchResponses = async () => {
                try {
                    const response = await fetch(`/api/feedback-forms/${form.id}/responses`);
                    const data = await response.json();
                    setResponses(data);
                    setFilteredResponses(data);
                } catch (err) {
                    console.error('Error fetching responses:', err);
                } finally {
                    setLoadingResponses(false);
                }
            };
            fetchResponses();
        }, [form.id]);

        useEffect(() => {
            const filtered = responses.filter(response => {
                const matchesSearch = response.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    response.subject.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'all' || response.status.toLowerCase() === statusFilter.toLowerCase();
                return matchesSearch && matchesStatus;
            });
            setFilteredResponses(filtered);
        }, [responses, searchTerm, statusFilter]);

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Responses - {form.title}</h2>
                        <div className="modal-actions">
                            <button className="export-button" onClick={() => handleExportResponses(responses)}>
                                <FaDownload /> Export
                            </button>
                            <button className="close-button" onClick={onClose}>&times;</button>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="responses-filters">
                            <div className="search-box">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Search by student name or subject..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="filter-box">
                                <FaFilter />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        {loadingResponses ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading responses...</p>
                            </div>
                        ) : responses.length === 0 ? (
                            <div className="no-responses">
                                <p>No responses yet</p>
                            </div>
                        ) : (
                            <>
                                <div className="responses-summary">
                                    <div className="summary-card">
                                        <span className="summary-title">Total Responses</span>
                                        <span className="summary-value">{responses.length}</span>
                                    </div>
                                    <div className="summary-card">
                                        <span className="summary-title">Average Rating</span>
                                        <span className="summary-value">
                                            {(responses.reduce((acc, r) => acc + parseFloat(calculateAverageRating(r.answers) || 0), 0) / responses.length).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="summary-card">
                                        <span className="summary-title">Reviewed</span>
                                        <span className="summary-value">
                                            {responses.filter(r => r.status === 'reviewed').length}
                                        </span>
                                    </div>
                                </div>

                                <div className="responses-table-container">
                                    <table className="responses-table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Subject</th>
                                                <th>Submission Date</th>
                                                <th>Status</th>
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
                                                    <td className="action-buttons">
                                                        <button
                                                            className="action-icon view"
                                                            onClick={() => handleCheckResponse(response)}
                                                            title="View Details"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            className="action-icon check"
                                                            onClick={() => handleCheckResponse(response)}
                                                            title="Check Response"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="feedback-forms-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading feedback forms...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feedback-forms-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchFeedbackForms} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-forms-container">
            <div className="forms-header">
                <div className="header-content">
                    <h1>Manage Feedback Forms</h1>
                    <p>View and manage feedback forms and responses for your courses.</p>
                </div>
            </div>

            <div className="forms-grid">
                {forms.map((form, index) => (
                    <div key={index} className="form-card">
                        <div className="form-header">
                            <h2>{form.title}</h2>
                            {getStatusBadge(form.status)}
                        </div>

                        <div className="form-section">
                            <FaRegClock className="icon" />
                            <div className="section-content">
                                <div className="time-info">
                                    <div>
                                        <span className="label">Start Time</span>
                                        <span className="value">{formatDateTime(form.startTime)}</span>
                                    </div>
                                    <div>
                                        <span className="label">Deadline</span>
                                        <span className="value deadline">{formatDateTime(form.deadline)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <FaRegQuestionCircle className="icon" />
                            <div className="section-content">
                                <span>{form.questionCount} questions to answer</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                className="action-button view-responses"
                                onClick={() => handleViewResponses(form)}
                            >
                                View Responses <FaEye />
                            </button>
                            <button
                                className="action-button check-responses"
                                onClick={() => handleViewResponses(form)}
                            >
                                Check Responses <FaCheck />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showResponseModal && selectedForm && (
                <ResponseModal
                    form={selectedForm}
                    onClose={() => {
                        setShowResponseModal(false);
                        setSelectedForm(null);
                    }}
                />
            )}

            {showDetailedResponse && selectedResponse && (
                <DetailedResponseView
                    response={selectedResponse}
                    onClose={() => {
                        setShowDetailedResponse(false);
                        setSelectedResponse(null);
                    }}
                />
            )}
        </div>
    );
};

export default FeedbackForms; 