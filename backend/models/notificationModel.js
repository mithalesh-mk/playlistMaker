const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: false }, 
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: false }, 
    type: { type: String, required: true }, 
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
