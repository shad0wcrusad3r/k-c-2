var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
  let phone = req.user.phone || "";

  // remove everything except digits
  phone = phone.replace(/\D/g, "");

  // if phone is longer than 10, trim to last 10 digits (common for +91)
  if (phone.length > 10) {
    phone = phone.slice(-10);
  }
  res.render('profile',{
    username: req.user.username,
    phone
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
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