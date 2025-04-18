require("dotenv").config();
const PORT = process.env.PORT || 4000;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Configure CORS to allow connections from your local network
app.use(cors());

// MongoDB connection with better error handling
mongoose
    .connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        // Listen on all network interfaces
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running at port ${PORT}`);
            console.log('Access the application on your local network:');
            console.log(`- Local: http://localhost:${PORT}`);
            console.log(`- Network: Check your computer's IP address and use: http://YOUR_IP:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const routes = require("./routes/routes");
app.use("/api/v1", routes);

app.get("/", (req, res) => {
    res.send("server home");
});

// Add direct HTML endpoint for chart visualization
app.get("/piChart", (req, res) => {
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chart Visualizations</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
              color: #333;
          }
          h1 {
              text-align: center;
              color: #2c3e50;
              margin-bottom: 30px;
              font-size: 2.5rem; /* Larger title */
          }
          h2 {
              text-align: center;
              color: #34495e;
              margin: 20px 0 10px;
              font-size: 1.8rem; /* Subtitle size */
          }
          .chart-container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              padding: 20px;
              margin: 0 auto 40px;
              width: 100%;
              max-width: 800px; /* Centering and limiting width */
              border: 1px solid #e0e0e0; /* Subtle border */
          }
          canvas {
              width: 100% !important; /* Override inline width */
              height: 300px; /* Uniform height for all charts */
          }
          @media (max-width: 768px) {
              h1 {
                  font-size: 2rem; /* Responsive title size */
              }
              h2 {
                  font-size: 1.5rem; /* Responsive subtitle size */
              }
          }
      </style>
  </head>
  <body>
      <h1>Chart Visualizations</h1>

      <div class="chart-container">
          <h2>Bar Chart</h2>
          <canvas id="barChart"></canvas>
      </div>

      <div class="chart-container">
          <h2>Pie Chart</h2>
          <canvas id="pieChart"></canvas>
      </div>

      <div class="chart-container">
          <h2>Line Chart</h2>
          <canvas id="lineChart"></canvas>
      </div>

      <script>
          document.addEventListener('DOMContentLoaded', () => {
              fetch('/api/v1/data')
                  .then(response => response.json())
                  .then(data => {
                      const labels = Object.keys(data);
                      const values = Object.values(data).map(Number); // Convert values to numbers

                      // Bar Chart
                      const barCtx = document.getElementById('barChart').getContext('2d');
                      new Chart(barCtx, {
                          type: 'bar',
                          data: {
                              labels: labels,
                              datasets: [{
                                  label: 'Ratings',
                                  data: values,
                                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                  borderColor: 'rgba(75, 192, 192, 1)',
                                  borderWidth: 1
                              }]
                          },
                          options: {
                              scales: {
                                  y: {
                                      beginAtZero: true,
                                      title: {
                                          display: true,
                                          text: 'Ratings',
                                          font: {
                                              size: 16,
                                              weight: 'bold'
                                          }
                                      }
                                  }
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                          }
                      });

                      // Pie Chart
                      const pieCtx = document.getElementById('pieChart').getContext('2d');
                      new Chart(pieCtx, {
                          type: 'pie',
                          data: {
                              labels: labels,
                              datasets: [{
                                  label: 'Ratings Distribution',
                                  data: values,
                                  backgroundColor: [
                                      'rgba(255, 99, 132, 0.6)',
                                      'rgba(54, 162, 235, 0.6)',
                                      'rgba(255, 206, 86, 0.6)',
                                      'rgba(75, 192, 192, 0.6)',
                                      'rgba(153, 102, 255, 0.6)',
                                      'rgba(255, 159, 64, 0.6)'
                                  ],
                                  borderColor: [
                                      'rgba(255, 99, 132, 1)',
                                      'rgba(54, 162, 235, 1)',
                                      'rgba(255, 206, 86, 1)',
                                      'rgba(75, 192, 192, 1)',
                                      'rgba(153, 102, 255, 1)',
                                      'rgba(255, 159, 64, 1)'
                                  ],
                                  borderWidth: 1
                              }]
                          }
                      });

                      // Line Chart
                      const lineCtx = document.getElementById('lineChart').getContext('2d');
                      new Chart(lineCtx, {
                          type: 'line',
                          data: {
                              labels: labels,
                              datasets: [{
                                  label: 'Ratings Over Time',
                                  data: values,
                                  fill: false,
                                  borderColor: 'rgba(75, 192, 192, 1)',
                                  tension: 0.1
                              }]
                          }
                      });
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                  });
          });
      </script>
  </body>
  </html>
  `);
});

