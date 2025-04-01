import { Navigate } from "react-router-dom";
import { useAuth } from "./userContext/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // No need to destructure `handleLogout` here

  const token = localStorage.getItem("auth_token");
  console.log("user:", user, "token:", token);

  if (loading) return <p>Loading...</p>;

  // If no token or no user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
