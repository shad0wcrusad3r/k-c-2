var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
  //res.render('home');
  let phone = req.user.phone || "";

  // remove everything except digits
  phone = phone.replace(/\D/g, "");

  // if phone is longer than 10, trim to last 10 digits (common for +91)
  if (phone.length > 10) {
    phone = phone.slice(-10);
  }
  res.render('home',{
    username: req.user.username,
    phone
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;