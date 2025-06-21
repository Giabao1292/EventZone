import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PageLoader from "./ui/PageLoader";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./ui/PrivateRoute";
import RegisterOrganizerForm from "./components/organizer/OrganizerRegistration";
import OrganizerLayout from "./ui/organizer/OrganizerLayout";
import EventCreationForm from "./components/organizer/EventCreationForm";
import LayoutDesigner from "./components/organizer/LayoutDesigner";
import AdminLayout from "./layouts/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import EventDetail from "./pages/EventDetail";
import BookingPage from "./pages/BookingPage";
import OrganizerManagementPage from "./pages/admin/OrganizerManagementPage";
import PaymentPage from "./components/booking/Payment";
import SelectSeats from "./components/booking/SelectSeats";
import Payment from "./components/booking/Payment";
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./components/authentication/LoginPage"));
const RegisterPage = lazy(() =>
  import("./components/authentication/RegisterPage")
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ChangePasswordForm = lazy(() => import("./pages/ChangePasswordPage"));
const ForgotPassword = lazy(() =>
  import("./components/authentication/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("./components/authentication/ResetPasswordPage")
);
const AppLayout = lazy(() => import("./ui/AppLayout"));

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
            <Route path="/events/:eventId" element={<EventDetail />} />
          </Route>

          {/* Protected Routes for Authenticated Users */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="payment" element={<PaymentPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordForm />} />
              <Route
                path="/register-organizer"
                element={<RegisterOrganizerForm />}
              />
            </Route>
            <Route path="/book/:showingId" element={<BookingPage />}>
              <Route
                index
                element={
                  <SelectSeats
                    showingId={null} // tạm null, sẽ lấy từ useParams ở BookingPage
                  />
                }
              />
              <Route path="payment" element={<Payment />} />
            </Route>
          </Route>

          {/* Protected Routes for Organizers */}
          <Route element={<PrivateRoute allowedRoles={["ORGANIZER"]} />}>
            <Route path="/organizer/*" element={<OrganizerLayout />}>
              <Route
                path="layout-designer/:showingTimeId"
                element={<LayoutDesigner />}
              />
              <Route path="create-event" element={<EventCreationForm />} />
            </Route>
          </Route>
          {/* Protected Routes for Admins */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />} />
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route
              path="/admin/organizers"
              element={<OrganizerManagementPage />}
            />
          </Route>
          <Route path="/book/:showingId/*" element={<BookingPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
