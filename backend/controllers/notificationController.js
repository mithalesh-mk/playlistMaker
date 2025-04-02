const Notification = require("../models/notificationModel");
const { sendNotification } = require("../socket"); // Import sendNotification
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
// Middleware to check if the notification is older than 30 days
const checkNotificationAge = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Delete notifications older than 30 days
  await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
};

// Controller: Get notifications for a user, sorted by recent
exports.getNotifications = async (req, res) => {
           try {
             const userId = req.body.userId; // Assuming authMiddleware adds userId to req
         
             // Remove old notifications (older than 30 days)
             await checkNotificationAge();
         
             // Fetch notifications for the user, sorted by creation date
             const notifications = await Notification.find({ user: userId })
               .sort({ createdAt: -1 }) // Sort by most recent
               .populate("sender", "username") // Optionally populate sender details
               .populate("playlist", "name") // Optionally populate playlist name
               .populate("comment", "text") // Optionally populate comment text
               .lean(); // Convert to plain objects
         
             console.log("Notifications:", notifications);
         
             // Include the notification type in the response
             const result = notifications.map(notification => ({
               ...notification,
               type: notification.type, // Show the type of notification
             }));
         
             res.status(200).json({
               success: true,
               message: "Notifications retrieved successfully",
               data: result,  // Send the mapped result
             });
           } catch (error) {
             res.status(500).json({
               success: false,
               message: "Error retrieving notifications",
               error: error.message,
             });
           }
         };
         

// Controller: Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find the notification and mark it as read
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Mark as read
    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking notification as read",
      error: error.message,
    });
  }
};
