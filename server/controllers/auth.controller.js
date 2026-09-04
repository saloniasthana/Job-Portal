import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import validator from 'validator';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken, setTokenCookie } from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service.js';

// Toggle in .env — off by default so signup/login work without SMTP set up.
// Set REQUIRE_EMAIL_VERIFICATION=true once you've wired up real SMTP creds.
const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'Name, email, password and role are required');
  }
  if (!validator.isEmail(email)) throw new ApiError(400, 'Invalid email address');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');
  if (!['candidate', 'recruiter'].includes(role)) throw new ApiError(400, 'Invalid role');

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  if (!requireEmailVerification) {
    const user = new User({ name, email, password, role, isVerified: true });
    await user.save();

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    return res.status(201).json({ success: true, token, user: user.toSafeObject() });
  }

  const user = new User({ name, email, password, role });
  const rawToken = user.createVerificationToken();
  await user.save();

  await sendVerificationEmail(user, rawToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Check your email to verify your account.',
  });
});

// @route GET /api/auth/verify-email/:token
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  }).select('+verificationToken +verificationTokenExpires');

  if (!user) throw new ApiError(400, 'Verification link is invalid or has expired');

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);

  res.json({ success: true, message: 'Email verified', token, user: user.toSafeObject() });
});

// @route POST /api/auth/resend-verification
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  // Don't reveal whether the account exists
  if (!user || user.isVerified) {
    return res.json({ success: true, message: 'If that account exists, a verification email was sent.' });
  }

  const rawToken = user.createVerificationToken();
  await user.save();
  await sendVerificationEmail(user, rawToken);

  res.json({ success: true, message: 'If that account exists, a verification email was sent.' });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (requireEmailVerification && !user.isVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);

  res.json({ success: true, token, user: user.toSafeObject() });
});

// @route POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @route POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user) {
    return res.json({ success: true, message: 'If that account exists, a reset email was sent.' });
  }

  const rawToken = user.createResetToken();
  await user.save();
  await sendPasswordResetEmail(user, rawToken);

  res.json({ success: true, message: 'If that account exists, a reset email was sent.' });
});

// @route POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) throw new ApiError(400, 'Reset link is invalid or has expired');

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successful. You can now log in.' });
});
