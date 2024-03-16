const mongoose = require('mongoose');

const AmountSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Amount', AmountSchema);
