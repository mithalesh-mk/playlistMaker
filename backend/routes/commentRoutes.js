const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

router.post("/addcomment/:playlistId", authMiddleware, commentController.addComment);
router.post("/addreply/:commentId", authMiddleware, commentController.addReply);
router.delete("/deletecomment/:playlistId/:id", authMiddleware, commentController.deleteComment);
router.get("/getcomments/:playlistId", authMiddleware, commentController.getComments);
router.put('/editcomment/:commentId', authMiddleware, commentController.editComment);
router.get('/sortcomments/:playlistId', authMiddleware, commentController.sortComments);

module.exports = router;