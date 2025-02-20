import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api", // Set your API base URL
});

// Add an interceptor to attach the token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token"); // Retrieve token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
