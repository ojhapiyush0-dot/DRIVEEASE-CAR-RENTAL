import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { Car } from '../models/Car.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { rangesOverlap } from '../utils/bookingUtils.js';

const router = Router();
const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

router.use(authMiddleware, adminMiddleware);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })),
    });
  } catch (error) {
    console.error('admin users:', error);
    return res.status(500).json({ message: 'Unable to load users.' });
  }
});

router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ name: 1 });
    return res.json({
      cars: cars.map((car) => ({
        id: car.id,
        name: car.name,
        category: car.category,
        price: car.price,
      })),
    });
  } catch (error) {
    console.error('admin cars:', error);
    return res.status(500).json({ message: 'Unable to load cars.' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email').sort({ createdAt: -1 });
    return res.json({
      bookings: bookings.map((booking) => ({
        id: booking._id.toString(),
        user: booking.userId?.name || 'Unknown',
        userEmail: booking.userId?.email || '',
        car: booking.carName,
        pickup: booking.pickupLocation,
        dropoff: booking.dropoffLocation,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        total: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      })),
    });
  } catch (error) {
    console.error('admin bookings:', error);
    return res.status(500).json({ message: 'Unable to load bookings.' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalCars, totalBookings, pendingBookings, confirmedBookings] = await Promise.all([
      User.countDocuments(),
      Car.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
    ]);
    return res.json({ totalUsers, totalCars, totalBookings, pendingBookings, confirmedBookings });
  } catch (error) {
    console.error('admin stats:', error);
    return res.status(500).json({ message: 'Unable to load dashboard stats.' });
  }
});

router.patch('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (status === 'confirmed') {
      const others = await Booking.find({
        _id: { $ne: booking._id },
        carId: booking.carId,
        status: 'confirmed',
      });
      const clash = others.find((other) =>
        rangesOverlap(other.pickupAt, other.returnAt, booking.pickupAt, booking.returnAt)
      );
      if (clash) {
        return res.status(409).json({ message: 'This car is already booked for the selected time.' });
      }
    }

    booking.status = status;
    await booking.save();
    return res.json({ booking });
  } catch (error) {
    console.error('admin patch booking:', error);
    return res.status(500).json({ message: 'Unable to update booking.' });
  }
});

export default router;
