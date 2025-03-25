const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/feedbackController");

router.get("/feedbacks", feedbackController.getFeedbacks);
router.post("/feedbacks", authMiddleware, feedbackController.submitFeedback);
router.delete("/feedbacks/:feedbackId", authMiddleware, feedbackController.deleteFeedback);

module.exports = router;