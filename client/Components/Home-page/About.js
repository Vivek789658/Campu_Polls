import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-container">
            <button onClick={() => navigate(-1)} className="back-button">
                <i className="fas fa-arrow-left"></i> Back
            </button>

            <div className="about-content">
                <div className="about-header">
                    <h1>About Our Feedback System</h1>
                    <p className="subtitle">Empowering Education Through Meaningful Feedback</p>
                </div>

                <div className="about-grid">
                    <div className="about-section">
                        <div className="icon-wrapper">
                            <i className="fas fa-bullseye"></i>
                        </div>
                        <h2>Our Mission</h2>
                        <p>To create a transparent and efficient feedback system that enhances the quality of education through meaningful communication between students and educators.</p>
                    </div>

                    <div className="about-section">
                        <div className="icon-wrapper">
                            <i className="fas fa-eye"></i>
                        </div>
                        <h2>Our Vision</h2>
                        <p>To revolutionize educational feedback by providing a platform that promotes continuous improvement and mutual understanding between students and faculty.</p>
                    </div>

                    <div className="about-section">
                        <div className="icon-wrapper">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h2>What We Offer</h2>
                        <p>A comprehensive feedback management system that enables efficient collection, analysis, and implementation of student feedback for educational improvement.</p>
                    </div>

                    <div className="about-section">
                        <div className="icon-wrapper">
                            <i className="fas fa-users"></i>
                        </div>
                        <h2>Who We Serve</h2>
                        <p>Educational institutions, teachers, and students who believe in the power of constructive feedback to enhance the learning experience.</p>
                    </div>
                </div>

                <div className="features-section">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <i className="fas fa-lock"></i>
                            <h3>Secure & Anonymous</h3>
                            <p>Ensuring confidential and honest feedback</p>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-chart-bar"></i>
                            <h3>Analytics</h3>
                            <p>Detailed insights and reporting</p>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-mobile-alt"></i>
                            <h3>Mobile Friendly</h3>
                            <p>Access anywhere, anytime</p>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-sync"></i>
                            <h3>Real-time Updates</h3>
                            <p>Instant feedback processing</p>
                        </div>
                    </div>
                </div>

                <div className="team-section">
                    <h2>Our Team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-photo">
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <h3>John Doe</h3>
                            <p>Project Lead</p>
                        </div>
                        <div className="team-member">
                            <div className="member-photo">
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <h3>Jane Smith</h3>
                            <p>Lead Developer</p>
                        </div>
                        <div className="team-member">
                            <div className="member-photo">
                                <i className="fas fa-user-circle"></i>
                            </div>
                            <h3>Mike Johnson</h3>
                            <p>UI/UX Designer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 