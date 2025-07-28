var express = require('express');
var router = express.Router();
const User = require('../models/User');

// example route (if you want to list users)
router.get('/', async function(req, res) {
  const users = await User.find();
  res.json(users);
});

module.exports = router;