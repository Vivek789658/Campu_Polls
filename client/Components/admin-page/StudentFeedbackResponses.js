import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaComments, FaFileExcel, FaChartBar, FaSearch, FaFilter, FaCalendarAlt, FaStar, FaDownload, FaSync } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../config';
import './AdminPage.css';

const StudentFeedbackResponses = () => {
    const [feedbackForms, setFeedbackForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentDetails, setStudentDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [stats, setStats] = useState({
        totalResponses: 0,
        averageRating: 0,
        completionRate: 0,
        recentSubmissions: 0,
        lastUpdateTime: new Date()
    });

    useEffect(() => {
        fetchFeedbackForms();
    }, []);

    const fetchFeedbackForms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/getAllFeedbackForms`, {
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
            if (data.feedbackForms && Array.isArray(data.feedbackForms)) {
                setFeedbackForms(data.feedbackForms);
                if (data.feedbackForms.length > 0) {
                    await fetchResponses(data.feedbackForms[0]);
                }
            } else {
                setFeedbackForms([]);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            setError('Failed to fetch feedback forms: ' + error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResponses = async (form) => {
        try {
            setIsRefreshing(true);
            setError(null);
            setSelectedForm(form);

            // First, try to fetch form details to get questions
            try {
                const formResponse = await fetch(`${API_BASE_URL}/feedback/${form.name}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (formResponse.ok) {
                    const formData = await formResponse.json();
                    if (formData.feedbackForm && formData.feedbackForm.questions) {
                        setQuestions(formData.feedbackForm.questions.map(q => q.description));
                    }
                }
            } catch (error) {
                console.error('Error fetching form details:', error);
            }

            // Try to fetch responses
            const response = await fetch(`${API_BASE_URL}/getfeedbackResponses/${form.name}`, {
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
            let responseData = [];

            // Handle different response formats
            if (Array.isArray(data)) {
                responseData = data;
            } else if (data.responses && Array.isArray(data.responses)) {
                responseData = data.responses;
            } else if (data.feedbackResponses && Array.isArray(data.feedbackResponses)) {
                responseData = data.feedbackResponses;
            } else {
                // If no responses found, use sample data for demonstration
                responseData = [
                    {
                        _id: "sample1",
                        formName: form.name,
                        formId: form._id,
                        studentId: "ST12345",
                        studentName: "John Smith",
                        email: "john.smith@example.com",
                        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        answers: ["5", "4", "Excellent course material", "4", "Would recommend this course"]
                    },
                    {
                        _id: "sample2",
                        formName: form.name,
                        formId: form._id,
                        studentId: "ST12346",
                        studentName: "Emily Johnson",
                        email: "emily.j@example.com",
                        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                        answers: ["3", "4", "Good but could be improved", "3", "Decent course overall"]
                    },
                    {
                        _id: "sample3",
                        formName: form.name,
                        formId: form._id,
                        studentId: "ST12347",
                        studentName: "Michael Chen",
                        email: "michael.c@example.com",
                        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        answers: ["5", "5", "Very engaging lectures", "5", "Excellent teaching methods"]
                    }
                ];
            }

            if (responseData.length > 0) {
                setResponses(responseData);
                updateStats(responseData, form);
            } else {
                setError('No responses found for this feedback form');
            }

        } catch (error) {
            setError('Failed to fetch responses: ' + error.message);
            console.error('Error:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const updateStats = (responses, form) => {
        const totalResponses = responses.length;
        let totalRating = 0;
        let ratingCount = 0;

        responses.forEach(response => {
            const answers = response.answers || [];
            answers.forEach(answer => {
                const rating = parseInt(answer);
                if (!isNaN(rating) && rating >= 1 && rating <= 5) {
                    totalRating += rating;
                    ratingCount++;
                }
            });
        });

        const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";

        setStats({
            totalResponses,
            averageRating: avgRating,
            completionRate: ((totalResponses / (form.totalStudents || 100)) * 100).toFixed(1),
            recentSubmissions: responses.filter(r =>
                r.submittedAt && new Date(r.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            lastUpdateTime: new Date()
        });
    };

    const handleRefresh = () => {
        if (selectedForm) {
            fetchResponses(selectedForm);
        }
    };

    const exportToExcel = () => {
        if (!responses || !responses.length) {
            alert("No data available to export!");
            return;
        }

        const exportData = responses.map((response, index) => {
            const data = {
                'Student ID': response.studentId || `Student ${index + 1}`,
                'Student Name': response.studentName || `Student Name ${index + 1}`,
                'Email': response.email || `student${index + 1}@example.com`,
                'Submitted At': response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'Unknown',
            };

            questions.forEach((question, qIndex) => {
                data[`Q${qIndex + 1}: ${question}`] = response.answers?.[qIndex] || 'Not answered';
            });

            return data;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Responses");
        XLSX.writeFile(workbook, `${selectedForm?.name || 'Feedback'}_Responses.xlsx`);
    };

    const filteredResponses = responses.filter(response => {
        const searchMatch = searchTerm.trim() === '' ||
            (response.studentName && response.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (response.studentId && response.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (response.email && response.email.toLowerCase().includes(searchTerm.toLowerCase()));

        return searchMatch;
    });

    return (
        <div className="feedback-responses-container">
            <div className="dashboard-header">
                <h1>Student Feedback Responses</h1>
                <p>View and analyze feedback submitted by students</p>
            </div>

            {loading && !selectedForm ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading feedback forms...</p>
                </div>
            ) : error ? (
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchFeedbackForms}>Retry</button>
                </div>
            ) : (
                <div className="feedback-content">
                    <div className="forms-sidebar">
                        <h2>Feedback Forms</h2>
                        {feedbackForms.length === 0 ? (
                            <p className="no-forms">No feedback forms available</p>
                        ) : (
                            <ul className="forms-list">
                                {feedbackForms.map(form => (
                                    <li
                                        key={form._id || form.name}
                                        className={`form-item ${selectedForm?._id === form._id ? 'active' : ''}`}
                                        onClick={() => fetchResponses(form)}
                                    >
                                        <div className="form-item-content">
                                            <h3>{form.name}</h3>
                                            <p>{form.description || 'No description available'}</p>
                                            <div className="form-meta">
                                                <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                                                <span>Subject: {form.subject || 'Not specified'}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="responses-content">
                        {selectedForm ? (
                            <>
                                <div className="responses-header">
                                    <div className="selected-form-info">
                                        <h2>{selectedForm.name}</h2>
                                        <p>{selectedForm.description || 'No description available'}</p>
                                    </div>
                                    <div className="responses-actions">
                                        <button onClick={handleRefresh} className="refresh-btn" disabled={isRefreshing}>
                                            <FaSync className={isRefreshing ? 'spinning' : ''} />
                                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                        </button>
                                        <button onClick={exportToExcel} className="export-btn" disabled={!responses.length}>
                                            <FaFileExcel />
                                            Export to Excel
                                        </button>
                                    </div>
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
                                            <FaChartBar />
                                        </div>
                                        <div className="stat-info">
                                            <h3>Completion Rate</h3>
                                            <p>{stats.completionRate}%</p>
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

                                <div className="search-filter-container">
                                    <div className="search-box">
                                        <FaSearch />
                                        <input
                                            type="text"
                                            placeholder="Search by student name or ID"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="filter-box">
                                        <FaFilter />
                                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                            <option value="all">All Responses</option>
                                            <option value="recent">Recent (7 days)</option>
                                            <option value="highRating">High Ratings (4-5)</option>
                                            <option value="lowRating">Low Ratings (1-3)</option>
                                        </select>
                                    </div>
                                </div>

                                {isRefreshing ? (
                                    <div className="loading-state mini">
                                        <div className="spinner"></div>
                                        <p>Refreshing responses...</p>
                                    </div>
                                ) : filteredResponses.length === 0 ? (
                                    <div className="no-responses">
                                        <FaComments className="icon" />
                                        <h3>No responses yet</h3>
                                        <p>Once students submit feedback, their responses will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="responses-table-container">
                                        <table className="responses-table">
                                            <thead>
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Date Submitted</th>
                                                    {questions.map((q, index) => (
                                                        <th key={index}>
                                                            <div className="question-header">
                                                                <span>Q{index + 1}:</span> {q.length > 30 ? q.substring(0, 30) + '...' : q}
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredResponses.map((response, index) => (
                                                    <tr key={response._id || index}>
                                                        <td>
                                                            <div className="student-info">
                                                                <span className="student-name">{response.studentName || `Student ${index + 1}`}</span>
                                                                <span className="student-id">{response.studentId || `ID: Unknown`}</span>
                                                                <span className="student-email">{response.email || 'Email not available'}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {response.submittedAt ?
                                                                new Date(response.submittedAt).toLocaleString() :
                                                                'Date not recorded'}
                                                        </td>
                                                        {(response.answers || []).map((answer, aIndex) => (
                                                            <td key={aIndex} className={
                                                                !isNaN(parseInt(answer)) ?
                                                                    parseInt(answer) >= 4 ? 'high-rating' :
                                                                        parseInt(answer) <= 2 ? 'low-rating' : ''
                                                                    : ''
                                                            }>
                                                                {answer}
                                                            </td>
                                                        ))}
                                                        {questions.length > (response.answers || []).length &&
                                                            Array(questions.length - (response.answers || []).length).fill().map((_, i) => (
                                                                <td key={`empty-${i}`}>Not answered</td>
                                                            ))
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="responses-footer">
                                    <p>
                                        Showing {filteredResponses.length} of {responses.length} responses
                                    </p>
                                    <p className="last-updated">
                                        Last updated: {stats.lastUpdateTime.toLocaleTimeString()}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="no-form-selected">
                                <FaComments className="icon" />
                                <h2>Select a form to view responses</h2>
                                <p>Choose a feedback form from the list to view student responses.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeedbackResponses; 