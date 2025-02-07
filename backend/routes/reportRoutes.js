const express = require('express');
const router = express.Router();
const multer = require('multer');
const reportController = require('../controllers/reportController');

const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only XML files are allowed.'));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

router.post('/', upload.single('xmlFile'), reportController.uploadReport);
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);

module.exports = router;