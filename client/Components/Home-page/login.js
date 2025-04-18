import React, { useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router-dom";
import emailjs from '@emailjs/browser';
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState({ message: "", isError: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });
      const userType = response.data.data.type;
      localStorage.setItem("userData", JSON.stringify(response.data.data));
      window.location.href = `/${userType}`;
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Network error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendStatus({ message: "", isError: false });

    try {
      const templateParams = {
        from_name: contactName,
        from_email: contactEmail,
        message: contactMessage,
        to_email: "your-email@gmail.com" // Replace with your email
      };

      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      setSendStatus({
        message: "Message sent successfully!",
        isError: false
      });
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (error) {
      setSendStatus({
        message: "Failed to send message. Please try again.",
        isError: true
      });
    } finally {
      setSending(false);
    }
  };

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    setIsMobileMenuOpen(false);
  };

  const scrollToAbout = () => {
    const headerOffset = 100; // Offset for header height and some spacing
    const aboutPosition = aboutRef.current?.getBoundingClientRect().top;
    const offsetPosition = aboutPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    setIsMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    const headerOffset = 100; // Offset for header height and some spacing
    const contactPosition = contactRef.current?.getBoundingClientRect().top;
    const offsetPosition = contactPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    setIsMobileMenuOpen(false);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setErrorMessage("");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="login-container">
      {/* Video Background with Welcome Content */}
      <div className="hero-section" ref={heroRef}>
        <video autoPlay loop muted className="video-background">
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Welcome Content */}
        <div className="welcome-content">
          <h1>Welcome to Campus Polls And Opinions</h1>
          <p>
            Your voice matters! Join a vibrant community where students share opinions,
            vote on campus issues, and stay updated with what others think. From fun polls
            to serious discussions — speak up, stay informed, and shape your campus life.
          </p>
          <button className="start-btn" onClick={() => setShowLoginForm(true)}>
            Get Started
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* About Section */}
        <div className="about-content" ref={aboutRef}>
          <h2>About Campus Polls and Opinions</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Our Mission</h3>
              <p>To create a dynamic platform where student voices are heard, valued, and transformed into meaningful campus actions.</p>
            </div>
            <div className="about-card">
              <h3>What We Do</h3>
              <p>We provide an innovative polling system that connects students, faculty, and administration to foster better communication and decision-making.</p>
            </div>
            <div className="about-card">
              <h3>Why Choose Us</h3>
              <p>Our platform offers real-time insights, secure voting, and a user-friendly interface designed specifically for educational institutions.</p>
            </div>
            <div className="about-card">
              <h3>Our Impact</h3>
              <p>We've helped numerous campuses improve student engagement, make data-driven decisions, and create more inclusive communities.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-content" ref={contactRef}>
          <div className="section-header">
            <h2>Contact Us</h2>
            <div className="header-line"></div>
            <p className="contact-subtitle">Get in touch with us for any questions or inquiries</p>
          </div>
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="contact-card">
                <h3>Our Location</h3>
                <div className="icon-circle">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <p>Punjab</p>
              </div>
              <div className="contact-card">
                <h3>Email Address</h3>
                <div className="icon-circle">
                  <i className="fas fa-envelope"></i>
                </div>
                <p>info@campuspolls.com<br />support@campuspolls.com</p>
              </div>
            </div>

            <div className="contact-form-container">
              <div className="contact-card form-card">
                <h3>Send Message</h3>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  {sendStatus.message && (
                    <div className={`status-message ${sendStatus.isError ? 'error' : 'success'}`}>
                      {sendStatus.message}
                    </div>
                  )}
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Your Message"
                      required
                      rows="3"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="nav-section">
          <div className="nav-container">
            <div className="nav-grid">
              <div className="nav-column">
                <h3>Navigation</h3>
                <div className="nav-links">
                  <button onClick={scrollToHero} className="nav-item">Home</button>
                  <button onClick={scrollToAbout} className="nav-item">About</button>
                  <button onClick={scrollToContact} className="nav-item">Contact</button>
                </div>
              </div>
              <div className="nav-column">
                <h3>Resources</h3>
                <div className="nav-links">
                  <a href="#" className="nav-item">Help Center</a>
                  <a href="#" className="nav-item">FAQs</a>
                  <a href="#" className="nav-item">Terms of Service</a>
                </div>
              </div>
              <div className="nav-column">
                <h3>Connect With Us</h3>
                <div className="social-media-links">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-item facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-item twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://www.instagram.com/imvivek_12/" target="_blank" rel="noopener noreferrer" className="social-item instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/vivek-kumar-67242a248/" target="_blank" rel="noopener noreferrer" className="social-item linkedin">
                    <i className="fab fa-linkedin-in"></i>
                  </a>

                </div>
              </div>
            </div>
            <div className="nav-footer">
              <p>&copy; 2024 Campus Polls and Opinions. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="login-header">
        <div className="header-content">
          {/* Hamburger Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          {/* Desktop Navigation */}
          <div className="desktop-only">
            <nav className="header-nav">
              <button onClick={scrollToHero} className="nav-link">Home</button>
              <button onClick={scrollToAbout} className="nav-link">About</button>
              <button onClick={scrollToContact} className="nav-link">Contact</button>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav">
            <button onClick={scrollToHero} className="nav-link">Home</button>
            <button onClick={scrollToAbout} className="nav-link">About</button>
            <button onClick={scrollToContact} className="nav-link">Contact</button>
          </nav>
        )}
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-content">
          <button className="close-sidebar" onClick={toggleMobileMenu}>×</button>
          <div className="mobile-brand">
            <span className="brand-text">Campus Polls and Opinions</span>
          </div>
          <nav className="mobile-nav">
            <button onClick={scrollToHero} className="nav-link">Home</button>
            <button onClick={scrollToAbout} className="nav-link">About</button>
            <button onClick={scrollToContact} className="nav-link">Contact</button>
            <button
              className="mobile-login-btn"
              onClick={() => {
                setShowLoginForm(true);
                toggleMobileMenu();
              }}
            >
              Login
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Login Form Modal */}
      {showLoginForm && (
        <div className="login-modal-overlay" onClick={closeLoginForm}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeLoginForm}>×</button>
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              <div className="form-group">
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  required
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-700 font-bold mb-4">Login with Others</p>
              <div className="space-y-3 flex flex-col items-center">
                <button className="flex items-center justify-center w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                  <span>Login with Google</span>
                </button>
                <button className="flex items-center justify-center w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                  <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" className="w-5 h-5 mr-2" />
                  <span>Login with Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
