import { Navigate } from "react-router-dom";
import { useAuth } from "./userContext/AuthProvider";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading, handleLogout } = useAuth(); // Ensure logout function is available
  const token = localStorage.getItem("auth_token");
  if (!token) {
    handleLogout();
  }
  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
