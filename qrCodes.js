const express = require('express');
const router = express.Router();
const QRCode = require('../models/QRCode');
const auth = require('../middleware/auth');
const qrcode = require('qrcode');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate QR Code
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;

    // Generate QR code image
    const qrCodeData = await qrcode.toDataURL(text);
    
    // Save QR code to database
    const qrCode = new QRCode({
      text,
      userId,
      imageUrl: qrCodeData
    });

    await qrCode.save();

    res.status(201).json(qrCode);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all QR codes with pagination and filters
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const userId = req.user._id;

    let query = { userId };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.generatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const qrCodes = await QRCode.find(query)
      .sort({ generatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await QRCode.countDocuments(query);

    res.json({
      qrCodes,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete QR code
router.delete('/:id', auth, async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    if (qrCode.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await qrCode.remove();
    res.json({ message: 'QR code deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Share QR code via email
router.post('/share', auth, async (req, res) => {
  try {
    const { qrCodeId, recipientEmail } = req.body;
    const qrCode = await QRCode.findById(qrCodeId);

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    if (qrCode.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Shared QR Code',
      html: `
        <h2>QR Code Shared with You</h2>
        <p>Here is the QR code that was shared with you:</p>
        <img src="${qrCode.imageUrl}" alt="QR Code" />
        <p>Text content: ${qrCode.text}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'QR code shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all QR codes
router.get('/all', async (req, res) => {
  try {
    const qrCodes = await QRCode.find();
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new QR code
router.post('/new', async (req, res) => {
  try {
    const qrCode = new QRCode({
      content: req.body.content,
      type: req.body.type
    });
    const newQRCode = await qrCode.save();
    res.status(201).json(newQRCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single QR code
router.get('/:id', async (req, res) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    res.json(qrCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a QR code
router.delete('/:id', async (req, res) => {
  try {
    const qrCode = await QRCode.findByIdAndDelete(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    res.json({ message: 'QR code deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 