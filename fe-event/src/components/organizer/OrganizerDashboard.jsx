import { useState, useEffect } from "react";
import OrganizerCard from "./OrganizerCard";
import OrganizerButton from "./OrganizerButton";
import OrganizerInput from "./OrganizerInput";
import apiClient from "../../api/axios";

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRevenue: 0,
    totalAttendees: 0,
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data from API
        const [eventsResponse, statsResponse] = await Promise.all([
          apiClient.get("/events/myevents"),
          apiClient.get("/organizer/stats"), // Assuming this endpoint exists
        ]);

        const events = eventsResponse.data.data || [];
        const dashboardStats = statsResponse.data.data || {};

        // Calculate stats from real data
        const totalEvents = events.length;
        const activeEvents = events.filter(
          (e) => e.status === "ACTIVE" || e.status === "APPROVED"
        ).length;
        const totalRevenue = events.reduce(
          (sum, event) => sum + (event.totalRevenue || 0),
          0
        );
        const totalAttendees = events.reduce(
          (sum, event) => sum + (event.totalAttendees || 0),
          0
        );

        setStats({
          totalEvents,
          activeEvents,
          totalRevenue,
          totalAttendees,
        });

        // Get recent events (last 3)
        const recent = events
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt) -
              new Date(a.createdAt || a.updatedAt)
          )
          .slice(0, 3)
          .map((event) => ({
            id: event.id,
            name: event.eventTitle,
            date: event.startTime,
            attendees: event.totalAttendees || 0,
            revenue: event.totalRevenue || 0,
            status: event.status?.toLowerCase() || "unknown",
            image: event.posterImage || "/placeholder.svg",
          }));

        setRecentEvents(recent);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to default values
        setStats({
          totalEvents: 0,
          activeEvents: 0,
          totalRevenue: 0,
          totalAttendees: 0,
        });
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "upcoming":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 loading-skeleton rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 loading-skeleton rounded-2xl"></div>
          <div className="h-96 loading-skeleton rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text-blue mb-2">
          Chào mừng trở lại!
        </h1>
        <p className="text-slate-600 text-lg">
          Quản lý sự kiện của bạn một cách chuyên nghiệp
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OrganizerCard
          title="Tổng sự kiện"
          subtitle="Tất cả sự kiện đã tạo"
          icon="📊"
          value={stats.totalEvents}
          change="+12%"
          changeType="positive"
          className="animate-slide-in-left"
          style={{ animationDelay: "0.1s" }}
        />

        <OrganizerCard
          title="Sự kiện đang diễn ra"
          subtitle="Sự kiện hiện tại"
          icon="🎯"
          value={stats.activeEvents}
          change="+3"
          changeType="positive"
          className="animate-slide-in-left"
          style={{ animationDelay: "0.2s" }}
        />

        <OrganizerCard
          title="Tổng doanh thu"
          subtitle="Tính theo VND"
          icon="💰"
          value={formatCurrency(stats.totalRevenue)}
          change="+8.5%"
          changeType="positive"
          className="animate-slide-in-left"
          style={{ animationDelay: "0.3s" }}
        />

        <OrganizerCard
          title="Tổng người tham gia"
          subtitle="Tất cả sự kiện"
          icon="👥"
          value={stats.totalAttendees.toLocaleString()}
          change="+156"
          changeType="positive"
          className="animate-slide-in-left"
          style={{ animationDelay: "0.4s" }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-2xl border border-blue-200/30 backdrop-blur-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OrganizerButton
            variant="primary"
            icon="✨"
            fullWidth
            onClick={() => console.log("Create Event")}
          >
            Tạo sự kiện mới
          </OrganizerButton>

          <OrganizerButton
            variant="secondary"
            icon="📈"
            fullWidth
            onClick={() => console.log("View Analytics")}
          >
            Xem thống kê
          </OrganizerButton>

          <OrganizerButton
            variant="outline"
            icon="💳"
            fullWidth
            onClick={() => console.log("Withdraw")}
          >
            Rút tiền
          </OrganizerButton>
        </div>
      </div>

      {/* Recent Events & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-2xl border border-blue-200/30 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-700">
              Sự kiện gần đây
            </h2>
            <OrganizerButton variant="ghost" size="sm">
              Xem tất cả
            </OrganizerButton>
          </div>

          <div className="space-y-4">
            {recentEvents.map((event, index) => (
              <div
                key={event.id}
                className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 border border-blue-200/20 hover:border-blue-300/40 transition-all duration-300 cursor-pointer hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {event.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>📅 {formatDate(event.date)}</span>
                      <span>👥 {event.attendees} người</span>
                      <span>💰 {formatCurrency(event.revenue)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-2xl border border-blue-200/30 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">
            Thống kê nhanh
          </h2>

          <div className="space-y-6">
            {/* Revenue Chart Placeholder */}
            <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 border border-blue-200/20">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">
                Doanh thu tháng này
              </h3>
              <div className="h-32 bg-gradient-to-r from-blue-100/30 to-orange-100/30 rounded-lg flex items-center justify-center">
                <span className="text-slate-500">📊 Biểu đồ doanh thu</span>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 border border-blue-200/20">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">
                Danh mục phổ biến
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Công nghệ", count: 8, percentage: 33 },
                  { name: "Âm nhạc", count: 6, percentage: 25 },
                  { name: "Kinh doanh", count: 5, percentage: 21 },
                  { name: "Giáo dục", count: 3, percentage: 13 },
                  { name: "Khác", count: 2, percentage: 8 },
                ].map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-slate-700">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-blue-200/30 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600 w-8 text-right">
                        {category.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-4 border border-blue-200/20">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">
                Sự kiện sắp diễn ra
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Workshop AI", date: "25/01/2024", time: "14:00" },
                  { name: "Concert Jazz", date: "28/01/2024", time: "19:30" },
                  { name: "Tech Meetup", date: "30/01/2024", time: "18:00" },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-100/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {event.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {event.date} - {event.time}
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Sắp tới
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-2xl border border-blue-200/30 backdrop-blur-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">
          Tìm kiếm sự kiện
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OrganizerInput placeholder="Tên sự kiện..." icon="🔍" fullWidth />
          <OrganizerInput placeholder="Danh mục..." icon="📂" fullWidth />
          <OrganizerButton variant="primary" icon="🔍" fullWidth>
            Tìm kiếm
          </OrganizerButton>
        </div>
      </div>

      {/* Tips & Insights */}
      <div className="bg-gradient-to-r from-blue-100/50 to-orange-100/50 rounded-2xl border border-blue-200/30 backdrop-blur-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">
          💡 Mẹo & Gợi ý
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/50 rounded-xl p-4 border border-blue-200/30">
            <h3 className="font-semibold text-slate-700 mb-2">
              🎯 Tối ưu hóa sự kiện
            </h3>
            <p className="text-sm text-slate-600">
              Sử dụng dữ liệu phân tích để cải thiện trải nghiệm người tham gia
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 border border-blue-200/30">
            <h3 className="font-semibold text-slate-700 mb-2">
              📱 Marketing hiệu quả
            </h3>
            <p className="text-sm text-slate-600">
              Tận dụng mạng xã hội để quảng bá sự kiện của bạn
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 border border-blue-200/30">
            <h3 className="font-semibold text-slate-700 mb-2">
              💰 Tăng doanh thu
            </h3>
            <p className="text-sm text-slate-600">
              Cung cấp các gói VIP và early bird để tăng doanh số
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
