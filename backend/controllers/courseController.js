import Course from '../models/Course.js';

const buildCourseImageUrl = (req) => {
  if (!req.file) return req.body.image;
  return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
};

const normalizeArrayField = (value) => {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

// @desc    Get all courses with optional search/filter
// @route   GET /api/courses
// @access  Protected
export const getCourses = async (req, res) => {
  try {
    const {
      category,
      search,
      level,
      status,
      feeMin,
      feeMax,
      sort,
      page = 1,
      pageSize = 12,
    } = req.query;

    const query = {};

    if (!status || status === 'Active') {
      query.status = 'Active';
    } else if (status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
    }

    if (feeMin || feeMax) {
      query.fee = {};
      if (feeMin) query.fee.$gte = Number(feeMin);
      if (feeMax) query.fee.$lte = Number(feeMax);
    }

    let sortBy = { createdAt: -1 };
    if (sort === 'oldest') sortBy = { createdAt: 1 };
    if (sort === 'feeLow') sortBy = { fee: 1 };
    if (sort === 'feeHigh') sortBy = { fee: -1 };

    const skip = (Number(page) - 1) * Number(pageSize);
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(pageSize));

    res.json({ success: true, count: courses.length, total, page: Number(page), pageSize: Number(pageSize), courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Protected
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

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      image: buildCourseImageUrl(req),
      createdBy: req.user._id,
      totalSeats: Number(req.body.totalSeats) || 0,
      availableSeats: Number(req.body.availableSeats || req.body.totalSeats) || 0,
      requirements: normalizeArrayField(req.body.requirements),
      learningOutcomes: normalizeArrayField(req.body.learningOutcomes),
    };

    if (courseData.availableSeats > courseData.totalSeats) {
      courseData.availableSeats = courseData.totalSeats;
    }

    const courseExists = await Course.findOne({ title: courseData.title });
    if (courseExists) {
      return res.status(400).json({ success: false, message: 'Course with this title already exists' });
    }

    const course = await Course.create(courseData);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const courseData = {
      ...req.body,
      image: buildCourseImageUrl(req),
      totalSeats: Number(req.body.totalSeats) || course.totalSeats,
      availableSeats: Number(req.body.availableSeats !== undefined ? req.body.availableSeats : course.availableSeats) || course.availableSeats,
      requirements: normalizeArrayField(req.body.requirements),
      learningOutcomes: normalizeArrayField(req.body.learningOutcomes),
    };

    if (courseData.availableSeats > courseData.totalSeats) {
      courseData.availableSeats = courseData.totalSeats;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, courseData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle course active/inactive status
// @route   PUT /api/courses/:id/status
// @access  Private/Admin
export const toggleCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.status = status === 'Inactive' ? 'Inactive' : 'Active';
    await course.save();

    res.json({ success: true, course });
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

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload course image
// @route   POST /api/courses/upload
// @access  Private/Admin
export const uploadCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
