import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import "./ChartVisualization.css";

const ChartVisualization = ({ type = 'rating', subjectData = null }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Construct the URL based on type and subject
                let url = `http://localhost:4000/api/v1/feedback/stats?type=${type}`;
                if (subjectData) {
                    url += `&subjectCode=${subjectData.code}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData = await response.json();

                if (!isMounted) return;

                // Validate and transform the data
                const processedData = {
                    ratings: jsonData.ratings || [0, 0, 0, 0, 0],
                    metrics: jsonData.metrics || [0, 0, 0, 0, 0],
                    engagement: jsonData.engagement || [],
                    dates: jsonData.dates || []
                };

                setChartData(processedData);
            } catch (err) {
                console.error("Error fetching chart data:", err);
                if (isMounted) {
                    setError("Failed to load chart data. Please try again later.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [type, subjectData]);

    useEffect(() => {
        if (!chartData || !chartRef.current) return;

        // Destroy existing chart if it exists
        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        let chartConfig;

        try {
            switch (type) {
                case 'rating':
                    chartConfig = {
                        type: 'bar',
                        data: {
                            labels: ['1★', '2★', '3★', '4★', '5★'],
                            datasets: [{
                                label: 'Rating Distribution',
                                data: chartData.ratings,
                                backgroundColor: [
                                    'rgba(239, 68, 68, 0.6)',
                                    'rgba(249, 115, 22, 0.6)',
                                    'rgba(234, 179, 8, 0.6)',
                                    'rgba(34, 197, 94, 0.6)',
                                    'rgba(59, 130, 246, 0.6)'
                                ],
                                borderColor: [
                                    'rgb(239, 68, 68)',
                                    'rgb(249, 115, 22)',
                                    'rgb(234, 179, 8)',
                                    'rgb(34, 197, 94)',
                                    'rgb(59, 130, 246)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Rating Distribution'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Number of Responses'
                                    }
                                }
                            }
                        }
                    };
                    break;

                case 'quality':
                    chartConfig = {
                        type: 'radar',
                        data: {
                            labels: ['Knowledge', 'Communication', 'Engagement', 'Preparation', 'Feedback'],
                            datasets: [{
                                label: 'Teaching Quality Metrics',
                                data: chartData.metrics,
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                borderColor: 'rgb(59, 130, 246)',
                                pointBackgroundColor: 'rgb(59, 130, 246)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(59, 130, 246)'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    min: 0,
                                    max: 5,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            }
                        }
                    };
                    break;

                case 'engagement':
                    chartConfig = {
                        type: 'line',
                        data: {
                            labels: chartData.dates.length > 0 ? chartData.dates : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                            datasets: [{
                                label: 'Student Engagement',
                                data: chartData.engagement.length > 0 ? chartData.engagement : [85, 88, 92, 90, 95],
                                fill: true,
                                borderColor: 'rgb(34, 197, 94)',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Student Engagement Over Time'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100,
                                    title: {
                                        display: true,
                                        text: 'Engagement Score (%)'
                                    }
                                }
                            }
                        }
                    };
                    break;

                default:
                    return;
            }

            // Create new chart
            chartRef.current.chart = new Chart(ctx, chartConfig);
        } catch (err) {
            console.error("Error creating chart:", err);
            setError("Failed to create chart visualization");
        }

        // Cleanup function
        return () => {
            if (chartRef.current?.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, [chartData, type]);

    if (loading) {
        return (
            <div className="chart-loading">
                <div className="spinner"></div>
                <p>Loading chart data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chart-error">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="chart-wrapper">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartVisualization; 