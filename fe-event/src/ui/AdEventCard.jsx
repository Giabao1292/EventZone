import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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

const AdEventCard = ({ ad }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${ad.eventId}`);
  };

  // Logic ưu tiên hiển thị: Banner > Poster > Default
  const getDisplayMedia = () => {
    // Kiểm tra banner URL có hợp lệ không
    const isValidUrl = (url) => {
      if (!url || typeof url !== "string") return false;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (ad.bannerImageUrl && isValidUrl(ad.bannerImageUrl)) {
      return {
        url: ad.bannerImageUrl,
        type:
          ad.bannerImageUrl.includes(".mp4") ||
          ad.bannerImageUrl.includes(".webm")
            ? "video"
            : "image",
      };
    }
    if (ad.posterImage && isValidUrl(ad.posterImage)) {
      return {
        url: ad.posterImage,
        type: "image",
      };
    }
    return {
      url: "/placeholder.svg",
      type: "image",
    };
  };

  const displayMedia = getDisplayMedia();

  return (
    <div
      onClick={handleClick}
      className="flex bg-[#1f1f1f] rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all group"
      style={{ maxWidth: "100%", height: "200px" }}
    >
      <div className="w-[40%] relative overflow-hidden">
        {displayMedia.type === "video" ? (
          <video
            src={displayMedia.url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={displayMedia.url}
            alt={ad.eventTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Badge cho banner */}
        {ad.bannerImageUrl && displayMedia.url === ad.bannerImageUrl && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {displayMedia.type === "video" ? "🎬 VIDEO" : "🖼️ BANNER"}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center px-6 w-[60%] text-white">
        <h3 className="text-xl font-semibold group-hover:text-orange-400 transition-colors">
          {ad.eventTitle}
        </h3>
        <p className="text-sm text-gray-300 mt-2">
          📅 {formatDate(ad.startDate)}
        </p>
        <p className="text-xs text-gray-400 mt-1">👤 {ad.organizerName}</p>

        {/* Hiển thị thông tin banner nếu có */}
        {ad.bannerImageUrl && displayMedia.url === ad.bannerImageUrl && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
              Quảng cáo
            </span>
            {displayMedia.type === "video" && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                Video
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdEventCard;
