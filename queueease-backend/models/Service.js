const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'passport-renewal',
      'new-passport',
      'visa-application',
      'work-permit',
      'residency-permit',
      'travel-document',
      'document-legitisation'
    ]
  },
  details: {
    fullName: String,
    dob: Date,
    nationality: String,
    documentPath: String
  },
  appointment: {
    date: Date,
    timeSlot: String
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);