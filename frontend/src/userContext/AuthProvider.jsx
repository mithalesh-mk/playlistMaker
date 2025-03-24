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
      const token = localStorage.getItem("auth_token"); // ✅ Retrieve token

      if (!token) {
        setLoading(false);
        handleLogout();
        return;
      }

      console.log("token", token);
      try {
        const response = await axiosInstance.get("/auth/verify");

        if (response.data.success) {
          console.log("response", response.data);
          setUser(response.data.user);
        } else {
          setLoading(false);
          handleLogout();
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log("Verification failed:", error);
        handleLogout();
        return;
      }
           setLoading(false);
        };
        verifyUser();
    }, [user]);


  if (loading) return <AnimatedLoader />;

  const handleLogin = (token, userData) => {
    localStorage.setItem("auth_token", token); // ✅ Store JWT in Local Storage
    setUser(userData);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, handleLogin, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
