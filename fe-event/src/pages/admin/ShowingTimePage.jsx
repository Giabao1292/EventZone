"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Calendar,
  Users,
  Search,
  Mail,
  Phone,
  QrCode,
  UserCheck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  Filter,
  RefreshCw,
} from "lucide-react";

import {
  getEventShowingTimes,
  getEventAttendees,
  checkInAttendee,
  searchAttendeeByQR,
  getEventAnalytics,
} from "../../services/eventService";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import AttendeeModal from "../../components/admin/AttendeeModal";

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

// Loading Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
};

const ShowingTimeManagement = ({ eventId, eventTitle, onBack }) => {
  const [showingTimes, setShowingTimes] = useState([]);
  const [selectedShowingTime, setSelectedShowingTime] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingShowingTimes, setIsLoadingShowingTimes] = useState(false);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [checkInFilter, setCheckInFilter] = useState("all");
  const [pagination, setPagination] = useState({
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // QR Scanner states
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isSearchingByQR, setIsSearchingByQR] = useState(false);

  // Attendee Modal states
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState("");

  // Fetch showing times when component mounts
  useEffect(() => {
    fetchShowingTimes();
  }, [eventId]);

  // Fetch attendees and analytics when showing time is selected
  useEffect(() => {
    if (selectedShowingTime) {
      fetchAttendees();
      fetchAnalytics();
    }
  }, [selectedShowingTime, pagination.number, pagination.size]);

  const fetchShowingTimes = async () => {
    setIsLoadingShowingTimes(true);
    try {
      const response = await getEventShowingTimes(eventId);
      if (response.code === 200) {
        setShowingTimes(response.data);
      }
    } catch (error) {
      console.error("Error fetching showing times:", error);
    } finally {
      setIsLoadingShowingTimes(false);
    }
  };

  const fetchAttendees = async () => {
    if (!selectedShowingTime) return;

    setIsLoadingAttendees(true);
    try {
      const searchParams = [];
      if (searchTerm.trim()) {
        searchParams.push(`fullName:${searchTerm.trim()}`);
      }
      if (searchEmail.trim()) {
        searchParams.push(`email:${searchEmail.trim()}`);
      }
      if (checkInFilter !== "all") {
        const statusValue =
          checkInFilter === "not_checked_in" ? "NOT_CHECKED_IN" : "CHECKED_IN";
        searchParams.push(`checkinStatus:${statusValue}`);
      }

      const response = await getEventAttendees(
        eventId,
        selectedShowingTime.startTime,
        pagination.number,
        pagination.size,
        searchParams
      );

      if (response.code === 200) {
        setAttendees(response.data.content);
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          number: response.data.number,
          size: response.data.size,
        }));
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedShowingTime) return;

    setIsLoadingAnalytics(true);
    try {
      const response = await getEventAnalytics(
        eventId,
        selectedShowingTime.startTime
      );
      if (response.code === 200) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleCheckIn = async (bookingId) => {
    setIsCheckingIn(true);
    setCheckInError(""); // Clear previous error
    try {
      await checkInAttendee(bookingId);
      // Refresh attendees list and analytics
      fetchAttendees();
      fetchAnalytics();
      alert("Check-in thành công!");
      setIsAttendeeModalOpen(false);
    } catch (error) {
      console.error("Error checking in attendee:", error);
      // Extract error message from response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi check-in!";
      setCheckInError(errorMessage);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleQRScan = async (qrToken) => {
    if (!selectedShowingTime) {
      alert("Vui lòng chọn thời gian chiếu trước!");
      return;
    }

    setIsSearchingByQR(true);
    try {
      const response = await searchAttendeeByQR(
        eventId,
        selectedShowingTime.startTime,
        qrToken
      );
      if (response.code === 200 && response.data.content.length > 0) {
        const attendee = response.data.content[0];
        setSelectedAttendee(attendee);
        setIsAttendeeModalOpen(true);
      } else {
        alert("Không tìm thấy người tham dự với mã QR này!");
      }
    } catch (error) {
      console.error("Error searching by QR:", error);
      alert("Có lỗi xảy ra khi tìm kiếm!");
    } finally {
      setIsSearchingByQR(false);
      setIsQRScannerOpen(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, number: 0 }));
    fetchAttendees();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearchEmail("");
    setCheckInFilter("all");
    setPagination((prev) => ({ ...prev, number: 0 }));
  };

  const getCheckInStatusBadge = (status) => {
    const statusConfig = {
      NOT_CHECKED_IN: { label: "Chưa check-in", variant: "secondary" },
      CHECKED_IN: { label: "Đã check-in", variant: "default" },
      CHECKED_OUT: { label: "Đã check-out", variant: "outline" },
    };
    const config = statusConfig[status] || statusConfig.NOT_CHECKED_IN;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const attendeeStats = useMemo(() => {
    if (analytics) {
      return {
        total: analytics.numberOfAttendees,
        checkedIn: analytics.numberOfCheckIns,
        attendanceRate:
          analytics.numberOfAttendees > 0
            ? (analytics.numberOfCheckIns / analytics.numberOfAttendees) * 100
            : 0,
        totalSeats: analytics.numberOfSeats,
        sale: analytics.sale,
        averageAttendees: analytics.averageAttendees,
      };
    }

    // Fallback to calculated stats if analytics not available
    const total = attendees.length;
    const checkedIn = attendees.filter(
      (a) => a.checkInStatus === "CHECKED_IN"
    ).length;
    const totalSeats = attendees.reduce((sum, a) => sum + a.numberOfSeats, 0);

    return {
      total,
      checkedIn,
      attendanceRate: total > 0 ? (checkedIn / total) * 100 : 0,
      totalSeats,
      sale: 0,
      averageAttendees: 0,
    };
  }, [attendees, analytics]);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    const startPage = Math.max(
      0,
      pagination.number - Math.floor(maxButtons / 2)
    );
    const endPage = Math.min(
      pagination.totalPages - 1,
      startPage + maxButtons - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPagination((prev) => ({ ...prev, number: i }))}
          className={`px-3 py-1 text-sm border rounded-md ${
            i === pagination.number
              ? "bg-blue-500 text-white border-blue-500"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            )}
            <h1 className="text-3xl font-bold">Quản lý thời gian chiếu</h1>
          </div>
          <p className="text-gray-600">Sự kiện: {eventTitle}</p>
        </div>
        <Button
          onClick={fetchShowingTimes}
          variant="outline"
          disabled={isLoadingShowingTimes}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${
              isLoadingShowingTimes ? "animate-spin" : ""
            }`}
          />
          Làm mới
        </Button>
      </div>

      {/* Showing Times List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Danh sách thời gian chiếu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingShowingTimes ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
              <span className="ml-2">Đang tải thời gian chiếu...</span>
            </div>
          ) : showingTimes.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Không có thời gian chiếu nào
              </h3>
              <p className="text-gray-500">
                Sự kiện này chưa có thời gian chiếu được thiết lập
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showingTimes.map((showingTime) => (
                <Card
                  key={showingTime.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedShowingTime?.id === showingTime.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedShowingTime(showingTime)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">
                          {new Date(showingTime.startTime).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>
                          {formatTime(showingTime.startTime)} -{" "}
                          {formatTime(showingTime.endTime)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>
                          Mở bán: {formatDateTime(showingTime.saleOpenTime)}
                        </div>
                        <div>
                          Đóng bán: {formatDateTime(showingTime.saleCloseTime)}
                        </div>
                      </div>
                      {selectedShowingTime?.id === showingTime.id && (
                        <Badge className="w-full justify-center">Đã chọn</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendees Section */}
      {selectedShowingTime && (
        <>
          {/* Selected Showing Time Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Thời gian chiếu đã chọn
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(
                        selectedShowingTime.startTime
                      ).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(selectedShowingTime.startTime)} -{" "}
                      {formatTime(selectedShowingTime.endTime)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedShowingTime(null)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Bỏ chọn
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Tổng người tham dự
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendeeStats.total}</div>
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
                  {attendeeStats.checkedIn}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Tổng số ghế
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {attendeeStats.totalSeats}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Tỷ lệ tham dự
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {attendeeStats.attendanceRate.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Doanh thu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {attendeeStats.sale.toLocaleString("vi-VN")}đ
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                {/* Search by Full Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tìm kiếm theo tên
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Nhập tên người tham dự..."
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

                {/* Search by Email with QR Button */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tìm kiếm theo email
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Nhập email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="pl-11 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                    </div>
                    {/* <Button
                      onClick={() => setIsQRScannerOpen(true)}
                      className="h-12 px-4 bg-green-600 hover:bg-green-700"
                      disabled={isSearchingByQR}
                    >
                      {isSearchingByQR ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <QrCode className="w-5 h-5" />
                      )}
                    </Button> */}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Trạng thái check-in
                  </Label>
                  <Select
                    value={checkInFilter}
                    onValueChange={setCheckInFilter}
                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  >
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="not_checked_in">
                      Chưa check-in
                    </SelectItem>
                    <SelectItem value="checked_in">Đã check-in</SelectItem>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSearch}
                  disabled={isLoadingAttendees}
                  className="h-12 px-6"
                >
                  {isLoadingAttendees ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Tìm kiếm
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="h-12 px-6 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendees List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Danh sách người tham dự ({pagination.totalElements})
                </span>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Hiển thị:
                  </Label>
                  <Select
                    value={pagination.size.toString()}
                    onValueChange={(value) =>
                      setPagination((prev) => ({
                        ...prev,
                        size: Number.parseInt(value),
                        number: 0,
                      }))
                    }
                    className="w-20 h-8"
                  >
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAttendees ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2">
                    Đang tải danh sách người tham dự...
                  </span>
                </div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Không tìm thấy người tham dự nào
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">
                              {attendee.fullName}
                            </h3>
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
                              {attendee.qrToken}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {attendee.numberOfSeats} ghế
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            {attendee.paidAt && (
                              <span className="text-green-600">
                                Thanh toán:{" "}
                                {new Date(attendee.paidAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            )}
                            {attendee.checkInTime && (
                              <span className="text-blue-600">
                                Check-in:{" "}
                                {new Date(attendee.checkInTime).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {/* {attendee.checkInStatus === "NOT_CHECKED_IN" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleCheckIn(attendee.id)}
                                                        >
                                                            <UserCheck className="w-4 h-4 mr-2" />
                                                            Check-in
                                                        </Button>
                                                    )} */}
                          {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              alert(`Gửi email cho ${attendee.fullName}`)
                            }
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Gửi email
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="text-sm text-gray-500">
                    Hiển thị {pagination.number * pagination.size + 1} đến{" "}
                    {Math.min(
                      (pagination.number + 1) * pagination.size,
                      pagination.totalElements
                    )}{" "}
                    trong tổng số {pagination.totalElements} kết quả
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          number: prev.number - 1,
                        }))
                      }
                      disabled={pagination.number === 0}
                    >
                      Trước
                    </Button>

                    <div className="flex items-center gap-1">
                      {renderPaginationButtons()}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          number: prev.number + 1,
                        }))
                      }
                      disabled={pagination.number >= pagination.totalPages - 1}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* QR Scanner Modal */}

      {/* Attendee Detail Modal */}
      <AttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
        attendee={selectedAttendee}
        onCheckIn={handleCheckIn}
        isCheckingIn={isCheckingIn}
        checkInError={checkInError}
      />
    </div>
  );
};

export default ShowingTimeManagement;
