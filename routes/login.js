var express = require('express');
var router = express.Router();


const userModel = require('./users')

const passport=require('passport');
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res,next) {
  res.render('login');
});

router.post("/login-me",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})

router.get('/logout',function(req,res,next){
  req.logout(function (err) {
    if(err){return next(err);}
    res.redirect('/');
  })
})

module.exports = router;
