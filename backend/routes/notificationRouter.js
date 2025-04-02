const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");   
const notificationController = require("../controllers/notificationController");

router.get("/notifications", authMiddleware, notificationController.getNotifications);
router.patch("/notifications/:notificationId", authMiddleware, notificationController.markNotificationAsRead);

module.exports = router;
