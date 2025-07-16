import { useEffect, useState, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../api/axios";

export default function Payment() {
  const { event, showing, selection } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút
  const [paymentMethod, setPaymentMethod] = useState("PAYOS"); // Mặc định PayOS

  const timerRef = useRef(null);
  const isHoldCalled = useRef(false);

  // Đếm ngược thời gian giữ chỗ
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          toast.error("Hết thời gian giữ chỗ. Vui lòng chọn lại.");
          navigate(`/book/${showing?.id}`, { state: { event, showing } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (isHoldCalled.current || !showing || !selection || !user) return;
    isHoldCalled.current = true;

    const holdBooking = async () => {
      try {
        const voucher = selection.find((s) => s.type === "voucher");
        console.log("Voucher in selection:", voucher); // Debug voucher
        const bookingRequest = {
          showingTimeId: showing.id,
          seats: selection
            .filter((s) => s.type === "seat")
            .map((s) => ({
              seatId: s.seatId,
              price: s.price,
            })),
          zones: selection
            .filter((s) => s.type === "zone")
            .map((s) => ({
              zoneId: s.zoneId,
              quantity: s.qty,
              price: s.price,
            })),
          voucherId: voucher ? voucher.voucherId : null,
        };
        console.log("Booking request sent to /bookings/hold:", bookingRequest); // Debug payload
        const response = await bookingService.holdBooking(bookingRequest);
        console.log("Booking response:", response); // Debug response
        setBooking(response);
        startTimer();
      } catch (err) {
        console.error("Hold booking error:", err);
        if (err.message.includes("401")) {
          toast.error("Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    holdBooking();
    return () => clearInterval(timerRef.current);
  }, [showing, selection, user, navigate, paymentMethod]);

  const handleConfirmPayment = async () => {
    if (!booking?.id) {
      toast.error("Dữ liệu booking không hợp lệ");
      return;
    }

    try {
      const payload = {
        bookingId: booking.id,
        amount: booking.finalPrice,
        description: `Thanh toán vé sự kiện ${event?.title || ""}`,
        paymentMethod,
      };

      const res = await apiClient.post("/bookings/pay", payload);
      const payUrl = res.data.data.checkoutUrl;
      window.location.href = payUrl;
    } catch (err) {
      console.error(err);
      toast.error("Không tạo được liên kết thanh toán");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang giữ chỗ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-red-400 font-semibold">Có lỗi xảy ra</h3>
          </div>
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  if (!booking || !event || !showing || !selection || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <svg
            className="w-12 h-12 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-red-400 font-semibold mb-2">
            Dữ liệu không hợp lệ
          </h3>
          <p className="text-white">Vui lòng thử lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Thanh toán</h2>
          <p className="text-gray-300">Hoàn tất đặt vé của bạn</p>
        </div>

        {/* Timer Alert - Fixed at top */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-amber-300 font-medium">
                Thời gian giữ chỗ
              </span>
            </div>
            <span className="text-2xl font-bold text-amber-400">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full bg-amber-900/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 300) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Event & Booking Details */}
          <div className="space-y-4">
            {/* Event Information */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Sự kiện</h3>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium text-white">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {new Date(showing.startTime).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Chi tiết đặt chỗ
              </h3>
              <div className="space-y-2">
                {/* Hiển thị từng mục đã chọn */}
                {selection.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
                        {s.type === "seat"
                          ? "Ghế"
                          : s.type === "zone"
                          ? "Khu vực"
                          : "Voucher"}
                      </span>
                      <span className="text-white text-sm font-medium">
                        {s.type === "seat"
                          ? `Ghế ${s.seatLabel}`
                          : s.type === "zone"
                          ? `${s.zoneName} (x${s.qty})`
                          : `Voucher ${s.voucherCode || s.voucherId}`}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Nếu có giảm giá từ voucher thì hiển thị dòng giảm giá */}
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-white/20">
                    <span className="text-white text-sm font-medium">
                      Giảm giá
                    </span>
                    <span className="text-red-400 text-sm font-semibold">
                      -{booking.discountAmount.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                )}

                {/* Tổng thanh toán cuối cùng */}
                <div className="pt-2 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      {booking.finalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Khách hàng</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400">Họ tên</p>
                  <p className="text-white font-medium text-sm">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white font-medium text-sm">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Method & Summary */}
          <div className="space-y-4">
            {/* Payment Method */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Phương thức thanh toán
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="PAYOS"
                    checked={paymentMethod === "PAYOS"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-500 bg-transparent border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium text-sm">PayOS</p>
                        <p className="text-xs text-gray-400">
                          Thanh toán qua PayOS
                        </p>
                      </div>
                      <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-500 bg-transparent border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium text-sm">VNPay</p>
                        <p className="text-xs text-gray-400">
                          Thanh toán qua VNPay
                        </p>
                      </div>
                      <div className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Summary - Prominent */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-300">Tổng thanh toán</p>
                  <p className="text-4xl font-bold text-white">
                    {booking.finalPrice.toLocaleString("vi-VN")}₫
                  </p>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Xác nhận thanh toán
                  </div>
                </button>

                <p className="text-xs text-gray-400">
                  Bằng cách nhấn "Xác nhận thanh toán", bạn đồng ý với điều
                  khoản sử dụng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
