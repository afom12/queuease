const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  appointmentDate: { // ✅ use this name instead of "date"
    type: Date,
    required: true
  },
  queueNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Queue', queueSchema);
