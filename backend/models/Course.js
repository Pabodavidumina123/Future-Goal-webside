import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add an instructor name'] },
  email: { type: String, required: [true, 'Please add an instructor email'] },
  phone: { type: String, required: [true, 'Please add an instructor phone number'] },
  bio: { type: String, required: [true, 'Please add instructor bio'] },
  image: { type: String, required: [true, 'Please add an instructor image URL'] },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a course category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    duration: {
      type: String,
      required: [true, 'Please add a course duration'],
    },
    fee: {
      type: Number,
      required: [true, 'Please add a course fee in LKR'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: [true, 'Please add a course level'],
    },
    image: {
      type: String,
      required: [true, 'Please add a course image URL'],
    },
    organization: {
      type: String,
      required: [true, 'Please add the organization/institute name'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    email: {
      type: String,
      required: [true, 'Please add a contact email address'],
    },
    website: {
      type: String,
      required: [true, 'Please add a website URL'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a course start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add a course end date'],
    },
    schedule: {
      type: String,
      required: [true, 'Please add a course schedule'],
    },
    location: {
      type: String,
      required: [true, 'Please add the course location'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please specify total seats'],
      min: [1, 'Total seats must be at least 1'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Please specify available seats'],
      min: [0, 'Available seats cannot be negative'],
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalSeats;
        },
        message: 'Available seats cannot exceed total seats',
      },
    },
    requirements: {
      type: [String],
      default: [],
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    instructor: {
      type: instructorSchema,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
