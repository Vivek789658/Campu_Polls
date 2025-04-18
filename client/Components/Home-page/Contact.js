import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({
        submitting: false,
        submitted: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, submitted: false, error: null });

        try {
            await axios.post(`${API_BASE_URL}/contact`, formData);
            setStatus({ submitting: false, submitted: true, error: null });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({
                submitting: false,
                submitted: false,
                error: 'Failed to send message. Please try again.'
            });
        }
    };

    return (
        <div className="contact-container">
            <button onClick={() => navigate(-1)} className="back-button">
                <i className="fas fa-arrow-left"></i> Back
            </button>
            <div className="contact-content">
                <div className="contact-info">
                    <h1>Get in Touch</h1>
                    <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

                    <div className="contact-details">
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <div>
                                <h3>Address</h3>
                                <p>123 Education Street, Academic District, 12345</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <div>
                                <h3>Phone</h3>
                                <p>+1 234 567 8900</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <div>
                                <h3>Email</h3>
                                <p>info@feedbacksystem.edu</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-section">
                    <form onSubmit={handleSubmit} className="contact-form">
                        {status.submitted && (
                            <div className="success-message">
                                Thank you for your message! We'll get back to you soon.
                            </div>
                        )}

                        {status.error && (
                            <div className="error-message">
                                {status.error}
                            </div>
                        )}

                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your Email"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Your Message"
                                required
                                className="form-input"
                                rows="5"
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={status.submitting}
                        >
                            {status.submitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact; 