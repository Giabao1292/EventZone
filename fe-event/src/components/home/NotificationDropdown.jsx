"use client";

import { useState, useEffect, useRef } from "react";
import { notificationService } from "../../services/notificationServices";
import useWebSocket from "../../hooks/useWebSocket";

const NotificationDropdown = ({
  className = "",
  iconClassName = "ti ti-bell-ringing text-xl relative z-[1]",
  dropdownPosition = "right",
  style = "admin", // Style này có thể vẫn hữu ích cho các thuộc tính CSS hoặc logic khác, nhưng không phải cho cách mở/đóng.
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false); // Vẫn dùng để kiểm soát việc render DOM khi ẩn
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const dropdownRef = useRef(null);
  // const timerRef = useRef(null); // Không cần thiết nếu chỉ dùng click

  // WebSocket hook
  const {
    connected,
    notifications: wsNotifications,
    removeNotification: removeWsNotification,
  } = useWebSocket({
    notificationPrefix: style === "admin" ? "[Admin]" : "",
  });

  // Fetch initial notifications and unread count
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [notificationsResponse, unreadResponse] = await Promise.all([
        notificationService.getAllNotifications(),
        notificationService.getUnreadCount(),
      ]);

      const notifications = notificationsResponse.data || [];
      const unreadCountFromAPI = unreadResponse.data || 0;

      // Sắp xếp thông báo theo thời gian mới nhất lên đầu
      const sortedNotifications = notifications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAllNotifications(sortedNotifications);
      setUnreadCount(unreadCountFromAPI);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new WebSocket notifications
  useEffect(() => {
    if (wsNotifications.length > 0 && !isMarkingAllRead) {
      const latestNotification = wsNotifications[0];

      // Add to notifications list if not already exists
      setAllNotifications((prev) => {
        const exists = prev.some((n) => n.id === latestNotification.id);
        if (!exists) {
          setUnreadCount((prevCount) => prevCount + 1);
          // Thêm thông báo mới vào đầu và sắp xếp lại theo thời gian
          const updatedNotifications = [latestNotification, ...prev];
          return updatedNotifications.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        }
        return prev;
      });

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        const title =
          style === "admin"
            ? `[Admin] ${latestNotification.title}`
            : latestNotification.title;
        new Notification(title, {
          body: latestNotification.content,
          icon: "/favicon.ico",
        });
      }
    }
  }, [wsNotifications, style, isMarkingAllRead]);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // Mark notification as read and handle redirect
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await notificationService.markAsRead(notification.id);

        // Update local state immediately
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setAllNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
      }

      if (notification.redirectPath) {
        if (typeof window !== "undefined") {
          window.location.href = notification.redirectPath;
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert state on error
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
        setAllNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: false } : n
          )
        );
      }
    }
  };

  // Mark all as read - Fixed version
  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead || unreadCount === 0) return;

    try {
      setIsMarkingAllRead(true);

      // Call API first
      await notificationService.markAllAsRead();

      // Update state immediately after successful API call
      setUnreadCount(0);
      setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Refresh from server to ensure consistency
      setTimeout(() => {
        fetchNotifications();
      }, 500);
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Refresh from server on error to get correct state
      fetchNotifications();
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  // Delete single notification
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);

      // Find the notification before removing it
      const deletedNotification = allNotifications.find(
        (n) => n.id === notificationId
      );

      // Remove from state
      setAllNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );

      // Update unread count if deleted notification was unread
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      // Remove from WebSocket notifications if exists
      removeWsNotification(notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Delete all read notifications
  const handleDeleteAllRead = async () => {
    try {
      await notificationService.deleteAllRead();
      // Remove only read notifications from state
      setAllNotifications((prev) => prev.filter((n) => !n.read));
    } catch (error) {
      console.error("Error deleting all read notifications:", error);
    }
  };

  // === Thay đổi chính ở đây ===
  // Xử lý click để mở/đóng dropdown
  const handleToggleDropdown = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của thẻ 'a'
    setIsOpen((prev) => {
      const newState = !prev;
      setShouldRender(newState); // Đảm bảo phần tử được render khi mở
      return newState;
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Có thể thêm delay nếu muốn hiệu ứng fade out trước khi unmount
        // setTimeout(() => setShouldRender(false), 300);
        setShouldRender(false); // Đóng ngay lập tức về mặt DOM
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const readNotifications = allNotifications.filter((n) => n.read);
  const hasReadNotifications = readNotifications.length > 0;
  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef} // Gán ref vào div bao ngoài cùng
    >
      {/* Notification Bell Icon */}
      <a
        className="relative inline-flex hover:text-gray-500 text-gray-300 cursor-pointer"
        href="#"
        onClick={handleToggleDropdown} // Gọi hàm xử lý click thống nhất
      >
        <i className={iconClassName}></i>

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <div className="absolute inline-flex items-center justify-center text-white text-[11px] font-medium bg-blue-600 min-w-[16px] h-4 rounded-full -top-2 -right-2 px-1 z-[2]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}

        {/* WebSocket connection indicator */}
        <div className="absolute bottom-0 right-0 z-[2]">
          {connected ? (
            <div
              className="w-2 h-2 bg-green-400 rounded-full"
              title="WebSocket connected"
            ></div>
          ) : (
            <div
              className="w-2 h-2 bg-red-400 rounded-full"
              title="WebSocket disconnected"
            ></div>
          )}
        </div>
      </a>

      {/* Dropdown Menu */}
      {shouldRender && ( // Chỉ render khi shouldRender là true
        <div
          className={`absolute ${
            dropdownPosition === "right" ? "right-0" : "left-0"
          } top-full mt-1 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[380px] transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
          style={{ minWidth: "380px", maxHeight: "450px" }}
          // onMouseEnter và onMouseLeave ở đây không còn cần thiết cho việc mở/đóng dropdown chính
          // nhưng có thể giữ lại nếu bạn muốn các hiệu ứng con bên trong dropdown khi hover
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h3>
                {connected ? (
                  <div
                    className="flex items-center space-x-1 text-green-600"
                    title="WebSocket đã kết nối"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-medium">Live</span>
                  </div>
                ) : (
                  <div
                    className="flex items-center space-x-1 text-red-600"
                    title="WebSocket ngắt kết nối"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs font-medium">Offline</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAllRead}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full font-medium transition-all ${
                      isMarkingAllRead ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Đánh dấu tất cả đã đọc"
                  >
                    {isMarkingAllRead ? (
                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    <span>{isMarkingAllRead ? "Marking..." : "Mark all"}</span>
                  </button>
                )}
                {hasReadNotifications && (
                  <button
                    onClick={handleDeleteAllRead}
                    className="flex items-center space-x-1 px-3 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full font-medium transition-all"
                    title="Xóa tất cả thông báo đã đọc"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Clear read</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShouldRender(false); // Đóng hoàn toàn
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm">Loading...</p>
                </div>
              ) : allNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5-5 5h5v5a7.5 7.5 0 0015 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No notifications</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4
                              className={`text-sm font-medium text-gray-900 truncate ${
                                !notification.read ? "font-semibold" : ""
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) =>
                            handleDeleteNotification(e, notification.id)
                          }
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all ml-2 flex-shrink-0"
                          title="Xóa thông báo"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {allNotifications.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between space-x-3">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAllRead || unreadCount === 0}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg font-medium transition-all ${
                      isMarkingAllRead || unreadCount === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isMarkingAllRead ? (
                      <div className="w-4 h-4 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <span>
                      {isMarkingAllRead ? "Marking..." : "Mark all read"}
                    </span>
                  </button>
                  {hasReadNotifications && (
                    <button
                      onClick={handleDeleteAllRead}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg font-medium transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Clear read</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
