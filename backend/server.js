const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const reportRoutes = require('./routes/reportRoutes');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);

module.exports = app;