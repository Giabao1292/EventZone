import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageLoader from "../ui/PageLoader";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { isEventTracked, trackEvent, untrackEvent } from "../services/trackingService";

const formatDateTime = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTracked, setIsTracked] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`/api/events/detail/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(res.data.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sự kiện:", err);
        setError("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [eventId]);

  useEffect(() => {
  if (event?.id) {
    isEventTracked(event.id).then(setIsTracked).catch(() => setIsTracked(false));
  }
  }, [event?.id]);

  const handleTrackToggle = async () => {
  if (!event?.id) return;
  setTrackingLoading(true);
  try {
    if (isTracked) {
      await untrackEvent(event.id);
      setIsTracked(false);
    } else {
      await trackEvent(event.id);
      setIsTracked(true);
    }
  } catch (err) {
    // Xử lý lỗi nếu cần
  } finally {
    setTrackingLoading(false);
  }
};
  if (loading)
    return (
      <div className="text-white bg-gray-900 min-h-screen">
        <PageLoader />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 bg-gray-900 min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  if (!event)
    return (
      <div className="text-red-500 bg-gray-900 min-h-screen flex items-center justify-center">
        Không tìm thấy sự kiện
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Event Card */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 min-h-[400px]">
            {/* Left Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  {event.eventTitle}
                </h1>

                {/* Time Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    {formatDateTime(event.startTime)} -{" "}
                    {formatDateTime(event.endTime)}
                  </span>
                </div>

                {/* Duration Badge */}
                {event.showingTimes && event.showingTimes.length > 1 && (
                  <div className="inline-block mb-6">
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full border border-gray-600">
                      + {event.showingTimes.length - 1} ngày khác
                    </span>
                  </div>
                )}

                {/* Location */}
                {event.showingTimes && event.showingTimes[0]?.address && (
                  <div className="flex items-start gap-3 mb-8">
                    <MapPin className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300">
                      <p className="text-emerald-400 font-medium">
                        {event.showingTimes[0].address.venueName}
                      </p>
                      <p className="text-sm">
                        {event.showingTimes[0].address.location},{" "}
                        {event.showingTimes[0].address.city}
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-300 whitespace-pre-line">
                    {event.description}
                  </p>
                {/* Nút theo dõi sự kiện */}
                <button
                className={`mt-4 px-6 py-2 rounded-lg font-semibold transition
                  ${isTracked ? "bg-yellow-400 text-black" : "bg-gray-600 text-white hover:bg-gray-700"}
                  ${trackingLoading ? "opacity-60 cursor-wait" : ""}
                `}
                type="button"
                onClick={handleTrackToggle}
                disabled={trackingLoading}
              >
                {isTracked ? "Đã theo dõi" : "Theo dõi sự kiện"}
              </button>
  
              </div>
              </div>

              {/* Bottom Section */}
              <div>
                <hr className="border-gray-700 mb-6" />

                {/* Price */}
                <div className="flex items-center justify-between mb-6"></div>

                {/* Book Button */}
                <button
                  onClick={() => {
                    // Scroll to showing times section
                    document.getElementById("showing-times")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  Chọn lịch diễn
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              {event.headerImage && (
                <img
                  src={event.headerImage}
                  alt="Event Header"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-800/20"></div>
            </div>
          </div>
        </div>

        {/* Showing Times Section */}
        <div id="showing-times" className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Chọn suất chiếu
          </h2>
          {event.showingTimes?.map((st) => {
            const now = new Date();
            const saleOpen = new Date(st.saleOpenTime);
            const saleClose = new Date(st.saleCloseTime);
            const isBeforeSale = now < saleOpen;
            const isAfterSale = now > saleClose;

            return (
              <div
                key={st.id}
                className="border border-gray-300 rounded-lg p-4 bg-gray-100"
              >
                <p className="font-medium mb-1 text-black">
                  📅 {formatDateTime(st.startTime)} →{" "}
                  {formatDateTime(st.endTime)}
                </p>
                <p className="mb-4 text-black">
                  📍 {st.address?.venueName}, {st.address?.location},{" "}
                  {st.address?.city}
                </p>

                {isBeforeSale && (
                  <p className="text-yellow-600 font-semibold">
                    Vé chưa mở bán. Vui lòng quay lại sau.
                  </p>
                )}

                {isAfterSale && (
                  <p className="text-red-600 font-semibold">
                    Sự kiện đã kết thúc. Không thể mua vé.
                  </p>
                )}

                {!isBeforeSale && !isAfterSale && (
                  <button
                    onClick={() =>
                      navigate(`/book/${st.id}`, {
                        state: { event, showing: st },
                      })
                    }
                    className="px-5 py-2 bg-emerald-500 text-black font-semibold rounded hover:bg-emerald-600"
                  >
                    Mua vé ngay
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
