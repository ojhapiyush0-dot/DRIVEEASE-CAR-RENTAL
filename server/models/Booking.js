import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  carId: { type: String, required: true, index: true },
  carName: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  returnDate: { type: String, required: true },
  returnTime: { type: String, required: true },
  pickupAt: { type: Date, required: true },
  returnAt: { type: Date, required: true },
  rentalDays: { type: Number, required: true, min: 1 },
  pricePerDay: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model('Booking', bookingSchema);
