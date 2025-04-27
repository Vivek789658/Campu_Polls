import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChartVisualization from "./ChartVisualization";
import Alert from "../common/Alert";
import { FaChalkboardTeacher, FaBook, FaChartBar, FaEnvelope, FaBell, FaSignOutAlt, FaSun, FaMoon, FaBars, FaArrowLeft, FaUserGraduate, FaStar, FaComments, FaChartLine } from 'react-icons/fa';
import "./ProfessorPage.css";

const BASE_URL = "https://pr-01.onrender.com";

const ProfessorPage = () => {
  const [professorInfo, setProfessorInfo] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfessorInfo();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const fetchProfessorInfo = async () => {
    setLoading(true);
    setError("");

    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        throw new Error("User data not found. Please login again.");
      }

      const userData = JSON.parse(userDataString);
      if (!userData._id) {
        throw new Error("Invalid user data. Please login again.");
      }

      const response = await fetch(`${BASE_URL}/api/v1/getSubjects/${userData._id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch professor info");
      }

      const data = await response.json();

      setProfessorInfo({
        name: userData.name || "Professor Name",
        department: userData.department || "Computer Science",
        email: userData.username || "professor@university.edu",
        subjectsTaught: data.subjects ? data.subjects.map(subject => ({
          name: subject.subjectName,
          code: subject.subjectCode
        })) : [],
        profileImage: userData.profileImage || ""
      });

    } catch (error) {
      console.error("Error fetching professor info:", error);
      setError(error.message || "Failed to load professor information");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleViewFeedback = (subject = null) => {
    setSelectedSubject(subject);
    setShowCharts(true);
    setActiveTab('feedback');
  };

  const handleBackToDashboard = () => {
    setShowCharts(false);
    setSelectedSubject(null);
    setActiveTab('dashboard');
  };

  const renderDashboardContent = () => (
    <>
      {/* Dashboard Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Total Subjects</h3>
            <div className="card-icon">
              <FaBook />
            </div>
          </div>
          <div className="card-value">{professorInfo?.subjectsTaught.length || 0}</div>
          <p className="card-description">Subjects currently teaching</p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Pending Feedback</h3>
            <div className="card-icon">
              <FaChartBar />
            </div>
          </div>
          <div className="card-value">5</div>
          <p className="card-description">Feedback forms to review</p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Messages</h3>
            <div className="card-icon">
              <FaEnvelope />
            </div>
          </div>
          <div className="card-value">3</div>
          <p className="card-description">Unread messages</p>
        </div>
      </div>

      {/* Subjects Section */}
      <section className="feedback-section">
        <div className="feedback-header">
          <h2 className="feedback-title">My Subjects</h2>
          <button className="btn-primary">View All</button>
        </div>
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {professorInfo?.subjectsTaught.map((subject, index) => (
              <tr key={index}>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>Active</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => handleViewFeedback(subject)}
                  >
                    View Feedback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );

  const renderFeedbackContent = () => (
    <div className="feedback-view">
      <div className="feedback-view-header">
        <button className="btn-back" onClick={handleBackToDashboard}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2 className="feedback-view-title">
          {selectedSubject
            ? `Feedback Analysis - ${selectedSubject.name} (${selectedSubject.code})`
            : 'Overall Feedback Analysis'
          }
        </h2>
      </div>

      {/* Feedback Summary Cards */}
      <div className="feedback-summary-grid">
        <div className="summary-card">
          <div className="summary-icon">
            <FaUserGraduate />
          </div>
          <div className="summary-content">
            <h3>Total Students</h3>
            <div className="summary-value">156</div>
            <p className="summary-change positive">+12% from last semester</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaStar />
          </div>
          <div className="summary-content">
            <h3>Average Rating</h3>
            <div className="summary-value">4.8</div>
            <p className="summary-change positive">+0.3 from last semester</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaComments />
          </div>
          <div className="summary-content">
            <h3>Total Responses</h3>
            <div className="summary-value">142</div>
            <p className="summary-change">91% response rate</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaChartLine />
          </div>
          <div className="summary-content">
            <h3>Performance Index</h3>
            <div className="summary-value">92%</div>
            <p className="summary-change positive">+5% from last semester</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-card large">
            <div className="chart-header">
              <h3 className="chart-title">Rating Distribution</h3>
              <select className="chart-period-select">
                <option>Last Semester</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="chart-content">
              <ChartVisualization
                type="rating"
                subjectData={selectedSubject}
              />
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Teaching Quality</h3>
            </div>
            <div className="chart-content">
              <ChartVisualization
                type="quality"
                subjectData={selectedSubject}
              />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Student Engagement</h3>
            </div>
            <div className="chart-content">
              <ChartVisualization
                type="engagement"
                subjectData={selectedSubject}
              />
            </div>
          </div>
        </div>

        {/* Detailed Feedback Table */}
        <div className="feedback-details-card">
          <div className="details-header">
            <h3 className="details-title">Recent Feedback</h3>
            <button className="btn-primary">View All</button>
          </div>
          <div className="feedback-table-container">
            <table className="feedback-details-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data Structures</td>
                  <td>
                    <div className="rating-cell">
                      <span className="rating-value">4.8</span>
                      <div className="rating-stars">★★★★★</div>
                    </div>
                  </td>
                  <td>Excellent teaching methodology and clear explanations</td>
                  <td>2024-03-15</td>
                </tr>
                <tr>
                  <td>Algorithms</td>
                  <td>
                    <div className="rating-cell">
                      <span className="rating-value">4.5</span>
                      <div className="rating-stars">★★★★½</div>
                    </div>
                  </td>
                  <td>Very helpful with complex topics</td>
                  <td>2024-03-14</td>
                </tr>
                <tr>
                  <td>Database Systems</td>
                  <td>
                    <div className="rating-cell">
                      <span className="rating-value">4.7</span>
                      <div className="rating-stars">★★★★★</div>
                    </div>
                  </td>
                  <td>Great practical examples and assignments</td>
                  <td>2024-03-13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="professor-page">
      {/* Theme Toggle Button */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      {/* Mobile Menu Toggle */}
      <button className="menu-toggle" onClick={toggleMobileMenu}>
        <FaBars />
      </button>

      <div className="professor-main">
        {/* Sidebar */}
        <aside className={`professor-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="professor-profile">
            <div className="profile-header">
              <img
                src={professorInfo?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(professorInfo?.name || 'Professor')}
                alt="Professor Profile"
                className="profile-image"
              />
              <div className="profile-info">
                <h2>{professorInfo?.name || 'Loading...'}</h2>
                <p className="department">{professorInfo?.department || 'Department'}</p>
                <p className="email">{professorInfo?.email || 'Email'}</p>
              </div>
            </div>
          </div>

          <nav className="nav-menu">
            <a
              href="#dashboard"
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('dashboard');
                handleBackToDashboard();
              }}
            >
              <FaChalkboardTeacher />
              Dashboard
            </a>
            <a href="#subjects" className={`nav-item ${activeTab === 'subjects' ? 'active' : ''}`}>
              <FaBook />
              My Subjects
            </a>
            <a
              href="#feedback"
              className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => handleViewFeedback()}
            >
              <FaChartBar />
              View Feedback
            </a>
            <a href="#notifications" className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}>
              <FaBell />
              Notifications
              <span className="notification-badge">3</span>
            </a>
            <button onClick={handleLogout} className="nav-item">
              <FaSignOutAlt />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="professor-content">
          {error && (
            <Alert
              type="error"
              message={error}
              title="Error"
              onClose={() => setError("")}
            />
          )}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            showCharts ? renderFeedbackContent() : renderDashboardContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfessorPage;
