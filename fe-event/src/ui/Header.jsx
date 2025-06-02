import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import avatarDefault from "../assets/images/avtDefault.jpg";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const avatarUrl = user?.profileUrl || avatarDefault;

  return (
    <header className="bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
            LBTrinp
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/events"
            className="text-slate-600 hover:text-blue-600 transition hover:scale-105"
          >
            Sự kiện
          </Link>
          <Link
            to="/categories"
            className="text-slate-600 hover:text-blue-600 transition hover:scale-105"
          >
            Thể loại
          </Link>
          <Link
            to="/home"
            className="text-slate-600 hover:text-blue-600 transition hover:scale-105"
          >
            Vé của tôi
          </Link>

          {/* Logged in */}
          {isAuthenticated ? (
            <div className="relative group flex items-center space-x-2 pl-4 border-l border-slate-300">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-sm cursor-pointer"
                />

                {/* Dropdown - bắt đầu từ cạnh trái avatar */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>

              <span className="text-slate-700 font-medium">
                {user?.fullname}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-300">
              <Link
                to="/register"
                className="text-slate-600 hover:text-blue-600 transition"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
