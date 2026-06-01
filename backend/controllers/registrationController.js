import Registration from '../models/Registration.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create a new course registration
// @route   POST /api/registrations
// @access  Private (Student)
export const createRegistration = async (req, res) => {
  try {
    const {
      courseId,
      fullName,
      email,
      phone,
      address,
      dob,
      educationLevel,
      additionalNotes,
    } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if student is already registered for this course
    const alreadyRegistered = await Registration.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: `You have already registered for ${course.title}. Status: ${alreadyRegistered.status}`,
      });
    }

    // Check if seats are available
    if (course.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'No seats available for this course' });
    }

    // Create registration
    const registration = await Registration.create({
      student: req.user._id,
      course: courseId,
      fullName,
      email,
      phone,
      address,
      dob,
      educationLevel,
      additionalNotes,
      status: 'pending',
    });

    // Create student notification
    await Notification.create({
      recipient: req.user._id,
      message: `Your registration request for "${course.title}" was submitted successfully and is pending admin approval.`,
      type: 'info',
    });

    // Create admin notification (for all admins)
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        message: `New student registration request from ${fullName} for "${course.title}".`,
        type: 'warning',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get registrations (Admin gets all, Student gets their own)
// @route   GET /api/registrations
// @access  Private
export const getRegistrations = async (req, res) => {
  try {
    let registrations;

    if (req.user.role === 'admin') {
      // Admin gets all registrations, populated with details
      registrations = await Registration.find()
        .populate('student', 'name email')
        .populate('course', 'title image category fee startDate availableSeats')
        .sort('-createdAt');
    } else {
      // Student gets their own registrations
      registrations = await Registration.find({ student: req.user._id })
        .populate('course', 'title image category duration fee startDate availableSeats')
        .sort('-createdAt');
    }

    res.json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update registration status (Approve / Reject)
// @route   PUT /api/registrations/:id/status
// @access  Private/Admin
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status type' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('course')
      .populate('student');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    const oldStatus = registration.status;
    registration.status = status;
    await registration.save();

    const course = await Course.findById(registration.course._id);

    // If status changes to approved, decrement seats
    if (status === 'approved' && oldStatus !== 'approved') {
      if (course && course.availableSeats > 0) {
        course.availableSeats -= 1;
        await course.save();
      }
    }

    // If status changes from approved to something else, increment seats
    if (oldStatus === 'approved' && status !== 'approved') {
      if (course) {
        course.availableSeats += 1;
        await course.save();
      }
    }

    // Create notification for student
    const statusMsg = status === 'approved' ? 'APPROVED 🎉' : 'REJECTED ❌';
    const alertType = status === 'approved' ? 'success' : 'error';
    await Notification.create({
      recipient: registration.student._id,
      message: `Your course registration for "${registration.course.title}" has been ${statusMsg} by the administration.`,
      type: alertType,
    });

    res.json({
      success: true,
      message: `Registration status updated to ${status}`,
      registration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete registration
// @route   DELETE /api/registrations/:id
// @access  Private/Admin
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    // If deleting an approved registration, restore the seat
    if (registration.status === 'approved') {
      const course = await Course.findById(registration.course);
      if (course) {
        course.availableSeats += 1;
        await course.save();
      }
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Registration record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
