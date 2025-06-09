import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveToken } from "../utils/storage";
import EventList from "../pages/EventList";
import HeroSlider from "../pages/HeroSlider";
import CategoryNav from "../ui/CategoryNav";


function getQueryParam(name, search) {
  const params = new URLSearchParams(search);
  return params.get(name);
}

function Home() {
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const verifyStatus = getQueryParam("verifyStatus", location.search);

    if (verifyStatus === "success") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) saveToken(accessToken);

      setNotification({
        type: "success",
        message: "✅ Email xác thực thành công! Bạn đã được đăng nhập.",
      });
    } else if (verifyStatus === "failed") {
      setNotification({
        type: "error",
        message: "❌ Xác thực email thất bại hoặc token hết hạn.",
      });
    }

    // Clean URL
    window.history.replaceState({}, document.title, "/home");
  }, [location.search]);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {notification && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-lg text-white z-50 transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-white hover:text-gray-200 text-2xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/*<h1 className="text-3xl font-bold">Welcome to Home</h1>*/}
      <CategoryNav />
      <HeroSlider />
      <EventList />

    </div>
  );
}

export default Home;
