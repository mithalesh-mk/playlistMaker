import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../app/login/Login";
import Home from "../app/dashboard/Home";
import Singup from "@/app/signup/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '', element: <Home /> },  // Default route for the root path
      { path: "/login", element: <Login /> },  // About page will render Login component
      { path: '/signup', element: < Singup/> },  // About page will render SignupForm component
    ],
  },
]);

export default router;
