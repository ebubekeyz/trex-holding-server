const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: ['true', 'Please provide your fullName'],
    },
    username: {
      type: String,
      required: ['true', 'Please provide your phone username'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
      unique: true,
    },
    phone: {
      type: String,
      required: ['true', 'Please provide your phone number'],
    },
    country: {
      type: String,
      required: ['true', 'Please provide your country'],
    },
    password: {
      type: String,
      required: [true, 'Password length should not be less than 6'],
      minlength: 6,
    },
    bitcoinAddress: {
      type: String,
    },
    etherumAddress: {
      type: String,
    },
    usdtTrc2Address: {
      type: String,
    },
    bitcoinCashAddress: {
      type: String,
    },
    liteCoinAddress: {
      type: String,
    },
    bnbAddress: {
      type: String,
    },
    tronAddress: {
      type: String,
    },
    xrpAddress: {
      type: String,
    },
    dogeCoinAddress: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isWait = await bcrypt.compare(candidatePassword, this.password);
  return isWait;
};

module.exports = mongoose.model('User', UserSchema);
