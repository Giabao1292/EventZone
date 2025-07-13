import { useState, useEffect } from "react";
import { getEventsByStatus } from "../../services/eventService";
import { getShowingTimesByEvent } from "../../services/showingTime"; // service lấy showing times
import eventRescheduleService from '../../services/eventRescheduleService'; // service gửi yêu cầu dời lịch
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
  { id: 1, label: "Nháp", color: "from-gray-400 to-gray-600", icon: <HiOutlineDocument /> },
  { id: 2, label: "Chờ duyệt", color: "from-yellow-400 to-yellow-600", icon: <HiOutlineClock /> },
  { id: 4, label: "Đã duyệt", color: "from-green-400 to-green-600", icon: <HiOutlineCheck /> },
  { id: 3, label: "Từ chối", color: "from-red-400 to-red-600", icon: <HiOutlineXMark /> },
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showingTimes, setShowingTimes] = useState([]);
  const [selectedShowingTimeId, setSelectedShowingTimeId] = useState(null);
  const [requestedStartTime, setRequestedStartTime] = useState("");
  const [requestedEndTime, setRequestedEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const openRescheduleModal = async (event) => {
    setSelectedEvent(event);
    setErrorMsg("");
    setSelectedShowingTimeId(null);
    setRequestedStartTime("");
    setRequestedEndTime("");
    setReason("");
    setModalOpen(true);
    try {
      const times = await getShowingTimesByEvent(event.id);
      setShowingTimes(times);
    } catch {
      setShowingTimes([]);
    }
  };

  const submitRescheduleRequest = async () => {
    if (!selectedShowingTimeId || !requestedStartTime || !requestedEndTime || !reason) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setRequestSubmitting(true);
    setErrorMsg("");
    try {
      const showingTime = showingTimes.find((st) => st.id === selectedShowingTimeId);
      await eventRescheduleService.createRequest({
        eventId: selectedEvent.id,
        showingTimeId: selectedShowingTimeId,
        oldStartTime: showingTime.startTime,
        oldEndTime: showingTime.endTime,
        requestedStartTime,
        requestedEndTime,
        reason,
      });
      alert("Gửi yêu cầu dời lịch thành công!");
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || "Gửi yêu cầu thất bại");
    } finally {
      setRequestSubmitting(false);
    }
  };

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

                        {/* APPROVED: nút Quảng cáo + Người tham dự + Xin dời lịch */}
                        {event.status === "APPROVED" && (
                            <>
                              <div className="flex gap-2 mt-4">
                                <Link
                                    to={`/organizer/ads/create/${event.id}`}
                                    className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
                                >
                                  📢 Quảng cáo
                                </Link>
                                <Link
                                    to={`/organizer/attendees/${event.id}`}
                                    state={{ eventTitle: event.title }}
                                    className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
                                >
                                  👥 Người tham dự
                                </Link>
                              </div>
                              <button
                                  onClick={() => openRescheduleModal(event)}
                                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
                              >
                                Xin dời lịch
                              </button>
                            </>
                        )}
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Modal dời lịch */}
          {modalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full text-white shadow-lg">
                  <h2 className="text-xl font-bold mb-4">
                    Xin dời lịch: {selectedEvent?.title}
                  </h2>

                  <label className="block mb-2 font-semibold">Chọn suất chiếu:</label>
                  <select
                      className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                      value={selectedShowingTimeId || ""}
                      onChange={(e) => setSelectedShowingTimeId(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      -- Chọn suất chiếu --
                    </option>
                    {showingTimes.map((st) => (
                        <option key={st.id} value={st.id}>
                          {new Date(st.startTime).toLocaleString()} - {new Date(st.endTime).toLocaleString()}
                        </option>
                    ))}
                  </select>

                  <label className="block mb-2 font-semibold">Thời gian bắt đầu mới:</label>
                  <input
                      type="datetime-local"
                      className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                      value={requestedStartTime}
                      onChange={(e) => setRequestedStartTime(e.target.value)}
                  />

                  <label className="block mb-2 font-semibold">Thời gian kết thúc mới:</label>
                  <input
                      type="datetime-local"
                      className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                      value={requestedEndTime}
                      onChange={(e) => setRequestedEndTime(e.target.value)}
                  />

                  <label className="block mb-2 font-semibold">Lý do dời lịch:</label>
                  <textarea
                      className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                  />

                  {errorMsg && (
                      <div className="mb-4 text-red-500 font-semibold">{errorMsg}</div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                        disabled={requestSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                        onClick={submitRescheduleRequest}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                        disabled={requestSubmitting}
                    >
                      {requestSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
