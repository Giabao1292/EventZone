import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import PageLoader from "./ui/PageLoader";
import VerifyEmail from "./pages/VerifyEmail";

// Lazy load các page và layout
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() =>
  import("./features/authentication/pages/LoginPage")
);
const RegisterPage = lazy(() =>
  import("./features/authentication/pages/RegisterPage")
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ChangePasswordForm = lazy(() => import("./pages/ChangePasswordPage"));
const ForgotPassword = lazy(() =>
  import("./features/authentication/pages/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("./features/authentication/pages/ResetPasswordPage")
);
const AppLayout = lazy(() => import("./ui/AppLayout"));

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
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
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
