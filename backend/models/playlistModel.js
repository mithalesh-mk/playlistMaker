const mongoose = require("mongoose");
const shortid = require("shortid");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null, // Default thumbnail URL
    },
    shareableId: { type: String, unique: true, default: shortid.generate } // New field
  },
  { timestamps: true }
);

//text indexing
playlistSchema.index({ name: "text", description: "text", category: "text" });

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
