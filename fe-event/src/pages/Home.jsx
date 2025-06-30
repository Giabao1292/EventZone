import backGround from "../assets/images/background/background.png";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { saveToken } from "../utils/storage";
import CategoryNav from "../ui/CategoryNav";
import EventCard from "../ui/EventCard";
import {
  getCategories,
  getEventsByCategory,
} from "../services/categoryService";
import BackgroundEffect from "../ui/BackGround";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const trendingEvents = [
    {
      id: 1,
      title: "Concacaf Gold Cup",
      date: "Jun 28",
      price: "From $72",
      bgColor: "bg-blue-600",
      type: "sports",
    },
    {
      id: 2,
      title: "Club World Cup",
      date: "Jun 23",
      price: "From $120",
      bgColor: "bg-green-700",
      type: "sports",
    },
    {
      id: 3,
      title: "Beyoncé Tour",
      date: "Jul 4",
      price: "From $220",
      bgColor: "bg-purple-600",
      type: "music",
    },
    {
      id: 4,
      title: "Braves at Mets",
      date: "Jun 23",
      price: "From $13",
      bgColor: "bg-gradient-to-r from-red-600 to-blue-600",
      type: "sports",
    },
  ];

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
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = (eventId) => {
    const newFavorites = new Set(favorites);
    newFavorites.has(eventId)
      ? newFavorites.delete(eventId)
      : newFavorites.add(eventId);
    setFavorites(newFavorites);
  };

  const nextSlide = () =>
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(trendingEvents.length / 4)
    );
  const prevSlide = () =>
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(trendingEvents.length / 4)) %
        Math.ceil(trendingEvents.length / 4)
    );
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
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

        <div className="relative z-10 text-center pt-16 pb-12">
          <Link
            to="/register-organizer"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-base font-medium shadow hover:scale-105 transition-all inline-block"
          >
            Trở thành nhà tổ chức
          </Link>
          <p className="text-base md:text-lg mt-4 mb-10 text-gray-300 font-light">
            Your next best-night-ever is waiting
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

        <div className="relative z-10 px-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Sự kiện nổi bật</h2>
            <div className="flex items-center space-x-3 text-gray-400 text-xs">
              <span>1 of 4</span>
              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-1.5 rounded-full border border-gray-600 hover:border-gray-400 transition-colors"
                >
                  ❮
                </button>
                <button
                  onClick={nextSlide}
                  className="p-1.5 rounded-full border border-gray-600 hover:border-gray-400 transition-colors"
                >
                  ❯
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingEvents.map((event) => (
              <div key={event.id} className="group relative text-sm">
                <div
                  className={`relative rounded-xl overflow-hidden ${event.bgColor} h-56 group-hover:scale-105 transition-transform duration-300 cursor-pointer`}
                >
                  <button
                    onClick={() => toggleFavorite(event.id)}
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/30 backdrop-blur hover:bg-black/50 transition"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        favorites.has(event.id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                      fill={favorites.has(event.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 space-y-0.5">
                  <h3 className="font-medium text-sm">{event.title}</h3>
                  <p className="text-gray-400 text-xs">{event.date}</p>
                  <p className="text-gray-300 text-sm">{event.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <CategoryNav
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categories={categories}
        />
      </div>

      {selectedCategoryId && (
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4">
            {eventsByCategory[selectedCategoryId]?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
