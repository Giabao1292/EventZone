import React from "react";
import "./assets/css/theme.css";
import "./assets/fonts/icons/tabler-icons/tabler-icons.css";
import "./index.css";
import "./styles/organizer.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
);
