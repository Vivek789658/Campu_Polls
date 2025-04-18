import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "./AdminChartVisualization.css";

const AdminChartVisualization = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:4000/api/v1/data");
                if (!response.ok) {
                    throw new Error("Failed to fetch chart data");
                }
                const data = await response.json();
                setChartData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setError("Failed to load chart data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!chartData) return;

        // Bar Chart
        const barCtx = document.getElementById("adminBarChart");
        if (barCtx) {
            const barChart = new Chart(barCtx, {
                type: "bar",
                data: {
                    labels: Object.keys(chartData),
                    datasets: [{
                        label: "Ratings",
                        data: Object.values(chartData),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Ratings",
                                font: {
                                    size: 14,
                                    weight: "bold"
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });

            return () => {
                barChart.destroy();
            };
        }
    }, [chartData]);

    useEffect(() => {
        if (!chartData) return;

        // Pie Chart
        const pieCtx = document.getElementById("adminPieChart");
        if (pieCtx) {
            const pieChart = new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: Object.keys(chartData),
                    datasets: [{
                        label: "Ratings Distribution",
                        data: Object.values(chartData),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)"
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });

            return () => {
                pieChart.destroy();
            };
        }
    }, [chartData]);

    useEffect(() => {
        if (!chartData) return;

        // Line Chart
        const lineCtx = document.getElementById("adminLineChart");
        if (lineCtx) {
            const lineChart = new Chart(lineCtx, {
                type: "line",
                data: {
                    labels: Object.keys(chartData),
                    datasets: [{
                        label: "Ratings Over Time",
                        data: Object.values(chartData),
                        fill: false,
                        borderColor: "rgba(75, 192, 192, 1)",
                        tension: 0.1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Ratings",
                                font: {
                                    size: 14,
                                    weight: "bold"
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });

            return () => {
                lineChart.destroy();
            };
        }
    }, [chartData]);

    if (loading) {
        return (
            <div className="admin-chart-visualization-container">
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl font-semibold">Loading chart data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-chart-visualization-container">
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl font-semibold text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-chart-visualization-container">
            <h1 className="text-3xl font-bold text-center mb-6">Feedback Analytics Dashboard</h1>

            <div className="chart-container">
                <h2>Rating Distribution (Bar Chart)</h2>
                <canvas id="adminBarChart"></canvas>
            </div>

            <div className="chart-container">
                <h2>Rating Distribution (Pie Chart)</h2>
                <canvas id="adminPieChart"></canvas>
            </div>

            <div className="chart-container">
                <h2>Rating Trends (Line Chart)</h2>
                <canvas id="adminLineChart"></canvas>
            </div>
        </div>
    );
};

export default AdminChartVisualization; 