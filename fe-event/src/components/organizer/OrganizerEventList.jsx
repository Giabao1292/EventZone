import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const OrganizerEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/events/myevents", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sắp xếp sự kiện mới lên đầu
        const sortedEvents = res.data.data.sort(
          (a, b) =>
            new Date(b.createdAt || b.updatedAt) -
            new Date(a.createdAt || a.updatedAt)
        );

        setEvents(sortedEvents);

        // Tính toán stats
        const total = sortedEvents.length;
        const active = sortedEvents.filter(
          (e) => e.status === "ACTIVE" || e.status === "APPROVED"
        ).length;
        const pending = sortedEvents.filter(
          (e) => e.status === "PENDING"
        ).length;
        const completed = sortedEvents.filter(
          (e) => e.status === "COMPLETED"
        ).length;
        const totalRevenue = sortedEvents.reduce(
          (sum, event) => sum + (event.totalRevenue || 0),
          0
        );

        setStats({
          total,
          active,
          pending,
          completed,
          totalRevenue,
        });
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sự kiện:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      case "COMPLETED":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải sự kiện...</p>
        </div>
      </div>
    );
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
                <p className="text-slate-600 text-sm font-medium">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
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
                <p className="text-slate-600 text-sm font-medium">
                  Đã hoàn thành
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.completed}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                <BarChart3 className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Tổng doanh thu
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalRevenue.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                <DollarSign className="text-white" size={20} />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="REJECTED">Bị từ chối</option>
                <option value="COMPLETED">Đã hoàn thành</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 opacity-0">
                Action
              </label>
              <Link
                to="/organizer/create-event"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo sự kiện mới
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
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

          {filteredEvents.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/50 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Event Image */}
                    <div className="w-full h-48 rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
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

                    {/* Event Info */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-slate-700 line-clamp-2">
                          {event.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {getStatusIcon(event.status)}
                          <span className="ml-1">{event.status}</span>
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {new Date(event.startTime).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>

                        {event.venue && (
                          <div className="flex items-center text-sm text-slate-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="line-clamp-1">{event.venue}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-slate-500">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{event.ticketsSold || 0} vé đã bán</span>
                          </div>
                          {event.totalRevenue && (
                            <div className="flex items-center text-green-600 font-semibold">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span>
                                {event.totalRevenue.toLocaleString("vi-VN")} đ
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-3">
                        <Link
                          to={`/organizer/edit/${event.id}`}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Chi tiết
                        </Link>

                        <Link
                          to={`/organizer/ads/create/${event.id}`}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-105"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Quảng cáo
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Không có sự kiện nào</p>
                <p className="text-sm">
                  Hãy tạo sự kiện mới hoặc thử thay đổi bộ lọc
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizerEventList;
