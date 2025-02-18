import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
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
                handleLogout();
                return;
            }

            console.log('token',token)
            try {
                const response = await axios.get("http://localhost:3000/api/auth/verify", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    console.log('response',response.data)
                    setUser(response.data.user);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.log("Verification failed:", error);
                handleLogout();
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
        window.location.reload(); // ✅ Refresh to apply authentication state
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, handleLogin,handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
