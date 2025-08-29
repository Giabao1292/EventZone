import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { TrendingUp, Filter, DollarSign, Users, BarChart3 } from "lucide-react";

export default function StatisticsSeatsPage() {
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    totalEvents: 0,
    avgRevenue: 0,
  });

  // Lấy danh sách sự kiện
  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/api/events/myevents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách sự kiện:", res.data.data);
        setEvents(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sự kiện:", error);
      }
    }
    fetchEvents();
  }, []);

  // Hàm lấy dữ liệu thống kê
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const params = {};
      if (eventId) params.eventId = eventId;
      if (fromDate) params.fromDate = `${fromDate}T00:00:00`;
      if (toDate) params.toDate = `${toDate}T23:59:59`;

      const res = await axios.get("/api/ticket-sales", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setData(res.data);

      // Tính toán thống kê tổng hợp
      const totalRevenue = res.data.reduce(
        (sum, item) => sum + (item.totalRevenue || 0),
        0
      );
      const totalTickets = res.data.reduce(
        (sum, item) => sum + (item.ticketsSold || 0),
        0
      );
      const totalEvents = res.data.length;
      const avgRevenue = totalEvents > 0 ? totalRevenue / totalEvents : 0;

      setStats({
        totalRevenue,
        totalTickets,
        totalEvents,
        avgRevenue,
      });
    } catch (e) {
      setData([]);
      setStats({
        totalRevenue: 0,
        totalTickets: 0,
        totalEvents: 0,
        avgRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Lọc khi submit form
  const handleFilter = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Lấy dữ liệu mặc định khi vào trang
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

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
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Thống kê doanh thu
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Theo dõi hiệu suất bán vé và doanh thu sự kiện
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Tổng doanh thu
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalRevenue.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                <DollarSign className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Vé đã bán</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalTickets.toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                <Users className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Sự kiện</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalEvents}
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
                  TB doanh thu
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.avgRevenue.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="text-blue-500" size={20} />
            <h3 className="text-xl font-semibold text-slate-700">
              Bộ lọc dữ liệu
            </h3>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={handleFilter}
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Sự kiện
              </label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">Tất cả sự kiện</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Từ ngày
              </label>
              <input
                type="date"
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Đến ngày
              </label>
              <input
                type="date"
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 opacity-0">
                Filter
              </label>
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105"
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Lọc dữ liệu"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Data Table */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
              <BarChart3 className="text-blue-500" size={20} />
              <span>Chi tiết doanh thu</span>
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center space-x-2 text-slate-600">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">
                      Tên sự kiện
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">
                      Số vé đã bán
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">
                      Doanh thu
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((item, index) => (
                    <motion.tr
                      key={item.eventId}
                      className="hover:bg-slate-50/50 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-700">
                          {item.eventTitle}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {item.ticketsSold?.toLocaleString("vi-VN") || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-green-600">
                          {item.totalRevenue?.toLocaleString("vi-VN") || 0} đ
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (item.totalRevenue || 0) > 1000000
                              ? "bg-green-100 text-green-800"
                              : (item.totalRevenue || 0) > 500000
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(item.totalRevenue || 0) > 1000000
                            ? "Xuất sắc"
                            : (item.totalRevenue || 0) > 500000
                            ? "Tốt"
                            : "Cần cải thiện"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-slate-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Không có dữ liệu</p>
                <p className="text-sm">
                  Hãy thử thay đổi bộ lọc hoặc tạo sự kiện mới
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
