import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageLoader from "../ui/PageLoader";
import { Calendar, MapPin } from "lucide-react";
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
      <div className="text-white min-h-screen bg-zinc-800">
        <PageLoader />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-red-500 min-h-screen flex items-center justify-center bg-zinc-800">
        {error || "Không tìm thấy sự kiện"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Ticket-style event card */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl flex"
          style={{
            backgroundColor: "rgb(56, 56, 61)",
            position: "relative",
            margin: "0 auto",
            minHeight: "250px",
          }}
        >
          {/* Dotted divider */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "1px",
              borderLeft: "2px dashed white",
              zIndex: 5,
              transform: "translateX(-50%)",
            }}
          />
          {/* Top & bottom dots */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
              height: "40px",
              backgroundColor: "rgb(56, 56, 61)",
              borderRadius: "50%",
              border: "2px solid rgb(255, 255, 255)",
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
              height: "40px",
              backgroundColor: "rgb(56, 56, 61)",
              borderRadius: "50%",
              border: "2px solid rgb(255, 255, 255)",
              zIndex: 10,
            }}
          />

          {/* Left: Info */}
          <div className="w-1/2 p-6 flex flex-col justify-between text-white z-10">
            <div>
              <h1 className="text-2xl font-bold mb-4">{event.eventTitle}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">
                  {formatDateTime(event.startTime)} -{" "}
                  {formatDateTime(event.endTime)}
                </span>
              </div>
              {event.showingTimes?.length > 1 && (
                <div className="inline-block mb-2">
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full border border-gray-600">
                    + {event.showingTimes.length - 1} ngày khác
                  </span>
                </div>
              )}
              {event.showingTimes?.[0]?.address && (
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-400 mt-1" />
                  <div>
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
              <p className="text-gray-300 whitespace-pre-line mb-4">
                {event.description}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleTrackToggle}
                className={`w-full px-6 py-2 rounded-lg font-semibold transition ${
                  isTracked
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                } ${trackingLoading ? "opacity-60 cursor-wait" : ""}`}
                disabled={trackingLoading}
              >
                {isTracked ? "Đã theo dõi" : "Theo dõi sự kiện"}
              </button>
              <button
                onClick={() =>
                  document.getElementById("showing-times")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded transition"
              >
                Chọn lịch diễn
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-1/2 relative z-10">
            {event.headerImage && (
              <img
                src={event.headerImage}
                alt="Event Header"
                className="w-full h-full object-cover"
                style={{
                  minHeight: "100%",
                  borderTopRightRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                }}
              />
            )}
          </div>
        </div>

        {/* Showing times */}
        <div id="showing-times" className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Chọn suất chiếu
          </h2>
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
                return st.status.trim().toUpperCase() === "RESCHEDULE_PENDING";
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
                className="border border-gray-300 rounded-lg p-4 bg-gray-100 text-black"
              >
                <p className="font-medium mb-1">
                  📅 {formatDateTime(st.startTime)} →{" "}
                  {formatDateTime(st.endTime)}
                </p>
                <p className="mb-4">
                  📍 {st.address?.venueName}, {st.address?.location},{" "}
                  {st.address?.city}
                </p>
                {isReschedulePending ? (
                  <p className="text-red-600 font-semibold">
                    Suất chiếu này đang chờ cập nhật lịch. Tạm ngưng bán vé!
                  </p>
                ) : isBeforeSale ? (
                  <p className="text-yellow-600 font-semibold">
                    Vé chưa mở bán. Vui lòng quay lại sau (
                    {formatDateTime(st.saleOpenTime)}).
                  </p>
                ) : isAfterSale && !isAfterEnd ? (
                  <p className="text-red-600 font-semibold">
                    Hết thời gian bán vé ({formatDateTime(st.saleCloseTime)}).
                  </p>
                ) : isAfterEnd ? (
                  <>
                    <p className="text-red-600 font-semibold">
                      Sự kiện đã kết thúc. Không thể mua vé.
                    </p>
                    {canReview && (
                      <button
                        className="mt-2 px-5 py-2 rounded-lg border border-emerald-500 text-emerald-600 font-semibold bg-white hover:bg-emerald-50 transition"
                        onClick={() => navigate(`/reviews/${st.id}`)}
                      >
                        Xem đánh giá
                      </button>
                    )}
                  </>
                ) : (
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
