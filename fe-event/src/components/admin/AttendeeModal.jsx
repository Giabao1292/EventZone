"use client";

import {
  X,
  Mail,
  Phone,
  QrCode,
  Users,
  UserCheck,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import PropTypes from "prop-types";

// Hàm đếm số lượng seatLabels (ngăn trường hợp seatLabels là "" hoặc null)
const countSeatLabels = (seatLabels) => {
  if (!seatLabels || seatLabels.trim() === "") return 0;
  return seatLabels.split(",").filter((x) => x.trim() !== "").length;
};

// Hàm đếm tổng số ghế theo zoneSeatCounts: "2,3,1" => 6
const sumZoneSeats = (zoneSeatCounts) => {
  if (!zoneSeatCounts || zoneSeatCounts.trim() === "") return 0;
  return zoneSeatCounts
    .split(",")
    .map((x) => parseInt(x.trim()))
    .filter((x) => !isNaN(x))
    .reduce((a, b) => a + b, 0);
};

const AttendeeModal = ({
  isOpen,
  onClose,
  attendee,
  onCheckIn,
  isCheckingIn,
  checkInError,
}) => {
  if (!isOpen || !attendee) return null;

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

  // Tổng số ghế: seatLabels + zoneSeatCounts
  const getSeatCount = () => {
    const seatsByLabel = countSeatLabels(attendee.seatLabels);
    const seatsByZone = sumZoneSeats(attendee.zoneSeatCounts);
    return seatsByLabel + seatsByZone;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Thông tin người tham dự
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header với tên và trạng thái */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{attendee.fullName}</h2>
            {getCheckInStatusBadge(attendee.checkInStatus)}
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{attendee.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{attendee.phone || "Chưa có"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Mã QR</p>
                  <p className="font-medium font-mono">{attendee.qrToken}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Số ghế</p>
                  <p className="font-medium">{getSeatCount()} ghế</p>
                </div>
              </div>

              {/* Hiển thị Ghế cụ thể nếu có */}
              {attendee.seatLabels && attendee.seatLabels.trim() !== "" && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ghế cụ thể</p>
                    <p className="font-medium">{attendee.seatLabels}</p>
                  </div>
                </div>
              )}

              {/* Hiển thị Khu vực nếu có */}
              {attendee.zoneNames && attendee.zoneNames.trim() !== "" && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    <p className="text-sm text-gray-600">Khu vực</p>
                    {attendee.zoneNames || "Chưa chọn khu vực"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin thời gian */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-lg">Thông tin thời gian</h3>

            {attendee.paidAt && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian thanh toán</p>
                  <p className="font-medium">
                    {formatDateTime(attendee.paidAt)}
                  </p>
                </div>
              </div>
            )}

            {attendee.checkInTime && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Thời gian check-in</p>
                  <p className="font-medium">
                    {formatDateTime(attendee.checkInTime)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {checkInError && (
            <div className="border-t pt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm font-medium">
                  Lỗi check-in:
                </p>
                <p className="text-red-600 text-sm">{checkInError}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-4 flex gap-3">
            {attendee.checkInStatus === "NOT_CHECKED_IN" && (
              <Button
                onClick={() => onCheckIn(attendee.id)}
                disabled={isCheckingIn}
                className="flex-1"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                {isCheckingIn ? "Đang check-in..." : "Check-in"}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => alert(`Gửi email cho ${attendee.fullName}`)}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Gửi email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

AttendeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  attendee: PropTypes.object,
  onCheckIn: PropTypes.func.isRequired,
  isCheckingIn: PropTypes.bool.isRequired,
  checkInError: PropTypes.string,
};

export default AttendeeModal;
