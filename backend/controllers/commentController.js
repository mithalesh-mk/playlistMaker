const Comment = require('../models/commentModel');
const PlayList = require('../models/playlistModel');
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require('../models/notificationModel');
const { sendNotification } = require('../socket');

//Add comment Routes
exports.addComment = async (req, res) => {
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
        message: 'Playlist Not found',
        data: error,
        success: false,
      });
    }

    playlist.comments.push(comment._id);
    await playlist.save();

    //Sending notification to the owner of the playlist
    if(playlist.userId.toString() !== req.body.userId) {
      const notificationData = {
        user: playlist.userId,
        sender: req.body.userId,
        playlist: params,
        comment: comment._id,
        type: 'comment',
      };

      const notification = new Notification(notificationData);
      await notification.save();
      sendNotification(playlist.user.toString(), notificationData);
    }

    return res.status(200).send({
      message: 'Comment uploaded',
      data: null,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Not able to comment',
      data: error,
      success: false,
    });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, replyText } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({
        message: 'Comment not found',
        success: false,
      });
    }

    comment.replies.push({ userId, replyText });
    await comment.save();

    // Sending notification to the owner of the comment
    if(comment.userId.toString() !== userId) {
      const notificationData = {
        user: comment.userId,
        sender: userId,
        playlist: comment.playlist,
        comment: comment._id,
        type: 'reply',
      };
      const notification = new Notification(notificationData);
      await notification.save();
      sendNotification(comment.userId.toString(), notificationData);
    }

    return res.status(200).send({
      message: 'Reply added successfully',
      data: comment.replies,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to add reply',
      data: error,
      success: false,
    });
  }
};

//delete Comment
exports.deleteComment = async (req, res) => {
  try {
    //Finding playlist where comment is
    const params = req.params.playlistId;
    console.log(params);
    const playlist = await PlayList.findById(params);

    if (!playlist) {
      return res.status(400).send({
        message: 'Playlist Not found',
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
      message: 'Comment deleted Successfully',
      data: null,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Not able to delete comment',
      data: error,
      success: false,
    });
  }
};


// Get All comments
exports.getComments = async (req, res) => {
  try {
    const params = req.params.playlistId;

    const playlist = await PlayList.findById(params).populate({
      path: 'comments',
      populate: [
        {
          path: 'userId', // Populate user details
        },
        {
          path: 'replies', // Populate replies for each comment
          populate: {
            path: 'userId', // Populate user details for each reply
          }
        }
      ]
    });

    if (!playlist) {
      return res.status(400).send({
        message: 'Playlist Not found',
        data: null,
        success: false,
      });
    }

    return res.status(200).send({
      message: 'Comments fetched Successfully',
      data: playlist.comments,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Not able to fetch comments',
      data: error.message,
      success: false,
    });
  }
};
