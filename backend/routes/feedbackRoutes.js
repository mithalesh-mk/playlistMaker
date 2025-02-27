const express = require("express");
const Feedback = require("../models/feedbackModel");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all feedbacks with user details
router.get("/feedbacks", authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "username profilePic") // Fetch username & profile
      .select("message rating createdAt");


    return res.status(200).send({
      message: "Feedbacks retrieved successfully",
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", success: false });
  }
});

// Submit feedback
router.post("/feedbacks", authMiddleware, async (req, res) => {
           try {
             const { message, rating } = req.body;
             const userId = req.body.userId; // Get userId from middleware
             console.log("User ID:", userId);
         
             if (!message) {
               return res.status(400).send({
                 message: "Message is required",
                 success: false,
               });
             }
         
             if (!userId) {
               return res.status(400).send({
                 message: "User ID is missing",
                 success: false,
               });
             }
         
             const feedback = new Feedback({ user: userId, message, rating });
             await feedback.save();
         
             return res.status(201).send({
               message: "Feedback submitted successfully",
               success: true,
               data: feedback,
             });
           } catch (error) {
             console.error(error);
             return res.status(500).send({ message: "Server error", success: false });
           }
});
         
// Delete feedback (Admin or Owner)
router.delete("/feedbacks/:feedbackId", authMiddleware, async (req, res) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).send({
        message: "Feedback not found",
        success: false,
      });
    }
    // Check if the user is the owner of the feedback or an admin
    if (feedback.user.toString() !== req.body.userId) {
      return res.status(403).send({
        message: "Unauthorized to delete this feedback",
        success: false,
      });
    }

    await Feedback.findByIdAndDelete(feedbackId);

    return res.status(200).send({
      message: "Feedback deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", success: false });
  }
});

module.exports = router;
