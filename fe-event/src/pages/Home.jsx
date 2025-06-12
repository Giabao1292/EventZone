import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveToken } from "../utils/storage";
import CategoryNav from "../ui/CategoryNav";
import EventCard from "../ui/EventCard";
import {
  getCategories,
  getEventsByCategory,
} from "../services/categoryService";

const getQueryParam = (name, search) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

function Home() {
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [categories, setCategories] = useState([]);
  const [eventsByCategory, setEventsByCategory] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Xử lý trạng thái xác thực từ URL
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

    window.history.replaceState({}, document.title, "/home");
  }, [location.search]);

  // Tự động ẩn thông báo sau 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Lấy tất cả categories và poster-images cho từng category
  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCategories();
      setCategories(cats);

      const eventsMap = {};
      for (const cat of cats) {
        const events = await getEventsByCategory(cat.categoryId);
        eventsMap[cat.categoryId] = events;
      }

      setEventsByCategory(eventsMap);
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-200 bg-opacity-30 backdrop-blur-md text-black flex flex-col items-center justify-start">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-lg text-white z-50 transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-3">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-white hover:text-gray-200 text-2xl font-bold leading-none ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navbar danh mục */}
      <CategoryNav
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Danh sách sự kiện */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        {selectedCategoryId && (
          <div className="flex flex-wrap justify-center gap-6 px-6">
            {eventsByCategory[selectedCategoryId]?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
