const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {  // ✅ Changed from "userId" to "user"
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0, // Minimum rating is 0
      max: 5, // Maximum rating is 5
      default: 5, // Default to 5 rating initially
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;



