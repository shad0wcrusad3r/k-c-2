var express = require('express');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res, next) {
  res.render('checkout');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
module.exports=router;