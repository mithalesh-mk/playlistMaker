const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Playlist = require("../models/playlistModel");
const router = express.Router();

router.post("/addplaylist", authMiddleware, async (req, res) => {
  try {
    const newPlayList = new Playlist({ ...req.body, user: req.body.userId });
    await newPlayList.save();
    return res.status(200).send({
      message: "Play List Created successfully",
      success: true,
      data: "",
    });
  } catch (error) {
    return res.status(500).send({
      message: "PlayList creation failed",
      data: error,
      success: false,
    });
  }
});

module.exports = router;
