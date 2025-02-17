const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
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

    return res.status(200).send({
      message: "Created new user successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to upload" });
  }
});

//Log in user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
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
      data: token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
