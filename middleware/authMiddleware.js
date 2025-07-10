const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResponse = require('../utils/sendResponse');

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return sendResponse(res, 401, 'Unauthorized', null, false);

  try {
    const decoded = jwt.verify(token, process.env.JWT_LOGIN_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    return sendResponse(res, 401, 'Token expired or invalid', null, false);
  }
};

// export.protect = async (req, res, next) => {
//   let token;

//   // Check for token in Authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1]; // Get token after "Bearer"

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_LOGIN_SECRET);

//       // Attach user to request (exclude password)
//       req.user = await User.findById(decoded.userId).select('-password');

//       next(); // Proceed to the route
//     } catch (err) {
//       console.error(err);
//       return res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

module.exports = isAuthenticated;
