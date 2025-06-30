"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Mail,
  Phone,
  QrCode,
  TrendingUp,
  CreditCard,
  ArrowLeft,
  Ticket,
  Star,
  UserCheck,
  UserX,
  BarChart3,
  Loader2,
} from "lucide-react";

// Import API services
import {
  searchEvents,
  getEventDetail,
  updateEventStatus,
  buildSearchParams,
  mapApiEventToComponent,
  mapApiEventDetailToComponent,
  mapDisplayStatusToApi,
  getEventStats,
} from "../../services/eventService";

// Mock data for attendees (since API doesn't provide this)
const mockAttendees = [
  {
    id: "att1",
    eventId: "1",
    userId: "user1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    ticketQuantity: 2,
    totalAmount: 1000000,
    bookingDate: "2024-01-15T10:30:00Z",
    paymentStatus: "completed",
    checkInStatus: "checked_in",
    checkInTime: "2024-02-15T08:45:00Z",
    ticketCode: "TK001-2024",
    specialRequests: "Cần chỗ ngồi gần sân khấu",
  },
  {
    id: "att2",
    eventId: "1",
    userId: "user2",
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0912345678",
    ticketQuantity: 1,
    totalAmount: 500000,
    bookingDate: "2024-01-16T14:20:00Z",
    paymentStatus: "completed",
    checkInStatus: "not_checked_in",
    ticketCode: "TK002-2024",
  },
  {
    id: "att3",
    eventId: "1",
    userId: "user3",
    name: "Lê Văn Cường",
    email: "levancuong@email.com",
    phone: "0923456789",
    ticketQuantity: 3,
    totalAmount: 1500000,
    bookingDate: "2024-01-17T09:15:00Z",
    paymentStatus: "pending",
    checkInStatus: "not_checked_in",
    ticketCode: "TK003-2024",
    specialRequests: "Cần hỗ trợ người khuyết tật",
  },
];

// Utility Components (keeping all original components)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Input = ({ placeholder, value, onChange, className = "" }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  />
);

