import { use, useEffect, useState } from "react";
import socket from "../socket"; // Your socket instance
import axios from "axios";
import { useAuth } from "@/userContext/AuthProvider";
import axiosInstance from "@/axiosInstance";

const NotificationComponent = () => {
  
  const { user, notifications,setNotifications } = useAuth(); // Assuming you have a way to get the current user and notifications
  console.log(user)
  useEffect(() => {
    const markRead = async (notificationId) => {
      try {
        await axiosInstance.patch(`/notifications/${notificationId}`);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        console.log("Notification marked as read:", notificationId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    notifications.map((notification => {
      if(notification.isRead === false) {
        markRead(notification._id)
      }
    })
    )
  },[])

    
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
