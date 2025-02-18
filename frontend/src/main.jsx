import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./themeContext/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./userContext/AuthProvider";
import router from "./routes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