const Select = ({ value, onValueChange, children, className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      {children}
    </select>
  );
};

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const Textarea = ({
  placeholder,
  value,
  onChange,
  rows = 3,
  className = "",
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  />
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="p-6 pb-4 border-b">{children}</div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

const DialogContent = ({ children }) => <div className="p-6">{children}</div>;

const DialogFooter = ({ children, className = "" }) => (
  <div className={`p-6 pt-4 border-t flex justify-end gap-3 ${className}`}>
    {children}
  </div>
);

const Label = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

// Loading Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
};

// Main Components
const EventApprovalModal = ({ event, isOpen, onClose, onSuccess }) => {
  const [action, setAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eventDetail, setEventDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch event detail when modal opens
  useEffect(() => {
    if (isOpen && event && !eventDetail) {
      fetchEventDetail();
    }
  }, [isOpen, event]);

  const fetchEventDetail = async () => {
    if (!event?.id) return;

    setLoadingDetail(true);
    try {
      const response = await getEventDetail(event.id);
      if (response.code === 200) {
        const mappedDetail = mapApiEventDetailToComponent(response.data);
        setEventDetail(mappedDetail);
      }
    } catch (error) {
      console.error("Error fetching event detail:", error);
      // Use basic event data if detail fetch fails
      setEventDetail(event);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApprove = async () => {
    if (!event) return;
    setIsLoading(true);

    try {
      const response = await updateEventStatus(
        event.id,
        mapDisplayStatusToApi("approved")
      );
      if (response.code === 200) {
        alert("Sự kiện đã được duyệt thành công!");
        onSuccess();
        onClose();
        setAction(null);
      } else {
        alert("Có lỗi xảy ra khi duyệt sự kiện!");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      alert("Có lỗi xảy ra khi duyệt sự kiện!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!event || !rejectionReason.trim()) return;

    setIsLoading(true);

    try {
      await updateEventStatus(
        event.id,
        mapDisplayStatusToApi("rejected"),
        rejectionReason
      );

      // Nếu tới được đây tức là không bị catch lỗi => Thành công
      alert("Sự kiện đã được từ chối!");
      onSuccess?.();
      onClose?.();
      setAction(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting event:", error);
      alert("Có lỗi xảy ra khi từ chối sự kiện!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setAction(null);
    setRejectionReason("");
    setEventDetail(null);
    onClose();
  };

  if (!event) return null;

  const displayEvent = eventDetail || event;

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogHeader>
        <DialogTitle>Chi tiết sự kiện - Xem xét duyệt</DialogTitle>
      </DialogHeader>

      <DialogContent>
        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-2">Đang tải chi tiết sự kiện...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Event Image */}
            {displayEvent.imageUrl && (
              <div className="w-full">
                <img
                  src={displayEvent.imageUrl || "/placeholder.svg"}
                  alt={displayEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Event Title and Category */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {displayEvent.title}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{displayEvent.category}</Badge>
                {displayEvent.ageRating && (
                  <Badge variant="secondary">{displayEvent.ageRating}</Badge>
                )}
                {displayEvent.tags &&
                  displayEvent.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Ngày diễn ra</p>
                    <p className="text-gray-600">
                      {displayEvent.date &&
                        new Date(displayEvent.date).toLocaleDateString(
                          "vi-VN",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Thời gian</p>
                    <p className="text-gray-600">
                      {displayEvent.time}
                      {displayEvent.endTime && ` - ${displayEvent.endTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Địa điểm</p>
                    <p className="text-gray-600">{displayEvent.location}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Giá vé</p>
                    <p className="text-gray-600">
                      {displayEvent.price === 0
                        ? "Miễn phí"
                        : `${displayEvent.price.toLocaleString("vi-VN")} VNĐ`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Số lượng vé</p>
                    <p className="text-gray-600">
                      {displayEvent.maxTickets || "Không giới hạn"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    {displayEvent.orgLogoUrl ? (
                      <img
                        src={displayEvent.orgLogoUrl || "/placeholder.svg"}
                        alt="Organizer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">O</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Người tổ chức</p>
                    <p className="text-gray-600">
                      {displayEvent.organizerName}
                    </p>
                    {displayEvent.organizerEmail && (
                      <p className="text-sm text-gray-500">
                        {displayEvent.organizerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Mô tả sự kiện
              </h3>
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {displayEvent.description}
                </p>
              </div>
            </div>

            {/* Banner Text */}
            {displayEvent.bannerText && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin banner
                </h3>
                <div className="p-4 bg-blue-50 border rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {displayEvent.bannerText}
                  </p>
                </div>
              </div>
            )}

            {/* Showing Times */}
            {displayEvent.showingTimes &&
              displayEvent.showingTimes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lịch chiếu
                  </h3>
                  <div className="space-y-2">
                    {displayEvent.showingTimes.map((showTime, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 border rounded-lg"
                      >
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>
                              {showTime.startTime &&
                                new Date(showTime.startTime).toLocaleString(
                                  "vi-VN"
                                )}
                              {showTime.endTime &&
                                ` - ${new Date(showTime.endTime).toLocaleString(
                                  "vi-VN"
                                )}`}
                            </span>
                          </div>
                          {showTime.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span>{showTime.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Event Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                <p className="text-gray-900">
                  {displayEvent.createdAt &&
                    new Date(displayEvent.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cập nhật lần cuối
                </p>
                <p className="text-gray-900">
                  {displayEvent.updatedAt &&
                    new Date(displayEvent.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>

            {displayEvent?.status === "rejected" ? (
              // ✅ Trường hợp đã bị từ chối: Hiển thị readonly lý do
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <Label
                  htmlFor="rejection-reason"
                  className="text-lg font-semibold text-red-800 mb-3 block"
                >
                  Lý do từ chối sự kiện
                </Label>
                <Textarea
                  value={displayEvent.rejectionReason}
                  readOnly
                  rows={4}
                />
                <p className="text-sm text-red-600 mt-2">
                  Lý do từ chối đã được gửi email cho người tổ chức.
                </p>
              </div>
            ) : (
              action === "reject" && (
                // ✅ Trường hợp đang thực hiện hành động từ chối: Hiển thị form nhập lý do
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Label
                    htmlFor="rejection-reason"
                    className="text-lg font-semibold text-red-800 mb-3 block"
                  >
                    Lý do từ chối sự kiện *
                  </Label>
                  <Textarea
                    placeholder="Vui lòng nhập lý do cụ thể tại sao sự kiện này bị từ chối..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                  <p className="text-sm text-red-600 mt-2">
                    Lý do từ chối sẽ được gửi email thông báo đến người tổ chức.
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </DialogContent>

      <DialogFooter>
        {displayEvent?.status === "rejected" ? (
          // ✅ Trường hợp đã bị từ chối: Chỉ có nút Đóng
          <Button variant="outline" onClick={resetModal}>
            Đóng
          </Button>
        ) : !action ? (
          // ✅ Chưa chọn action: Hiển thị 2 nút Duyệt / Từ chối
          <>
            <Button variant="outline" onClick={resetModal}>
              Đóng
            </Button>
            <Button variant="destructive" onClick={() => setAction("reject")}>
              <XCircle className="w-5 h-5 mr-2" />
              Từ chối sự kiện
            </Button>
            <Button
              onClick={() => setAction("approve")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Duyệt sự kiện
            </Button>
          </>
        ) : action === "approve" ? (
          // ✅ Đang chọn duyệt
          <>
            <Button variant="outline" onClick={() => setAction(null)}>
              Quay lại
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Đang xử lý..." : "Xác nhận duyệt"}
            </Button>
          </>
        ) : (
          // ✅ Đang chọn từ chối
          <>
            <Button variant="outline" onClick={() => setAction(null)}>
              Quay lại
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isLoading || !rejectionReason.trim()}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
};

// Keep original AttendeeManagement component (using mock data since API doesn't provide this)
const AttendeeManagement = ({ eventId, eventTitle }) => {
  const [attendees, setAttendees] = useState(
    mockAttendees.filter((a) => a.eventId === eventId)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      const matchesSearch =
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.ticketCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || attendee.checkInStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [attendees, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = attendees.length;
    const checkedIn = attendees.filter(
      (a) => a.checkInStatus === "checked_in"
    ).length;
    const totalRevenue = attendees
      .filter((a) => a.paymentStatus === "completed")
      .reduce((sum, a) => sum + a.totalAmount, 0);
    const totalTickets = attendees.reduce(
      (sum, a) => sum + a.ticketQuantity,
      0
    );

    return {
      total,
      checkedIn,
      attendanceRate: total > 0 ? (checkedIn / total) * 100 : 0,
      totalRevenue,
      totalTickets,
    };
  }, [attendees]);

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "Đã thanh toán", variant: "default" },
      pending: { label: "Chờ thanh toán", variant: "secondary" },
      failed: { label: "Thanh toán thất bại", variant: "destructive" },
      refunded: { label: "Đã hoàn tiền", variant: "outline" },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCheckInStatusBadge = (status) => {
    const statusConfig = {
      not_checked_in: { label: "Chưa check-in", variant: "secondary" },
      checked_in: { label: "Đã check-in", variant: "default" },
      checked_out: { label: "Đã check-out", variant: "outline" },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCheckIn = async (attendeeId) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              checkInStatus: "checked_in",
              checkInTime: new Date().toISOString(),
            }
          : a
      )
    );
    setIsLoading(false);
    alert("Check-in thành công!");
  };

  const handleCheckOut = async (attendeeId) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? {
              ...a,
              checkInStatus: "checked_out",
              checkOutTime: new Date().toISOString(),
            }
          : a
      )
    );
    setIsLoading(false);
    alert("Check-out thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý người tham dự</h1>
        <p className="text-gray-600">Sự kiện: {eventTitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tổng số người
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Đã check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.checkedIn}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tỷ lệ tham dự
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.attendanceRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalRevenue.toLocaleString("vi-VN")} VNĐ
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Tổng vé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Tìm kiếm người tham dự
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Nhập tên, email hoặc mã vé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-64 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Trạng thái check-in
              </Label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              >
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="not_checked_in">Chưa check-in</SelectItem>
                <SelectItem value="checked_in">Đã check-in</SelectItem>
                <SelectItem value="checked_out">Đã check-out</SelectItem>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="w-full lg:w-auto">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
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

      {/* Attendees List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách người tham dự ({filteredAttendees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{attendee.name}</h3>
                      {getPaymentStatusBadge(attendee.paymentStatus)}
                      {getCheckInStatusBadge(attendee.checkInStatus)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {attendee.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {attendee.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        {attendee.ticketCode}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(attendee.bookingDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Số vé: {attendee.ticketQuantity}</span>
                      <span>
                        Tổng tiền:{" "}
                        {attendee.totalAmount.toLocaleString("vi-VN")} VNĐ
                      </span>
                      {attendee.checkInTime && (
                        <span className="text-green-600">
                          Check-in:{" "}
                          {new Date(attendee.checkInTime).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      )}
                    </div>
                    {attendee.specialRequests && (
                      <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        <strong>Yêu cầu đặc biệt:</strong>{" "}
                        {attendee.specialRequests}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attendee.checkInStatus === "not_checked_in" &&
                      attendee.paymentStatus === "completed" && (
                        <Button
                          size="sm"
                          onClick={() => handleCheckIn(attendee.id)}
                          disabled={isLoading}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Check-in
                        </Button>
                      )}
                    {attendee.checkInStatus === "checked_in" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(attendee.id)}
                        disabled={isLoading}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Check-out
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`Gửi email cho ${attendee.name}`)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Gửi email
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Không tìm thấy người tham dự nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Keep original EventReport component (using mock data)
const EventReport = ({ eventId }) => {
  const [isExporting, setIsExporting] = useState(false);

  // For now, use mock data since API doesn't provide attendee data
  const event = { id: eventId, title: "Sample Event" };
  const attendees = mockAttendees.filter((a) => a.eventId === eventId);

  const report = useMemo(() => {
    const totalRevenue = attendees
      .filter((a) => a.paymentStatus === "completed")
      .reduce((sum, a) => sum + a.totalAmount, 0);
    const totalTicketsSold = attendees.reduce(
      (sum, a) => sum + a.ticketQuantity,
      0
    );
    const checkedInCount = attendees.filter(
      (a) => a.checkInStatus === "checked_in"
    ).length;

    return {
      eventId,
      eventTitle: event?.title || "",
      totalRevenue,
      totalTicketsSold,
      totalAttendees: attendees.length,
      checkedInCount,
      attendanceRate:
        attendees.length > 0 ? (checkedInCount / attendees.length) * 100 : 0,
      averageTicketPrice:
        totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0,
      attendees,
    };
  }, [eventId, event, attendees]);

  const handleExport = async (format) => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert(`Báo cáo ${format.toUpperCase()} đã được tạo thành công!`);
    setIsExporting(false);
  };

  if (!event) {
    return <div>Không tìm thấy sự kiện</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo sự kiện</h1>
          <p className="text-gray-600">{report.eventTitle}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport("excel")} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Đang xuất..." : "Excel"}
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isExporting ? "Đang xuất..." : "PDF"}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {report.totalRevenue.toLocaleString("vi-VN")} VNĐ
            </div>
            <p className="text-sm text-gray-600">
              Trung bình: {report.averageTicketPrice.toLocaleString("vi-VN")}{" "}
              VNĐ/vé
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Vé đã bán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {report.totalTicketsSold}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Người tham dự
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {report.totalAttendees}
            </div>
            <p className="text-sm text-gray-600">
              Đã check-in: {report.checkedInCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tỷ lệ tham dự
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {report.attendanceRate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">
              {report.checkedInCount}/{report.totalAttendees} người
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Attendee List */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết người tham dự</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tên</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Số vé</th>
                  <th className="text-left p-2">Số tiền</th>
                  <th className="text-left p-2">Thanh toán</th>
                  <th className="text-left p-2">Check-in</th>
                  <th className="text-left p-2">Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {report.attendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{attendee.name}</td>
                    <td className="p-2 text-gray-600">{attendee.email}</td>
                    <td className="p-2">{attendee.ticketQuantity}</td>
                    <td className="p-2">
                      {attendee.totalAmount.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={
                          attendee.paymentStatus === "completed"
                            ? "default"
                            : attendee.paymentStatus === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {attendee.paymentStatus === "completed"
                          ? "Đã thanh toán"
                          : attendee.paymentStatus === "pending"
                          ? "Chờ thanh toán"
                          : "Thất bại"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={
                          attendee.checkInStatus === "checked_in"
                            ? "default"
                            : attendee.checkInStatus === "checked_out"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {attendee.checkInStatus === "not_checked_in"
                          ? "Chưa check-in"
                          : attendee.checkInStatus === "checked_in"
                          ? "Đã check-in"
                          : "Đã check-out"}
                      </Badge>
                    </td>
                    <td className="p-2 text-gray-600">
                      {new Date(attendee.bookingDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Event Management Component with API integration
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

  useEffect(() => {
    fetchEvents();
  }, [pagination.size, pagination.number]);

  const filteredEvents = events;

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ duyệt", variant: "secondary", icon: Clock },
      approved: { label: "Đã duyệt", variant: "default", icon: CheckCircle },
      rejected: { label: "Bị từ chối", variant: "destructive", icon: XCircle },
      published: { label: "Đã xuất bản", variant: "outline", icon: FileText },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
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
    console.log("Event status updated successfully");
    setIsModalOpen(false);
    // Refresh events list
    fetchEvents();
  };

  const handleSearch = () => {
    fetchEvents(searchTerm, statusFilter);
  };

  const renderEventList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quản lý sự kiện</h2>
          <p className="text-gray-600 mt-2">
            Duyệt và quản lý các sự kiện được tạo bởi người tổ chức
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentView("reports")} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Báo cáo
          </Button>
          <Button onClick={fetchEvents} variant="outline" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : "Làm mới"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      <Card>
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
        <Card className="border-red-200 bg-red-50">
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
            <p className="mt-4 text-gray-600">Đang tải danh sách sự kiện...</p>
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
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  <img
                    src={
                      event.imageUrl || "/placeholder.svg?height=200&width=300"
                    }
                    alt={event.title}
                    className="w-full lg:w-64 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(event.status)}
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          {event.ageRating && (
                            <Badge variant="secondary" className="text-xs">
                              {event.ageRating}
                            </Badge>
                          )}
                          {event.featured && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              <Star className="w-3 h-3 mr-1" />
                              Nổi bật
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {event.startDate &&
                            new Date(event.startDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          {event.startDate && event.endDate && " ~ "}
                          {event.endDate &&
                            new Date(event.endDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-start gap-2 text-gray-600 w-full">
                          <MapPin className="w-4 h-4 shrink-0 mt-1" />
                          <span className="break-words">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {event.price === 0
                              ? "Miễn phí"
                              : `${event.price.toLocaleString("vi-VN")} VNĐ`}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Tổ chức:{" "}
                          <span className="font-medium">
                            {event.organizerName}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Tạo:{" "}
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
                            setCurrentView("attendees");
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Người tham dự
                        </Button>
                        <Button
                          onClick={() => handleViewEvent(event)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết & Duyệt
                        </Button>
                      </div>
                    </div>

                    {/* Show rejection reason if rejected */}
                    {event.status === "rejected" && event.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Lý do từ chối:
                        </p>
                        <p className="text-sm text-red-700">
                          {event.rejectionReason}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Đã xem xét bởi: {event.reviewedBy} -{" "}
                          {event.reviewedAt &&
                            new Date(event.reviewedAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}

                    {/* Show approval info if approved */}
                    {event.status === "approved" && event.reviewedBy && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✅ Đã được duyệt bởi:{" "}
                          <span className="font-medium">
                            {event.reviewedBy}
                          </span>
                        </p>
                        <p className="text-xs text-green-600">
                          {event.reviewedAt &&
                            new Date(event.reviewedAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t mt-4">
              <div className="text-sm text-gray-500">
                Showing {pagination.number * pagination.size + 1} to{" "}
                {Math.min(
                  (pagination.number + 1) * pagination.size,
                  pagination.totalElements
                )}{" "}
                of {pagination.totalElements} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      number: prev.number - 1,
                    }))
                  }
                  disabled={pagination.number === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {renderPaginationButtons()}
                </div>

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      number: prev.number + 1,
                    }))
                  }
                  disabled={pagination.number >= pagination.totalPages - 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEvents.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy sự kiện nào
            </h3>
            <p className="text-gray-500 mb-4">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const reportMemo = useMemo(
    () => <EventReport eventId={selectedEventId} />,
    [selectedEventId]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Navigation */}
        {currentView !== "list" && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setCurrentView("list")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>
        )}

        {/* Render different views based on currentView state */}
        {currentView === "list" && renderEventList()}

        {currentView === "attendees" && (
          <AttendeeManagement
            eventId={selectedEventId}
            eventTitle={
              events.find((e) => e.id === selectedEventId)?.title || "Sự kiện"
            }
          />
        )}

        {currentView === "reports" && reportMemo}

        {/* Approval Modal */}
        <EventApprovalModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
};

export default EventManagementPage;
