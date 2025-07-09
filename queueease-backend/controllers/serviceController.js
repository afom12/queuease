const multer = require('multer');
const path = require('path');
const Service = require('../models/Service');
const Queue = require('../models/Queue');

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
  }
};

// Initialize upload middleware
exports.upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Handle service application submission
exports.submitService = async (req, res) => {
  try {
    const { serviceType, fullName, dob, nationality, appointmentDate, timeSlot } = req.body;
    const userId = req.user.userId;
    const filePath = req.file ? req.file.path : null;

    // Validate required fields
    if (!serviceType || !fullName || !dob || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new service application
    const newService = new Service({
      user: userId,
      serviceType,
      details: {
        fullName,
        dob,
        nationality,
        documentPath: filePath
      },
      appointment: {
        date: new Date(appointmentDate),
        timeSlot
      },
      status: 'pending'
    });

    await newService.save();

    // Create corresponding queue entry
    const today = new Date(appointmentDate).toISOString().split('T')[0];
    const count = await Queue.countDocuments({
      appointmentDate: {
        $gte: new Date(`${today}T00:00:00Z`),
        $lte: new Date(`${today}T23:59:59Z`)
      },
      serviceType
    });

    const newQueue = new Queue({
      user: userId,
      serviceType,
      serviceName: serviceType.replace('-', ' '),
      serviceApplication: newService._id,
      appointmentDate: new Date(appointmentDate),
      queueNumber: count + 1,
      status: 'pending'
    });

    await newQueue.save();

    res.status(201).json({
      message: 'Service application submitted successfully',
      service: newService,
      queue: newQueue
    });

  } catch (err) {
    console.error('Service submission error:', err);
    res.status(500).json({ 
      message: 'Failed to submit service application',
      error: err.message 
    });
  }
};

// Get all services for a user
exports.getUserServices = async (req, res) => {
  try {
    const userId = req.user.userId;
    const services = await Service.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({ services });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch services',
      error: err.message 
    });
  }
};

// Get service details
exports.getServiceDetails = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user.userId;

    const service = await Service.findOne({ 
      _id: serviceId,
      user: userId 
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch service details',
      error: err.message 
    });
  }
};
