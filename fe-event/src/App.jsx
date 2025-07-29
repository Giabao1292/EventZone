import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  default as Payment,
  default as PaymentPage,
} from "./components/booking/Payment";
import SelectSeats from "./components/booking/SelectSeats";
import AdsCreatePage from "./components/organizer/AdsCreatePage";
import EditEventForm from "./components/organizer/EditEventForm";
import EventCreationForm from "./components/organizer/EventCreationForm";
import LayoutDesigner from "./components/organizer/LayoutDesigner";
import EventManager from "./components/organizer/EventManager";
import OrganizerProfile from "./components/organizer/OrganizerProfile";
import AdminLayout from "./layouts/admin/AdminLayout";
import BookingPage from "./pages/BookingPage";
import EventDetail from "./pages/EventDetail";
import WishlistPage from "./pages/WishListPage";
import DashboardPage from "./pages/admin/DashboardPage";
import EventManagementPage from "./pages/admin/EventManagementPage";
import OrganizerManagementPage from "./pages/admin/OrganizerManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import VoucherManagementPage from "./pages/admin/VoucherManagementPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";

import AdsManagement from "./pages/admin/AdsManagement";
import RegisterOrganizerForm from "./components/organizer/OrganizerRegistration";
import PaymentAdsResultPage from "./components/organizer/PaymentAdsResult";
import StatisticsSeatsPage from "./pages/StatisticsSeatsPage";
import PaymentCancel from "./components/booking/Payment-cancel";
import PaymentResult from "./components/booking/Payment-result";
import DepositResult from "./components/organizer/DepositResult";
import SearchPage from "./pages/SearchPage";
import VerifyEmail from "./pages/VerifyEmail";
import PageLoader from "./ui/PageLoader";
import PrivateRoute from "./ui/PrivateRoute";
import OrganizerLayout from "./ui/organizer/OrganizerLayout";
import ReviewPage from "./components/review/ReviewPage";
import ViewBookingHistory from "./pages/ViewBookingHistory";
import ReviewManagementPage from "./pages/ReviewManagementPage";
import AdminReviewManagementPage from "./pages/admin/AdminReviewManagementPage";
import AttendeeManager from "./components/organizer/AttendeeManager";
import AdminWithdrawRequests from "./pages/admin/AdminWithdrawRequests";
import WithdrawRequestPage from "./components/organizer/WithdrawRequestPage";
import ReviewSectionPage from "./pages/ReviewSectionPage";
import MyVouchers from "./pages/MyVouchers";
import RevenueDashboard from "./pages/admin/RevenueManagementPage";
import OrganizerDocumentsPage from "./pages/admin/OrganizerDocumentsPage";

import ChatWidget from "./components/chat/ChatWidget";
import ChatPage from "./pages/ChatPage";
import ChatErrorBoundary from "./components/chat/ChatErrorBoundary";

import BankAccountManagement from "./components/organizer/BankAccountManagement";

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
        {/* Chat Components */}
        <ChatErrorBoundary>
          <ChatWidget />
        </ChatErrorBoundary>

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
            <Route path="/search" element={<SearchPage />} />
            <Route path="/reviews/:showingTimeId" element={<ReviewPage />} />
          </Route>

          {/* Protected Routes for Authenticated Users */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/booking-history" element={<ViewBookingHistory />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="/vouchers" element={<MyVouchers />} />

              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/payment-cancel" element={<PaymentCancel />} />
              <Route path="/deposit-result" element={<DepositResult />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordForm />} />
              <Route
                path="/register-organizer"
                element={<RegisterOrganizerForm />}
              />
              <Route path="/reviewable" element={<ReviewSectionPage />} />
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
              <Route path="OrganizerProfile" element={<OrganizerProfile />} />
              {/* Route mặc định: hiển thị danh sách sự kiện */}
              <Route index element={<EventManager />} />
              <Route path="ads/create/:eventId" element={<AdsCreatePage />} />
              <Route
                path="payment-ads-result"
                element={<PaymentAdsResultPage />}
              />
              <Route
                path="layout-designer/:showingTimeId"
                element={<LayoutDesigner />}
              />

              <Route path="payment" element={<BankAccountManagement />} />

              <Route path="create-event" element={<EventCreationForm />} />
              <Route path="edit/:id" element={<EditEventForm />} />
              <Route
                path="statistics-seats"
                element={<StatisticsSeatsPage />}
              />
              <Route
                path="statistics-seats"
                element={<StatisticsSeatsPage />}
              />

              <Route path="reviews" element={<ReviewManagementPage />} />
              <Route path="attendees/:eventId" element={<AttendeeManager />} />
              <Route path="withdraw" element={<WithdrawRequestPage />} />
            </Route>
          </Route>

          {/* Protected Routes for Admins */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<AdminLayout />}>
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route
                path="/admin/vouchers"
                element={<VoucherManagementPage />}
              />
              <Route
                path="/admin/category-management"
                element={<CategoryManagementPage />}
              />
              <Route path="/admin/ads" element={<AdsManagement />} />
              <Route
                path="/admin/withdraw"
                element={<AdminWithdrawRequests />}
              />
              <Route
                path="/admin/organizers"
                element={<OrganizerManagementPage />}
              />
              <Route path="/admin/events" element={<EventManagementPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route
                path="/admin/reviews"
                element={<AdminReviewManagementPage />}
              />
              <Route path="/admin/revenue" element={<RevenueDashboard />} />
              <Route
                path="/admin/organizers/:organizerId/documents"
                element={<OrganizerDocumentsPage />}
              />
            </Route>
          </Route>
          <Route path="/book/:showingId/*" element={<BookingPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
