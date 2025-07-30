// NotificationTest.jsx
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs"; // fix cho Vite
import { over } from "stompjs";
import getWebSocketUrl from "../api/websocket";

let stompClient = null;

export default function NotificationTest() {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    connect();
    return () => disconnect(); // cleanup khi component bị unmount
  }, []);

  const connect = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("⚠️ No token found in localStorage!");
      return;
    }

    const socket = new SockJS(getWebSocketUrl());
    stompClient = over(socket);

    stompClient.connect(
      { Authorization: "Bearer " + token },
      (frame) => {
        console.log("✅ Connected:", frame);
        setConnected(true);

        // Subscribe to personal notifications
        stompClient.subscribe("/user/queue/notifications", (message) => {
          const payload = JSON.parse(message.body);
          setNotifications((prev) => [payload, ...prev]);
          console.log("🔔 New notification:", payload);
        });
      },
      (error) => {
        console.error("❌ STOMP Error:", error);
        setConnected(false);
      }
    );
  };

  const disconnect = () => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log("🔌 Disconnected");
        setConnected(false);
      });
    } else {
      console.warn("⚠️ stompClient not connected yet, skip disconnect.");
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h2 style={{ marginTop: "1rem", color: "white" }}>
        📡 WebSocket Notification Test
      </h2>
      <p style={{ marginTop: "1rem", color: "white" }}>
        Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

      <div style={{ marginTop: "1rem", color: "white" }}>
        {notifications.length === 0 ? (
          <p style={{ marginTop: "1rem", color: "white" }}>
            No notifications yet.
          </p>
        ) : (
          <ul style={{ marginTop: "1rem", color: "white" }}>
            {notifications.map((n, i) => (
              <li key={i} style={{ marginBottom: "10px" }}>
                <strong style={{ marginTop: "1rem", color: "white" }}>
                  {n.title}
                </strong>
                : {n.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
