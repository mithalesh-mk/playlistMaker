const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const router = express.Router();
const Video = require("../models/videoModel");
const PlayList = require("../models/playlistModel");

//Extracting video Id from video URL
const extractVideoId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([0-9A-Za-z_-]{11})/
  );
  return match ? match[1] : null;
};

router.post("/addvideo/:playlistId", authMiddleware, async (req, res) => {
  try {
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";
    const params = {
      part: "snippet,contentDetails,statistics", // ✅ Added contentDetails
      id: extractVideoId(req.body.url), // ✅ Accept videoId dynamically from request body
      key: process.env.YOUTUBE_API_KEY,
    };

    const response = await axios.get(API_URL, { params });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).send({ message: "Video not found" });
    }

    //To convert duration from seconds to time
    const parseISO8601Duration = (duration) => {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      if (!match) return 0;

      const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
      const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
      const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;

      const time = [hours, minutes, seconds];
      return time;
    };

    const video = response.data.items[0];

    //Creating Video Object
    const videoObj = {
      title: video.snippet?.title || "Title not available",
      thumbnail:
        video.snippet?.thumbnails?.high?.url || "Thumbnail not available",
      duration: parseISO8601Duration(video.contentDetails?.duration) || [
        0, 0, 0,
      ], // ✅ Now works correctly
      description: video.snippet?.description || "Description not available",
      views: video.statistics?.viewCount || "Views not available",
      url: req.body.url, // ✅ Generated dynamically
    };

    let savedVideo = await Video.findOneAndUpdate(
      { url: videoObj.url }, // Prevent duplicate videos
      videoObj,
      { upsert: true, new: true }
    );

    // ✅ Fetch playlist correctly using req.params.playlistId
    const playlist = await PlayList.findById(req.params.playlistId);
    if (!playlist) {
      return res.status(400).send({
        message: "Playlist Not present",
        success: false,
        data: [],
      });
    }

    // ✅ Avoid duplicate video entries in playlist
    if (!playlist.videos.includes(savedVideo._id)) {
      playlist.videos.push(savedVideo._id);
      await playlist.save();
    }

    return res.status(200).send({
      message: "Video added successfully",
      success: true,
      data: savedVideo, // ✅ Send video details instead of an empty array
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to upload" });
  }
});

// Delete video route
router.delete("/deletevideo/:playlistId", authMiddleware, async (req, res) => {
  try {
    const { url } = req.body; // Get video URL from request body
    const playlistId = req.params.playlistId; // Get playlist ID from params

    if (!url) {
      return res.status(400).json({ message: "Video URL is required" });
    }

    const videoId = extractVideoId(url); // Extract video ID
    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL" });
    }

    // Find and delete video from the database
    const deletedVideo = await Video.findOneAndDelete({ url });
    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Find playlist and remove video reference
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.videos = playlist.videos.filter(
      (video) => video.toString() !== deletedVideo._id.toString()
    );
    await playlist.save();

    return res.status(200).json({
      message: "Video deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get playlist details with videos
router.get("/getvideo/:playlistId/videos", authMiddleware, async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Find playlist
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Fetch videos from the Video collection
    const videos = await Video.find({ _id: { $in: playlist.videos } });

    return res.status(200).json({
      message: "Videos fetched successfully",
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
