import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, adminOnly, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .delete(protect, adminOnly, deleteCourse);

export default router;
