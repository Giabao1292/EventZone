"use client";
import useWebSocket from "../hooks/useWebSocket";

const NotificationSocket = () => {
  const { connected, notifications, clearNotifications } = useWebSocket();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🔧 WebSocket Test Panel</h3>

      <div className="mb-4">
        <span className="text-sm font-medium">Status: </span>
        <span
          className={`text-sm ${connected ? "text-green-600" : "text-red-600"}`}
        >
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Real-time Notifications ({notifications.length})
          </span>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No real-time notifications yet...
            </p>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="p-2 bg-white rounded border text-sm">
                <div className="font-medium">{notification.title}</div>
                <div className="text-gray-600">{notification.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSocket;
