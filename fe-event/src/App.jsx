import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./features/authentication/pages/LoginPage";
import AppLayout from "./ui/AppLayout";
import RegisterPage from "./features/authentication/pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyPage from "./features/authentication/pages/VerifyPage";
import ChangePasswordForm from "./pages/ChangePasswordPage";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./features/authentication/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/authentication/pages/ResetPasswordPage";
import EventList from "./pages/EventList";



<Route path="/reset-password" element={<ResetPasswordPage />} />

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
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
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/change-password"
                  element={<ChangePasswordForm />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                  import ResetPasswordPage from "./features/authentication/pages/ResetPasswordPage";

                  // ...

                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/events" element={<EventList />} />


              </Routes>

            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
