const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const videoController = require("../controllers/videoController");
const router = express.Router();

router.post("/addvideo/:playlistId", authMiddleware, videoController.addVideo);
router.delete("/deletevideo/:playlistId", authMiddleware, videoController.deleteVideo);
router.get("/getvideo/:playlistId/videos", authMiddleware, videoController.getVideo);

module.exports = router;



