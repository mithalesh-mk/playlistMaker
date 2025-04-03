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
    if(playlist.user.toString() !== req.body.userId) {
      const notificationData = {
        user: playlist.user,
        sender: req.body.userId,
        playlist: params,
        comment: comment._id,
        type: 'comment',
        message: `commented on your playlist ${playlist.name}`,
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
        message: `replied to your comment`,
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


exports.deleteComment = async (req, res) => {
  try {
    // Extract playlistId from params (assuming route is like /comment/delete/:playlistId)
    const { playlistId,id } = req.params;
    console.log('Playlist ID:', playlistId);

    // Validate playlistId
    if (!playlistId) {
      return res.status(400).send({
        message: 'Playlist ID is required',
        data: null,
        success: false,
      });
    }

    // Find the playlist
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      return res.status(404).send({
        message: 'Playlist not found',
        data: null,
        success: false,
      });
    }

    // Extract comment ID from body
    

    if (!id) {
      return res.status(400).send({
        message: 'Comment ID is required',
        data: null,
        success: false,
      });
    }

    // Check if comment exists in playlist.comments (assuming it's an array of IDs)
    const commentExists = playlist.comments.some(
      (commentId) => commentId.toString() === id
    );
    if (!commentExists) {
      return res.status(404).send({
        message: 'Comment not found in this playlist',
        data: null,
        success: false,
      });
    }

    // Remove comment from playlist.comments
    playlist.comments = playlist.comments.filter(
      (commentId) => commentId.toString() !== id
    );
    await playlist.save();


    // Delete the comment document
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).send({
        message: 'Comment not found in database',
        data: null,
        success: false,
      });
    }

    return res.status(200).send({
      message: 'Comment deleted successfully',
      data: null,
      success: true,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).send({
      message: 'Unable to delete comment',
      data: error.message,
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

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Extract commentId from request parameters
    const { text, rating } = req.body; // Extract new text and rating from request body

    // Find the comment by ID and update it
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text, rating },
      { new: true } // Return the updated document
    );

    if (!updatedComment) {
      return res.status(404).send({
        message: 'Comment not found',
        data: null,
        success: false,
      });
    }

    return res.status(200).send({
      message: 'Comment updated successfully',
      data: updatedComment,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to update comment',
      data: error.message,
      success: false,
    });
  }
}


exports.sortComments = async (req, res) => {
  try {
    const {playlistId} = req.params;
    const {sort} = req.query; // Get sort parameter from query string
    // Find the playlist by ID
    const playlist = await PlayList.findById(playlistId).populate({
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
      return res.status(404).send({
        message: 'Playlist not found',
        data: null,
        success: false,
      });
    }
    let sortedComments = playlist.comments;
    // Sort comments by rating in descending order
    if(sort === 'rating') {
      sortedComments = playlist.comments.sort((a, b) => {
        return b.rating - a.rating; // Sort in descending order
      });
    }
    else if(sort === 'date') {
      sortedComments = playlist.comments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort in ascending order
      });
    }
    else {
      return res.status(400).send({
        message: 'Invalid sort parameter',
        data: null,
        success: false,
      });
    }
    // Send the sorted comments as a response
    return res.status(200).send({
      message: 'Comments sorted successfully',
      data: sortedComments,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to sort comments',
      data: error.message,
      success: false,
    });
    
  }
}
