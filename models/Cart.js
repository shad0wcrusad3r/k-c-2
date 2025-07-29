const mongoose = require('../database/db'); // reuse existing connection

const cartItemSchema = new mongoose.Schema({
  dishId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
