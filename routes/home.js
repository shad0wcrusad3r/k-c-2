var express = require('express');
var router = express.Router();
const Cart = require('../models/Cart');

router.get('/', isLoggedIn,async function(req, res, next) {
  //res.render('home');
  let phone = req.user.phone || "";

  // remove everything except digits
  phone = phone.replace(/\D/g, "");

  // if phone is longer than 10, trim to last 10 digits (common for +91)
  if (phone.length > 10) {
    phone = phone.slice(-10);
  }

  // Get cart items count
  let cartCount = 0;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cartCount = cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  } catch (err) {
    console.error(err);
  }

  res.render('home',{
    username: req.user.username,
    phone,
    cartCount
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

router.get('/count', async (req, res) => {
  if (!req.isAuthenticated()) return res.json({ count: 0 });

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const count = cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.json({ count: 0 });
  }
});

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Successfully logged out.');
    
    // Destroy session & clear cookie
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // session cookie name
      res.redirect('/login'); // redirect to login page
    });
  });
});


module.exports = router;