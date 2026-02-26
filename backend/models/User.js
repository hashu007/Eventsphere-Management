const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'exhibitor', 'attendee'],
    default: 'attendee'
  },
  companyName: {
    type: String,
    required: function() { return this.role === 'exhibitor'; }
  },
  companyDescription: String,
  companyLogo: String,
  productsServices: String,
  contactNumber: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);