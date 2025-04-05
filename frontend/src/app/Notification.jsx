import { useEffect, useState } from "react";
import { CircleSmall, X } from "lucide-react";
import { useAuth } from "@/userContext/AuthProvider";
import axiosInstance from "@/axiosInstance";
import { useNavigate } from 'react-router-dom';


const NotificationComponent = ({ isOpen, onClose }) => {
  const { notifications, setNotifications } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const markRead = async (notificationId) => {
      try {
        await axiosInstance.patch(`/notifications/${notificationId}`);
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );


      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    notifications.forEach((notification) => {
      if (!notification.isRead) {
        markRead(notification._id);
      }
    });
  }, [notifications]);

  console.log(notifications);
  console.log(playlists);

  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-60 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      onClick={onClose}
    >
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-96 md:w-[28rem] lg:w-[32rem] max-h-screen 
        bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl
        transform transition-all duration-500 ease-in-out p-4 sm:p-6
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900
        overflow-y-auto"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-700/50 sticky top-0 bg-gray-900/95 z-10 backdrop-blur-sm">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
          >
            <X size={24} className="text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Notifications List */}
        <ul className="mt-6 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <li
                key={index}
                onClick={() => {
                  navigate(`/playlists/${notif.playlist._id}`)
                  onClose();
                  }}
                className="p-4 flex items-start gap-3 bg-gray-800/50 rounded-xl 
                hover:bg-gray-700/70 transition-all duration-200 border border-gray-700/30
                hover:border-gray-600/50 group animate-in fade-in slide-in-from-top-2"
              >
                <CircleSmall
                  size={20}
                  className="text-blue-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <strong className="text-blue-400 font-semibold block truncate">
                    {notif.sender.username}
                  </strong>
                  <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-center py-12 px-4">
              <div className="animate-pulse">
                <CircleSmall size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-lg">No notifications yet</p>
                <p className="text-sm mt-2">Check back later!</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationComponent;