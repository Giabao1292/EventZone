import React from "react";
import "./assets/css/theme.css";
import "./assets/fonts/icons/tabler-icons/tabler-icons.css";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
