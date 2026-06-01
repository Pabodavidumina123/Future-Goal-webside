import Course from '../models/Course.js';

// @desc    Get all courses with optional search/filter
// @route   GET /api/courses
// @access  Public (or protected if needed - let's make it public/protected)
export const getCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Apply category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Apply search filter (case insensitive matching)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query);
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      res.json({ success: true, course });
    } else {
      res.status(404).json({ success: false, message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      duration,
      fee,
      learningOutcomes,
      instructor,
      requirements,
      availableSeats,
      startDate,
    } = req.body;

    const courseExists = await Course.findOne({ title });
    if (courseExists) {
      return res.status(400).json({ success: false, message: 'Course with this title already exists' });
    }

    const course = await Course.create({
      title,
      description,
      image,
      category,
      duration,
      fee,
      learningOutcomes,
      instructor,
      requirements,
      availableSeats,
      startDate,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await Course.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
