const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

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
module.exports = router;
