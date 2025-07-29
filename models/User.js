const mongoose = require('../database/db'); // reuse existing connection
const plm = require('passport-local-mongoose')


//mongoose.connect("mongodb://127.0.0.1:27017/kulkarni-catering");

const userSchema = mongoose.Schema({
  username:String,
  password:String,
  phone:String
});

userSchema.plugin(plm)

module.exports = mongoose.model("User",userSchema);