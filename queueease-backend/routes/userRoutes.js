const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Multer configuration

// Update user profile (phone number, address, and profile photo)
router.put('/updateProfile', auth, upload.single('profilePhoto'), updateUserProfile);

module.exports = router;
