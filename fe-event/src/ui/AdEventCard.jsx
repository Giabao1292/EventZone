import React from "react";
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

  return (
    <div
      onClick={handleClick}
      className="flex bg-[#1f1f1f] rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all"
      style={{ maxWidth: "100%", height: "200px" }}
    >
      <img
        src={ad.posterImage}
        alt={ad.eventTitle}
        className="w-[40%] object-cover"
      />
      <div className="flex flex-col justify-center px-6 w-[60%] text-white">
        <h3 className="text-xl font-semibold">{ad.eventTitle}</h3>
        <p className="text-sm text-gray-300 mt-2">
          📅 {formatDate(ad.startDate)}
        </p>
      </div>
    </div>
  );
};

export default AdEventCard;
