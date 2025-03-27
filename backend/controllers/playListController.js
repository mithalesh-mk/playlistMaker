const authMiddleware = require("../middleware/authMiddleware");
const Playlist = require("../models/playlistModel");
const mongoose = require("mongoose");

// Add a new playlist
exports.addPlaylist = async (req, res) => {
  try {
    const newPlayList = new Playlist({ ...req.body, user: req.body.userId });
    await newPlayList.save();
    return res.status(200).send({
      message: "Play List Created successfully",
      success: true,
      data: newPlayList,
    });
  } catch (error) {
    return res.status(500).send({
      message: "PlayList creation failed",
      data: error,
      success: false,
    });
  }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
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
      return res.status(500).send({
        message: "PlayList Cannot be deleted",
        data: error,
        success: false,
      });
    }
  };

//Get playlist details by playlist ID
exports.getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    // Fetch playlist by ID
    let playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    let Owner = true;

    if (playlist.user.toString() !== req.body.userId) {
      Owner = false;
    }
    // playlist = {
    //   ...playlist,
    //   isOwner: Owner,
    // };
    const playlistObj = playlist.toObject();
    playlistObj.isOwner = Owner;

    return res.json(playlistObj);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//Get playlist
exports.getPlaylist = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find all playlists with populated likes and dislikes
    const playlists = await Playlist.find({ user: userId })
      .populate("likes", "username") // Populate likes with user names
      .populate("dislikes", "username") // Populate dislikes with user names
      .populate("user", "username profilePic");

    if (playlists.length === 0) {
      return res.status(201).send({
        message: "No playlists found for this user",
        data: [],
        success: true,
      });
    }

    return res.status(200).send({
      message: "Playlists retrieved successfully",
      data: playlists,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to get playlists",
      error,
      success: false,
    });
  }
};

// Get all playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    const { category } = req.query; // Get category from query params

    let matchStage = {};
    if (category) {
      matchStage.category = category; // Apply category filter if provided
    }

    const playlists = await Playlist.aggregate([
      { $match: matchStage }, // Filter by category if provided
      {
        $addFields: {
          likeCount: { $size: "$likes" } // Count likes
        }
      },
      { $sort: { likeCount: -1 } }, // Sort by like count in descending order
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }, // Convert user array to object
      {
        $project: {
          name: 1,
          user: { _id: 1, username: 1, profilePic: 1 },
          videos: 1,
          description: 1,
          comments: 1,
          likes: 1,
          dislikes: 1,
          shares: 1,
          category: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    if (playlists.length === 0) {
      return res.status(200).send({
        message: "No playlists found",
        data: [],
        success: true,
      });
    }

    return res.status(200).send({
      message: "Playlists retrieved successfully",
      data: playlists,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to get playlists",
      error,
      success: false,
    });
  }
};




// Like a playlist
exports.likePlaylist = async (req, res) => {
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
      playlist.likes = playlist.likes.filter((id) => id.toString() !== userId);
    } else {
      // If the user has disliked it, remove the dislike
      playlist.dislikes = playlist.dislikes.filter(
        (id) => id.toString() !== userId
      );
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
    res.status(500).send({
      message: "Error updating like",
      success: false,
      data: error,
    });
  }
};

// Dislike a playlist
exports.dislikePlaylist = async (req, res) => {
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
      playlist.dislikes = playlist.dislikes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // If the user has liked it, remove the like
      playlist.likes = playlist.likes.filter((id) => id.toString() !== userId);
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
    res.status(500).send({
      message: "Error updating dislike",
      success: false,
      data: error,
    });
  }
};

exports.updateOrder = async (req, res) => {
  const { playlistId } = req.params;
  const { newOrder } = req.body; // Array of video IDs in correct order
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
      videos: newOrder,
    });
    if (!updatedPlaylist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    res.json({
      success: true,
      message: "Playlist order updated",
      updatedOrder: updatedPlaylist.videos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order" });
  }
};

// Update a playlist (name, description, category)
exports.updatePlaylist = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { playlistId } = req.params;
    const { name, description, category } = req.body;
    console.log(req.body,userId);
    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).send({
        message: "Playlist not found",
        success: false,
      });
    }

    // Check if the requesting user is the owner of the playlist
    if (playlist.user.toString() !== userId) {
      return res.status(403).send({
        message: "Unauthorized to edit this playlist",
        success: false,
      });
    }

    // Update playlist fields
    if (name) playlist.name = name;
    if (description) playlist.description = description;
    if (category) playlist.category = category;

    await playlist.save();

    return res.status(200).send({
      message: "Playlist updated successfully",
      success: true,
      data: playlist,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error updating playlist",
      success: false,
      data: error,
    });
  }
};


