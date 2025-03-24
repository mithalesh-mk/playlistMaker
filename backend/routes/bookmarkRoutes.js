const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const bookmarkController = require("../controllers/bookmarkController");

router.get("/bookmarks", authMiddleware, bookmarkController.bookmarks);
router.post("/bookmarks/:playlistId", authMiddleware, bookmarkController.addBookmark);
router.delete("/bookmarks/:playlistId", authMiddleware, bookmarkController.removeBookmark);
router.put("/bookmarks/:playlistId", authMiddleware, bookmarkController.isBookMarked);

module.exports = router;
