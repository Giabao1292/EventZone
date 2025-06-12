import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { saveToken } from "../utils/storage";
import CategoryNav from "../ui/CategoryNav";
import EventCard from "../ui/EventCard";

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

  // Xử lý trạng thái xác thực email từ query param
  useEffect(() => {
    const verifyStatus = getQueryParam("verifyStatus", location.search);

    if (verifyStatus === "success") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) saveToken(accessToken);
      showNotification(
        "success",
        "✅ Email xác thực thành công! Bạn đã được đăng nhập."
      );
    } else if (verifyStatus === "failed") {
      showNotification(
        "error",
        "❌ Xác thực email thất bại hoặc token hết hạn."
      );
    }

    // Làm sạch URL sau khi xử lý xong
    window.history.replaceState({}, document.title, "/home");
  }, [location.search]);

  // Tự động ẩn thông báo sau 5 giây
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Lấy dữ liệu categories và poster-images cho từng category
  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await axios.get("http://localhost:8080/api/categories");
        const categoriesData = Array.isArray(catRes.data.data)
          ? catRes.data.data
          : [];
        setCategories(categoriesData);

        const eventsMap = {};
        const eventPromises = categoriesData.map(
          fetchEventsForCategory(eventsMap)
        );

        await Promise.all(eventPromises);
        setEventsByCategory(eventsMap);
      } catch (err) {
        console.error("Lỗi khi gọi API categories:", err);
      }
    }

    fetchData();
  }, []);

  // Helper functions
  const fetchEventsForCategory = (eventsMap) => async (category) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/categories/${category.categoryId}/poster-images`
      );
      eventsMap[category.categoryId] = Array.isArray(res.data.data)
        ? res.data.data
        : [];
    } catch (err) {
      console.error(
        `Lỗi khi lấy poster-images cho category ${category.categoryId}:`,
        err
      );
      eventsMap[category.categoryId] = [];
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

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