// Add direct HTML endpoint for admin chart visualization
app.get("/adminChart", (req, res) => {
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Chart Visualizations</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
              color: #333;
          }
          h1 {
              text-align: center;
              color: #2c3e50;
              margin-bottom: 30px;
              font-size: 2.5rem; /* Larger title */
          }
          h2 {
              text-align: center;
              color: #34495e;
              margin: 20px 0 10px;
              font-size: 1.8rem; /* Subtitle size */
          }
          .chart-container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              padding: 20px;
              margin: 0 auto 40px;
              width: 100%;
              max-width: 800px; /* Centering and limiting width */
              border: 1px solid #e0e0e0; /* Subtle border */
          }
          canvas {
              width: 100% !important; /* Override inline width */
              height: 300px; /* Uniform height for all charts */
          }
          @media (max-width: 768px) {
              h1 {
                  font-size: 2rem; /* Responsive title size */
              }
              h2 {
                  font-size: 1.5rem; /* Responsive subtitle size */
              }
          }
      </style>
  </head>
  <body>
      <h1>Admin Chart Visualizations</h1>

      <div class="chart-container">
          <h2>Bar Chart</h2>
          <canvas id="adminBarChart"></canvas>
      </div>

      <div class="chart-container">
          <h2>Pie Chart</h2>
          <canvas id="adminPieChart"></canvas>
      </div>

      <div class="chart-container">
          <h2>Line Chart</h2>
          <canvas id="adminLineChart"></canvas>
      </div>

      <script>
          document.addEventListener('DOMContentLoaded', () => {
              fetch('/api/v1/data')
                  .then(response => response.json())
                  .then(data => {
                      const labels = Object.keys(data);
                      const values = Object.values(data).map(Number); // Convert values to numbers

                      // Bar Chart
                      const barCtx = document.getElementById('adminBarChart').getContext('2d');
                      new Chart(barCtx, {
                          type: 'bar',
                          data: {
                              labels: labels,
                              datasets: [{
                                  label: 'Ratings',
                                  data: values,
                                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                  borderColor: 'rgba(75, 192, 192, 1)',
                                  borderWidth: 1
                              }]
                          },
                          options: {
                              scales: {
                                  y: {
                                      beginAtZero: true,
                                      title: {
                                          display: true,
                                          text: 'Ratings',
                                          font: {
                                              size: 16,
                                              weight: 'bold'
                                          }
                                      }
                                  }
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                          }
                      });

                      // Pie Chart
                      const pieCtx = document.getElementById('adminPieChart').getContext('2d');
                      new Chart(pieCtx, {
                          type: 'pie',
                          data: {
                              labels: labels,
                              datasets: [{
                                  label: 'Ratings Distribution',
                                  data: values,
                                  backgroundColor: [
                                      'rgba(255, 99, 132, 0.6)',
                                      'rgba(54, 162, 235, 0.6)',
                                      'rgba(255, 206, 86, 0.6)',
                                      'rgba(75, 192, 192, 0.6)',
                                      'rgba(153, 102, 255, 0.6)',
                                      'rgba(255, 159, 64, 0.6)'
                                  ],
                                  borderColor: [
                                      'rgba(255, 99, 132, 1)',
                                      'rgba(54, 162, 235, 1)',
                                      'rgba(255, 206, 86, 1)',
                                      'rgba(75, 192, 192, 1)',
                                      'rgba(153, 102, 255, 1)',
                                      'rgba(255, 159, 64, 1)'
                                  ],
                                  borderWidth: 1
                              }]
                          }
                      });

                      // Line Chart
                      const lineCtx = document.getElementById('adminLineChart').getContext('2d');
                      new Chart(lineCtx, {
                          type: 'line',
                          data: {
                              labels: labels,
                              datasets: [{
                                  label: 'Ratings Over Time',
                                  data: values,
                                  fill: false,
                                  borderColor: 'rgba(75, 192, 192, 1)',
                                  tension: 0.1
                              }]
                          }
                      });
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                  });
          });
      </script>
  </body>
  </html>
  `);
});
