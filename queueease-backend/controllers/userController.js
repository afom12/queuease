


const User = require('../models/user');
const cloudinary = require('cloudinary').v2; // Optional, if you're using Cloudinary to store photos

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { phoneNumber, address } = req.body;
    const userId = req.user.userId; // Get user ID from the auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user fields (phone number, address)
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    // Handle profile photo upload if exists
    if (req.file) {
      // If you're using Cloudinary to store the file
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'queueease_profile_pictures', // Upload to Cloudinary folder
      });

      // Save the URL returned by Cloudinary to the user's profile
      user.profilePhoto = result.secure_url;
    }

    // Save the updated user information
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
