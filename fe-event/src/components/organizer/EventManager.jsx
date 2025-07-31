import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getEventsByStatus } from "../../services/eventService";
import { getShowingTimesByEvent } from "../../services/showingTime";
import eventRescheduleService from "../../services/eventRescheduleService";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
  Edit,
  Plus,
  Filter,
  Search,
  MapPin,
} from "lucide-react";

const STATUS_TABS = [
  {
    id: 1,
    label: "Nháp",
    color: "from-slate-400 to-slate-600",
    icon: <FileText className="w-5 h-5" />,
    status: "DRAFT",
  },
  {
    id: 2,
    label: "Chờ duyệt",
    color: "from-yellow-400 to-yellow-600",
    icon: <Clock className="w-5 h-5" />,
    status: "PENDING",
  },
  {
    id: 4,
    label: "Đã duyệt",
    color: "from-green-400 to-green-600",
    icon: <CheckCircle className="w-5 h-5" />,
    status: "APPROVED",
  },
  {
    id: 3,
    label: "Từ chối",
    color: "from-red-400 to-red-600",
    icon: <XCircle className="w-5 h-5" />,
    status: "REJECTED",
  },
];

const STATUS_BADGES = {
  DRAFT: "bg-gradient-to-r from-slate-400 to-slate-600 text-white",
  PENDING: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white",
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
  const [searchTerm, setSearchTerm] = useState("");

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!organizerId) return;
    Promise.all(
      STATUS_TABS.map((tab) =>
        getEventsByStatus(organizerId, tab.id).then((list) => [
          tab.id,
          list.length,
        ])
      )
    ).then((countsArr) => {
      const counts = Object.fromEntries(countsArr);
      setTabCounts(counts);

      // Tính toán stats
      setStats({
        total: Object.values(counts).reduce((sum, count) => sum + count, 0),
        draft: counts[1] || 0,
        pending: counts[2] || 0,
        approved: counts[4] || 0,
        rejected: counts[3] || 0,
      });
    });
  }, [organizerId]);

  useEffect(() => {
    if (!organizerId) return;
    setLoading(true);
    getEventsByStatus(organizerId, currentTab)
      .then((data) => {
        // Sắp xếp sự kiện mới lên đầu
        const sortedEvents = (data || []).sort((a, b) => {
          // Ưu tiên: updatedAt > createdAt > startTime > current time
          const getDateA = (event) => {
            if (event.updatedAt) return new Date(event.updatedAt);
            if (event.createdAt) return new Date(event.createdAt);
            if (event.startTime) return new Date(event.startTime);
            return new Date(); // fallback
          };

          const getDateB = (event) => {
            if (event.updatedAt) return new Date(event.updatedAt);
            if (event.createdAt) return new Date(event.createdAt);
            if (event.startTime) return new Date(event.startTime);
            return new Date(); // fallback
          };

          const dateA = getDateA(b);
          const dateB = getDateB(a);

          return dateA - dateB;
        });
        setEvents(sortedEvents);
      })
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
    if (
      !selectedShowingTimeId ||
      !requestedStartTime ||
      !requestedEndTime ||
      !reason
    ) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setRequestSubmitting(true);
    setErrorMsg("");
    try {
      const showingTime = showingTimes.find(
        (st) => st.id === selectedShowingTimeId
      );
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

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function EmptyIcon() {
    if (currentTab === 3)
      return <XCircle className="text-5xl text-red-400 mb-2" />;
    if (currentTab === 4)
      return <CheckCircle className="text-5xl text-green-400 mb-2" />;
    if (currentTab === 2)
      return <Clock className="text-5xl text-yellow-400 mb-2" />;
    return <FileText className="text-5xl text-slate-400 mb-2" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              Quản lý sự kiện
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Theo dõi và quản lý tất cả sự kiện của bạn
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Tổng sự kiện
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                <Calendar className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Nháp</p>
                <p className="text-2xl font-bold text-slate-600">
                  {stats.draft}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full">
                <FileText className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full">
                <Clock className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                <CheckCircle className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Từ chối</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                <XCircle className="text-white" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="text-blue-500" size={20} />
            <h3 className="text-xl font-semibold text-slate-700">
              Bộ lọc sự kiện
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Trạng thái
              </label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                      shadow transition-all duration-300
                      bg-gradient-to-r ${tab.color}
                      ${
                        currentTab === tab.id
                          ? "scale-105 border-2 border-blue-400 shadow-blue-300/20"
                          : "opacity-80 hover:scale-105"
                      }
                      text-white relative
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/90 text-slate-900 font-bold shadow">
                      {tabCounts[tab.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Content */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
              <Calendar className="text-blue-500" size={20} />
              <span>Danh sách sự kiện ({filteredEvents.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center space-x-2 text-slate-600">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải dữ liệu sự kiện...</span>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-500">
                <EmptyIcon />
                <p className="text-lg font-medium">
                  {currentTab === 1 && "Chưa có bản nháp sự kiện nào."}
                  {currentTab === 2 && "Không có sự kiện nào đang chờ duyệt."}
                  {currentTab === 3 && "Không có sự kiện nào bị từ chối."}
                  {currentTab === 4 && "Không có sự kiện nào đã duyệt."}
                </p>
                <Link
                  to="/organizer/create-event"
                  className="inline-flex items-center mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo sự kiện mới
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="bg-slate-50/50 rounded-2xl border border-slate-200/50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* Status badge */}
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow ${
                          STATUS_BADGES[event.status] || "bg-slate-500"
                        }`}
                      >
                        {event.status === "DRAFT" && "Nháp"}
                        {event.status === "PENDING" && "Chờ duyệt"}
                        {event.status === "APPROVED" && "Đã duyệt"}
                        {event.status === "REJECTED" && "Từ chối"}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-700 line-clamp-2">
                          {event.title}
                        </h3>
                        <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-xs text-blue-800 font-medium">
                          {event.category}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{event.date}</span>
                        </div>

                        {event.location && (
                          <div className="flex items-center text-sm text-slate-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2">
                        {event.description}
                      </p>

                      {/* REJECTED: Lý do từ chối */}
                      {event.status === "REJECTED" && event.rejectionReason && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          <AlertCircle className="w-4 h-4" />
                          <span>Lý do từ chối: {event.rejectionReason}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-3">
                        {/* DRAFT: nút Chỉnh sửa */}
                        {event.status === "DRAFT" && (
                          <Link
                            to={`/organizer/edit/${event.id}`}
                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa
                          </Link>
                        )}

                        {/* APPROVED: nút Quảng cáo + Người tham dự + Xin dời lịch */}
                        {event.status === "APPROVED" && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                to={`/organizer/ads/create/${event.id}`}
                                className="flex items-center justify-center gap-1 text-sm font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-2 rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                              >
                                <TrendingUp className="w-4 h-4" />
                                Quảng cáo
                              </Link>
                              <Link
                                to={`/organizer/attendees/${event.id}`}
                                state={{ eventTitle: event.title }}
                                className="flex items-center justify-center gap-1 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                              >
                                <Users className="w-4 h-4" />
                                Người tham dự
                              </Link>
                            </div>
                            <button
                              onClick={() => openRescheduleModal(event)}
                              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                              <Clock className="w-4 h-4 inline mr-2" />
                              Xin dời lịch
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Modal dời lịch */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-700">
                    Xin dời lịch: {selectedEvent?.title}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                  >
                    <XCircle
                      className="text-slate-400 hover:text-red-500"
                      size={20}
                    />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Chọn suất chiếu:
                    </label>
                    <select
                      className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      value={selectedShowingTimeId || ""}
                      onChange={(e) =>
                        setSelectedShowingTimeId(Number(e.target.value))
                      }
                    >
                      <option value="" disabled>
                        -- Chọn suất chiếu --
                      </option>
                      {showingTimes.map((st) => (
                        <option key={st.id} value={st.id}>
                          {new Date(st.startTime).toLocaleString("vi-VN")} -{" "}
                          {new Date(st.endTime).toLocaleString("vi-VN")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Thời gian bắt đầu mới:
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      value={requestedStartTime}
                      onChange={(e) => setRequestedStartTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Thời gian kết thúc mới:
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      value={requestedEndTime}
                      onChange={(e) => setRequestedEndTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Lý do dời lịch:
                    </label>
                    <textarea
                      className="w-full p-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  {errorMsg && (
                    <div className="text-red-500 font-semibold text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all duration-300"
                      disabled={requestSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={submitRescheduleRequest}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 disabled:opacity-50"
                      disabled={requestSubmitting}
                    >
                      {requestSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
