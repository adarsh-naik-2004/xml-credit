const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const xml2js = require('xml2js');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const fs = require('fs');

const app = express();


app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan('dev'));
require('dotenv').config();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});



const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only XML files are allowed.'));
    }
  }
});




// MongoDB Schema
const reportSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  pan: String,
  creditScore: Number,
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    last7DaysEnquiries: Number
  },
  creditAccounts: [{
    creditCard: String,
    bank: String,
    address: String,
    accountNumber: String,
    amountOverdue: Number,
    currentBalance: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);


// XML Parser Middleware
const parseXML = xml => new Promise((resolve, reject) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(xml, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});


  

// Helper function to extract data from XML
const extractData = (xmlData) => {
  try {
    const { INProfileResponse } = xmlData;
    const basic = INProfileResponse.Current_Application.Current_Application_Details.Current_Applicant_Details;
    const summary = INProfileResponse.CAIS_Account.CAIS_Summary;
    const creditAccounts = INProfileResponse.CAIS_Account.CAIS_Account_DETAILS;
    const score = INProfileResponse.SCORE;

    const panNumbers = [];
    if (Array.isArray(INProfileResponse.CAIS_Account.CAIS_Account_DETAILS)) {
        INProfileResponse.CAIS_Account.CAIS_Account_DETAILS.forEach(account => {
        if (Array.isArray(account.CAIS_Holder_ID_Details)) {
            account.CAIS_Holder_ID_Details.forEach(detail => panNumbers.push(detail.Income_TAX_PAN));
        } else {
            panNumbers.push(account.CAIS_Holder_ID_Details.Income_TAX_PAN);
        }
    });
    } else {
        const singleAccount = INProfileResponse.CAIS_Account.CAIS_Account_DETAILS;
        if (Array.isArray(singleAccount.CAIS_Holder_ID_Details)) {
        singleAccount.CAIS_Holder_ID_Details.forEach(detail => panNumbers.push(detail.Income_TAX_PAN));
        } else {
        panNumbers.push(singleAccount.CAIS_Holder_ID_Details.Income_TAX_PAN);
    }
}
    //console.log("error hu mein",panNumbers)

    // Process basic details
    const basicDetails = {
      name: `${basic.First_Name} ${basic.Last_Name}`.trim(),
      mobile: basic.MobilePhoneNumber,
      pan: panNumbers[0],
      creditScore: parseInt(score.BureauScore)
    };

    // Process report summary
    const reportSummary = {
      totalAccounts: summary.Credit_Account.CreditAccountTotal,
      activeAccounts: summary.Credit_Account.CreditAccountActive,
      closedAccounts: summary.Credit_Account.CreditAccountClosed,
      currentBalance: summary.Total_Outstanding_Balance.Outstanding_Balance_All,
      securedAmount: summary.Total_Outstanding_Balance.Outstanding_Balance_Secured,
      unsecuredAmount: summary.Total_Outstanding_Balance.Outstanding_Balance_UnSecured,
      last7DaysEnquiries: INProfileResponse.TotalCAPS_Summary.TotalCAPSLast7Days
    };

    // Process credit accounts
    const processAccounts = (accounts) => {
      if (!Array.isArray(accounts)) accounts = [accounts];
      return accounts.map(acc => ({
        creditCard: acc.Account_Type,
        bank: acc.Subscriber_Name?.trim(),
        address: [
          acc.CAIS_Holder_Address_Details.First_Line_Of_Address_non_normalized,
          acc.CAIS_Holder_Address_Details.Second_Line_Of_Address_non_normalized,
          acc.CAIS_Holder_Address_Details.City_non_normalized
        ].filter(Boolean).join(', '),
        accountNumber: acc.Account_Number,
        amountOverdue: parseInt(acc.Amount_Past_Due) || 0,
        currentBalance: parseInt(acc.Current_Balance) || 0
      }));
    };

    return {
      ...basicDetails,
      reportSummary,
      creditAccounts: processAccounts(creditAccounts)
    };
  } catch (err) {
    logger.error('Data extraction error:', err);
    throw new Error('Invalid XML structure');
  }
};


  
  // Add this error handler middleware after your routes
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });



// API Endpoints
app.post('/api/reports', upload.single('xmlFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (req.file.mimetype !== 'text/xml' && req.file.mimetype !== 'application/xml') {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const xml = req.file.buffer.toString('utf8');
    const xmlData = await parseXML(xml);
    const reportData = extractData(xmlData);
    
    const newReport = await Report.create(reportData);
    res.status(201).json(newReport);
  } catch (err) {
    logger.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    logger.error('Get reports error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    logger.error('Get report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Database Connection

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const port = process.env.PORT
    app.listen(port, () => 
      console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    logger.error('DB connection failed:', err);
    process.exit(1);
  });


module.exports = app;