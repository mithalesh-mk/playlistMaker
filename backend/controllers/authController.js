const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");
const Playlist=require("../models/playlistModel");
const OTP = require("../models/otpModel");
require("dotenv").config();



const pendingUsers = new Map(); // { email: { username, email, otp, otpExpires } }

// Step 1: Signup 
exports.register = async (req, res) => {
  try {
    const { username, email,password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username and email are required", success: false });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email already registered", success: false });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Store user temporarily until they verify OTP

    pendingUsers.set(email, { username, email, password, otp, otpExpires });

    const emailBody = `
    <div style="max-width: 500px; margin: 50px auto; background: #1e1e1e; padding: 40px; border-radius: 12px; box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1); text-align: center;">
        <h2 style="color: #ffffff; font-size: 26px; margin-bottom: 15px; font-weight: 600;">EMAIL Verification</h2>
        <p style="color: #bbbbbb; font-size: 16px; line-height: 1.6;">Use the One-Time Password (OTP) below to verify your identity.</p>
        <div style="font-size: 34px; font-weight: bold; color: #ffffff; padding: 15px 30px; background: #393939; display: inline-block; border-radius: 8px; margin-top: 10px;">
            <span style="display: inline-block; letter-spacing:10px; margin-left: 10px">${otp}</span>
        </div>
        <div>
          <p style="color: #aaaaaa; font-size: 14px; margin-top: 20px;">This OTP is valid for a short period. Please do not share it with anyone.</p>
          <p style="color: #888888; font-size: 12px;">If you did not request this OTP, please ignore this email.</p>
          <hr style="border: 0; height: 1px; background: #333; margin: 25px 0;">
        <img src="https://res.cloudinary.com/dhzeynyhc/image/upload/v1740514032/Vessel_logo_nt0ofw.png" width="85" height="85" alt="Logo">
        </div>   
    </div>
    `; 
    // Send OTP via email
    await sendEmail(email, "Email Verification OTP", emailBody);

    res.status(200).json({ message: "OTP sent to email. Verify to continue.", success: true });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

//Verify OTP & Register 
exports.verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP and password are required", success: false });
    }

    // Find user entry by OTP
    let userEntry = [...pendingUsers.values()].find(entry => entry.otp === otp);

    if (!userEntry) {
      return res.status(400).json({ message: "Invalid OTP. Try again.", success: false });
    }

    const { username, email,password, otpExpires } = userEntry;

    // Check if OTP is expired
    if (Date.now() > otpExpires) {
      pendingUsers.delete(email);
      return res.status(401).json({ message: "OTP expired. Request a new one.", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered. Please log in.", success: false });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    // Remove user from pending list after successful registration
    pendingUsers.delete(email);

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Registration successful", token, user:newUser, success: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


//Log in user
exports.login = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(409).send({
        message: "User Does Not Exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(410).send({
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
};
exports.verify = async (req, res) => {
  // The userId is decoded from the token in the authMiddleware
  const userId = req.body.userId;

  const user = await User.findById(userId).select("-password");

  return res.status(200).json({
    message: "User verified",
    success: true,
    user: user, // Send back the userId
  });
};
// Select avatar
exports.selectAvatar = async (req, res) => {
  const { avatar,id } = req.body; 
  console.log(avatar) 

  // Save the avatar to the user in the database
  const user = await User.findOneAndUpdate({ _id: id },{
    profilePic: avatar
  });  
  return res.status(200).json({
    message: "Avatar selected successfully",
    user,
    success: true,
  }); 
};
// Forgot password
exports.forgotPassword = async (req, res) => {
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

    const emailBody = `
    <div style="max-width: 500px; margin: 50px auto; background: #1e1e1e; padding: 40px; border-radius: 12px; box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1); text-align: center;">
        <h2 style="color: #ffffff; font-size: 26px; margin-bottom: 15px; font-weight: 600;">OTP Verification</h2>
        <p style="color: #bbbbbb; font-size: 16px; line-height: 1.6;">Use the One-Time Password (OTP) below to verify your identity.</p>
        <div style="font-size: 34px; font-weight: bold; color: #ffffff; padding: 15px 30px; background: #393939; display: inline-block; border-radius: 8px; margin-top: 10px;">
            <span style="display: inline-block; letter-spacing:10px; margin-left: 10px">${otp}</span>
        </div>
        <div>
          <p style="color: #aaaaaa; font-size: 14px; margin-top: 20px;">This OTP is valid for a short period. Please do not share it with anyone.</p>
          <p style="color: #888888; font-size: 12px;">If you did not request this OTP, please ignore this email.</p>
          <hr style="border: 0; height: 1px; background: #333; margin: 25px 0;">
        <img src="https://res.cloudinary.com/dhzeynyhc/image/upload/v1740514032/Vessel_logo_nt0ofw.png" width="85" height="85" alt="Logo">
        </div>   
    </div>
    `; 


    // Send OTP via email
    await sendEmail(email, "Password Reset OTP", emailBody);

    res.status(200).send({ message: "OTP sent to email", success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send({ message: "Error sending OTP", success: false });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
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
      return res.status(401).send({ message: "Invalid OTP", success: false });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(402).send({ message: "Expired OTP", success: false });
    }

    res.status(200).send({ message: "OTP verified", success: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ message: "Error verifying OTP", success: false });
  }
};


// Reset password after OTP verification
exports.resetPassword = async (req, res) => {
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
};

// Change Password 
exports.changePassword = async (req, res) => {
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
};
// Change username
exports.changeUsername = async (req, res) => {
  try {
    const userId = req.body.userId; // Get user ID from middleware
    const newUsername = req.body.newUsername?.trim(); // Trim early

    // Validate newUsername
    if (!newUsername || typeof newUsername !== "string" || newUsername.length < 3) {
      return res.status(400).json({
        message: "Invalid username. It must be at least 3 characters long.",
        success: false,
      });
    }
    // Find user and update username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.username = newUsername;
    await user.save();

    return res.status(200).json({
      message: "Username updated successfully",
      success: true,
      data: { username: user.username, email: user.email },
    });

  } catch (error) {
    console.error("Error updating username:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
// change avatar
exports.changeProfilePicture = async (req, res) => {
  try {
    const userId = req.body.userId; // Get user ID from authenticated user
    const { avatar } = req.body; // avatar = image URL

    if (!avatar || typeof avatar !== "string" || !avatar.trim()) {
      return res.status(400).json({ message: "Invalid avatar URL", success: false });
    }

    // Validate MongoDB ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID", success: false });
    }

    // Update the user's profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: avatar.trim() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "Profile picture updated successfully",
      success: true,
      profilePictureUrl: user.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// delete user

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId; // Extract user ID from request

    // Validate user ID
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID", success: false });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Delete user's playlists
    await Playlist.deleteMany({ user: userId });
    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and associated playlists deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};