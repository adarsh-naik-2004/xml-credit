const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const reportRoutes = require('./routes/reportRoutes');


const app = express();


app.use(cors({ origin: "*" }));
app.use(express.json()); 
app.use(morgan('dev'));

require('dotenv').config();


connectDB();


app.use('/api/reports', reportRoutes);


app.use(errorHandler);


module.exports = app;