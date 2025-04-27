const express = require('express');
const cors = require('cors');
const feedbackFormsRouter = require('./routes/feedbackForms');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', feedbackFormsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 