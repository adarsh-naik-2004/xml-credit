const Report = require('../models/Report');
const { parseXML, extractData } = require('../services/xmlParserService');
const logger = require('../config/logger');

exports.uploadReport = async (req, res) => {
  try {
    console.log("Received file:", req.file); // Debugging

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("File type:", req.file.mimetype);

    const xml = req.file.buffer.toString("utf8");
    const xmlData = await parseXML(xml);
    console.log("Parsed XML Data:", JSON.stringify(xmlData, null, 2));
    const reportData = extractData(xmlData);

    const newReport = await Report.create(reportData);
    res.status(201).json(newReport);
  } catch (err) {
    console.error("Upload error:", err);
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