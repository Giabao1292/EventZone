import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const OrganizerSidebar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      path: "/organizer",
      label: "Quản lý sự kiện",
      icon: "📊",
      color: "blue",
      description: "Xem và quản lý tất cả sự kiện",
    },
    {
      path: "/organizer/create-event",
      label: "Tạo sự kiện mới",
      icon: "✨",
      color: "orange",
      description: "Tạo sự kiện mới cho tổ chức",
    },
    {
      path: "/organizer/statistics-seats",
      label: "Thống kê doanh thu",
      icon: "💰",
      color: "green",
      description: "Theo dõi doanh thu và báo cáo",
    },
    {
      path: "/organizer/analytics",
      label: "Thống kê chi tiết",
      icon: "📈",
      color: "purple",
      description: "Phân tích dữ liệu sự kiện",
    },
    {
      path: "/organizer/reviews",
      label: "Quản lý đánh giá",
      icon: "⭐",
      color: "yellow",
      description: "Xem và phản hồi đánh giá",
    },
    {
      path: "/organizer/withdraw",
      label: "Rút tiền",
      icon: "💳",
      color: "red",
      description: "Quản lý yêu cầu rút tiền",
    },
  ];

  const getColorClasses = (color, isActive, isHovered) => {
    const baseClasses = "transition-all duration-300 ease-out";

    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-blue-100 to-orange-100 border-blue-300/50 shadow-lg shadow-blue-200/50 text-blue-700`;
    }

    if (isHovered) {
      const hoverColors = {
        blue: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-200/50 hover:shadow-blue-200/30",
        orange:
          "hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:border-orange-200/50 hover:shadow-orange-200/30",
        green:
          "hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-200/50 hover:shadow-green-200/30",
        purple:
          "hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:border-purple-200/50 hover:shadow-purple-200/30",
        yellow:
          "hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 hover:border-yellow-200/50 hover:shadow-yellow-200/30",
        red: "hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-200/50 hover:shadow-red-200/30",
      };
      return `${baseClasses} ${hoverColors[color]} hover:translate-x-2`;
    }

    return `${baseClasses} hover:translate-x-1`;
  };

  return (
    <div className="w-72 bg-gradient-to-b from-white/95 via-blue-50/95 to-orange-50/95 text-slate-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl border-r border-blue-200/30">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-orange-100/10 to-blue-100/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-orange-400 to-blue-400"></div>

      {/* Animated background elements */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-orange-200/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-orange-200/30 to-blue-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Organizer
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full mt-2"></div>
          <p className="text-sm text-slate-600 mt-2">
            Quản lý sự kiện chuyên nghiệp
          </p>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === index;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group block py-4 px-4 rounded-xl border border-transparent backdrop-blur-sm ${getColorClasses(
                  item.color,
                  isActive,
                  isHovered
                )}`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium group-hover:text-slate-700 transition-colors duration-300 block">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                      {item.description}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default OrganizerSidebar;
