import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import AnimatedLoader from "@/components/Loading";

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("auth_token");
      setUser(null);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      if (token) {
        localStorage.setItem("auth_token", token);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const savedToken = localStorage.getItem("auth_token");

      if (!savedToken) {
        setLoading(false);
        return; // Don't call handleLogout() here to avoid unnecessary redirects
      }

      try {
      
        const response = await axiosInstance.get("/auth/verify");

        if (response.data.success) {
          console.log("User verified:", response.data);
          setUser(response.data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.log("Verification failed:", error);
        handleLogout();
      } finally {
        setLoading(false); // ✅ Always set loading to false at the end
      }
    };

    verifyUser();
  }, []);

  if (loading) return <AnimatedLoader />;

  const handleLogin = (token, userData) => {
    localStorage.setItem("auth_token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`; // ✅ Set header on login
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
