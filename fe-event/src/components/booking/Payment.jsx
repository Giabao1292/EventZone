"use client";

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
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [paymentMethod, setPaymentMethod] = useState("PAYOS"); // Default PayOS
  const timerRef = useRef(null);
  const isHoldCalled = useRef(false);

  // Countdown timer for seat hold
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

        const response = await bookingService.holdBooking(bookingRequest);
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#222831] to-[#2d3748] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#76ABAE]/30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[#76ABAE] rounded-full animate-spin"></div>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-[#EEEEEE] text-xl font-semibold">
              Đang giữ chỗ...
            </p>
            <p className="text-[#76ABAE] text-sm">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#222831] to-[#2d3748] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#31363F] to-[#2a2f3a] border border-red-500/20 rounded-2xl p-8 max-w-md shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
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
            </div>
            <h3 className="text-red-400 font-bold text-lg mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-[#EEEEEE] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#76ABAE] text-[#222831] rounded-lg font-semibold hover:bg-[#76ABAE]/80 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !event || !showing || !selection || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#222831] to-[#2d3748] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#31363F] to-[#2a2f3a] border border-[#31363F]/80 rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-[#76ABAE]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#76ABAE]"
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
          </div>
          <h3 className="text-[#76ABAE] font-bold text-lg mb-2">
            Dữ liệu không hợp lệ
          </h3>
          <p className="text-[#EEEEEE]">Vui lòng thử lại.</p>
        </div>
      </div>
    );
  }

  const timerPercentage = (timeLeft / 300) * 100;
  const isUrgent = timeLeft <= 60;

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#76ABAE] to-[#5a8a8d] rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#EEEEEE] to-[#76ABAE] bg-clip-text text-transparent">
                Thanh toán
              </h1>
              <p className="text-[#76ABAE] text-lg">Hoàn tất đặt vé của bạn</p>
            </div>
          </div>
        </div>

        {/* Timer Alert - Enhanced */}
        <div
          className={`relative overflow-hidden rounded-2xl mb-8 transition-all duration-500 ${
            isUrgent
              ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 shadow-red-500/20"
              : "bg-gradient-to-r from-[#76ABAE]/20 to-[#5a8a8d]/20 border border-[#76ABAE]/30 shadow-[#76ABAE]/20"
          } shadow-2xl`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    isUrgent ? "bg-red-400" : "bg-[#76ABAE]"
                  }`}
                ></div>
                <span className="text-[#EEEEEE] font-semibold text-lg">
                  Thời gian giữ chỗ
                </span>
                {isUrgent && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full animate-bounce">
                    KHẨN CẤP
                  </span>
                )}
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${
                    isUrgent ? "text-red-400" : "text-[#76ABAE]"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-[#76ABAE]">còn lại</div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-[#31363F]/80 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    isUrgent
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-[#76ABAE] to-[#5a8a8d]"
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event & Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-gradient-to-br from-[#31363F] to-[#2a2f3a] backdrop-blur-sm border border-[#31363F]/80 rounded-2xl p-6 shadow-2xl hover:shadow-[#76ABAE]/10 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#76ABAE]/20 to-[#5a8a8d]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#76ABAE]"
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
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#EEEEEE] mb-2">
                    Thông tin sự kiện
                  </h3>
                  <h4 className="text-lg font-semibold text-[#76ABAE] mb-3">
                    {event.title}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-[#222831]/50 rounded-lg">
                      <svg
                        className="w-4 h-4 text-[#76ABAE] flex-shrink-0"
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
                      <div>
                        <p className="text-xs text-[#76ABAE] font-medium">
                          Thời gian
                        </p>
                        <p className="text-[#EEEEEE] text-sm font-semibold">
                          {new Date(showing.startTime).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#222831]/50 rounded-lg">
                      <svg
                        className="w-4 h-4 text-[#76ABAE] flex-shrink-0"
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
                      <div>
                        <p className="text-xs text-[#76ABAE] font-medium">
                          Địa điểm
                        </p>
                        <p className="text-[#EEEEEE] text-sm font-semibold">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gradient-to-br from-[#31363F] to-[#2a2f3a] backdrop-blur-sm border border-[#31363F]/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#76ABAE]/20 to-[#5a8a8d]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#76ABAE]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#EEEEEE]">
                  Chi tiết đặt chỗ
                </h3>
              </div>

              <div className="space-y-4">
                {selection.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 bg-[#222831]/30 rounded-xl border border-[#31363F]/50 hover:bg-[#222831]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          s.type === "seat"
                            ? "bg-blue-500/20 text-blue-400"
                            : s.type === "zone"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {s.type === "seat"
                          ? "GHẾ"
                          : s.type === "zone"
                          ? "KHU VỰC"
                          : "VOUCHER"}
                      </span>
                      <span className="text-[#EEEEEE] font-semibold">
                        {s.type === "seat"
                          ? `Ghế ${s.seatLabel}`
                          : s.type === "zone"
                          ? `${s.zoneName} (x${s.qty})`
                          : `Voucher ${s.voucherCode || s.voucherId}`}
                      </span>
                    </div>
                    {s.type !== "voucher" && (
                      <span className="text-[#76ABAE] font-bold">
                        {(s.price * (s.qty || 1)).toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                ))}

                {booking.discountAmount > 0 && (
                  <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <span className="text-green-400 font-semibold">
                        Giảm giá
                      </span>
                    </div>
                    <span className="text-green-400 font-bold text-lg">
                      -{booking.discountAmount.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#31363F]/80">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#76ABAE]/10 to-[#5a8a8d]/10 rounded-xl">
                    <span className="text-xl font-bold text-[#EEEEEE]">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-[#76ABAE]">
                      {booking.finalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gradient-to-br from-[#31363F] to-[#2a2f3a] backdrop-blur-sm border border-[#31363F]/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#76ABAE]/20 to-[#5a8a8d]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#76ABAE]"
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
                <h3 className="text-xl font-bold text-[#EEEEEE]">
                  Thông tin khách hàng
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#222831]/30 rounded-xl">
                  <p className="text-xs text-[#76ABAE] font-medium mb-1">
                    Họ tên
                  </p>
                  <p className="text-[#EEEEEE] font-semibold text-lg">
                    {user.name}
                  </p>
                </div>
                <div className="p-4 bg-[#222831]/30 rounded-xl">
                  <p className="text-xs text-[#76ABAE] font-medium mb-1">
                    Email
                  </p>
                  <p className="text-[#EEEEEE] font-semibold text-lg">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-gradient-to-br from-[#31363F] to-[#2a2f3a] backdrop-blur-sm border border-[#31363F]/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#76ABAE]/20 to-[#5a8a8d]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#76ABAE]"
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
                <h3 className="text-xl font-bold text-[#EEEEEE]">
                  Phương thức thanh toán
                </h3>
              </div>

              <div className="space-y-3">
                <label
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    paymentMethod === "PAYOS"
                      ? "border-[#76ABAE] bg-[#76ABAE]/10 shadow-lg shadow-[#76ABAE]/20"
                      : "border-[#31363F]/80 hover:border-[#76ABAE]/50 hover:bg-[#31363F]/50"
                  }`}
                >
                  <input
                    type="radio"
                    value="PAYOS"
                    checked={paymentMethod === "PAYOS"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          paymentMethod === "PAYOS"
                            ? "bg-[#76ABAE]/20"
                            : "bg-[#31363F]/50"
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 ${
                            paymentMethod === "PAYOS"
                              ? "text-[#76ABAE]"
                              : "text-gray-400"
                          }`}
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
                      <div>
                        <p className="text-[#EEEEEE] font-bold text-lg">
                          PayOS
                        </p>
                        <p className="text-[#76ABAE] text-sm">
                          Thanh toán nhanh chóng
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "PAYOS" && (
                      <div className="w-6 h-6 bg-[#76ABAE] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                      </div>
                    )}
                  </div>
                </label>

                <label
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    paymentMethod === "VNPAY"
                      ? "border-[#76ABAE] bg-[#76ABAE]/10 shadow-lg shadow-[#76ABAE]/20"
                      : "border-[#31363F]/80 hover:border-[#76ABAE]/50 hover:bg-[#31363F]/50"
                  }`}
                >
                  <input
                    type="radio"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          paymentMethod === "VNPAY"
                            ? "bg-[#76ABAE]/20"
                            : "bg-[#31363F]/50"
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 ${
                            paymentMethod === "VNPAY"
                              ? "text-[#76ABAE]"
                              : "text-gray-400"
                          }`}
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
                      <div>
                        <p className="text-[#EEEEEE] font-bold text-lg">
                          VNPay
                        </p>
                        <p className="text-[#76ABAE] text-sm">
                          Ví điện tử phổ biến
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "VNPAY" && (
                      <div className="w-6 h-6 bg-[#76ABAE] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-[#76ABAE]/10 via-[#31363F] to-[#2a2f3a] border-2 border-[#76ABAE]/30 rounded-2xl p-8 shadow-2xl shadow-[#76ABAE]/20 sticky top-4">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-[#76ABAE] font-semibold">
                    Tổng thanh toán
                  </p>
                  <div className="relative">
                    <p className="text-5xl font-bold bg-gradient-to-r from-[#EEEEEE] to-[#76ABAE] bg-clip-text text-transparent">
                      {booking.finalPrice.toLocaleString("vi-VN")}₫
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#76ABAE]/20 to-transparent animate-pulse rounded-lg"></div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  className="group relative w-full bg-gradient-to-r from-[#76ABAE] to-[#5a8a8d] hover:from-[#5a8a8d] hover:to-[#76ABAE] text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#76ABAE]/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <svg
                      className="w-6 h-6"
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
                    <span>Xác nhận thanh toán</span>
                  </div>
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-[#76ABAE]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p>Thanh toán được bảo mật với SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
