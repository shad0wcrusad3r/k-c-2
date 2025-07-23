var express = require('express');
var router = express.Router();

const userModel = require('./users')

const passport=require('passport');
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req,res){
    res.render('signup')
})

router.post('/register',function(req,res){
  var userdata=new userModel({
    username:req.body.username,
    phone:req.body.phone
  });


  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })

  })
})

module.exports = router;