"use client";

import { useState, useRef, useEffect } from "react";

const DDNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  // Xử lý hiệu ứng delay khi hover
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setShouldRender(true);
    // Đặt một timeout nhỏ trước khi hiển thị để CSS transition có thể hoạt động
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsOpen(false);
    // Đợi cho animation kết thúc trước khi xóa khỏi DOM
    timerRef.current = setTimeout(() => {
      setShouldRender(false);
    }, 300); // Thời gian bằng với thời gian transition
  };

  // Dọn dẹp timeout khi component unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Notification Bell Icon */}
      <a
        className="relative inline-flex hover:text-gray-500 text-gray-300"
        href="#"
      >
        <i className="ti ti-bell-ringing text-xl relative z-[1]"></i>
        <div className="absolute inline-flex items-center justify-center text-white text-[11px] font-medium bg-blue-600 w-2 h-2 rounded-full -top-[1px] -right-[6px]"></div>
      </a>

      {/* Dropdown Menu - Absolutely positioned */}
      {shouldRender && (
        <div
          className={`absolute left-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border border-gray-200 w-[300px] transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
          style={{ minWidth: "300px" }}
        >
          <div>
            <h3 className="text-gray-500 font-semibold text-base px-6 py-3">
              Notification
            </h3>
            <ul className="list-none flex flex-col">
              <li>
                <a href="#" className="py-3 px-6 block hover:bg-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    Roman Joined the Team!
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Congratulate him
                  </p>
                </a>
              </li>
              <li>
                <a href="#" className="py-3 px-6 block hover:bg-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    New message received
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Salma sent you new message
                  </p>
                </a>
              </li>
              <li>
                <a href="#" className="py-3 px-6 block hover:bg-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    New Payment received
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Check your earnings
                  </p>
                </a>
              </li>
              <li>
                <a href="#" className="py-3 px-6 block hover:bg-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    Jolly completed tasks
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Assign her new tasks
                  </p>
                </a>
              </li>
              <li>
                <a href="#" className="py-3 px-6 block hover:bg-gray-200">
                  <p className="text-sm text-gray-500 font-medium">
                    Roman Joined the Team!
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Congratulate him
                  </p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DDNotification;
