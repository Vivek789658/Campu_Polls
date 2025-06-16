import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Pie, Line } from "react-chartjs-2";
import { FaChartBar, FaChartPie, FaChartLine, FaSpinner } from "react-icons/fa";
import "./AdminPage.css";

const AdminChartVisualization = () => {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        ratings: [10, 15, 25, 30, 20],
        subjects: [
            { name: 'Mathematics', avgRating: 4.2 },
            { name: 'Physics', avgRating: 4.5 },
            { name: 'Chemistry', avgRating: 4.0 },
            { name: 'Biology', avgRating: 4.3 },
            { name: 'Computer Science', avgRating: 4.7 }
        ],
        trends: [
            { date: '2024-01', avgRating: 4.2 },
            { date: '2024-02', avgRating: 4.3 },
            { date: '2024-03', avgRating: 4.5 }
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://campu-polls.onrender.com/api/v1/getFeedbackAnalytics');
                const data = await response.json();
                if (data && data.success && data.analytics) {
                    setChartData(data.analytics);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    const ratingChartData = {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{
            label: 'Rating Distribution',
            data: chartData.ratings,
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ]
        }]
    };

    const subjectChartData = {
        labels: chartData.subjects.map(s => s.name),
        datasets: [{
            label: 'Subject Ratings',
            data: chartData.subjects.map(s => s.avgRating),
            backgroundColor: '#36A2EB'
        }]
    };

    const trendChartData = {
        labels: chartData.trends.map(t => t.date),
        datasets: [{
            label: 'Rating Trends',
            data: chartData.trends.map(t => t.avgRating),
            borderColor: '#4BC0C0',
            fill: false
        }]
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
                <div style={{ textAlign: 'center' }}>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite', height: '48px', width: '48px', color: '#4F46E5' }} />
                    <p style={{ marginTop: '16px', color: '#4B5563' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            padding: '24px'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '24px'
                }}>
                    Admin Dashboard
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                            <FaChartPie style={{ marginRight: '8px', display: 'inline' }} />
                            Rating Distribution
                        </h2>
                        <div style={{ height: '300px' }}>
                            <Pie data={ratingChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                            <FaChartBar style={{ marginRight: '8px', display: 'inline' }} />
                            Subject Ratings
                        </h2>
                        <div style={{ height: '300px' }}>
                            <Bar data={subjectChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        <FaChartLine style={{ marginRight: '8px', display: 'inline' }} />
                        Rating Trends
                    </h2>
                    <div style={{ height: '300px' }}>
                        <Line data={trendChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChartVisualization; 
