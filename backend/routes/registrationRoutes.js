import express from 'express';
import {
  createRegistration,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from '../controllers/registrationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createRegistration)
  .get(protect, getRegistrations);

router.route('/:id/status')
  .put(protect, adminOnly, updateRegistrationStatus);

router.route('/:id')
  .delete(protect, adminOnly, deleteRegistration);

export default router;
