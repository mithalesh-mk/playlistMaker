import { Navigate } from "react-router-dom";
import { useAuth } from "./userContext/AuthProvider";

const ProtectedRoute = ({ children }) => {
    const {user, loading } = useAuth();

    if (loading) return <p>Loading...</p>; // Show a loading state while checking authentication

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
