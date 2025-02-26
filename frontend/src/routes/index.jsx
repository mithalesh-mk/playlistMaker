import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../app/login/Login";
import Home from "../app/dashboard/Home";
import Singup from "@/app/signup/Signup";
import ProtectedRoute from "@/ProtecedRoute";
import Sidebar from "@/app/dashboard/Sidebar";
import Profile from "@/app/profile/Profile";
import ChooseAvatar from "@/app/avatar/ChooseAvatar";
import Playlists from "@/app/playlist/Playlists";
import BookMarks from "@/app/bookmark/BookMarks";
import Playlist from "@/app/playlist/Playlist";
import ForgotPassword from "@/app/login/Forgot-password";
import Feedback from "@/app/feedback/Feedback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '', element: <Sidebar><ProtectedRoute><Home /></ProtectedRoute></Sidebar> },  // Default route for the root path
      { path: "/login", element: <Login /> },  // About page will render Login component
      { path: '/signup', element: < Singup/> },  // About page will render SignupForm component
      {path: '/profile', element: <Sidebar><ProtectedRoute><Profile /></ProtectedRoute></Sidebar>},
      {path: '/choose-avatar', element: <ChooseAvatar/>},
      {path: '/playlists', element: <Sidebar><ProtectedRoute><Playlists /></ProtectedRoute></Sidebar>},
      {path: '/bookmarks', element: <Sidebar><ProtectedRoute><BookMarks /></ProtectedRoute></Sidebar>},
      {path: '/playlists/:playlistId', element: <Sidebar><ProtectedRoute><Playlist /></ProtectedRoute></Sidebar>},
      {path: '/forgot-password', element: <ForgotPassword/>},
      {path : "/feedback" , element : <Sidebar><ProtectedRoute><Feedback/></ProtectedRoute></Sidebar>}, 
    ],
  },
]);

export default router;
