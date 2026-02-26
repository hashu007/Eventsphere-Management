const mongoose = require('mongoose');

const boothSchema = new mongoose.Schema({
  expoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true
  },
  boothNumber: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  location: {
    floor: String,
    section: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  exhibitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked'],
    default: 'available'
  }
});

module.exports = mongoose.models.Booth || mongoose.model('Booth', boothSchema);