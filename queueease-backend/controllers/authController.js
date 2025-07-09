

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists",
        field: "email"  // Helps frontend highlight the specific field
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security

    // Create and save user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'user' // Default to 'user' if role not provided
    });
    
    await user.save();

    // Create JWT token (same as login)
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user data (excluding password)
    res.status(201).json({ 
      token,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      message: "Registration successful"
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation failed",
        errors: err.errors 
      });
    }
    
    res.status(500).json({ 
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        field: "email"  // Helps frontend highlight the field
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        field: "password"  // Helps frontend highlight the field
      });
    }

    // Create JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user data (excluding password)
    res.json({ 
      token,
      user: { 
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      message: "Login successful"
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: "Login failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
