import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function setAuthCookie(res, user) {
  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.cookie(process.env.COOKIE_NAME || 'driveease_token', token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(process.env.COOKIE_NAME || 'driveease_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body || {};
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!EMAIL_PATTERN.test(String(email).trim())) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    const digits = String(phone).replace(/\D/g, '');
    if (!PHONE_PATTERN.test(digits)) {
      return res.status(400).json({ message: 'Enter a valid 10-digit Indian mobile number.' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: digits,
      passwordHash,
      role: 'customer',
    });

    setAuthCookie(res, user);
    return res.status(201).json({ user: user.toPublicJSON() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    console.error('register:', error);
    return res.status(500).json({ message: 'Unable to register right now.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    setAuthCookie(res, user);
    return res.json({ user: user.toPublicJSON() });
  } catch (error) {
    console.error('login:', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out.' });
});

router.get('/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user.toPublicJSON() });
});

export default router;
