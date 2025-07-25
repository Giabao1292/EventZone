"use client";

import { useEffect, useState } from "react";
import ViewBookingHistoryService from "../services/ViewBookingHistoryServices";
import BackgroundEffect from "../ui/BackGround";
import backgroundImage from "../assets/images/background/background.png";
import { Input } from "../components/ui/input";
import {
  Search,
  Calendar,
  Ticket,
  Clock,
  User,
  X,
  MapPin,
  CreditCard,
  Star,
} from "lucide-react";
import QrCodeService from "../services/qrCodeService";
import jsPDF from "jspdf";
import ReviewSection from "../components/review/ReviewSection";

export default function ViewBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await ViewBookingHistoryService.getBookings();
        // Sort bookings by booking date (newest first)
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.bookedAt || 0);
          const dateB = new Date(b.bookedAt || 0);
          return dateB - dateA;
        });
        setBookings(sortedData);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử đặt vé:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchQr = async () => {
      if (!selectedBooking) return;
      try {
        const qrData = await QrCodeService.getQrCodeBase64(
          selectedBooking.bookingId
        );
        setQrImage(qrData);
      } catch (err) {
        console.error("Lỗi khi tải QR:", err);
        setQrImage(null);
      }
    };
    fetchQr();
  }, [selectedBooking]);

  const isEventEnded = (endTime) => {
    if (!endTime) return false;
    return new Date(endTime) < new Date();
  };

  const canReview = (booking) => {
    return (
      booking.paymentStatus === "CONFIRMED" && isEventEnded(booking.endTime)
    );
  };

  const filteredBookings = bookings.filter((b) =>
    b.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate bookings into those needing reviews and others
  const reviewableBookings = filteredBookings.filter(canReview);
  const regularBookings = filteredBookings.filter(
    (booking) => !canReview(booking)
  );

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleOpenReview = (booking) => {
    setReviewBooking(booking);
  };

  const handleCloseReview = () => {
    setReviewBooking(null);
  };

  const downloadTicketPDF = () => {
    if (!selectedBooking || !qrImage) {
      console.error("No ticket information or QR code available to download.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(20);
    doc.setTextColor(255, 102, 0);
    doc.text("Event Ticket", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(selectedBooking.eventTitle, 105, 30, { align: "center" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Event Information", 20, 45);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      `Venue: ${selectedBooking.venue || "No information available"}`,
      20,
      55
    );
    doc.text(
      `Time: ${
        selectedBooking.showTime
          ? new Date(selectedBooking.showTime).toLocaleString("en-US")
          : "No information available"
      }`,
      20,
      65
    );
    doc.text(
      `Booking Date: ${
        selectedBooking.bookedAt
          ? new Date(selectedBooking.bookedAt).toLocaleString("en-US")
          : "No information available"
      }`,
      20,
      75
    );

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Booking Details", 20, 90);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Quantity: ${selectedBooking.quantity || 1} ticket(s)`, 20, 100);
    doc.text(
      `Seat Numbers: ${
        selectedBooking.seatNumbers?.join(", ") || "No seat information"
      }`,
      20,
      110
    );
    doc.text(
      `Payment: ${selectedBooking.paymentMethod || "Unknown"} (${
        selectedBooking.paymentStatus || "Unknown"
      })`,
      20,
      120
    );
    doc.text(
      `Total Amount: ${
        selectedBooking.finalPrice?.toLocaleString() || "0"
      } VND`,
      20,
      130
    );

    if (qrImage) {
      doc.addImage(qrImage, "PNG", 130, 45, 50, 50);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Scan QR code to check-in", 130, 100, { align: "center" });
    }

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for using our service!", 105, 280, {
      align: "center",
    });

    doc.save(
      `Ticket_${selectedBooking.eventTitle}_${selectedBooking.bookingId}.pdf`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center bg-gray-800/80 backdrop-blur-sm p-12 rounded-2xl border border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Đang tải dữ liệu
          </h3>
          <p className="text-gray-300">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Chưa có thông tin";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const BookingSection = ({
    title,
    bookings,
    icon,
    emptyMessage,
    gradientFrom,
    gradientTo,
    borderColor,
  }) => (
    <div className="mb-16">
      <div className="relative mb-8">
        {/* Decorative background */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl blur-xl opacity-30`}
        ></div>

        {/* Section header */}
        <div
          className={`relative bg-gray-800/60 backdrop-blur-sm border ${borderColor} rounded-2xl p-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl mr-4 shadow-lg`}
              >
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                <p className="text-gray-400 text-sm">
                  {bookings.length === 0
                    ? "Chưa có vé nào"
                    : `${bookings.length} vé`}
                </p>
              </div>
            </div>
            <div
              className={`px-4 py-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full`}
            >
              <span className="text-white font-bold text-lg">
                {bookings.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div
            className={`w-20 h-20 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Trống</h3>
          <p className="text-gray-400 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              onViewDetails={handleViewDetails}
              onOpenReview={handleOpenReview}
              isEventEnded={isEventEnded}
              index={index}
              sectionGradient={`${gradientFrom} ${gradientTo}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative">
      <BackgroundEffect image={backgroundImage} />

      {/* Header Section */}
      <div className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-6">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            📋 Lịch sử đặt vé
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Danh sách các sự kiện bạn đã đặt vé để dễ dàng theo dõi và quản lý.
          </p>
          <p className="text-orange-400 text-sm">
            Bạn có thể xóa sự kiện khỏi danh sách bất cứ lúc nào hoặc nhấn vào
            sự kiện để xem chi tiết.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm sự kiện đã đặt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-800/60 backdrop-blur-sm border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-800/80 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Sections */}
      <div className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-8">
              {searchQuery ? (
                <Search className="w-12 h-12 text-gray-400" />
              ) : (
                <Ticket className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {searchQuery
                ? "🔍 Không tìm thấy vé phù hợp"
                : "🙁 Bạn chưa có vé nào được đặt"}
            </h3>
            <p className="text-gray-300 text-lg mb-8">
              {searchQuery
                ? "Hãy thử lại với từ khóa khác."
                : "Bắt đầu khám phá và đặt vé các sự kiện bạn yêu thích!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            {/* All Bookings Section */}
            <BookingSection
              title="🎫 Tất cả vé đã đặt"
              bookings={regularBookings}
              icon={<Ticket className="w-6 h-6 text-blue-400" />}
              emptyMessage="Không có vé nào khác"
              gradientFrom="from-blue-500/20"
              gradientTo="to-purple-500/20"
              borderColor="border-blue-500/30"
            />

            {/* Reviews Needed Section */}
            <BookingSection
              title="⭐ Cần đánh giá"
              bookings={reviewableBookings}
              icon={<Star className="w-6 h-6 text-yellow-400" />}
              emptyMessage="Không có sự kiện nào cần đánh giá"
              gradientFrom="from-yellow-500/20"
              gradientTo="to-orange-500/20"
              borderColor="border-yellow-500/30"
            />
          </>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-[100000] bg-black/70 flex justify-center items-center p-6">
          <div className="bg-gray-900 rounded-2xl shadow-lg max-w-3xl w-full p-6 text-white relative">
            <ReviewSection
              showingTimeId={reviewBooking.showingTimeId}
              canReview={true}
              onClose={handleCloseReview}
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedBooking.imageUrl}
                alt={selectedBooking.eventTitle}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedBooking.checkinStatus === "Đã check-in"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {selectedBooking.checkinStatus || "Chưa check-in"}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedBooking.eventTitle}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Thông tin sự kiện
                  </h3>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Địa điểm</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.venue || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Thời gian diễn ra</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.showTime
                          ? new Date(selectedBooking.showTime).toLocaleString(
                              "vi-VN"
                            )
                          : "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày đặt vé</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.bookedAt
                          ? new Date(selectedBooking.bookedAt).toLocaleString(
                              "vi-VN"
                            )
                          : "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Chi tiết đặt vé
                  </h3>
                  <div className="flex items-start space-x-3">
                    <Ticket className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Số lượng vé</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.quantity || 1} vé
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Số ghế</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.seatNumbers?.join(", ") ||
                          "Không có thông tin ghế"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Thanh toán</p>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.paymentMethod}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            selectedBooking.paymentStatus === "Đã thanh toán"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedBooking.paymentStatus || "Chưa rõ"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700">
                        Tổng tiền:
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        {selectedBooking.finalPrice?.toLocaleString() || "0"} đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Mã QR Check-in
                </h3>
                <div className="flex justify-center">
                  <img
                    src={qrImage}
                    alt="QR Code"
                    className="w-48 h-48 object-contain border border-gray-300 rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Quét mã này tại sự kiện để check-in nhanh chóng.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={downloadTicketPDF}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Tải vé PDF
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
                  Chia sẻ
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        html,
        body {
          overflow: visible !important;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
}

const BookingCard = ({
  booking,
  onViewDetails,
  onOpenReview,
  isEventEnded,
  index,
  sectionGradient,
}) => {
  const {
    eventTitle,
    imageUrl,
    showTime,
    endTime,
    finalPrice,
    checkinStatus,
    seatNumbers,
    paymentStatus,
  } = booking;

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Chưa có thông tin";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const canReview = paymentStatus === "CONFIRMED" && isEventEnded(endTime);

  return (
    <div
      className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group relative"
      style={{
        animationName: "fadeInUp",
        animationDuration: "0.6s",
        animationTimingFunction: "ease-out",
        animationFillMode: "forwards",
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Hover gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${sectionGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
      ></div>

      <div className="relative">
        <img
          src={imageUrl}
          alt={eventTitle}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {canReview && (
            <span className="px-3 py-1 bg-yellow-500/90 text-yellow-100 border border-yellow-400/50 rounded-full text-xs font-medium backdrop-blur-sm shadow-lg">
              ⭐ Có thể đánh giá
            </span>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-lg ${
              checkinStatus === "Đã check-in"
                ? "bg-green-500/90 text-green-100 border border-green-400/50"
                : "bg-blue-500/90 text-blue-100 border border-blue-400/50"
            }`}
          >
            {checkinStatus === "CHECKED_IN"
              ? "✓ Đã check-in"
              : "⏳ Chưa check-in"}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-orange-500/90 text-orange-100 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg">
            {finalPrice ? `${finalPrice.toLocaleString()} đ` : "Miễn phí"}
          </span>
        </div>
      </div>

      <div className="relative p-6 flex flex-col justify-between h-[220px]">
        <div>
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {eventTitle}
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-400" />
              <span>{formatDateTime(showTime)}</span>
            </div>
            {seatNumbers && seatNumbers.length > 0 && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-400" />
                <span className="font-medium">
                  Ghế: {seatNumbers.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onViewDetails(booking)}
            className="flex-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 text-orange-400 text-sm font-medium py-2 px-3 rounded-lg border border-orange-500/30 transition-all duration-300 hover:shadow-md hover:shadow-orange-500/20"
          >
            Chi tiết
          </button>
          {canReview && (
            <button
              onClick={() => onOpenReview(booking)}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-yellow-500/30 transform hover:scale-105"
            >
              ⭐ Đánh giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
