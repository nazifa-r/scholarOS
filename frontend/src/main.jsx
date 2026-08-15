import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import "./index.css";

<<<<<<< HEAD
if (import.meta.env.DEV && !sessionStorage.getItem("scholaros_session_loaded")) {
=======
if (
  import.meta.env.DEV &&
  !sessionStorage.getItem("scholaros_session_loaded")
) {
>>>>>>> 9873b64 (fix: resolve sidebar active state issue and improved dark mode theme)
  localStorage.removeItem("scholaros_user");
  sessionStorage.setItem("scholaros_session_loaded", "true");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
<<<<<<< HEAD
  </StrictMode>
);
=======
  </StrictMode>,
);
>>>>>>> 9873b64 (fix: resolve sidebar active state issue and improved dark mode theme)
