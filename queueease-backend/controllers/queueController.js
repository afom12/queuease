const Queue = require('../models/Queue');
const { sendNotification } = require('../utils/notificationUtil');

// Define valid service types
const SERVICE_TYPES = [
  { id: 'passport-renewal', name: 'Passport Renewal' },
  { id: 'new-passport', name: 'New Passport' },
  { id: 'visa-application', name: 'Visa Application' },
  { id: 'work-permit', name: 'Work Permit' },
  { id: 'residency-permit', name: 'Residency Permit' },
  { id: 'travel-document', name: 'Travel Document' },
  { id: 'document-legitisation', name: 'Document Legitisation' }
];

// Admin/Officer: Get all queues
exports.getAllQueues = async (req, res) => {
  try {
    const queues = await Queue.find()
      .populate('user', 'name email phoneNumber')
      .sort({ appointmentDate: 1, queueNumber: 1 });

    res.json({ queues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get available service types
exports.getServiceTypes = async (req, res) => {
  try {
    res.json({ serviceTypes: SERVICE_TYPES });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register a queue
exports.registerQueue = async (req, res) => {
  try {
    const { serviceType, appointmentDate } = req.body;
    const userId = req.user.userId;

    // Validate service type
    const validService = SERVICE_TYPES.find(s => s.id === serviceType);
    if (!validService) {
      return res.status(400).json({ 
        message: 'Invalid service type',
        validServiceTypes: SERVICE_TYPES.map(s => s.id)
      });
    }

    // Validate appointment date (must be future date)
    const appointment = new Date(appointmentDate);
    if (appointment < new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    // Get the latest queue number for that day
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
      serviceName: validService.name,
      appointmentDate,
      queueNumber: count + 1,
      status: 'pending'
    });

    await newQueue.save();

    // Populate user data for notification
    const populatedQueue = await Queue.findById(newQueue._id)
      .populate('user', 'name email phoneNumber');

    // Send confirmation notification
    sendNotification(
      populatedQueue.user,
      `Your ${validService.name} appointment is scheduled for ${appointmentDate}. Queue number: ${count + 1}`
    );

    res.status(201).json({ 
      message: "Queue registered successfully",
      queue: populatedQueue
    });

  } catch (err) {
    console.error('Queue registration error:', err);
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to register queue'
    });
  }
};

// Admin/Officer: Update queue status
exports.updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value',
        validStatuses 
      });
    }

    const queue = await Queue.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    ).populate('user', 'name email phoneNumber');

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Send notification
    sendNotification(
      queue.user,
      `Your ${queue.serviceName} queue status has been updated to '${status}'`
    );

    res.json({ 
      message: 'Queue status updated successfully',
      queue 
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to update queue status'
    });
  }
};

// Get my queues (User-specific)
exports.getMyQueues = async (req, res) => {
  try {
    const userId = req.user.userId;
    const queues = await Queue.find({ user: userId })
      .sort({ appointmentDate: -1, queueNumber: 1 });

    res.json({ queues });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to fetch your queues'
    });
  }
};

// Register a queue reschedule
exports.registerQueueReschedule = async (req, res) => {
  try {
    const { appointmentDate } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;

    // Validate new date
    const newDate = new Date(appointmentDate);
    if (newDate < new Date()) {
      return res.status(400).json({ message: 'New appointment date must be in the future' });
    }

    const queue = await Queue.findById(id);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    // Authorization check
    if (queue.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to reschedule this queue" });
    }

    // Calculate new queue number for the new date and service type
    const today = new Date(appointmentDate).toISOString().split('T')[0];
    const count = await Queue.countDocuments({
      appointmentDate: {
        $gte: new Date(`${today}T00:00:00Z`),
        $lte: new Date(`${today}T23:59:59Z`)
      },
      serviceType: queue.serviceType
    });

    // Update queue
    queue.appointmentDate = appointmentDate;
    queue.queueNumber = count + 1;
    queue.status = 'pending';
    await queue.save();

    // Send notification
    const populatedQueue = await Queue.findById(queue._id)
      .populate('user', 'name email phoneNumber');

    sendNotification(
      populatedQueue.user,
      `Your ${queue.serviceName} appointment has been rescheduled to ${appointmentDate}. New queue number: ${count + 1}`
    );

    res.status(200).json({ 
      message: "Queue rescheduled successfully", 
      queue: populatedQueue 
    });

  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to reschedule queue'
    });
  }
};

// Cancel a queue
exports.cancelQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const queue = await Queue.findById(id);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    // Authorization check
    if (queue.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to cancel this queue" });
    }

    // Don't allow cancellation if already completed or cancelled
    if (queue.status === 'completed') {
      return res.status(400).json({ message: "Cannot cancel a completed queue" });
    }
    if (queue.status === 'cancelled') {
      return res.status(400).json({ message: "Queue is already cancelled" });
    }

    queue.status = 'cancelled';
    await queue.save();

    // Send notification
    const populatedQueue = await Queue.findById(queue._id)
      .populate('user', 'name email phoneNumber');

    sendNotification(
      populatedQueue.user,
      `Your ${queue.serviceName} appointment has been cancelled`
    );

    res.json({ 
      message: "Queue cancelled successfully", 
      queue: populatedQueue 
    });

  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to cancel queue'
    });
  }
};

// Admin/Officer: Filter and track queues live
exports.trackQueues = async (req, res) => {
  try {
    const { status, serviceType, date } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (date) {
      const day = new Date(date).toISOString().split('T')[0];
      filter.appointmentDate = {
        $gte: new Date(`${day}T00:00:00Z`),
        $lte: new Date(`${day}T23:59:59Z`)
      };
    }

    const queues = await Queue.find(filter)
      .populate('user', 'name email phoneNumber')
      .sort({ appointmentDate: 1, queueNumber: 1 });

    res.json({ queues });

  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to fetch queues'
    });
  }
};