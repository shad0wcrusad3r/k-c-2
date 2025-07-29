const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.post('/add', async (req, res) => {
console.log("Cart Add Request:", req.body); // 👈 log what you get

  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not logged in' });

  const { dishId, name, price, image, quantity } = req.body; // ✅ include quantity

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.dishId === dishId);

    if (existingItem) {
      if (quantity <= 0) {
        // Remove item if quantity is zero or less
        cart.items = cart.items.filter(item => item.dishId !== dishId);
      } else {
        // Update existing item
        existingItem.quantity = quantity;
      }
    } else if (quantity > 0) {
      // Add new item only if quantity is positive
      cart.items.push({ dishId, name, price, image, quantity });
    }

    // remove items that are 0
    cart.items = cart.items.filter(item => item.quantity > 0);
    cart.updatedAt = Date.now();

    if (cart.items.length === 0) {
      // If cart is empty, delete it
      await Cart.deleteOne({ user: req.user._id });
    } else {
      await cart.save();
    }

    const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    res.json({ success: true, cartCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});



router.post('/update', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not logged in' });

  const { dishId, change } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const item = cart.items.find(i => i.dishId === dishId);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      cart.updatedAt = Date.now();
      await cart.save();
    }
  }

  res.json({ success: true, cart });
});

router.get('/count', isLoggedIn, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const count = cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
    res.json({ count });
  } catch (err) {
    res.json({ count: 0 });
  }
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

router.get('/items', async (req, res) => {
  if (!req.isAuthenticated()) return res.json({ items: [] });
  const cart = await Cart.findOne({ user: req.user._id });
  res.json({ items: cart ? cart.items : [] });
});


module.exports = router;
