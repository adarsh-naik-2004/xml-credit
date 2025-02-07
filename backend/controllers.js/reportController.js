const Report = require('../models/Report');
const { parseXML, extractData } = require('../services/xmlParserService');
const logger = require('../config/logger');

exports.uploadReport = async (req, res) => {
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
};

exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    logger.error('Get reports error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    logger.error('Get report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};