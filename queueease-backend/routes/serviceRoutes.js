const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/authMiddleware');

router.post(
  '/submit',
  auth,
  serviceController.upload.single('document'),
  serviceController.submitService
);

router.get('/my-services', auth, serviceController.getUserServices);
router.get('/:id', auth, serviceController.getServiceDetails);

module.exports = router;