const express = require('express');
const router = express.Router();
const {
  registerQueue,
  getMyQueues,
  getAllQueues,
  updateQueueStatus,
  cancelQueue,
  registerQueueReschedule,
  trackQueues,
  getServiceTypes
} = require('../controllers/queueController');

const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Public endpoints (no auth required)
router.get('/services/types', getServiceTypes);

// Regular user endpoints (require authentication)
router.post('/register', auth, registerQueue);
router.get('/myqueues', auth, getMyQueues);
router.put('/cancel/:id', auth, cancelQueue);
router.put('/reschedule/:id', auth, registerQueueReschedule);

// Admin/Officer endpoints (require specific roles)
router.get('/all', auth, checkRole(['admin', 'officer']), getAllQueues);
router.put('/update/:id', auth, checkRole(['admin', 'officer']), updateQueueStatus);
router.get('/track', auth, checkRole(['admin', 'officer']), trackQueues);

module.exports = router;