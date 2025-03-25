const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const playListController = require("../controllers/playListController");  

router.post("/addplaylist", authMiddleware, playListController.addPlaylist);
router.delete("/deleteplaylist/:playlistId", authMiddleware, playListController.deletePlaylist);
router.get("/getplaylist/:id", authMiddleware, playListController.getPlaylistDetails);
router.get("/userplaylists", authMiddleware, playListController.getPlaylist);
router.get("/allplaylists", authMiddleware, playListController.getAllPlaylists);
router.post("/:playlistId/like", authMiddleware, playListController.likePlaylist);
router.post("/:playlistId/dislike", authMiddleware, playListController.dislikePlaylist);
router.put("/updateOrder/:playlistId", playListController.updateOrder);
router.put("/updatePlaylist/:playlistId", playListController.updatePlaylist);

module.exports = router;
