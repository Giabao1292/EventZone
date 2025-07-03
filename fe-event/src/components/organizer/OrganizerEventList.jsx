import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrganizerEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "http://localhost:8080/api/events/myevents",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(res.data.data);
      } catch (err) {
        alert("Không thể lấy danh sách sự kiện!");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-gradient-to-tr from-gray-800 to-slate-700 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform"
        >
          <div className="w-full h-48 flex justify-center items-center bg-slate-900 rounded-xl mb-3 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-full object-contain"
            />
          </div>
          <div className="w-full">
            <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
            <p className="text-sm text-slate-300 mb-2">{event.date}</p>
            <p className="text-slate-400 line-clamp-2 mb-2">
              {event.description}
            </p>
            <div className="flex gap-2 mt-2">
              <Link
                to={`/organizer/edit/${event.id}`}
                className="px-4 py-1 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
              >
                Chi tiết
              </Link>
              <Link
                to={`/organizer/ads/create/${event.id}`}
                className="px-4 py-1 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
              >
                Quảng cáo
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizerEventList;
