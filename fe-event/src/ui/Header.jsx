"use client";

import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import avatarDefault from "../assets/images/avtDefault.jpg";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa"; // Import FaBars and FaTimes for mobile menu icon

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const avatarUrl = user?.profileUrl || avatarDefault;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); // Ref for mobile menu to close on outside click
  const timeoutRef = useRef(null); // Thêm timeout ref để delay việc đóng dropdown

  // Hàm xử lý hover để mở dropdown
  const handleMouseEnter = () => {
    // Clear timeout nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  // Hàm xử lý khi chuột rời khỏi vùng dropdown với delay
  const handleMouseLeave = () => {
    // Thêm delay 150ms trước khi đóng dropdown
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  // Hàm xử lý click đăng xuất
  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  // Close mobile menu on outside click
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

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check if the user's role is ORGANIZER
  const isOrganizer = user?.role === "ORGANIZER";

  return (
    <header className="bg-[#2eb866] sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-white text-4xl font-bold font-playfair tracking-wide">
            ticketplus
          </span>
        </Link>

        {/* Search box - Hidden on small screens, shown on md and larger */}
        <div className="flex-1 hidden md:flex justify-center mx-6">
          <div className="flex items-center bg-white rounded-md px-4 py-2 w-full max-w-[400px]">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Bạn tìm gì hôm nay?"
              className="flex-1 outline-none text-gray-600 bg-transparent placeholder:text-gray-400"
            />
            <span className="mx-2 text-gray-300">|</span>
            <button className="text-gray-600 font-medium hover:text-green-600">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Mobile menu button (hamburger) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white text-2xl focus:outline-none ml-4"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Menu - Hidden on small screens, shown on md and larger */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/organizer"
            className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#2eb866] transition font-medium cursor-pointer no-underline"
          >
            {isOrganizer ? "Nhà tổ chức" : "Trở thành nhà tổ chức"}
          </Link>

          <Link
            to="/home"
            className="flex items-center text-white hover:text-green-300 transition cursor-pointer no-underline"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="text-white mr-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.121 10.06h7.758M8.121 13.94h7.758"
                stroke="#FFFFFF"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Vé đã mua
          </Link>

          {isAuthenticated ? (
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Box chứa avatar và tên */}
              <div
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${
                  dropdownOpen
                    ? "bg-black bg-opacity-20"
                    : "hover:bg-black hover:bg-opacity-10"
                }`}
              >
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <span className="text-white font-medium">{user?.fullname}</span>
              </div>

              {/* Dropdown content */}
              {dropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
                  onMouseEnter={handleMouseEnter} // Thêm onMouseEnter cho dropdown menu
                  onMouseLeave={handleMouseLeave} // Thêm onMouseLeave cho dropdown menu
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-100 hover:text-blue-600 transition no-underline font-medium rounded-t-lg"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-100 hover:text-blue-600 transition no-underline font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 text-slate-500 hover:bg-red-100 hover:text-red-600 transition font-medium rounded-b-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/register"
                className="text-white hover:text-blue-200 transition cursor-pointer no-underline"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="bg-white text-[#2eb866] px-6 py-2 rounded-full hover:bg-gray-100 transition-all font-semibold cursor-pointer no-underline"
              >
                Đăng nhập
              </Link>
            </div>
          )}

          <div className="flex items-center cursor-pointer ml-2">
            <span className="w-7 h-7 rounded-full flex items-center justify-center bg-white">
              <span className="text-xl">🇻🇳</span>
            </span>
            <svg
              className="w-4 h-4 ml-1 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 w-full bg-[#2eb866] shadow-lg py-4 z-40"
          >
            <div className="flex flex-col items-center space-y-4">
              {/* Search Box for Mobile */}
              <div className="flex items-center bg-white rounded-md px-4 py-2 w-11/12">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Bạn tìm gì hôm nay?"
                  className="flex-1 outline-none text-gray-600 bg-transparent placeholder:text-gray-400"
                />
                <span className="mx-2 text-gray-300">|</span>
                <button className="text-gray-600 font-medium hover:text-green-600">
                  Tìm kiếm
                </button>
              </div>

              <Link
                to="/organizer"
                className="w-11/12 text-center border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#2eb866] transition font-medium cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isOrganizer ? "Nhà tổ chức" : "Trở thành nhà tổ chức"}
              </Link>

              <Link
                to="/home"
                className="flex items-center text-white hover:text-green-300 transition cursor-pointer no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="text-white mr-2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.121 10.06h7.758M8.121 13.94h7.758"
                    stroke="#FFFFFF"
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
                    className="block w-11/12 text-center text-white px-4 py-2 hover:bg-black hover:bg-opacity-10 transition no-underline font-medium rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/change-password"
                    className="block w-11/12 text-center text-white px-4 py-2 hover:bg-black hover:bg-opacity-10 transition no-underline font-medium rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-11/12 text-center text-white px-4 py-2 hover:bg-red-700 transition font-medium rounded"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-11/12 text-center text-white px-4 py-2 hover:bg-black hover:bg-opacity-10 transition cursor-pointer no-underline rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                  <Link
                    to="/login"
                    className="w-11/12 text-center bg-white text-[#2eb866] px-6 py-2 rounded-full hover:bg-gray-100 transition-all font-semibold cursor-pointer no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                </>
              )}

              <div className="flex items-center cursor-pointer">
                <span className="w-7 h-7 rounded-full flex items-center justify-center bg-white">
                  <span className="text-xl">🇻🇳</span>
                </span>
                <svg
                  className="w-4 h-4 ml-1 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
