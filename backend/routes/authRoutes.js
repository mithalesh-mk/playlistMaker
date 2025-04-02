const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const passport = require('passport')
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/verify", authMiddleware, authController.verify);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authMiddleware, authController.changePassword);
router.put("/change-username", authMiddleware, authController.changeUsername);
router.put("/change-profile-picture", authMiddleware, authController.changeProfilePicture);
router.post("/select-avatar", authController.selectAvatar);
router.delete("/delete-account", authMiddleware, authController.deleteUser);


// oauth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
  (req, res) => {
    if (!req.user) {
      return res.redirect('http://localhost:5173/login');
    }

    // ✅ The user will be available here from the authentication process
    const user = req.user;

   

    // ✅ Generate JWT token after successful login
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );


    // ✅ Redirect to frontend with token as a query param
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

module.exports = router;
