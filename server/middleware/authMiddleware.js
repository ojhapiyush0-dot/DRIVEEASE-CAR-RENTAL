import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function authMiddleware(req, res, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || 'driveease_token';
    const token = req.cookies?.[cookieName];
    if (!token) {
      return res.status(401).json({ message: 'Please log in to continue.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'Session is no longer valid. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}

export function optionalAuth(req, res, next) {
  const cookieName = process.env.COOKIE_NAME || 'driveease_token';
  const token = req.cookies?.[cookieName];
  if (!token) {
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err || !payload?.userId) {
      return next();
    }
    try {
      req.user = await User.findById(payload.userId);
    } catch (error) {
      console.error('optionalAuth:', error.message);
    }
    next();
  });
}
