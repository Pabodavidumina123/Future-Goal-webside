import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../services/emailService.js';

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'futurepathsecretkey12345', {
    expiresIn: '30d',
  });
};

const formatUserResponse = (user) => ({
  success: true,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  profileImage: user.profileImage || '',
  createdAt: user.createdAt,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
    });

    if (user) {
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        console.warn('Welcome email could not be sent:', emailError.message);
      }

      res.status(201).json({
        ...formatUserResponse(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        ...formatUserResponse(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(formatUserResponse(user));
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get the authenticated user's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update authenticated user's profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: 'Email is already in use.' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload profile image for authenticated user
// @route   POST /api/auth/profile/photo
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.json({ success: true, profileImage: imageUrl, user: formatUserResponse(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
