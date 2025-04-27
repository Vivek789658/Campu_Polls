import React, { useState, useEffect } from "react";
import { FaUsers, FaChalkboardTeacher, FaBook, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import "./WelcomeMsg.css";

const WelcomeMsg = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    totalSubjects: 0,
    totalForms: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      // Fetch all statistics in parallel for better performance
      const [studentsRes, professorsRes, subjectsRes, formsRes] = await Promise.all([
        axios.get('/api/students/count'),
        axios.get('/api/professors/count'),
        axios.get('/api/subjects/count'),
        axios.get('/api/feedback-forms/count')
      ]);

      setStats({
        totalStudents: studentsRes.data.count,
        totalProfessors: professorsRes.data.count,
        totalSubjects: subjectsRes.data.count,
        totalForms: formsRes.data.count
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="welcome-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="welcome-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      {/* Welcome Header */}
      <div className="welcome-header">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage and monitor your educational system efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon students">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon professors">
            <FaChalkboardTeacher />
          </div>
          <div className="stat-info">
            <h3>Total Professors</h3>
            <p>{stats.totalProfessors}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon subjects">
            <FaBook />
          </div>
          <div className="stat-info">
            <h3>Total Subjects</h3>
            <p>{stats.totalSubjects}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon forms">
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <h3>Total Forms</h3>
            <p>{stats.totalForms}</p>
          </div>
        </div>
      </div>

      {/* Last Updated Indicator */}
      <div className="last-updated">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WelcomeMsg;
