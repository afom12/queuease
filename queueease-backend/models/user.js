const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'officer'],
    default: 'user'
  },
  phoneNumber: { 
    type: String 
},
  address: 
  { type: String 

  },
  profilePhoto:
  { type: String 
    
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
