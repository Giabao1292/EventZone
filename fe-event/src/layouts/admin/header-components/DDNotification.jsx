"use client";

import { useState, useRef, useEffect } from "react";
import { notificationService } from "../../../services/notificationServices";
import useWebSocket from "../../../hooks/useWebSocket";

const DDNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // WebSocket hook
  const { connected, notifications: wsNotifications } = useWebSocket({
    notificationPrefix: "[Admin]",
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
        const title = `[Admin] ${latestNotification.title}`;
        new Notification(title, {
          body: latestNotification.content,
          icon: "/favicon.ico",
        });
      }
    }
  }, [wsNotifications, isMarkingAllRead]);

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
      if (!notification.isRead) {
        await notificationService.markAsRead(notification.id);

        // Update local state immediately
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setAllNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
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
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
        setAllNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: false } : n
          )
        );
      }
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead || unreadCount === 0) return;

    try {
      setIsMarkingAllRead(true);

      // Call API first
      await notificationService.markAllAsRead();

      // Update state immediately after successful API call
      setUnreadCount(0);
      setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

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

  // Xử lý hiệu ứng delay khi hover
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setShouldRender(true);
    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsOpen(false);
    timerRef.current = setTimeout(() => {
      setShouldRender(false);
    }, 300);
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
        onClick={(e) => e.preventDefault()}
      >
        <i className="ti ti-bell-ringing text-xl relative z-[1]"></i>

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <div className="absolute inline-flex items-center justify-center text-white text-[11px] font-medium bg-blue-600 min-w-[16px] h-4 rounded-full -top-[1px] -right-[6px] px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}

        {/* WebSocket connection indicator */}
        <div className="absolute -bottom-1 -left-1">
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
      {shouldRender && (
        <div
          className={`absolute left-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border border-gray-200 w-[350px] transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
          style={{ minWidth: "350px", maxHeight: "400px" }}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
              <h3 className="text-gray-500 font-semibold text-base">
                Admin Notifications
                {connected && (
                  <span className="ml-2 text-xs text-green-600">(Live)</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  title="Đánh dấu tất cả đã đọc"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm">Loading...</p>
                </div>
              ) : allNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <i className="ti ti-bell text-2xl mb-2 block"></i>
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <ul className="list-none flex flex-col">
                  {allNotifications.map((notification) => (
                    <li key={notification.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNotificationClick(notification);
                        }}
                        className={`py-3 px-6 block hover:bg-gray-100 border-l-4 transition-colors ${
                          !notification.isRead
                            ? "border-l-blue-500 bg-blue-50"
                            : "border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-400 font-medium mt-1">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {allNotifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DDNotification;
