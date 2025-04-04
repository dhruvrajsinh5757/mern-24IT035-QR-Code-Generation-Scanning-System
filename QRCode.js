const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'url', 'email', 'phone', 'wifi']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QRCode', qrCodeSchema); 