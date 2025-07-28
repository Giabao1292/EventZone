// src/ui/HeaderOrganizer.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const HeaderOrganizer = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header className="px-8 py-6 flex justify-between items-center relative bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-sm z-[99999]">
      {/* Left section */}
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
            Organizer Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Quản lý sự kiện chuyên nghiệp
          </p>
        </div>

        {/* Time and Date */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-xl p-3 border border-blue-200/30 backdrop-blur-sm shadow-sm">
            <div className="text-center">
              <div className="text-lg font-mono font-bold text-slate-700">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-slate-500">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-3 bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-xl border border-blue-200/30 backdrop-blur-sm hover:from-blue-200/50 hover:to-orange-200/50 transition-all duration-300 group shadow-sm">
          <svg
            className="w-5 h-5 text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 0 0 4 6v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H8a4 4 0 0 0-3.81 2.19z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-xl border border-blue-200/30 backdrop-blur-sm hover:from-blue-200/50 hover:to-orange-200/50 transition-all duration-300 group shadow-sm"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                {user?.fullname || "Organizer"}
              </p>
              <p className="text-xs text-slate-500">Quản lý sự kiện</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
              {user?.fullName?.charAt(0) || "O"}
            </div>
            <svg
              className="w-4 h-4 text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-blue-200/30 py-2 z-[99999] animate-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-3 border-b border-blue-200/30">
                <p className="text-sm font-medium text-slate-700">
                  {user?.fullname || "Organizer"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || "organizer@eventzone.com"}
                </p>
              </div>

              <div className="py-2">
                <a
                  href="/organizer/OrganizerProfile"
                  className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông tin tài khoản
                </a>
                <a
                  href="/organizer/payment"
                  className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10l9-6 9 6M4 10v10h16V10M10 14h4M6 14h.01M6 18h.01M18 14h.01M18 18h.01"
                    />
                  </svg>
                  Ngân hàng
                </a>
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-blue-500 group-hover:text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Cài đặt
                </a>
              </div>

              <div className="border-t border-blue-200/30 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-200 group"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-[99998]"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default HeaderOrganizer;
