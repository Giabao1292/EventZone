import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import avatarDefault from "../assets/images/avtDefault.jpg"; // Đường dẫn tới ảnh mặc định

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const avatarUrl = user?.profileUrl || avatarDefault;

  return (
    <header className="bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
            LBTrinp
          </span>
        </Link>

        <nav className="flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/events"
            className="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
          >
            Sự kiện
          </Link>
          <Link
            to="/categories"
            className="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
          >
            Thể loại
          </Link>
          <Link
            to="/home"
            className="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
          >
            Vé của tôi
          </Link>
          <Link
            to="/profile"
            className="text-slate-600 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"
          >
            Tài khoản của tôi
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-300">
              <div className="flex items-center space-x-2">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="text-slate-700 font-medium">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-500 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-50"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-300">
              <Link
                to="/register"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
