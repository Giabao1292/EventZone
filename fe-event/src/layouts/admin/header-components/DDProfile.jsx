"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import avatarDefault from "/assets/images/profile/user-1.jpg";
const DDProfile = () => {
  const { user, logout } = useAuth();
  const avatarUrl = user?.profileUrl || avatarDefault;
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  // Xử lý hiệu ứng delay khi hover
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setShouldRender(true);
    // Đặt một timeout nhỏ trước khi hiển thị để CSS transition có thể hoạt động
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 50);
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false); // Đóng dropdown khi đăng xuất
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsOpen(false);
    // Đợi cho animation kết thúc trước khi xóa khỏi DOM
    timerRef.current = setTimeout(() => {
      setShouldRender(false);
    }, 300); // Thời gian bằng với thời gian transition
  };
  // Dọn dẹp timeout khi component unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Profile Image */}
      <a className="relative cursor-pointer align-middle rounded-full">
        <img
          className="object-cover w-9 h-9 rounded-full"
          src={avatarUrl || "/assets/images/profile/user-1.jpg"}
          alt="User profile"
          aria-hidden="true"
        />
      </a>

      {/* Dropdown Menu - Absolutely positioned */}
      {shouldRender && (
        <div
          className={`absolute right-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
          style={{ minWidth: "200px" }}
        >
          <div className="p-0 py-2">
            <Link
              to="/profile"
              className="flex gap-2 items-center font-medium px-4 py-1.5 hover:bg-gray-200 text-gray-400"
              onClick={() => setIsOpen(false)}
            >
              <i className="ti ti-user text-xl"></i>
              <p className="text-sm">My Profile</p>
            </Link>
            <a
              href="#"
              className="flex gap-2 items-center font-medium px-4 py-1.5 hover:bg-gray-200 text-gray-400"
            >
              <i className="ti ti-mail text-xl"></i>
              <p className="text-sm">My Account</p>
            </a>
            <a
              href="#"
              className="flex gap-2 items-center font-medium px-4 py-1.5 hover:bg-gray-200 text-gray-400"
            >
              <i className="ti ti-list-check text-xl"></i>
              <p className="text-sm">My Task</p>
            </a>
            <div className="px-4 mt-[7px] grid">
              <button
                onClick={handleLogoutClick}
                className="btn-outline-primary font-medium text-[15px] w-full hover:bg-blue-600 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DDProfile;
