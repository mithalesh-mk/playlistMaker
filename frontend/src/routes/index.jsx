import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../app/login/Login";
import Home from "../app/dashboard/Home";
import Singup from "@/app/signup/Signup";
import ProtectedRoute from "@/ProtecedRoute";
import Sidebar from "@/app/dashboard/Sidebar";
import Profile from "@/app/profile/Profile";
import ChooseAvatar from "@/app/avatar/ChooseAvatar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '', element: <Sidebar><ProtectedRoute><Home /></ProtectedRoute></Sidebar> },  // Default route for the root path
      { path: "/login", element: <Login /> },  // About page will render Login component
      { path: '/signup', element: < Singup/> },  // About page will render SignupForm component
      {path: '/profile', element: <Sidebar><ProtectedRoute><Profile /></ProtectedRoute></Sidebar>},
      {path: '/choose-avatar', element: <ChooseAvatar/>}  
    ],
  },
]);

export default router;
