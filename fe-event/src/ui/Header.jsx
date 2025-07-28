"use client";

import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import avatarDefault from "../assets/images/profile/avtDefault.jpg";
import useAuth from "../hooks/useAuth";

import NotificationDropdown from "../components/home/NotificationDropdown";
import { FaRegStar } from "react-icons/fa";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const avatarUrl = user?.profileUrl || avatarDefault;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const timeoutRef = useRef(null);
  const location = useLocation();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        event.target.tagName !== "svg" &&
        event.target.tagName !== "path"
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isOrganizer = user?.role === "ORGANIZER";
  const isHomePage = location.pathname === "/home";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-800/50 transition-all duration-300 ${
        isHomePage ? "bg-transparent" : "bg-[#12141D]"
      }`}
      style={{
        backdropFilter: isHomePage ? "blur(10px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-sm">T</span>
          </div>
          <span className="text-white font-extrabold text-base tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            TicketPlus
          </span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-base focus:outline-none hover:text-orange-400 transition-colors"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/home"
            className="text-gray-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Sự kiện
          </Link>
          <a
            href="/wishlist"
            className="text-gray-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Sự kiện yêu thích
          </a>
          <Link
            to="/booking-history"
            className="flex items-center text-gray-300 hover:text-white text-sm font-semibold transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="mr-2"
              fill="none"
            >
              <path
                d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8.121 10.06h7.758M8.121 13.94h7.758"
                stroke="currentColor"
              />
            </svg>
            Vé đã mua
          </Link>

          <Link
            to="/reviewable"
            className="flex items-center text-gray-200 hover:text-yellow-400 text-sm font-semibold transition-colors"
            title="Đánh giá sự kiện"
          >
            <FaRegStar className="mr-2 text-lg" />
            Đánh giá
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/register-organizer"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isOrganizer ? "Nhà tổ chức" : "Trở thành nhà tổ chức"}
          </Link>

          {/* Notification Bell - Only show when authenticated */}
          {isAuthenticated && <NotificationDropdown />}

          {isAuthenticated ? (
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center space-x-3 cursor-pointer bg-gray-800/50 rounded-full px-3 py-1 hover:bg-gray-700/50 transition-all">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                />
                <span className="text-white font-medium text-sm">
                  {user?.fullname}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
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
              </div>

              {dropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-200"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 text-sm font-medium rounded-t-xl transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/vouchers"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 text-sm font-medium rounded-t-xl transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Voucher của tôi
                  </Link>

                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-500 text-sm font-medium transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <hr className="border-gray-200" />
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 text-gray-500 hover:bg-red-50 hover:text-red-600 text-sm font-medium rounded-b-xl transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm font-semibold transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`md:hidden absolute top-full left-0 w-full shadow-2xl py-6 z-40 border-t border-gray-800 transition-all duration-300 ${
              isHomePage ? "bg-transparent" : "bg-[#12141D]"
            }`}
            style={{ backdropFilter: isHomePage ? "blur(10px)" : "none" }}
          >
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/register-organizer"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transition-all no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isOrganizer ? "Nhà tổ chức" : "Trở thành nhà tổ chức"}
              </Link>
              <Link
                to="/events"
                className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sự kiện
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <Link
                to="/booking-history"
                className="flex items-center text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="mr-2"
                  fill="none"
                >
                  <path
                    d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8.121 10.06h7.758M8.121 13.94h7.758"
                    stroke="currentColor"
                  />
                </svg>
                Vé đã mua
              </Link>

              {isAuthenticated ? (
                <>
                  <hr className="w-32 border-gray-700" />
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/wishlist"
                    className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sự kiện yêu thích
                  </Link>
                  <Link
                    to="/change-password"
                    className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="text-gray-400 hover:text-red-400 text-sm font-semibold transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <hr className="w-32 border-gray-700" />
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-orange-400 text-sm font-semibold transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-all shadow-md cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
