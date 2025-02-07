const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const reportRoutes = require('./routes/reportRoutes');


const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json()); // Add limit for JSON payloads
app.use(morgan('dev'));

require('dotenv').config();

// Connect Database
connectDB();

// Routes
app.use('/api/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

// Export for Vercel
module.exports = app;