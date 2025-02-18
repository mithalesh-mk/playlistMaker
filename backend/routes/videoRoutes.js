const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const router = express.Router();
const Video = require("../models/videoModel");
const PlayList = require("../models/playlistModel");

router.post("/addvideo/:playlistId", authMiddleware, async (req, res) => {
  try {
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";
    const params = {
      part: "snippet,statistics",
      id: "H42zWaD4A4s",
      key: "AIzaSyAR1pbG-NT53ssivVhzfGxkU2GKR7SLCXQ",
    };

    const videoData = await axios.get(API_URL, { params });
    if (!videoData.data.items.length) {
      return res.status(404).send({ message: "Video not found" });
    }
    const video = videoData.data.items[0];

    const videoObj = {
      title: video.snippet?.title || "Title not available",
      thumbnail:
        video.snippet?.thumbnails?.high?.url || "Thumbnail not available",
      duration: video.contentDetails?.duration || 0,
      description: video.snippet?.description || "Description not available",
      views: video.statistics?.viewCount || "Views not available",
      url: `https://www.youtube.com/watch?v=${params.id}`,
    };

    let savedVideo = await Video.findOneAndUpdate(
      { url: videoObj.url }, // Find by URL
      videoObj, // Update with new details
      { upsert: true, new: true } // Create if not found, return updated doc
    );

    //Checking playlist id from playlist database
    const param = req.params;
    const playlist = await PlayList.findById(params);
    if (!playlist) {
      return res.status(400).send({
        message: "Playlist Not present",
        success: false,
        data: [],
      });
    }

    if (!playlist.videos.includes(savedVideo._id)) {
      playlist.videos.push(savedVideo._id);
      await playlist.save();
    }

    return res.status(200).send({
      message: "Url added successfully",
      success: true,
      data: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to upload" });
  }
});

module.exports = router;
