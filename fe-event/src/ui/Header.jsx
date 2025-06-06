import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import avatarDefault from "../assets/images/avtDefault.jpg";
import { FaSearch } from "react-icons/fa";
import { MdConfirmationNumber } from "react-icons/md";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const avatarUrl = user?.profileUrl || avatarDefault;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref để bao phủ toàn bộ vùng hover

  // Loại bỏ useEffect để đóng khi click bên ngoài vì chúng ta sẽ dùng onMouseLeave

  // Hàm xử lý hover để mở dropdown
  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  // Hàm xử lý khi chuột rời khỏi toàn bộ vùng dropdown (bao gồm cả box kích hoạt và menu)
  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  // Hàm xử lý click đăng xuất
  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false); // Đóng dropdown sau khi đăng xuất
  };

  return (
    <header className="bg-[#2eb866] sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-white text-4xl font-bold font-playfair tracking-wide">
            ticketplus
          </span>
        </Link>

        {/* Search box */}
        <div className="flex-1 flex justify-center mx-6">
          <div className="flex items-center bg-white rounded-md px-4 py-2 w-[400px]">
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

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <Link
            to="/organizer"
            className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#2eb866] transition font-medium cursor-pointer no-underline"
          >
            Trở thành nhà tổ chức
          </Link>

          <Link
            to="/home"
            className="flex items-center text-white hover:text-green-300 transition cursor-pointer no-underline"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="text-white mr-2"
              fill="none" // Thêm class mr-2 vào đây
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.758 12a2.91 2.91 0 011.928-2.74c.52-.186.98-.617.98-1.17V5.243a1 1 0 00-1-1H2.334a1 1 0 00-1 1v2.849c0 .552.461.983.981 1.17a2.91 2.91 0 010 5.478c-.52.187-.98.618-.98 1.17v2.848a1 1 0 001 1h19.333a1 1 0 001-1V15.91c0-.552-.461-.983-.981-1.17A2.91 2.91 0 0119.758 12z"
                stroke="#FFFFFF"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M8.121 10.06h7.758M8.121 13.94h7.758"
                stroke="#FFFFFF"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            Vé đã mua
          </Link>

          {isAuthenticated ? (
            <div
              className="relative p-2 rounded-lg transition-colors duration-200"
              ref={dropdownRef} // Ref bao phủ toàn bộ vùng tương tác (box + menu)
              onMouseEnter={handleMouseEnter} // Mở khi chuột vào
              onMouseLeave={handleMouseLeave} // Đóng khi chuột ra
              style={{
                backgroundColor: dropdownOpen
                  ? "rgba(0, 123, 255, 0.8)"
                  : "transparent",
              }} // Giữ màu khi đang mở/hover
            >
              {/* Box chứa avatar và tên */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <span className="text-white font-medium">{user?.fullname}</span>
              </div>

              {/* Dropdown content, chỉ hiện khi dropdownOpen là true */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-100 hover:text-blue-600 transition no-underline font-medium"
                    onClick={() => setDropdownOpen(false)} // Đóng dropdown khi click link
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-100 hover:text-blue-600 transition no-underline font-medium"
                    onClick={() => setDropdownOpen(false)} // Đóng dropdown khi click link
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={handleLogoutClick} // Sử dụng hàm xử lý logout
                    className="w-full text-left px-4 py-2 text-slate-500 hover:bg-red-100 hover:text-red-600 transition font-medium"
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
      </div>
    </header>
  );
};

export default Header;
