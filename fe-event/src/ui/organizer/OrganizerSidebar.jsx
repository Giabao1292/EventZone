import { Link } from "react-router-dom";

const OrganizerSidebar = () => {
  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-5 shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-pink-900/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Organizer
        </h2>

        <nav className="space-y-3">
          <Link
            to="/organizer"
            className="group block py-3 px-4 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:shadow-lg hover:shadow-blue-500/25 hover:translate-x-2 border border-transparent hover:border-blue-500/30 backdrop-blur-sm"
          >
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full group-hover:animate-pulse"></span>
              <span className="group-hover:text-blue-300 transition-colors duration-300">
                Quản lý sự kiện
              </span>
            </span>
          </Link>

          <Link
            to="/organizer/create-event"
            className="group block py-3 px-4 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:shadow-lg hover:shadow-purple-500/25 hover:translate-x-2 border border-transparent hover:border-purple-500/30 backdrop-blur-sm"
          >
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full group-hover:animate-pulse"></span>
              <span className="group-hover:text-purple-300 transition-colors duration-300">
                Tạo sự kiện mới
              </span>
            </span>
          </Link>

          <Link
            to="/organizer/analytics"
            className="group block py-3 px-4 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-red-600/20 hover:shadow-lg hover:shadow-pink-500/25 hover:translate-x-2 border border-transparent hover:border-pink-500/30 backdrop-blur-sm"
          >
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-pink-400 rounded-full group-hover:animate-pulse"></span>
              <span className="group-hover:text-pink-300 transition-colors duration-300">
                Thống kê
              </span>
            </span>
          </Link>
        </nav>
      </div>

      {/* Animated background elements */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </div>
  );
};

export default OrganizerSidebar;
