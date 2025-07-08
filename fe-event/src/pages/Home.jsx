"use client"
import { useState, useEffect } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import Slider from "react-slick"
import { toast } from "react-toastify"
import { saveToken } from "../utils/storage"
import CategoryNav from "../ui/CategoryNav"
import { wishlistService } from "../services/wishlistServices"
import { getCategories, getEventsByCategory } from "../services/categoryService"
import { getActiveAdsToday } from "../services/adsService"
import { getHomeEvents, getTrackedEvents } from "../services/eventService"
import AdEventCard from "../ui/AdEventCard"
import BackgroundEffect from "../ui/BackGround"
import SearchBar from "../components/home/SearchBar"
import EventCard from "../ui/EventCard"
import backGround from "../assets/images/background/background.png"
import { Sparkles, TrendingUp, Clock, Calendar, ArrowRight, Star } from "lucide-react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const getQueryParam = (name, search) => {
  const params = new URLSearchParams(search)
  return params.get(name)
}

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notification, setNotification] = useState(null)
  const [trendingAds, setTrendingAds] = useState([])
  const [categories, setCategories] = useState([])
  const [eventsByCategory, setEventsByCategory] = useState({})
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [featuredEvents, setFeaturedEvents] = useState({
    ongoing: [],
    upcoming: [],
  })
  const [wishlistEventIds, setWishlistEventIds] = useState(new Set())
  const [trackedEventIds, setTrackedEventIds] = useState(new Set())

  useEffect(() => {
    const verifyStatus = getQueryParam("verifyStatus", location.search)
    if (verifyStatus === "success") {
      const accessToken = localStorage.getItem("accessToken")
      if (accessToken) saveToken(accessToken)
      setNotification({
        type: "success",
        message: "✅ Email xác thực thành công! Bạn đã được đăng nhập.",
      })
    } else if (verifyStatus === "failed") {
      setNotification({
        type: "error",
        message: "❌ Xác thực email thất bại hoặc token hết hạn.",
      })
    }
    window.history.replaceState({}, document.title, "/home")
  }, [location.search])

  useEffect(() => {
    const timer = setTimeout(() => setNotification(null), 5000)
    return () => clearTimeout(timer)
  }, [notification])

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const ads = await getActiveAdsToday()
        setTrendingAds(ads || [])
        const homeEvents = await getHomeEvents()
        console.log("🏠 Home Events:", homeEvents)
        setFeaturedEvents(homeEvents || { ongoing: [], upcoming: [] })
      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chủ:", error)
      }
    }

    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
        const eventsMap = {}
        await Promise.all(
          cats.map(async (cat) => {
            const events = await getEventsByCategory(cat.categoryId)
            eventsMap[cat.categoryId] = events
          })
        )
        setEventsByCategory(eventsMap)
      } catch (error) {
        console.error("Lỗi tải danh mục:", error)
      }
    }

    const fetchWishlist = async () => {
      try {
        const wishlist = await wishlistService.getWishlist()
        const ids = new Set(wishlist.map((event) => event.id))
        setWishlistEventIds(ids)
      } catch (error) {
        console.error("Lỗi tải danh sách yêu thích:", error.message)
      }
    }

    const fetchTrackedEvents = async () => {
      try {
        const trackedEvents = await getTrackedEvents()
        const ids = new Set(trackedEvents.map((event) => event.id))
        setTrackedEventIds(ids)
      } catch (error) {
        console.error("Lỗi tải danh sách sự kiện đã theo dõi:", error.message)
      }
    }

    fetchHomeData()
    fetchCategories()
    fetchWishlist()
    fetchTrackedEvents()
  }, [])

  const toggleFavorite = async (eventId) => {
    try {
      const updatedSet = new Set(wishlistEventIds)
      if (wishlistEventIds.has(eventId)) {
        await wishlistService.removeFromWishlist(eventId)
        updatedSet.delete(eventId)
        toast.info("Đã xóa khỏi danh sách yêu thích")
      } else {
        await wishlistService.addToWishlist(eventId)
        updatedSet.add(eventId)
        toast.success("Đã thêm vào danh sách yêu thích")
      }
      setWishlistEventIds(updatedSet)
    } catch (error) {
      console.error("Failed to update wishlist:", error.message)
      toast.error("Lỗi khi cập nhật yêu thích")
    }
  }

  const toggleTrack = async (eventId, isTracking) => {
    const updatedSet = new Set(trackedEventIds)
    if (isTracking) {
      updatedSet.add(eventId)
    } else {
      updatedSet.delete(eventId)
    }
    setTrackedEventIds(updatedSet)
  }

  const handleSearch = (query) => {
    if (query && query.trim()) {
      navigate(`/search?search=eventTitle:${encodeURIComponent(query.trim())}`)
    }
  }

  const adSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1300,
    pauseOnHover: true,
    arrows: false,
    cssEase: "ease-in-out",
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <BackgroundEffect image={backGround} />

      {notification && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 transition-all backdrop-blur-sm ${
            notification.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-current hover:text-gray-300 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
            Khám phá sự kiện
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {" "}
              tuyệt vời
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Tham gia hàng ngàn sự kiện thú vị, kết nối với cộng đồng và tạo nên những kỷ niệm đáng nhớ
          </p>
          <div className="mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Link
            to="/register-organizer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles size={24} />
            Trở thành nhà tổ chức
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="relative z-10 border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
        <CategoryNav
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categories={categories}
        />
      </div>

      {/* Events by Category */}
      {selectedCategoryId && (
        <section className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Star className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {categories.find((cat) => cat.categoryId === selectedCategoryId)?.categoryName}
                </h2>
                <p className="text-gray-400">{eventsByCategory[selectedCategoryId]?.length || 0} sự kiện có sẵn</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventsByCategory[selectedCategoryId]?.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={wishlistEventIds.has(event.id)}
                  isUpcoming={false}
                  onToggleFavorite={toggleFavorite}
                  onToggleTrack={togglescholarship toggleTrack}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Ads */}
      {trendingAds.length > 0 && (
        <section className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-500 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">🔥 Sự kiện nổi bật</h2>
                <p className="text-gray-400">Những sự kiện được quan tâm nhất</p>
              </div>
            </div>
            <div className="max-w-5xl mx-auto">
              {trendingAds.length === 1 ? (
                <AdEventCard ad={trendingAds[0]} />
              ) : (
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
        </section>
      )}

      {/* Ongoing Events */}
      {featuredEvents.ongoing.length > 0 && (
        <section className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">🎉 Sự kiện đang diễn ra</h2>
                  <p className="text-gray-400">Tham gia ngay để không bỏ lỡ</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredEvents.ongoing.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isFavorite={wishlistEventIds.has(ev.id)}
                  isUpcoming={false}
                  onToggleFavorite={toggleFavorite}
                  onToggleTrack={toggleTrack}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {featuredEvents.upcoming.length > 0 && (
        <section className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">⏳ Sắp mở bán</h2>
                <p className="text-gray-400">Đặt lịch để không bỏ lỡ</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredEvents.upcoming.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isFavorite={wishlistEventIds.has(ev.id)}
                  isUpcoming={true}
                  onToggleFavorite={toggleFavorite}
                  onToggleTrack={toggleTrack}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-gray-800/60 backdrop-blur-sm border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Thống kê nền tảng</h2>
            <p className="text-gray-400">Những con số ấn tượng của chúng tôi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-colors">
              <div className="text-4xl font-bold text-orange-400 mb-2">10,000+</div>
              <div className="text-gray-300">Sự kiện đã tổ chức</div>
            </div>
            <div className="text-center bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-colors">
              <div className="text-4xl font-bold text-orange-400 mb-2">500,000+</div>
              <div className="text-gray-300">Người tham gia</div>
            </div>
            <div className="text-center bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-orange-500/50 transition-colors">
              <div className="text-4xl font-bold text-orange-400 mb-2">1,000+</div>
              <div className="text-gray-300">Nhà tổ chức</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}