import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PageLoader from "./ui/PageLoader";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./ui/PrivateRoute";
import RegisterOrganizerForm from "./features/organizer/pages/OrganizerRegistration";
import OrganizerLayout from "./ui/OrganizerLayout";
import CreateEvent from "./features/organizer/pages/CreateEvent";


const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./features/authentication/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/authentication/pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ChangePasswordForm = lazy(() => import("./pages/ChangePasswordPage"));
const ForgotPassword = lazy(() => import("./features/authentication/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./features/authentication/pages/ResetPasswordPage"));
const AppLayout = lazy(() => import("./ui/AppLayout"));
// const OrganizerLayout = lazy(() => import("./ui/OrganizerLayout"));
// const AdminLayout = lazy(() => import("./ui/AdminLayout"));

function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Ngoài layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                    {/* Dưới layout */}
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/change-password" element={<ChangePasswordForm />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Public Home Page with AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
          </Route>

          {/* Protected Routes for Authenticated Users */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordForm />} />
              <Route
                path="/register-organizer"
                element={<RegisterOrganizerForm />}
              />
            </Route>
          </Route>

          {/* Protected Routes for Organizers */}
          <Route element={<PrivateRoute allowedRoles={["ORGANIZER"]} />}>
            <Route element={<OrganizerLayout />}>
              <Route path="/organizer" element={<CreateEvent />} />
            </Route>
          </Route>

          {/* Protected Routes for Admins */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            {/* <Route element={<AdminLayout />}>
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Route> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
