import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/axiosInstance";
import AnimatedLoader from "@/components/Loading";

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("auth_token"); // ✅ Retrieve token
           

            if (!token) {
                setLoading(false);
                return;
            }

            console.log('token',token)
            try {
                const response = await axiosInstance.get("/auth/verify");

                if (response.data.success) {
                    console.log('response',response.data)
                    setUser(response.data.user);
                } else {
                    setLoading(false)
                    handleLogout();
                    return;
                }
            } catch (error) {
                setLoading(false)
                console.log("Verification failed:", error);
                handleLogout();
                return;
            }

            setLoading(false);
        };

        verifyUser();
    }, []);

    if(loading) return <AnimatedLoader/>

    
    const handleLogin = (token, userData) => {
        localStorage.setItem("auth_token", token); // ✅ Store JWT in Local Storage
        setUser(userData);
    };

    const handleLogout = () => {
        
        localStorage.removeItem("auth_token"); // ✅ Remove token
        setUser(null);
        window.location.href = "/login"; // ✅ Refresh to apply authentication state
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, handleLogin,handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
