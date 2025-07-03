import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Slider from "react-slick"; // ✅ thêm thư viện
import { saveToken } from "../utils/storage";
import {
  getCategories,
  getEventsByCategory,
} from "../services/categoryService";
import { getActiveAdsToday } from "../services/adsService";
import { getHomeEvents } from "../services/eventService";
import CategoryNav from "../ui/CategoryNav";
import EventCard from "../ui/EventCard";
import AdEventCard from "../ui/AdEventCard"; // ✅ card dành riêng cho quảng cáo
import BackgroundEffect from "../ui/BackGround";
import backGround from "../assets/images/background/background.png";

import "slick-carousel/slick/slick.css"; // ✅ CSS bắt buộc
import "slick-carousel/slick/slick-theme.css";

const getQueryParam = (name, search) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

export default function Home() {
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [trendingAds, setTrendingAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [eventsByCategory, setEventsByCategory] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState({
    ongoing: [],
    upcoming: [],
  });

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

  useEffect(() => {
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const ads = await getActiveAdsToday();
        setTrendingAds(ads || []);

        const homeEvents = await getHomeEvents();
        setFeaturedEvents(homeEvents || { ongoing: [], upcoming: [] });
      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chủ:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        const eventsMap = {};
        for (const cat of cats) {
          const events = await getEventsByCategory(cat.categoryId);
          eventsMap[cat.categoryId] = events;
        }
        setEventsByCategory(eventsMap);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    fetchHomeData();
    fetchCategories();
  }, []);

  const toggleFavorite = (eventId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(eventId)
      ? newFavorites.delete(eventId)
      : newFavorites.add(eventId);
    setFavorites(newFavorites);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchQuery);
  };

  const adSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1300, // 👈 CHỈ 2 giây mỗi slide
    pauseOnHover: true,
    arrows: false,
    cssEase: "ease-in-out",
  };

  return (
    <div className="min-h-screen text-white text-sm md:text-base relative overflow-hidden">
      <BackgroundEffect image={backGround} />

      {notification && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md z-50 transition-all ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-white hover:text-gray-300 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 text-center pt-16 pb-12">
        <Link
          to="/register-organizer"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-base font-medium shadow hover:scale-105 transition-all inline-block"
        >
          Trở thành nhà tổ chức
        </Link>
        <p className="text-base md:text-lg mt-4 mb-10 text-gray-300 font-light">
          Sự kiện tuyệt vời đang chờ bạn
        </p>
        <div className="max-w-xl mx-auto px-4">
          <form onSubmit={handleSearch} className="relative">
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Bạn muốn xem gì?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm rounded-full bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </form>
        </div>
      </div>

      {/* 🔥 Sự kiện nổi bật (quảng cáo) */}

      {trendingAds.length > 0 && (
        <div className="relative z-10 px-6 pb-10">
          <h2 className="text-2xl font-semibold mb-4">🔥 Sự kiện nổi bật</h2>
          <div className="max-w-5xl mx-auto">
            {trendingAds.length === 1 ? (
              // ✅ Nếu chỉ có 1 sự kiện → hiển thị đơn lẻ
              <AdEventCard ad={trendingAds[0]} />
            ) : (
              // ✅ Nhiều sự kiện → dùng slider
              <Slider {...adSliderSettings}>
                {trendingAds.map((ad) => (
                  <div key={ad.id}>
                    <AdEventCard ad={ad} />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      )}

      {/* 🎉 Sự kiện đang diễn ra */}
      {featuredEvents.ongoing.length > 0 && (
        <div className="relative z-10 px-6 pb-10">
          <h2 className="text-xl font-semibold mb-4">
            🎉 Sự kiện đang diễn ra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredEvents.ongoing.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </div>
      )}

      {/* ⏳ Sắp mở bán */}
      {featuredEvents.upcoming.length > 0 && (
        <div className="relative z-10 px-6 pb-10">
          <h2 className="text-xl font-semibold mb-4">⏳ Sắp mở bán</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredEvents.upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </div>
      )}

      {/* Danh mục */}
      <div className="relative z-10">
        <CategoryNav
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categories={categories}
        />
      </div>

      {/* Sự kiện theo danh mục */}
      {selectedCategoryId && (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4">
            {eventsByCategory[selectedCategoryId]?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
