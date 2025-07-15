"use client";

import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Search,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildSearchParams,
  getEventStats,
  mapApiEventToComponent,
  searchEvents,
} from "../../services/eventService";
import ShowingTimeManagement from "./ShowingTimePage";
import RescheduleRequestsModal from "../../components/admin/RescheduleRequestsModal";
import eventRescheduleService from "../../services/eventRescheduleService";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import EventApprovalModal from "../../components/admin/EventApprovalModal";
import EventReport from "./EventReport";
import { useAuth } from "../../context/AuthContext";

const Select = ({ value, onValueChange, children, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  >
    {children}
  </select>
);

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
};

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentView, setCurrentView] = useState("list");
  const [selectedEventId, setSelectedEventId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    number: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
  });
  const PAGE_SIZE_OPTIONS = [1, 5, 10, 15, 20, 25];

  // Chỉ đếm các yêu cầu dời lịch PENDING cho từng event
  const [rescheduleCounts, setRescheduleCounts] = useState({});
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleModalEventId, setRescheduleModalEventId] = useState(null);
  const { user } = useAuth();

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = buildSearchParams(statusFilter, searchTerm);
      const response = await searchEvents(
        pagination.number,
        pagination.size,
        searchParams
      );

      if (response.code === 200 && response.data && response.data.content) {
        const mappedEvents = response.data.content.map(mapApiEventToComponent);
        setEvents(mappedEvents);
        setStats(getEventStats(response.data.content));
        setPagination({
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          number: response.data.number,
          size: response.data.size,
        });
      } else {
        setError("Không thể tải danh sách sự kiện");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Có lỗi xảy ra khi tải danh sách sự kiện");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.number, pagination.size, statusFilter, searchTerm]);

  // Đếm số lượng yêu cầu PENDING cho từng event (badge đỏ)
  const fetchRescheduleCounts = useCallback(async () => {
    const counts = {};
    await Promise.all(
      events.map(async (event) => {
        try {
          const reqs = await eventRescheduleService.getRequestsByEventId(
            event.id
          );
          counts[event.id] = reqs.filter((r) => r.status === "PENDING").length;
        } catch {
          counts[event.id] = 0;
        }
      })
    );
    setRescheduleCounts(counts);
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, [pagination.size, pagination.number, statusFilter, searchTerm]);

  useEffect(() => {
    if (events.length > 0) {
      fetchRescheduleCounts();
    }
  }, [events, fetchRescheduleCounts]);

  const filteredEvents = events;

  const getStatusBadge = (status) => {
    // Map trạng thái ↔︎ label, icon, màu
    const statusConfig = {
      pending: {
        label: "Chờ duyệt",
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800",
      },
      approved: {
        label: "Đã duyệt",
        icon: CheckCircle,
        color: "bg-green-100 text-green-800",
      },
      rejected: {
        label: "Bị từ chối",
        icon: XCircle,
        color: "bg-red-100 text-red-800",
      },
      published: {
        label: "Đã xuất bản",
        icon: FileText,
        color: "bg-blue-100 text-blue-800",
      },
      co,
    };
    // Đảm bảo key luôn dạng lowercase
    const key = (status || "").toLowerCase();
    const config = statusConfig[key];
    if (!config) return null; // fallback nếu status không khớp

    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1 ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 0; i < pagination.totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              number: i,
            }))
          }
          className={`px-3 py-1 text-sm border rounded-md ${
            i === pagination.number
              ? "bg-blue-500 text-white"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchEvents();
  };

  const handleSearch = () => {
    fetchEvents(searchTerm, statusFilter);
  };

  // Mở modal xem/duyệt các yêu cầu dời lịch
  const openRescheduleRequestsModal = (eventId) => {
    setRescheduleModalEventId(eventId);
    setShowRescheduleModal(true);
  };

  const reportMemo = useMemo(
    () => <EventReport eventId={selectedEventId} />,
    [selectedEventId]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {currentView === "list" && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Quản lý sự kiện
                </h2>
                <p className="text-gray-600 mt-2">
                  Duyệt và quản lý các sự kiện được tạo bởi người tổ chức
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentView("reports")}
                  variant="outline"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Báo cáo
                </Button>
                <Button
                  onClick={fetchEvents}
                  variant="outline"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : "Làm mới"}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">
                    Tổng số sự kiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <p className="text-blue-100 text-sm">Tất cả sự kiện</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-100">
                    Chờ duyệt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.pending}</div>
                  <p className="text-yellow-100 text-sm">Cần xem xét</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">
                    Đã duyệt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.approved}</div>
                  <p className="text-green-100 text-sm">Được phê duyệt</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-100">
                    Bị từ chối
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.rejected}</div>
                  <p className="text-red-100 text-sm">Không được duyệt</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                  {/* Search Input */}
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Tìm kiếm sự kiện
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Nhập tên sự kiện để tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full lg:w-64 space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Trạng thái
                    </Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    >
                      <SelectItem value="all">🔍 Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">⏳ Chờ duyệt</SelectItem>
                      <SelectItem value="approved">✅ Đã duyệt</SelectItem>
                      <SelectItem value="rejected">❌ Bị từ chối</SelectItem>
                      <SelectItem value="published">🚀 Đã xuất bản</SelectItem>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <div className="w-full lg:w-auto">
                    <Button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="w-full lg:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Đang tìm...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Tìm kiếm
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="w-full lg:w-auto">
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        fetchEvents("", "all");
                      }}
                      variant="outline"
                      className="w-full lg:w-auto h-12 px-6 border-2 border-gray-300 hover:border-gray-400 rounded-lg"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="border-red-200 bg-red-50 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card>
                <CardContent className="text-center py-12">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">
                    Đang tải danh sách sự kiện...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            {!isLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Page Size:
                  </label>
                  <select
                    value={pagination.size.toString()}
                    onChange={(e) => {
                      const newSize = Number.parseInt(e.target.value);
                      setPagination((prev) => ({
                        ...prev,
                        size: newSize,
                        number: 0,
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[60px]"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size.toString()}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-xl transition-all duration-200 rounded-2xl border border-gray-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <img
                          src={
                            event.imageUrl ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={event.title}
                          className="w-full lg:w-64 h-48 object-cover rounded-xl shadow-sm"
                        />

                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {getStatusBadge(event.status)}
                                <Badge variant="outline" className="text-xs">
                                  {event.category}
                                </Badge>
                                {event.ageRating && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {event.ageRating}
                                  </Badge>
                                )}
                                {event.featured && (
                                  <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600 text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Nổi bật
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm line-clamp-2">
                            {event.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>
                                {event.startDate &&
                                  new Date(event.startDate).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                {event.startDate && event.endDate && " ~ "}
                                {event.endDate &&
                                  new Date(event.endDate).toLocaleDateString(
                                    "vi-VN"
                                  )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{event.time}</span>
                            </div>
                            <div className="col-span-1 lg:col-span-2 flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                              <span className="break-words">
                                {event.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="space-y-1">
                              <div className="text-sm-bold text-black-500">
                                Tổ chức:{" "}
                                <span className="font-medium text-gray-700">
                                  {event.organizerName}
                                </span>
                              </div>
                              <div className="text-xs text-orange-500">
                                Tạo ngày:{" "}
                                {event.createdAt &&
                                  new Date(event.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEventId(event.id);
                                  setCurrentView("showingTimes");
                                }}
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Người tham dự
                              </Button>

                              <Button
                                size="sm"
                                variant={
                                  rescheduleCounts[event.id] > 0
                                    ? "destructive"
                                    : "outline"
                                }
                                onClick={() =>
                                  openRescheduleRequestsModal(event.id)
                                }
                              >
                                Yêu cầu dời lịch
                                {rescheduleCounts[event.id] > 0
                                  ? `(${rescheduleCounts[event.id]})`
                                  : ""}
                              </Button>

                              <Button
                                onClick={() => handleViewEvent(event)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Xem chi tiết & Duyệt
                              </Button>
                            </div>
                          </div>

                          {/* Block Lý do Từ chối */}
                          {event.status === "rejected" &&
                            event.rejectionReason && (
                              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm font-semibold text-red-700 mb-1">
                                  ❌ Lý do từ chối:
                                </p>
                                <p className="text-sm text-red-600">
                                  {event.rejectionReason}
                                </p>
                                <p className="text-xs text-red-500 mt-1">
                                  Đánh giá bởi: {event.reviewedBy} -{" "}
                                  {event.reviewedAt &&
                                    new Date(
                                      event.reviewedAt
                                    ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            )}

                          {/* Block Đã Duyệt */}
                          {event.status === "approved" && event.reviewedBy && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                              <p className="text-sm text-green-700 font-semibold">
                                ✅ Đã được duyệt bởi:{" "}
                                <span className="font-medium">
                                  {event.reviewedBy}
                                </span>
                              </p>
                              <p className="text-xs text-green-600">
                                {event.reviewedAt &&
                                  new Date(event.reviewedAt).toLocaleDateString(
                                    "vi-VN"
                                  )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {currentView === "showingTimes" && (
          <ShowingTimeManagement
            eventId={selectedEventId}
            eventTitle={
              events.find((e) => e.id === selectedEventId)?.title || "Sự kiện"
            }
            onBack={() => setCurrentView("list")}
          />
        )}

        {currentView === "reports" && reportMemo}

        <EventApprovalModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />

        {/* Modal duyệt yêu cầu dời lịch */}
        {showRescheduleModal && (
          <RescheduleRequestsModal
            eventId={rescheduleModalEventId}
            adminUserId={user?.id || null}
            onClose={() => setShowRescheduleModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EventManagementPage;
