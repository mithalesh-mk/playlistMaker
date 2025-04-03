import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance';
import AnimatedLoader from '@/components/Loading';
import socket from '@/socket';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    if (window.location.pathname !== '/login') {
      localStorage.removeItem('auth_token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = new URLSearchParams(window.location.search).get('token');

      if (token) {
        localStorage.setItem('auth_token', token);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

      const savedToken = localStorage.getItem('auth_token');

      if (!savedToken) {
        setLoading(false);
        return; // Don't call handleLogout() here to avoid unnecessary redirects
      }

      try {
        const response = await axiosInstance.get('/auth/verify');

        if (response.data.success) {
          console.log('User verified:', response.data);
          setUser(response.data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.log('Verification failed:', error);
        handleLogout();
      } finally {
        setLoading(false); // ✅ Always set loading to false at the end
      }
    };

    verifyUser();
  }, []);


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
    socket.emit('join', user?._id); // Join the socket room with the user's ID
    socket.on("newNotification", (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [notifications]);

  if (loading) return <AnimatedLoader />;

  const handleLogin = (token, userData) => {
    localStorage.setItem('auth_token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`; // ✅ Set header on login
    setUser(userData);
    
    const userId = userData._id; // Replace with actual user ID

    if (userId) {
      socket.emit('join', userId);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, handleLogin, handleLogout,notifications, setNotifications }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
