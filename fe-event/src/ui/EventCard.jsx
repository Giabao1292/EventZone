"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Share2, Calendar, MapPin, Bell, BellOff } from "lucide-react";
import { toast } from "react-toastify";
import {
  trackEvent,
  untrackEvent,
  isEventTracked,
} from "../services/trackingService";
import { wishlistService } from "../services/wishlistServices";

const formatDate = (isoDate) => {
  if (!isoDate) return "Chưa rõ ngày";
  const date = new Date(isoDate);
  if (isNaN(date)) return "Ngày không hợp lệ";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  if (!price || price === 0) return "Miễn phí";
  return `From ${price.toLocaleString()}đ`;
};

/**
 * EventCard component
 * @param {object} props
 * @param {object} props.event - Thông tin sự kiện
 * @param {boolean} props.isFavorite - Có trong danh sách yêu thích không
 * @param {boolean} props.isUpcoming - Là sự kiện sắp mở bán không
 * @param {function} props.onToggleFavorite - Hàm toggle yêu thích
 * @param {function} props.onToggleTrack - Hàm toggle theo dõi
 */
const EventCard = ({
  event,
  isFavorite = false,
  isUpcoming = false,
  onToggleFavorite,
  onToggleTrack,
}) => {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState(false);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);

  // Kiểm tra trạng thái theo dõi nếu là sự kiện sắp mở bán
  useEffect(() => {
    if (isUpcoming) {
      const checkTrackingStatus = async () => {
        try {
          const status = await isEventTracked(event.id);
          setTracking(status);
        } catch (error) {
          console.error("Lỗi kiểm tra trạng thái theo dõi:", error.message);
        }
      };
      checkTrackingStatus();
    }
  }, [event.id, isUpcoming]);

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      navigate("/login");
      return;
    }
    try {
      const updatedFavorite = !isFavorite;
      if (updatedFavorite) {
        await wishlistService.addToWishlist(event.id);
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        await wishlistService.removeFromWishlist(event.id);
        toast.info("Đã xóa khỏi danh sách yêu thích");
      }
      if (onToggleFavorite) onToggleFavorite(event.id);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật danh sách yêu thích"
      );
    }
  };

  const handleTrackClick = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem("accessToken")) {
      toast.error("Vui lòng đăng nhập để theo dõi sự kiện");
      navigate("/login");
      return;
    }
    setIsLoadingTrack(true);
    try {
      if (tracking) {
        await untrackEvent(event.id);
        setTracking(false);
        toast.info("Đã bỏ theo dõi sự kiện");
      } else {
        await trackEvent(event.id);
        setTracking(true);
        toast.success("Đã theo dõi sự kiện");
      }
      if (onToggleTrack) onToggleTrack(event.id, !tracking);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái theo dõi"
      );
    } finally {
      setIsLoadingTrack(false);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/events/${event.id}`;
    const shareData = {
      title: event.eventTitle,
      text: "Khám phá sự kiện này!",
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error("Không thể chia sẻ:", err);
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("📋 Đã sao chép liên kết sự kiện!");
    }
  };

  return (
    <div className="relative bg-gray-800/60 border border-gray-700 rounded-2xl hover:border-orange-500/50 transition-all overflow-hidden">
      <div className="cursor-pointer group" onClick={handleClick}>
        <img
          src={event.posterImage || event.imageUrl || "/placeholder.svg"}
          alt={event.eventTitle}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />

        {/* Overlay + Giá */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
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

      {/* Nút yêu thích + share + theo dõi */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        {isUpcoming && (
          <button
            onClick={handleTrackClick}
            disabled={isLoadingTrack}
            className={`p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
              tracking
                ? "bg-blue-500 text-white shadow-lg transform scale-110"
                : "bg-gray-800/80 text-white hover:bg-gray-700/80 border border-gray-600 hover:border-orange-500/50"
            }`}
            title={tracking ? "Bỏ thông báo" : "Nhận thông báo khi mở bán"}
          >
            {tracking ? (
              <BellOff className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </button>
        )}
        <button
          onClick={handleShareClick}
          className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-600 hover:border-orange-500/50 hover:bg-gray-700/80 transition"
          title="Chia sẻ sự kiện"
        >
          <Share2 size={16} className="text-gray-300 hover:text-orange-400" />
        </button>
        <button
          onClick={handleFavoriteClick}
          className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-600 hover:border-orange-500/50 hover:bg-gray-700/80 transition"
          title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            size={16}
            className={
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-300 hover:text-orange-400"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
