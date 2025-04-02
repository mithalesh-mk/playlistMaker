import { useEffect, useState } from "react";
import socket from "../socket";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]); // Add new notification to state
    });

    return () => {
      socket.off("newNotification"); // Clean up event listener on unmount
    };
  }, []);

  console.log("Notifications:", notifications); // Log notifications to console 

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.map((notif, index) => (
        <div key={index}>{notif.type} from {notif.sender}</div>
      ))}
    </div>
  );
};

export default Notifications;
