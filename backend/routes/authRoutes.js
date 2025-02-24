const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");
const OTP = require("../models/otpModel");
require("dotenv").config();

const router = express.Router();

//Registering of user

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
   
    if (user)
      return res.status(400).send({
        message: "User Already exist",
        success: false,
    });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      message: "Created new user successfully.",
      token: token,
      user: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to upload" });
  }
});

//Log in user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).send({
        message: "User Does Not Exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.send({
      message: "logged in successfully",
      success: true,
      user: user,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get("/verify", authMiddleware, async (req, res) => {
  // The userId is decoded from the token in the authMiddleware
  const userId = req.body.userId;

  const user = await User.findById(userId).select("-password");

  return res.status(200).json({
    message: "User verified",
    success: true,
    user: user, // Send back the userId
  });
});

router.post("/select-avatar", async (req, res) => {
  const { avatar,id } = req.body; 
  console.log(avatar) 

  // Save the avatar to the user in the database
  const user = await User.findOneAndUpdate({ _id: id },{
    profilePic: avatar
  });  
  return res.status(200).json({
    message: "Avatar selected successfully",
    success: true,
  }); 
});
// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "User not found", success: false });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    console.log("Generated OTP:", otp);

    // Store OTP in database
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpExpires } }, 
      { new: true }
    );

    console.log("Updated User:", updatedUser); // Debugging

    if (!updatedUser.otp) {
      console.log("❌ OTP was not stored properly!");
    }

    // Send OTP via email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.status(200).send({ message: "OTP sent to email", success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send({ message: "Error sending OTP", success: false });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.otp);
    console.log("OTP Expiry Time:", user.otpExpires, "Current Time:", Date.now());

    if (!user.otp || user.otp !== otp) {
      return res.status(400).send({ message: "Invalid OTP", success: false });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).send({ message: "Expired OTP", success: false });
    }

    res.status(200).send({ message: "OTP verified", success: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ message: "Error verifying OTP", success: false });
  }
});




// Reset password after OTP verification
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user.otp);
    console.log("OTP Expiry Time:", user.otpExpires, "Current Time:", Date.now());

    // Check if OTP is valid and not expired
    if (!user.otp || user.otp !== otp) {
      return res.status(400).send({ message: "Invalid OTP", success: false });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).send({ message: "Expired OTP", success: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password & remove OTP fields
    await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword, otp: null, otpExpires: null } }
    );

    res.status(200).send({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ message: "Error resetting password", success: false });
  }
});

/// Change Password Route
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword, reenterNewPassword } = req.body;
    const userId = req.body.userId; 

    // Check if new passwords match
    if (newPassword !== reenterNewPassword) {
      return res.status(400).send({ message: "New passwords do not match", success: false });
    }

    // Fetch user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    // Compare old password with stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Old password is incorrect", success: false });
    }

    // Check if the new password is the same as the old password
    const isSameAsOldPassword = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOldPassword) {
      return res.status(400).send({ message: "New password cannot be the same as the old password", success: false });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send({ message: "Server error", success: false });
  }
});


module.exports = router;
