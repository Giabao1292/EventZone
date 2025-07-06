// src/ui/EventCard.jsx
import { useNavigate } from "react-router-dom";
import { Bell, BellOff, Eye, EyeOff, Heart } from "lucide-react";
import { useState, useEffect } from "react";
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

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer w-[300px] rounded-xl overflow-hidden shadow-md bg-black transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Nút theo dõi (chỉ hiển thị cho sự kiện sắp mở bán) */}
      {isUpcoming && (
        <button
          onClick={handleTrackClick}
          disabled={isLoadingTrack}
          className={`p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
            tracking
              ? "bg-blue-500 text-white shadow-lg transform scale-110"
              : "bg-white/20 text-white hover:bg-white/30"
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
      {/* Nút yêu thích */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 text-white hover:text-red-500 transition"
        title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
      >
        {isFavorite ? (
          <Heart className="fill-red-500 text-red-500" />
        ) : (
          <Heart className="text-white" />
        )}
      </button>

      <img
        src={event.posterImage || event.imageUrl}
        alt={event.eventTitle}
        className="w-full h-[200px] object-cover"
      />

      <div className="text-white px-4 py-3 text-sm font-semibold">
        {event.eventTitle}

        {/* Giá vé */}
        <p className="text-green-400 font-bold text-sm mt-2">
          {formatPrice(event.lowestPrice || event.price)}
        </p>

        {/* Ngày */}
        <p className="text-gray-300 text-xs mt-1">
          {formatDate(event.startTime)}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
