import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token from the header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database by the ID inside the token (exclude password)
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        // Enforce active viewMode workspace as req.user.role for permission guards
        user.role = user.viewMode || user.role || 'USER';
      }
      req.user = user;

      // Move to the next function (allow access)
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

export const recruiterOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
};