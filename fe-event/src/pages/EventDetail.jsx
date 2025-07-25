import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageLoader from "../ui/PageLoader";
import { Calendar, MapPin, Clock, Star, Users } from "lucide-react";
import {
  isEventTracked,
  trackEvent,
  untrackEvent,
} from "../services/trackingService";

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

const formatDateOnly = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTimeOnly = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
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
  const [confirmedShowings, setConfirmedShowings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    const fetchConfirmed = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const res = await axios.get(
            "/api/bookings/confirmed-showing-time-ids",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setConfirmedShowings(res.data.data || []);
        }
      } catch {
        setConfirmedShowings([]);
      }
    };
    fetchConfirmed();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`/api/events/detail/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(res.data.data);
      } catch {
        setError("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [eventId]);

  useEffect(() => {
    if (event?.id) {
      isEventTracked(event.id)
        .then(setIsTracked)
        .catch(() => setIsTracked(false));
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
    } catch {}
    setTrackingLoading(false);
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen bg-gray-950">
        <PageLoader />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-slate-400">{error || "Không tìm thấy sự kiện"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        {/* Background Image with Overlay */}
        {event.headerImage && (
          <div className="absolute inset-0">
            <img
              src={event.headerImage}
              alt="Event Background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gray-900/80"></div>
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Event Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {event.eventTitle}
                </h1>

                {/* Event Meta */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-violet-400 font-medium">
                        {formatDateTime(event.startTime)} -{" "}
                        {formatDateTime(event.endTime)}
                      </p>
                    </div>
                  </div>

                  {event.showingTimes?.[0]?.address && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-cyan-400 font-medium">
                          {event.showingTimes[0].address.venueName}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {event.showingTimes[0].address.location},{" "}
                          {event.showingTimes[0].address.city}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.showingTimes?.length > 1 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-full font-medium">
                          {event.showingTimes.length} suất diễn
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Mô tả sự kiện
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() =>
                  document.getElementById("showing-times")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Xem lịch chiếu và đặt vé
              </button>
            </div>

            {/* Event Image */}
            <div className="lg:order-last">
              {event.headerImage && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={event.headerImage}
                    alt="Event Header"
                    className="w-full h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showing Times Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div id="showing-times" className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Lịch chiếu</h2>
            <p className="text-gray-400 text-lg">
              Chọn suất chiếu phù hợp với bạn
            </p>
          </div>

          <div className="grid gap-6">
            {event.showingTimes?.map((st) => {
              const now = new Date();
              const saleOpen = new Date(st.saleOpenTime);
              const saleClose = new Date(st.saleCloseTime);
              const endTime = new Date(st.endTime);
              const isBeforeSale = now < saleOpen;
              const isAfterSale = now > saleClose;
              const isAfterEnd = now > endTime;
              const canReview = user && confirmedShowings.includes(st.id);
              const isReschedulePending = (() => {
                if (!st.status) return false;
                if (typeof st.status === "string") {
                  return (
                    st.status.trim().toUpperCase() === "RESCHEDULE_PENDING"
                  );
                }
                if (typeof st.status === "object" && st.status.statusName) {
                  return (
                    st.status.statusName.trim().toUpperCase() ===
                    "RESCHEDULE_PENDING"
                  );
                }
                return false;
              })();

              return (
                <div
                  key={st.id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Showing Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {formatDateOnly(st.startTime)}
                          </h3>
                          <p className="text-violet-400 font-medium">
                            {formatTimeOnly(st.startTime)} -{" "}
                            {formatTimeOnly(st.endTime)}
                          </p>
                        </div>
                      </div>

                      {st.address && (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {st.address.venueName}
                            </p>
                            <p className="text-gray-400">
                              {st.address.location}, {st.address.city}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Area */}
                    <div className="flex-shrink-0 lg:text-right">
                      {isReschedulePending ? (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-orange-400 font-medium text-sm">
                              Đang cập nhật
                            </span>
                          </div>
                          <p className="text-orange-300 text-sm">
                            Suất chiếu này đang chờ cập nhật lịch
                          </p>
                        </div>
                      ) : isBeforeSale ? (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-yellow-400 font-medium text-sm">
                              Chưa mở bán
                            </span>
                          </div>
                          <p className="text-yellow-300 text-sm">
                            Mở bán: {formatDateTime(st.saleOpenTime)}
                          </p>
                        </div>
                      ) : isAfterSale && !isAfterEnd ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-red-400 font-medium text-sm">
                              Hết hạn bán vé
                            </span>
                          </div>
                          <p className="text-red-300 text-sm">
                            Đã đóng: {formatDateTime(st.saleCloseTime)}
                          </p>
                        </div>
                      ) : isAfterEnd ? (
                        <div className="space-y-3">
                          <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-400 font-medium text-sm">
                                Đã kết thúc
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">
                              Sự kiện đã diễn ra
                            </p>
                          </div>
                          {canReview && (
                            <button
                              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                              onClick={() => navigate(`/reviews/${st.id}`)}
                            >
                              <Star className="w-4 h-4 inline mr-2" />
                              Xem đánh giá
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/book/${st.id}`, {
                              state: { event, showing: st },
                            })
                          }
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 min-w-32"
                        >
                          Đặt vé ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
