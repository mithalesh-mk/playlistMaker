const express = require("express");
const connectDB = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const playlistRoutes = require("./routes/playListRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/playlist", playlistRoutes);

// Connect to MongoDB
connectDB();

// Sample Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
