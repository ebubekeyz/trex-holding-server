const PayReceipt = require('../models/PayReceipt');
const Amount = require('../models/Amount');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');

const createPayReceipt = async (req, res) => {
  req.body.user = req.user.userId;
  const payReceipt = await PayReceipt.create(req.body);

  const amount = await Amount.find({ user: req.user.userId });

  let { status, _id: amountId } = amount[amount.length - 1];
  console.log(status, amountId);
  const handleAmount = () => {
    status = 'confirmed';
  };

  const { receipt } = payReceipt;

  const email = req.user.email;
  const fullName = req.user.fullName;

  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"${fullName}" <${email}>`,
    to: `trexholding539@gmail.com`,
    subject: `PAYMENT RECEIPT FROM ${fullName}`,
    html: `<button>Please Confirm payment in your dashboard</button>`,
  });

  res.status(StatusCodes.CREATED).json({ payReceipt });
};

const getAllPayReceipt = async (req, res) => {
  const payReceipt = await PayReceipt.find({});
  res.status(StatusCodes.OK).json({ payReceipt, count: payReceipt.length });
};

const getUserPayReceipt = async (req, res) => {
  const payReceipt = await PayReceipt.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ payReceipt, count: payReceipt.length });
};

const updatePayReceipt = async (req, res) => {
  const { receipt } = req.body;
  const { id: payReceiptId } = req.params;
  const payReceipt = await PayReceipt.findOne({ _id: payReceiptId });
  if (!payReceiptId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${payReceiptId} exist`
    );
  }
  checkPermissions(req.user, payReceipt.user);
  payReceipt.receipt = receipt;

  await payReceipt.save();
  res.status(StatusCodes.OK).json({ msg: 'PayReceipt successfully updated' });
};

const getSinglePayReceipt = async (req, res) => {
  const { id: payReceiptId } = req.params;
  const payReceipt = await PayReceipt.findOne({ _id: payReceiptId });
  if (!payReceiptId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${payReceiptId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ payReceipt });
};

const deletePayReceipt = async (req, res) => {
  const { id: payReceiptId } = req.params;
  const payReceipt = await PayReceipt.findByIdAndRemove({ _id: payReceiptId });
  if (!payReceiptId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${payReceiptId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'PayReceipt successfully deleted' });
};

module.exports = {
  createPayReceipt,
  getAllPayReceipt,
  getUserPayReceipt,
  updatePayReceipt,
  getSinglePayReceipt,
  deletePayReceipt,
};
