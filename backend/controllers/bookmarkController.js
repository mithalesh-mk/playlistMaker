const User = require("../models/userModel");
const Playlist = require("../models/playlistModel");
const auth = require("../middleware/authMiddleware");

// Get all bookmarks for the authenticated user
exports.bookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).populate(
      "bookmarks",
      "playlistId user name description videos"
    );
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    return res.status(200).send({
      message: "Bookmarks retrieved successfully",
      success: true,
      data: user.bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", success: false });
  }
};

// Add a playlist to bookmarks
exports.addBookmark = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res
        .status(404)
        .send({ message: "Playlist not found", success: false });
    }

    const user = await User.findById(req.body.userId);

    if (user.bookmarks.includes(playlistId)) {
      return res
        .status(400)
        .send({ message: "Playlist already bookmarked", success: false });
    }

    user.bookmarks.push(playlistId);
    await user.save();

    return res.status(200).send({
      message: "Playlist added to bookmarks successfully",
      success: true,
      data: user.bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", success: false });
  }
};

// Remove a playlist from bookmarks
exports.removeBookmark = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const user = await User.findById(req.body.userId);

    if (!user.bookmarks.includes(playlistId)) {
      return res
        .status(400)
        .send({ message: "Playlist not found in bookmarks", success: false });
    }

    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== playlistId
    );
    await user.save();

    return res.status(200).send({
      message: "Playlist removed from bookmarks successfully",
      success: true,
      data: user.bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", success: false });
  }
};

exports.isBookMarked = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const user = await User.findById(req.body.userId);

    if (user.bookmarks.includes(playlistId)) {
      return res.status(200).send({
        message: "BooMarked",
        success: true,
        data: { isBookMark: true },
      });
    }

    return res.status(200).send({
      message: "BooMarked",
      success: true,
      data: { isBookMark: false },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Server Error",
      data: null,
      success: false,
    });
  }
};

