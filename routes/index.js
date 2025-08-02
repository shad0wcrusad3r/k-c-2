var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    success: req.flash('success')
  });
});

module.exports = router;
