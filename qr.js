const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

// Generate QR code
router.post('/generate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const qrCode = await QRCode.toDataURL(text);
    res.json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Save QR code to history
router.post('/save', async (req, res) => {
  try {
    const { text, qrCode } = req.body;
    if (!text || !qrCode) {
      return res.status(400).json({ error: 'Text and QR code are required' });
    }

    // TODO: Save to MongoDB
    res.json({ message: 'QR code saved successfully' });
  } catch (error) {
    console.error('Error saving QR code:', error);
    res.status(500).json({ error: 'Failed to save QR code' });
  }
});

// Get QR code history
router.get('/history', async (req, res) => {
  try {
    // TODO: Fetch from MongoDB
    res.json({ history: [] });
  } catch (error) {
    console.error('Error fetching QR code history:', error);
    res.status(500).json({ error: 'Failed to fetch QR code history' });
  }
});

module.exports = router; 