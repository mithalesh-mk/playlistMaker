const express = require("express");
const connectDB = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");
const playlistRoutes = require("./routes/playListRoutes");
const bookMarkRoutes = require("./routes/bookmarkRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRouter = require("./routes/commentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRouter");
const http = require("http");
const { initializeSocket } = require("./socket");
const cors = require("cors");
require("dotenv").config();
const passport = require('passport')
require('./config/passport');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(passport.initialize())


// Initialize Socket.io
initializeSocket(server);


app.use("/api/auth", authRoutes);
app.use("/api/playlist", playlistRoutes);
app.use("/api/bookmark", bookMarkRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRouter);
app.use("/api", feedbackRoutes);
app.use("/api", notificationRoutes);

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
