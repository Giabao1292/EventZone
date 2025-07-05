import React from "react";
import { Link } from "react-router-dom"; // Sử dụng Link nếu 'Checkout Pro Version' là một link

const AppTopstrip = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="md:flex hidden items-center gap-5">
        {/* Nếu đây là một link đến trang chủ hoặc một nơi khác */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-lg">T</span>
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              TicketPlus
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppTopstrip;
