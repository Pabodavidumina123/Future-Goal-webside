import ContactRequest from '../models/ContactRequest.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Submit a new course contact request
// @route   POST /api/contact-requests
// @access  Private
export const createContactRequest = async (req, res) => {
  try {
    const { courseId, name, email, phone, message } = req.body;

    if (!courseId || !name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Course, name, email and phone are required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const contactRequest = await ContactRequest.create({
      requester: req.user._id,
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone,
      course: courseId,
      courseName: course.title,
      message: message || '',
      status: 'pending',
    });

    // Notify requesting user
    await Notification.create({
      recipient: req.user._id,
      message: `Your contact request for "${course.title}" has been submitted and is pending review.`,
      type: 'info',
    });

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map((admin) => ({
      recipient: admin._id,
      message: `New contact request from ${name} for course "${course.title}".`,
      type: 'warning',
    }));
    if (adminNotifications.length > 0) {
      await Notification.insertMany(adminNotifications);
    }

    res.status(201).json({ success: true, message: 'Contact request submitted successfully.', contactRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get contact requests for admin or the authenticated user
// @route   GET /api/contact-requests
// @access  Private
export const getContactRequests = async (req, res) => {
  try {
    let contactRequests;

    if (req.user.role === 'admin') {
      contactRequests = await ContactRequest.find()
        .populate('requester', 'name email role')
        .populate('course', 'title category fee startDate');
    } else {
      contactRequests = await ContactRequest.find({ requester: req.user._id })
        .populate('course', 'title category fee startDate')
        .sort('-createdAt');
    }

    res.json({ success: true, count: contactRequests.length, contactRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact request status (pending, approved, rejected)
// @route   PUT /api/contact-requests/:id/status
// @access  Private/Admin
export const updateContactRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status type.' });
    }

    const contactRequest = await ContactRequest.findById(req.params.id).populate('course');
    if (!contactRequest) {
      return res.status(404).json({ success: false, message: 'Contact request not found.' });
    }

    contactRequest.status = status;
    contactRequest.reviewedBy = req.user._id;
    contactRequest.reviewedAt = new Date();
    await contactRequest.save();

    const statusLabel = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated';
    await Notification.create({
      recipient: contactRequest.requester,
      message: `Your contact request for "${contactRequest.courseName}" has been ${statusLabel}.`,
      type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info',
    });

    res.json({ success: true, message: `Request status updated to ${status}.`, contactRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send organization contact details to the requesting user
// @route   POST /api/contact-requests/:id/send-contact-details
// @access  Private/Admin
export const sendContactDetails = async (req, res) => {
  try {
    const { organizationName, contactNumber, email, website, address } = req.body;

    if (!organizationName || !contactNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Organization name, contact number, and email are required to send details.',
      });
    }

    const contactRequest = await ContactRequest.findById(req.params.id).populate('requester course');
    if (!contactRequest) {
      return res.status(404).json({ success: false, message: 'Contact request not found.' });
    }

    contactRequest.organizationContact = {
      name: organizationName,
      phone: contactNumber,
      email,
      website: website || '',
      address: address || '',
    };
    contactRequest.contactSentAt = new Date();
    contactRequest.status = 'approved';
    contactRequest.reviewedBy = req.user._id;
    contactRequest.reviewedAt = new Date();
    await contactRequest.save();

    await Notification.create({
      recipient: contactRequest.requester._id,
      message: `Contact details for "${contactRequest.courseName}" have been shared with you by the admin.`,
      type: 'success',
      payload: {
        courseName: contactRequest.courseName,
        organizationContact: contactRequest.organizationContact,
        requestId: contactRequest._id,
      },
    });

    res.json({
      success: true,
      message: 'Organization contact details sent to the student successfully.',
      contactRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
