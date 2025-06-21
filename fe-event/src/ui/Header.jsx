"use client";

import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import avatarDefault from "../assets/images/profile/avtDefault.jpg";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const avatarUrl = user?.profileUrl || avatarDefault;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const timeoutRef = useRef(null);

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

  return (
    <header
      style={{ backgroundColor: "#12141D" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <span className="text-white font-semibold text-lg">TicketPlus</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-xl focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/register-organizer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            {isOrganizer ? "Nhà tổ chức" : "Trở thành nhà tổ chức"}
          </Link>
          <Link
            to="/events"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Sự kiện
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Về chúng tôi
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Liên hệ
          </Link>
          <Link
            to="/home"
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="mr-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                stroke="currentColor"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.121 10.06h7.758M8.121 13.94h7.758"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Vé đã mua
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-600"
                />
                <span className="text-white font-medium">{user?.fullname}</span>
              </div>

              {dropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-orange-500 transition no-underline font-medium rounded-t-lg"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-orange-500 transition no-underline font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 text-gray-500 hover:bg-red-100 hover:text-red-600 transition font-medium rounded-b-lg"
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
                className="text-gray-300 hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            style={{ backgroundColor: "#12141D" }}
            className="md:hidden absolute top-full left-0 w-full shadow-lg py-4 z-40 border-t border-gray-800"
          >
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/register-organizer"
                className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isOrganizer ? "Nhà tổ chức" : "Trở thành nhà tổ chức"}
              </Link>
              <Link
                to="/events"
                className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sự kiện
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <Link
                to="/home"
                className="flex items-center text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="mr-1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.121 10.06h7.758M8.121 13.94h7.758"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Vé đã mua
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/change-password"
                    className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-orange-400 transition cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-gray-900 px-6 py-2 rounded-md hover:bg-gray-100 transition-all font-medium cursor-pointer no-underline"
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
