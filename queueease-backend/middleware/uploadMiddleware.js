const multer = require('multer');
const path = require('path');

// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Upload files to the 'uploads' folder
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Give the file a unique name (you could use the original name or generate a new one)
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExtension}`;
    cb(null, fileName);
  }
});

// Set file size limit and file type restrictions
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(extname)) {
      return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
