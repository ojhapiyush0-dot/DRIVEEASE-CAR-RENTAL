import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDb } from './config/db.js';
import { Car } from './models/Car.js';
import { User } from './models/User.js';
import { CARS } from '../src/data/cars.js';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'driveease' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('unhandled:', err);
  res.status(500).json({ message: 'Server error.' });
});

async function seedFleet() {
  for (const car of CARS) {
    await Car.updateOne({ id: car.id }, { $set: car }, { upsert: true });
  }

  console.log(`Fleet synced (${CARS.length} cars)`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Existing user promoted to admin:', email);
    }

    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'DriveEase Admin',
    email: email.toLowerCase(),
    phone: process.env.ADMIN_PHONE || '9999999999',
    passwordHash: await bcrypt.hash(password, 12),
    role: 'admin',
  });

  console.log('Admin account created:', email);
}

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required in .env');
    process.exit(1);
  }

  try {
    await connectDb(process.env.MONGODB_URI);
    await seedFleet();
    await seedAdmin();
  } catch (error) {
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`DriveEase API listening on http://localhost:${PORT}`);
  });
}

start();