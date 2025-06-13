import React from "react";
import { Link } from "react-router-dom"; // Sử dụng Link nếu 'Checkout Pro Version' là một link

const AppTopstrip = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="md:flex hidden items-center gap-5">
        {/* Nếu đây là một link đến trang chủ hoặc một nơi khác */}
        <Link to="/home">
          <img
            src="/assets/images/logos/logo-wrappixel.svg" // Đảm bảo đường dẫn này đúng trong thư mục public
            width="147"
            alt="logo-wrappixel"
          />
        </Link>
      </div>
    </div>
  );
};

export default AppTopstrip;
