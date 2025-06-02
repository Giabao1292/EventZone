import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./features/authentication/pages/LoginPage";
import AppLayout from "./ui/AppLayout";
import RegisterPage from "./features/authentication/pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyPage from "./features/authentication/pages/VerifyPage";
import ForgotPasswordForm from "./features/authentication/pages/ForgotPasswordForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyPage />} />
        <Route
          path="*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} /><Route path="/forgot-password" element={<ForgotPasswordForm />} />
                {/*<Route path="/forgot-password" element={<ForgotPasswordForm />} />*/}

              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
