const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const playListController = require("../controllers/playListController");

const { upload, uploadErrorHandler } = require("../config/cloudinaryConfig");

router.post("/addplaylist", authMiddleware, playListController.addPlaylist);
router.delete(
  "/deleteplaylist/:playlistId",
  authMiddleware,
  playListController.deletePlaylist
);
router.get(
  "/getplaylist/:id",
  authMiddleware,
  playListController.getPlaylistDetails
);
router.get("/userplaylists", authMiddleware, playListController.getPlaylist);
router.get("/allplaylists", authMiddleware, playListController.getAllPlaylists);

router.post(
  "/:playlistId/like",
  authMiddleware,
  playListController.likePlaylist
);
router.post(
  "/:playlistId/dislike",
  authMiddleware,
  playListController.dislikePlaylist
);
router.put(
  "/updateOrder/:playlistId",
  authMiddleware,
  playListController.updateOrder
);

router.get(
  "/share/:shareableId",
  authMiddleware,
  playListController.getPlaylistByShareableId
);
router.put("/updatePlaylist/:playlistId",authMiddleware, upload.single('image'),uploadErrorHandler, playListController.updatePlaylist);


router.post(
  "/:playlistId/like",
  authMiddleware,
  playListController.likePlaylist
);
router.post(
  "/:playlistId/dislike",
  authMiddleware,
  playListController.dislikePlaylist
);
router.put(
  "/updateOrder/:playlistId",
  authMiddleware,
  playListController.updateOrder
);

router.get(
  "/share/:shareableId",
  authMiddleware,
  playListController.getPlaylistByShareableId
);
router.get("/random", authMiddleware, playListController.getTenPlaylists);

module.exports = router;
