// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    otp: {
      type: String, // used for verification or reset password
    },

    otpExpiresAt: {
      type: Date, // expires in 5 or 10 minutes
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);
