const { Server } = require("socket.io");
const Notification = require("./models/notificationModel");

let io;
let onlineUsers = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
      
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        onlineUsers.set(userId.toString(), socket.id);
        console.log(`User ${userId} is online.`);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} went offline.`);
          break;
        }
      }
    });
  });
};

// Function to send real-time notifications
const sendNotification = async (userId, notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    const recipientSocketId = onlineUsers.get(userId.toString());
    if (recipientSocketId && io) {
      io.to(recipientSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { initializeSocket, sendNotification };
