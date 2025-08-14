var express = require('express');
var router = express.Router();
var axios = require('axios')
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User')
require('dotenv').config();

router.get('/', isLoggedIn, async function(req, res, next) {
  const cart = await Cart.findOne({ user: req.user._id }) || { items: [] };
  const user = await User.findById(req.user._id).lean();

  res.render('checkout', { cart: cart ? cart.items : [] , user});
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

async function sendTelegram(chatId, message, orderId) {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await axios.post(url, {
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Accept", callback_data: `ACCEPT_${orderId}` }],
          [{ text: "❌ Reject", callback_data: `REJECT_${orderId}` }]
        ]
      }
    });
    console.log("Telegram message sent:", res.data);
  } catch (err) {
    console.error("Telegram send error:", err.response?.data || err.message);
  }
}



router.post('/confirm', isLoggedIn, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const user = await User.findById(req.user._id);

    if (!cart || cart.items.length === 0) {
      return res.json({ success: false, error: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { paymentMethod, cookingRequest, orderDate } = req.body;

    const order = new Order({
      user: req.user._id,
      items: cart.items,
      totalAmount,
      paymentMethod: req.body.paymentMethod,
      cookingRequest,
      orderDate,
      status: 'Pending',
      clientResponse: 'Pending'
    });

    await order.save();
    await Cart.deleteOne({ user: req.user._id });

    // Include user address in WhatsApp message
    const msg = `📦 New Order Received!
Customer: ${user.username}
Phone: ${user.phone}
Address: ${user.address}
Items:\n${cart.items.map(i => `${i.quantity}x ${i.name}`).join('\n')}
Total: ₹${totalAmount}
Payment: ${req.body.paymentMethod.toUpperCase()}
Cooking Request: ${cookingRequest || "None"}
Date: ${orderDate}`;

    

    if (!paymentMethod) {
      return res.json({ success: false, error: 'Payment method required' });
    }
    
if (!orderDate) {
  return res.status(400).json({ success: false, error: "Order Date is required." });
}

    console.log("Payment method received:", req.body.paymentMethod);


    
await sendTelegram(process.env.CLIENT_TELEGRAM_CHAT_ID, msg, order._id);

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/status/:orderId', isLoggedIn, async (req, res) => {
  try {
      res.set('Cache-Control', 'no-store'); // ✅ disable caching

    const order = await Order.findById(req.params.orderId);
    if (!order || !order.user.equals(req.user._id)) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ clientResponse: order.clientResponse });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/update', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not logged in' });

  const { dishId, change } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const item = cart.items.find(i => i.dishId === dishId);
    if (item) {
      item.quantity = Math.max(0, item.quantity + change);
    }
    cart.items = cart.items.filter(i => i.quantity > 0); // remove 0-qty items
    cart.updatedAt = Date.now();
    await cart.save();
  }

  res.json({ success: true, cart });
});


module.exports=router;