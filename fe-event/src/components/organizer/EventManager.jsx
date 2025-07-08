import { useState, useEffect } from "react";
import { getEventsByStatus } from "../../services/eventService";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  HiOutlineDocument,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineEye,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

const STATUS_TABS = [
  {
    id: 1,
    label: "Nháp",
    color: "from-gray-400 to-gray-600",
    icon: <HiOutlineDocument />,
  },
  {
    id: 2,
    label: "Chờ duyệt",
    color: "from-yellow-400 to-yellow-600",
    icon: <HiOutlineClock />,
  },
  {
    id: 4,
    label: "Đã duyệt",
    color: "from-green-400 to-green-600",
    icon: <HiOutlineCheck />,
  },
  {
    id: 3,
    label: "Từ chối",
    color: "from-red-400 to-red-600",
    icon: <HiOutlineXMark />,
  },
];

const STATUS_BADGES = {
  DRAFT: "bg-gradient-to-r from-gray-400 to-gray-600 text-white",
  PENDING: "bg-gradient-to-r from-yellow-300 to-yellow-600 text-black",
  APPROVED: "bg-gradient-to-r from-green-400 to-green-600 text-white",
  REJECTED: "bg-gradient-to-r from-red-400 to-red-600 text-white",
};

export default function EventManager() {
  const { user } = useAuth();
  const organizerId = user?.organizer?.id;

  const [currentTab, setCurrentTab] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabCounts, setTabCounts] = useState({});

  useEffect(() => {
    if (!organizerId) return;
    Promise.all(
      STATUS_TABS.map((tab) =>
        getEventsByStatus(organizerId, tab.id).then((list) => [
          tab.id,
          list.length,
        ])
      )
    ).then((countsArr) => setTabCounts(Object.fromEntries(countsArr)));
  }, [organizerId]);

  useEffect(() => {
    if (!organizerId) return;
    setLoading(true);
    getEventsByStatus(organizerId, currentTab)
      .then((data) => setEvents(data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [organizerId, currentTab]);

  function EmptyIcon() {
    if (currentTab === 3)
      return <HiOutlineXMark className="text-5xl text-red-400 mb-2" />;
    if (currentTab === 4)
      return <HiOutlineCheck className="text-5xl text-green-400 mb-2" />;
    if (currentTab === 2)
      return <HiOutlineClock className="text-5xl text-yellow-400 mb-2" />;
    return <HiOutlineDocument className="text-5xl text-gray-400 mb-2" />;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-white">
        🎫 Quản lý sự kiện của bạn
      </h1>

      {/* Tabs status */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-3xl font-semibold
              shadow transition
              bg-gradient-to-r ${tab.color}
              ${
                currentTab === tab.id
                  ? "scale-110 border-2 border-blue-400 shadow-blue-300/20"
                  : "opacity-80 hover:scale-105"
              }
              text-white relative
            `}
            style={{ minWidth: 120 }}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/90 text-blue-900 font-bold shadow">
              {tabCounts[tab.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-xl shadow-xl p-7 min-h-64">
        {loading ? (
          <div className="text-gray-400 italic animate-pulse text-center py-12">
            Đang tải dữ liệu sự kiện...
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-gray-400 py-10">
            <EmptyIcon />
            <span className="text-base">
              {currentTab === 1 && "Chưa có bản nháp sự kiện nào."}
              {currentTab === 2 && "Không có sự kiện nào đang chờ duyệt."}
              {currentTab === 3 && "Không có sự kiện nào bị từ chối."}
              {currentTab === 4 && "Không có sự kiện nào đã duyệt."}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative flex flex-col rounded-2xl bg-gray-800/90 shadow-xl hover:shadow-2xl border border-gray-700 overflow-hidden transition hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Status badge */}
                  <span
                    className={`
          absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow
          ${STATUS_BADGES[event.status] || "bg-gray-500"}
        `}
                  >
                    {event.status === "DRAFT" && "Nháp"}
                    {event.status === "PENDING" && "Chờ duyệt"}
                    {event.status === "APPROVED" && "Đã duyệt"}
                    {event.status === "REJECTED" && "Từ chối"}
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white truncate">
                      {event.title}
                    </span>
                    <span className="ml-auto px-2 py-0.5 rounded bg-blue-900/80 text-xs text-blue-200 font-medium">
                      {event.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <span>{event.date}</span>
                    <span>·</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1 line-clamp-2">
                    {event.description}
                  </div>

                  {/* REJECTED: Lý do từ chối */}
                  {event.status === "REJECTED" && event.rejectionReason && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-300 bg-red-900/40 px-3 py-2 rounded">
                      <HiOutlineInformationCircle /> Lý do từ chối:{" "}
                      {event.rejectionReason}
                    </div>
                  )}

                  {/* DRAFT: nút Chỉnh sửa */}
                  {event.status === "DRAFT" && (
                    <Link
                      to={`/organizer/edit/${event.id}`}
                      className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
                    >
                      <HiOutlineEye /> Chỉnh sửa
                    </Link>
                  )}

                  {/* APPROVED: nút Quảng cáo */}
                  {event.status === "APPROVED" && (
                    <Link
                      to={`/organizer/ads/create/${event.id}`}
                      className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
                    >
                      📢 Quảng cáo
                    </Link>
                  )}

                  {/* PENDING: hiển thị thông báo */}
                  {event.status === "PENDING" && (
                    <p className="mt-4 text-sm italic text-yellow-300 text-center">
                      ⏳ Sự kiện đang chờ duyệt
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
