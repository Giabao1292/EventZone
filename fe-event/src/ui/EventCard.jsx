"use client"
import { useNavigate } from "react-router-dom"
import { Heart, Share2, Calendar, MapPin } from "lucide-react"
import { toast } from "react-toastify"

const formatDate = (isoDate) => {
  if (!isoDate) return "Chưa rõ ngày"
  const date = new Date(isoDate)
  if (isNaN(date)) return "Ngày không hợp lệ"
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

const formatPrice = (price) => {
  if (!price || price === 0) return "Miễn phí"
  return `From ${price.toLocaleString()}đ`
}

const EventCard = ({ event, isFavorite = false, onToggleFavorite }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/events/${event.id}`)
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(event.id)
  }

  const handleShareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/events/${event.id}`
    const shareData = {
      title: event.eventTitle,
      text: "Khám phá sự kiện này!",
      url: shareUrl,
    }

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error("Không thể chia sẻ:", err)
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success("📋 Đã sao chép liên kết sự kiện!")
    }
  }

  return (
    <div className="relative bg-gray-800/60 border border-gray-700 rounded-2xl hover:border-orange-500/50 transition-all overflow-hidden">
      {/* Vùng có thể click để xem chi tiết */}
      <div
        onClick={handleClick}
        className="cursor-pointer group overflow-hidden"
      >
        <img
          src={event.posterImage || event.imageUrl}
          alt={event.eventTitle}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placeholder.svg"
          }}
        />

        {/* Overlay + Giá + Share */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Price */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
            {formatPrice(event.lowestPrice || event.price)}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-white text-lg mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors duration-200">
            {event.eventTitle}
          </h3>
          <div className="space-y-2 text-sm text-gray-300 mb-4">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-orange-400" />
              <span>{formatDate(event.startTime)}</span>
            </div>
            {event.location && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-orange-400" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
          {event.category && (
            <div className="mt-3">
              <span className="inline-block bg-gray-700/50 text-gray-300 border border-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                {event.category}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nút yêu thích + share (bên ngoài vùng click) */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button
          onClick={handleShareClick}
          className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-600 hover:border-orange-500/50 hover:bg-gray-700/80 transition"
          title="Chia sẻ sự kiện"
        >
          <Share2 size={16} className="text-gray-300 hover:text-orange-400" />
        </button>
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-600 hover:border-orange-500/50 hover:bg-gray-700/80 transition"
          title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-orange-400"}
          />
        </button>
      </div>
    </div>
  )
}

export default EventCard
