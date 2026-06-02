import mongoose from 'mongoose';

const organizationContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: false },
    address: { type: String, required: false },
  },
  { _id: false }
);

const contactRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    requesterPhone: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    organizationContact: {
      type: organizationContactSchema,
      default: null,
    },
    contactSentAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
export default ContactRequest;
