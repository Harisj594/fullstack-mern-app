const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse"); // ✅

// Helper to generate JWTs
const createToken = (payload, secret, expiry) => {
  jwt.sign(payload, secret, { expiresIn: expiry });
};

// Register New User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic input validation
    if (!name || !email || !password)
      return sendResponse(res, 400, "All fields are required", null, false);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return sendResponse(res, 400, "User already registered", null, false);

    // HashedPassword
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Create JWT
    const accessToken = createToken(
      { userId: user._id },
      process.env.JWT_LOGIN_SECRET,
      "1h",
    );

    // Response
    return sendResponse(res, 201, "Registered successfully", {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return sendResponse(res, 500, error.message, null, false);
  }
};

// Login Existing User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password)
      return sendResponse(res, 400, "All fields are required", null, false);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return sendResponse(res, 400, "Invalid credentials", null, false);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return sendResponse(res, 400, "Invalid credentials", null, false);

    // Sign JWT
    const accessToken = createToken(
      { userId: user._id },
      process.env.JWT_LOGIN_SECRET,
      "15",
    );
    const refreshToken = createToken(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      "7d",
    );

    // Set cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Response
    return sendResponse(res, 200, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return sendResponse(res, 500, error.message, null, false);
  }
};

// REFRESH ACCESS TOKEN
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return sendResponse(res, 401, 'No refresh token', null, false);

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    const newAccessToken = createToken({ userId: user._id }, process.env.JWT_SECRET, '15m');

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    sendResponse(res, 200, 'Token refreshed', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    sendResponse(res, 401, 'Invalid refresh token', null, false);
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  sendResponse(res, 200, 'Logged out successfully', {});
};