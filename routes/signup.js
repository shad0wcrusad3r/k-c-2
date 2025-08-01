var express = require('express');
var router = express.Router();

const User = require('../models/User');

const passport=require('passport');
const localStrategy=require("passport-local");

passport.use(new localStrategy(User.authenticate()));

router.get("/", function (req,res){
    res.render('signup')
})

router.post('/register',function(req,res){
  const { username, phone, password, address } = req.body;

  const userdata = new User({ username, phone, address });

  User.register(userdata, password, (err, registeredUser) => {
    if (err) {
      console.error("Signup error:", err);
      return res.render('signup', { error: err.message });
    }

   // login the new user immediately
    req.login(registeredUser, (err) => {
      if (err) {
        console.error(err);
        return res.redirect('/login');
      }
      res.redirect('/home');
    });
  });
});

module.exports = router;