import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageLoader from "../ui/PageLoader";

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

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // <-- thêm dòng này
        const res = await axios.get(`/api/events/detail/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }, // <-- truyền token vào headers
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


  if (loading)
    return (
        <div className="text-white">
          <PageLoader />
        </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!event) return <div className="text-red-500">Không tìm thấy sự kiện</div>;

  return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header thông tin sự kiện */}
        <div className="grid md:grid-cols-2 gap-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.eventTitle}</h1>
            <p className="text-sm mb-4">
              {formatDateTime(event.startTime)} → {formatDateTime(event.endTime)}
            </p>
            <p className="mb-4 whitespace-pre-line">{event.description}</p>
          </div>
          <div>
            {event.headerImage && (
                <img
                    src={event.headerImage}
                    alt="Event Header"
                    className="w-full h-[300px] object-cover rounded-xl"
                />
            )}
          </div>
        </div>

        {/* Danh sách suất chiếu */}
        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold mb-2 text-white">
            Chọn suất chiếu
          </h2>
          {event.showingTimes?.map((st) => (
              <div
                  key={st.id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-100"
              >
                <p className="font-medium mb-1 text-black">
                  📅 {formatDateTime(st.startTime)} → {formatDateTime(st.endTime)}
                </p>
                <p className="mb-4 text-black">
                  📍 {st.address?.venueName}, {st.address?.location},{" "}
                  {st.address?.city}
                </p>

                <button
                    onClick={() =>
                        navigate(`/book/${st.id}`, { state: { event, showing: st } })
                    }
                    className="px-5 py-2 bg-emerald-500 text-black font-semibold rounded hover:bg-emerald-600"
                >
                  Mua vé ngay
                </button>
              </div>
          ))}
        </div>
      </div>
  );
};

export default EventDetail;