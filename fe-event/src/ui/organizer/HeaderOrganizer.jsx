// src/ui/HeaderOrganizer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const HeaderOrganizer = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="px-6 py-4 flex justify-between items-center">
      {/* Logo hoặc tiêu đề */}
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Organizer Dashboard
        </h1>
      </div>

      {/* Avatar và Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 focus:outline-none group"
        >
          <span className="text-white font-medium group-hover:text-blue-300 transition duration-200">
            {user?.fullname || "Organizer"}
          </span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
            {user?.fullName?.charAt(0) || "O"}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-3 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 py-2 z-50 animate-fadeIn"
            style={{ animation: "fadeIn 0.3s ease-in-out forwards" }}
          >
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/70 cursor-pointer"
            >
              Thông tin tài khoản
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/70 cursor-pointer"
            >
              Cài đặt
            </a>
            <hr className="border-t border-gray-700 my-2" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/70 cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderOrganizer;
