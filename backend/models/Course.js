import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true }
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    image: {
      type: String,
      required: [true, 'Please add a course image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    duration: {
      type: String,
      required: [true, 'Please add a duration'],
    },
    fee: {
      type: Number,
      required: [true, 'Please add a course fee in LKR'],
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    instructor: {
      type: instructorSchema,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Please specify available seats'],
      default: 30,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a course start date'],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
