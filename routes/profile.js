var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer({ limits: { fileSize: 5000000 } }); // 2MB limit

router.get('/', isLoggedIn, function(req, res, next) {
  let phone = req.user.phone || "";

  // remove everything except digits
  phone = phone.replace(/\D/g, "");

  // if phone is longer than 10, trim to last 10 digits (common for +91)
  if (phone.length > 10) {
    phone = phone.slice(-10);
  }
  res.render('profile', {
    user: {
      username: req.user.username,
      phone: phone,
      profilePicture: req.user.profilePicture 
    }
  });

  router.post('/update', isLoggedIn, async function(req, res, next) {
  try {
    const { username, phone } = req.body;
    
    // Validate input
    if (!username || username.length < 2) {
      return res.status(400).json({ error: "Username must be at least 2 characters" });
    }
    
    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      return res.status(400).json({ error: "Phone number must be 10 digits" });
    }
    
    // Update user in database
    req.user.username = username;
    req.user.phone = cleanedPhone;
    await req.user.save();
    
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    next(err);
  }
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
    
    // Destroy session & clear cookie
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // session cookie name
      res.redirect('/login'); // redirect to login page
    });
  });
});

router.post('/upload-picture', isLoggedIn, upload.single('profilePicture'), async function(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Convert to base64 or save to file system/cloud storage
    const imageData = req.file.buffer.toString('base64');
    req.user.profilePicture = `data:${req.file.mimetype};base64,${imageData}`;
    await req.user.save();
    
    res.json({ success: true, imageUrl: req.user.profilePicture });
  } catch (err) {
    next(err);
  }
});

module.exports = router;