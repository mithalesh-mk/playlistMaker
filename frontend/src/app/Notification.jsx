import { useEffect, useState } from "react";
import socket from "../socket"; // Your socket instance
import axios from "axios";
import { useAuth } from "@/userContext/AuthProvider";
import axiosInstance from "@/axiosInstance";

const NotificationComponent = () => {
  
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:3000/api/notifications`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Listen for new notifications in real-time
  useEffect(() => {
    socket.on("newNotification", (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  console.log('notifications', notifications)

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.length> 0 && notifications.map((notif) => (
          <li key={notif}>
            <strong>{notif.sender.username}</strong> {" "} {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
