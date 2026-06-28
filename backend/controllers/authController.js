import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { formatUserResponse, ensureSuperAdminRole } from '../utils/userResponse.js';
import { logLogin, logUserActivity } from '../utils/logger.js';
import AdminInvite from '../models/AdminInvite.js';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, inviteToken } = req.body;

    // SECURITY FIX: Validate input before hitting the database
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });
    
    // Check invite token if provided during signup
    if (inviteToken) {
      const invite = await AdminInvite.findOne({ token: inviteToken, isUsed: false });
      if (invite && invite.expiresAt > Date.now()) {
        user.role = invite.role;
        user.realRole = invite.role;
        user.viewMode = invite.role;
        await user.save({ validateBeforeSave: false });
        invite.isUsed = true;
        invite.usedBy = user._id;
        await invite.save();
      }
    }

    await ensureSuperAdminRole(user);
    await logUserActivity(user._id, 'REGISTER', `Registered account: ${email}`, req.ip);

    if (user) {
      return res.status(201).json(formatUserResponse(user, generateToken(user._id)));
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
      }
      if (user.status === 'banned') {
        return res.status(403).json({ message: 'Your account has been permanently banned.' });
      }
      await ensureSuperAdminRole(user);
      user.lastLoginDate = new Date();
      await user.save({ validateBeforeSave: false });
      await logLogin(user._id, req.ip, req.headers['user-agent']);
      return res.status(200).json(formatUserResponse(user, generateToken(user._id)));
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile (Protected)
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json(formatUserResponse(user));
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching profile' });
  }
};

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });

    // Security: Always return success to avoid revealing whether the email exists
    if (!user) {
      return res.status(200).json({
        message: 'If an account exists with that email, we have sent a reset link',
      });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token and store it on the user document
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build the reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Configure nodemailer transport with fallback
    let transporter;
    let mailFrom = process.env.SMTP_USER;

    if (!process.env.SMTP_USER) {
      console.log('No SMTP config found in .env. Creating an Ethereal test mail account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      mailFrom = testAccount.user;
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    const mailOptions = {
      from: `"HireCraft" <${mailFrom}>`,
      to: user.email,
      subject: 'Password Reset Request - HireCraft',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">HireCraft Password Reset</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">HireCraft — AI-Powered Career Accelerator</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!process.env.SMTP_USER) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Reset Email Sent successfully! Ethereal Preview URL:', previewUrl);
      return res.status(200).json({
        message: 'If an account exists with that email, we have sent a reset link',
        previewUrl,
      });
    }

    return res.status(200).json({
      message: 'If an account exists with that email, we have sent a reset link',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error sending reset email' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error resetting password' });
  }
};

// @desc    Login or register via Google credential
// @route   POST /api/auth/google-login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Decode the JWT payload (base64url-encoded second segment)
    const payloadSegment = credential.split('.')[1];
    const decodedPayload = JSON.parse(
      Buffer.from(payloadSegment, 'base64url').toString('utf-8')
    );

    const { email, name, picture } = decodedPayload;

    if (!email) {
      return res.status(400).json({ message: 'Unable to extract email from Google token' });
    }

    // Find existing user or create a new one
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }
    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been permanently banned.' });
    }

    await ensureSuperAdminRole(user);
    user.lastLoginDate = new Date();
    await user.save({ validateBeforeSave: false });
    await logLogin(user._id, req.ip, req.headers['user-agent']);

    return res.status(200).json(formatUserResponse(user, generateToken(user._id)));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Google login failed' });
  }
};

// @desc    Claim an admin/recruiter invitation
// @route   POST /api/auth/claim-invite
export const claimInvite = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    const invite = await AdminInvite.findOne({ token, isUsed: false });
    if (!invite) {
      return res.status(400).json({ message: 'Invalid, used, or expired invitation token' });
    }
    if (invite.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invitation token has expired' });
    }

    // Must be logged in to claim the invite (which req.user guarantees)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = invite.role;
    user.realRole = invite.role;
    user.viewMode = invite.role;
    await user.save({ validateBeforeSave: false });

    invite.isUsed = true;
    invite.usedBy = user._id;
    await invite.save();

    await logUserActivity(user._id, 'CLAIM_INVITE', `Claimed invite for role ${invite.role}`, req.ip);

    return res.status(200).json({
      message: `Successfully promoted to ${invite.role}!`,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to claim invitation' });
  }
};