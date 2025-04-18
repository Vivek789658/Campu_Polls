import React, { useState, useEffect } from "react";
import AddSubjects from "./AddSubjects";
import AssignSubjects from "./AssignSubjects";
import RegisterProfessors from "./RegisterProfessors";
import RegisterStudents from "./RegisterStudents";
import WelcomeMsg from "./WelcomeMsg";
import CreateFeedbackForm from "./CreateFeedbackForm";
import ProfessorRequests from "./ProfessorRequests";
import AdminChartVisualization from "./AdminChartVisualization";
import ManageFeedbackForms from "./ManageFeedbackForms";
import StudentFeedbackResponses from "./StudentFeedbackResponses";
import { FaHome, FaUsers, FaBook, FaClipboardList, FaChartBar, FaEnvelope, FaSignOutAlt, FaBars, FaChevronLeft, FaSun, FaMoon, FaListAlt, FaComments, FaCalendarAlt, FaBell, FaChartLine, FaTasks } from 'react-icons/fa';
import "./AdminPage.css";

const tabs = [
  { id: "welcome", label: "Welcome", icon: <FaHome size={20} />, component: <WelcomeMsg /> },
  { id: "registerStudents", label: "Register Students", icon: <FaUsers size={20} />, component: <RegisterStudents /> },
  { id: "addSubjects", label: "Add Subjects", icon: <FaBook size={20} />, component: <AddSubjects /> },
  { id: "registerProfessors", label: "Register Professors", icon: <FaUsers size={20} />, component: <RegisterProfessors /> },
  { id: "assignSubjects", label: "Assign Subjects", icon: <FaClipboardList size={20} />, component: <AssignSubjects /> },
  { id: "createFeedbackForm", label: "Create Feedback Form", icon: <FaChartBar size={20} />, component: <CreateFeedbackForm /> },
  { id: "manageFeedbackForms", label: "Manage Feedback Forms", icon: <FaListAlt size={20} />, component: <ManageFeedbackForms /> },
  { id: "studentFeedback", label: "Student Feedback", icon: <FaComments size={20} />, component: <StudentFeedbackResponses /> },
  { id: "professorQueries", label: "Check Professor Queries", icon: <FaEnvelope size={20} />, component: <ProfessorRequests /> },
  { id: "visualizeFeedback", label: "Visualize Feedback Data", icon: <FaChartBar size={20} />, component: <AdminChartVisualization /> },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [adminName, setAdminName] = useState("Administrator");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check for active tab in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('activeAdminTab');
    if (savedTab) {
      setActiveTab(savedTab);
      localStorage.removeItem('activeAdminTab'); // Clear it after use
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Get admin name from localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData && userData.name) {
          setAdminName(userData.name);
        }
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.admin-sidebar') && !event.target.closest('.menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleTabClick = (tabId) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
      // Scroll to top when changing tabs
      window.scrollTo(0, 0);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (showLogout) {
      setShowLogout(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = "/";
    }
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Get the current component to render
  const currentComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="admin-page">
      <div className="admin-main">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-content">
            {/* Profile Section */}
            <div className="admin-profile">
              <div className="profile-section" onClick={toggleLogout}>
                <img
                  src="http://localhost:1234/profile.e71834e8.jpg"
                  alt="Admin Profile"
                  className="profile-img"
                />
                <div className="profile-info">
                  <p className="profile-name">{adminName}</p>
                  <p className="profile-role">Administrator</p>
                </div>
              </div>
              {showLogout && (
                <div className="logout-dropdown">
                  <button
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="admin-divider" />

            {/* Navigation Tabs */}
            <nav className="nav-section">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabClick(tab.id)}
                  data-title={tab.label}
                  aria-label={tab.label}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            className="menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        )}

        {/* Main Content */}
        <main className={`admin-content ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          {currentComponent}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileMenu} />}
    </div>
  );
};

export default AdminPage;
