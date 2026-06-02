import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  uploadCourseImage,
} from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateCourseInput } from '../middleware/courseValidation.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `course-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.'));
    }
  },
});

router.post('/upload', protect, adminOnly, upload.single('image'), uploadCourseImage);

router.route('/')
  .get(protect, getCourses)
  .post(protect, adminOnly, validateCourseInput, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, adminOnly, validateCourseInput, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

router.put('/:id/status', protect, adminOnly, toggleCourseStatus);

export default router;
