"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import { getToken } from "../utils/storage";
import getWebSocketUrl from "../api/websocket";

const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const stompClientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    const token = getToken();
    if (!token) {
      console.warn("⚠️ No token found, cannot connect to WebSocket");
      return;
    }

    try {
      const socket = new SockJS(getWebSocketUrl());
      stompClientRef.current = over(socket);

      stompClientRef.current.connect(
        { Authorization: "Bearer " + token },
        (frame) => {
          console.log("✅ WebSocket Connected:", frame);
          setConnected(true);
          reconnectAttempts.current = 0;

          // Subscribe to personal notifications
          stompClientRef.current.subscribe(
            "/user/queue/notifications",
            (message) => {
              try {
                const payload = JSON.parse(message.body);
                console.log("🔔 New notification received:", payload);

                // Add new notification to the list
                setNotifications((prev) => [payload, ...prev]);
              } catch (error) {
                console.error("Error parsing notification message:", error);
              }
            }
          );
        },
        (error) => {
          console.error("❌ WebSocket Connection Error:", error);
          setConnected(false);

          // Attempt to reconnect
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            console.log(
              `🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 3000 * reconnectAttempts.current); // Exponential backoff
          } else {
            console.error("❌ Max reconnection attempts reached");
          }
        }
      );
    } catch (error) {
      console.error("❌ Error creating WebSocket connection:", error);
      setConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.disconnect(() => {
        console.log("🔌 WebSocket Disconnected");
        setConnected(false);
      });
    } else {
      console.warn("⚠️ WebSocket not connected, skip disconnect");
      setConnected(false);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connected,
    notifications,
    clearNotifications,
    removeNotification,
    reconnect: connect,
  };
};

export default useWebSocket;
