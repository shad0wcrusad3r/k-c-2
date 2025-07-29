var express = require('express');
var router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');

router.get('/', isLoggedIn, async function(req, res, next) {
  const cart = await Cart.findOne({ user: req.user._id }) || { items: [] };
  res.render('checkout', { cart: cart ? cart.items : [] });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}



router.post('/confirm', isLoggedIn, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.json({ success: false, error: 'Cart is empty' });
    }

    // calculate total
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // create new order
    const order = new Order({
      user: req.user._id,
      items: cart.items,
      totalAmount,
      status: 'Pending'
    });

    await order.save();

    // clear the cart
    await Cart.deleteOne({ user: req.user._id });

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
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