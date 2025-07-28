var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('profile',{
    username: req.user.username,
    phone: req.user.phone
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
    res.redirect('/');
  });
});

module.exports = router;