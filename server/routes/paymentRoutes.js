import dotenv from 'dotenv';
import { Router } from 'express';
import Stripe from 'stripe';
import { Booking } from '../models/Booking.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

dotenv.config();

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.use(authMiddleware);

/*
 * Create Stripe Checkout Session
 * POST /api/payments/create-checkout-session
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { bookingId } = req.body || {};

    if (!bookingId) {
      return res.status(400).json({
        message: 'Booking ID is required.',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found.',
      });
    }

    // Users can only pay for their own bookings
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You cannot pay for this booking.',
      });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'This booking has already been paid.',
      });
    }

    const amount = Math.round(Number(booking.totalAmount) * 100);

    if (!amount || amount < 100) {
      return res.status(400).json({
        message: 'Invalid booking amount.',
      });
    }

    const frontendUrl =
      process.env.CLIENT_ORIGIN || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      line_items: [
        {
          price_data: {
            currency: 'inr',

            product_data: {
              name: `${booking.carName} - DriveEase Car Rental`,
              description:
                `${booking.rentalDays} day rental | ` +
                `${booking.pickupLocation} to ${booking.dropoffLocation}`,
            },

            unit_amount: amount,
          },

          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking._id.toString(),
        userId: booking.userId.toString(),
      },

      success_url:
        `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${frontendUrl}/payment-cancelled?booking_id=${booking._id}`,
    });

    return res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('create checkout session:', error);

    return res.status(500).json({
      message: 'Unable to create payment session.',
    });
  }
});

export default router;