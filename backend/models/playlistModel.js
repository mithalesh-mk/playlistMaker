const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        videos: [
            {
                type: String, 
                required: true,
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        rating: {
            type: Number,
            min: 0, // Minimum rating is 0
            max: 5, // Maximum rating is 5
            default: 0, // Default to 0 rating initially
        },
        shares: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
