const express = require("express");
const Comment = require("../models/commentModel");
const PlayList = require("../models/playlistModel");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//Add comment Routes
router.post("/addcomment/:playlistId", authMiddleware, async (req, res) => {
  try {
    //Saving into Comment database
    const comment = new Comment({
      text: req.body.text,
      rating: req.body.rating ? req.body.rating : 5,
      userId: req.body.userId,
    });

    await comment.save();

    //Saving comment id into playlist database
    const params = req.params.playlistId;

    const playlist = await PlayList.findById(params);

    if (!playlist) {
      return res.status(400).send({
        message: "Playlist Not found",
        data: error,
        success: false,
      });
    }

    playlist.comments.push(comment._id);
    await playlist.save();

    return res.status(200).send({
      message: "Comment uploaded",
      data: null,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Not able to comment",
      data: error,
      success: false,
    });
  }
});

// Add a reply to a comment
router.post("/addreply/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, replyText } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({
        message: "Comment not found",
        success: false,
      });
    }

    comment.replies.push({ userId, replyText });
    await comment.save();

    return res.status(200).send({
      message: "Reply added successfully",
      data: comment.replies,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to add reply",
      data: error,
      success: false,
    });
  }
});

//delete Comment
router.delete(
  "/deletecomment/:playlistId",
  authMiddleware,
  async (req, res) => {
    try {
      //Finding playlist where comment is
      const params = req.params.playlistId;
      console.log(params);
      const playlist = await PlayList.findById(params);

      if (!playlist) {
        return res.status(400).send({
          message: "Playlist Not found",
          data: null,
          success: false,
        });
      }

      //Finding comment id for the comment which will be deleted.
      const idOfComment = req.body.id;
      playlist.comments = playlist.comments.filter(
        (id) => id.toString() !== idOfComment
      );

      await playlist.save();

      //Deleting comment document

      await Comment.findByIdAndDelete(idOfComment);

      return res.status(200).send({
        message: "Comment deleted Successfully",
        data: null,
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Not able to delete comment",
        data: error,
        success: false,
      });
    }
  }
);

//Get All comment
router.get("/getcomments/:playlistId", authMiddleware, async (req, res) => {
  try {
    const params = req.params.playlistId;

    const playlist = await PlayList.findById(params);

    if (!playlist) {
      return res.status(400).send({
        message: "Playlist Not found",
        data: null,
        success: false,
      });
    }

    const playlistData = await playlist.populate("comments");

    return res.status(200).send({
      message: "Comment fetched Successfully",
      data: playlist.comments,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Not able to delete comment",
      data: error,
      success: false,
    });
  }
});

module.exports = router;
