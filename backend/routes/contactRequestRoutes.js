import express from 'express';
import {
  createContactRequest,
  getContactRequests,
  updateContactRequestStatus,
  sendContactDetails,
} from '../controllers/contactRequestController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createContactRequest)
  .get(protect, getContactRequests);

router.route('/:id/status')
  .put(protect, adminOnly, updateContactRequestStatus);

router.route('/:id/send-contact-details')
  .post(protect, adminOnly, sendContactDetails);

export default router;
