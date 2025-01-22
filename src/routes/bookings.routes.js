import { Router } from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  deleteBooking,
} from '../controllers/bookings.controllers.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/bookings', authRequired, getBookings);
router.get('/bookings/:id', authRequired, getBooking);
router.post('/bookings', authRequired, createBooking);
router.delete('/bookings/:id', authRequired, deleteBooking);

export default router;
