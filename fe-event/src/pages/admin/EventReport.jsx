"use client";

import {
  DollarSign,
  Download,
  FileText,
  Loader2,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

// Import API services

// Import new ShowingTime component

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

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
// Loading Component
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
};
const EventReport = ({ eventId }) => {
  const [isExporting, setIsExporting] = useState(false);

  // For now, use mock data since API doesn't provide attendee data
  const [event, setEvent] = useState({ id: eventId, title: "Sample Event" });
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
  }, [eventId, attendees, event?.title]);

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
export default EventReport;
