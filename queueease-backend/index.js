const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cronJobs = require('./cronJobs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const queueRoutes = require('./routes/queueRoutes');
const serviceRoutes = require('./routes/serviceRoutes'); // ADD THIS LINE

app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/services', serviceRoutes); // ADD THIS LINE

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'QueueEase Backend is Running...' });
});

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error' 
  });
});

// 404 handler (must be after all other routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});