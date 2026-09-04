import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/apiError.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const bearer = req.headers.authorization;
  const token = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : req.cookies?.token;

  if (!token) throw new ApiError(401, 'Not authenticated');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Session expired, please log in again');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, `Access restricted to: ${roles.join(', ')}`);
  }
  next();
};
