const mongoose = require('../database/db'); // or require('mongoose') if you kept connection in User.js

const orderItemSchema = new mongoose.Schema({
  dishId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: Number,
  paymentMethod: { type: String, enum: ['cod', 'upi'], required: true },
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Delivered, Rejected
  clientResponse: { type: String, default: 'Pending' }, // Pending, Accepted, Rejected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
