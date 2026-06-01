import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
    },
    dob: {
      type: Date,
      required: [true, 'Please provide your date of birth'],
    },
    educationLevel: {
      type: String,
      required: [true, 'Please select your education level / A/L stream details'],
    },
    additionalNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
