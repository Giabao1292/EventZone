"use client";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; // ✅ Dùng icon trái tim

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
 * @param {boolean} props.isFavorite - Có nằm trong wishlist không
 * @param {function} props.onToggleFavorite - Hàm toggle yêu thích
 */
const EventCard = ({ event, isFavorite = false, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // 🔒 Không cho click lan ra div chính
    onToggleFavorite?.(event.id);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer w-[300px] rounded-xl overflow-hidden shadow-md bg-black transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Icon yêu thích */}
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
