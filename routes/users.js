var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const plm = require('passport-local-mongoose')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


mongoose.connect("mongodb://127.0.0.1:27017/kulkarni.catering");

const userSchema = mongoose.Schema({
  username:String,
  password:String,
  phone:String
});

userSchema.plugin(plm)

module.exports = mongoose.model("user",userSchema);

