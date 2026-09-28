import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  LOCATIONS,
  calculateRentalDays,
  findConflict,
  parseDateTime,
} from '../utils/bookingUtils.js';

const router = Router();

const PENDING_HOLD_MINUTES = Number(process.env.PENDING_HOLD_MINUTES || 30);

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (error) {
    console.error('list bookings:', error);
    return res.status(500).json({ message: 'Unable to load bookings.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You cannot view this booking.' });
    }
    return res.json({ booking });
  } catch (error) {
    console.error('get booking:', error);
    return res.status(500).json({ message: 'Unable to load this booking.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      carId,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
    } = req.body || {};

    if (!carId || !pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !returnDate || !returnTime) {
      return res.status(400).json({ message: 'All booking fields are required.' });
    }
    if (!LOCATIONS.includes(pickupLocation) || !LOCATIONS.includes(dropoffLocation)) {
      return res.status(400).json({ message: 'Choose a supported pickup and drop-off location.' });
    }

    const pickupAt = parseDateTime(pickupDate, pickupTime);
    const returnAt = parseDateTime(returnDate, returnTime);
    if (!pickupAt || !returnAt) {
      return res.status(400).json({ message: 'Enter valid pickup and return dates and times.' });
    }

    const rentalDays = calculateRentalDays(pickupAt, returnAt);
    if (rentalDays < 1 || returnAt <= pickupAt) {
      return res.status(400).json({
        message: 'Return must be after pickup. Rental duration cannot be zero.',
      });
    }

    const car = await Car.findOne({ id: carId });
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    const existing = await Booking.find({ carId: car.id });
    const conflict = findConflict(existing, pickupAt, returnAt, new Date(), PENDING_HOLD_MINUTES);
    if (conflict) {
      return res.status(409).json({ message: 'This car is already booked for the selected time.' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      carId: car.id,
      carName: car.name,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupAt,
      returnAt,
      rentalDays,
      pricePerDay: car.price,
      totalAmount: rentalDays * car.price,
      status: 'pending',
      paymentStatus: 'pending',
    });

    return res.status(201).json({ booking });
  } catch (error) {
    console.error('create booking:', error);
    return res.status(500).json({ message: 'Unable to create booking.' });
  }
});

export default router;
