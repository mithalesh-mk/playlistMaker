const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Playlist = require("../models/playlistModel");
const router = express.Router();

// Add a new playlist
router.post("/addplaylist", authMiddleware, async (req, res) => {
  try {
    console.log(req.body.userId);
    const newPlayList = new Playlist({ ...req.body, user: req.body.userId });
    await newPlayList.save();
    return res.status(200).send({
      message: "Play List Created successfully",
      success: true,
      data: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "PlayList creation failed",
      data: error,
      success: false,
    });
  }
});

// Delete a playlist
router.delete(
  "/deleteplaylist/:playlistId",
  authMiddleware,
  async (req, res) => {
    try {
      const playlistId = req.params.playlistId;
      const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
      if (!deletedPlaylist)
        return res.status(400).send({
          message: "Play List not found",
          success: false,
          data: "",
        });
      return res.status(200).send({
        message: "PlayList Deleted successfully",
        data: "",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "PlayList Cannot be deleted",
        data: error,
        success: false,
      });
    }
  }
);
// Like a playlist
router.post("/:playlistId/like", authMiddleware, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.body.userId;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).send({
        message: "Playlist not found",
        success: false,
      });
    }

    // Check if the user has already liked the playlist
    if (playlist.likes.includes(userId)) {
      // If the user has liked it, remove the like
      playlist.likes = playlist.likes.filter((id) => id !== userId);
    } else {
      // If the user has disliked it, remove the dislike
      playlist.dislikes = playlist.dislikes.filter((id) => id !== userId);
      // Add the like
      playlist.likes.push(userId);
    }

    await playlist.save();

    res.status(200).send({
      message: "Playlist like updated successfully",
      success: true,
      data: {
        likes: playlist.likes.length,
        dislikes: playlist.dislikes.length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error updating like",
      success: false,
      data: error,
    });
  }
});

// Dislike a playlist
router.post("/:playlistId/dislike", authMiddleware, async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.body.userId;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).send({
        message: "Playlist not found",
        success: false,
      });
    }

    // Check if the user has already disliked the playlist
    if (playlist.dislikes.includes(userId)) {
      // If the user has disliked it, remove the dislike
      playlist.dislikes = playlist.dislikes.filter((id) => id !== userId);
    } else {
      // If the user has liked it, remove the like
      playlist.likes = playlist.likes.filter((id) => id !== userId);
      // Add the dislike
      playlist.dislikes.push(userId);
    }

    await playlist.save();

    res.status(200).send({
      message: "Playlist dislike updated successfully",
      success: true,
      data: {
        likes: playlist.likes.length,
        dislikes: playlist.dislikes.length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error updating dislike",
      success: false,
      data: error,
    });
  }
});

module.exports = router;