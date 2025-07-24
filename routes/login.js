var express = require('express');
var router = express.Router();


const userModel = require('./users')

const passport=require('passport');
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res,next) {
  res.render('login');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.'
}));



module.exports = router;
