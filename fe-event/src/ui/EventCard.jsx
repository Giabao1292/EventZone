import React from "react";

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

const EventCard = ({ event }) => {
    return (
        <div className="w-[360px] rounded-xl overflow-hidden shadow-md bg-black  shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
            <img
                src={event.posterImage}
                alt={event.eventTitle}
                className="w-full h-[200px] object-cover"
            />
            <div className="text-white px-4 py-3 text-sm font-semibold">
                {event.eventTitle}
                <p className="text-gray-300 text-xs mt-1">
                    {formatDate(event.startTime)}
                </p>
            </div>
        </div>
    );
};

export default EventCard;
