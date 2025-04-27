import React from 'react';
import { FiUser, FiClock, FiStar } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { format } from 'date-fns';

const DetailedResponseView = ({ response, onClose }) => {
    if (!response) return null;

    const calculateAverageRating = () => {
        const ratingQuestions = response.answers.filter(answer => answer.type === 'rating');
        if (ratingQuestions.length === 0) return 0;
        
        const sum = ratingQuestions.reduce((acc, curr) => acc + parseInt(curr.answer), 0);
        return (sum / ratingQuestions.length).toFixed(1);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FiStar
                key={index}
                className={`star ${index < rating ? 'filled' : ''}`}
                fill={index < rating ? 'currentColor' : 'none'}
            />
        ));
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return 'status-badge submitted';
            case 'reviewed':
                return 'status-badge reviewed';
            default:
                return 'status-badge pending';
        }
    };

    return (
        <div className="modal-content detailed-response">
            <div className="modal-header">
                <div className="response-header-content">
                    <h2>Feedback Response Details</h2>
                    <div className="response-meta">
                        <span className="student-name">
                            <FiUser style={{ marginRight: '4px' }} />
                            {response.studentName}
                        </span>
                        <span>
                            <FiClock style={{ marginRight: '4px' }} />
                            {format(new Date(response.submittedAt), 'PPp')}
                        </span>
                        <span className={getStatusBadgeClass(response.status)}>
                            {response.status}
                        </span>
                    </div>
                </div>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>

            <div className="modal-body">
                <div className="response-summary">
                    <div className="summary-card">
                        <BiMessageSquareDetail className="summary-icon" />
                        <div className="summary-content">
                            <span className="summary-label">Total Questions</span>
                            <span className="summary-value">{response.answers.length}</span>
                        </div>
                    </div>
                    <div className="summary-card">
                        <FiStar className="summary-icon" />
                        <div className="summary-content">
                            <span className="summary-label">Average Rating</span>
                            <span className="summary-value">{calculateAverageRating()}</span>
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
                                {answer.type === 'rating' && (
                                    <div className="rating-display">
                                        <span className="rating-label">Rating:</span>
                                        <div className="stars">
                                            {renderStars(parseInt(answer.answer))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailedResponseView; 