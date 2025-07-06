import { useState } from "react"
import { Download, XCircle, Star } from "lucide-react"

const BookingCard = ({ booking, onViewDetails }) => {
  const {
    eventTitle,
    imageUrl,
    venue,
    showTime,
    bookedAt,
    finalPrice,
    paymentMethod,
    paymentStatus,
    checkinStatus,
    quantity,
    seatNumbers
  } = booking;

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
      <img
        src={imageUrl}
        alt={eventTitle}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{eventTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">📍 {venue}</p>
        <p className="text-sm text-gray-500">🗓️ {formatDateTime(showTime)}</p>

        <button
          onClick={() => onViewDetails(booking)}
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
