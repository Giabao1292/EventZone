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
        const bookingRequest = {
          showingTimeId: showing.id,
          paymentMethod, // Gửi phương thức lên BE
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
        };
        const response = await bookingService.holdBooking(bookingRequest);
        setBooking(response);
        startTimer();
      } catch (err) {
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

  if (loading) return <div className="text-white p-4">Đang giữ chỗ...</div>;
  if (error) return <div className="text-red-500 p-4">Lỗi: {error}</div>;

  if (!booking || !event || !showing || !selection || !user) {
    return (
      <div className="text-red-500 p-4">
        Dữ liệu không hợp lệ. Vui lòng thử lại.
      </div>
    );
  }

  const total = selection.reduce((sum, s) => {
    return s.type === "seat" ? sum + s.price : sum + s.price * s.qty;
  }, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>
      <div className="w-full max-w-md space-y-4">
        {/* Sự kiện */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Sự kiện</h3>
          <p>{event.title}</p>
          <p>{new Date(showing.startTime).toLocaleString("vi-VN")}</p>
          <p>{event.location}</p>
        </div>

        {/* Chi tiết đặt chỗ */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Đặt chỗ</h3>
          {selection.map((s, idx) => (
            <p key={idx}>
              {s.type === "seat"
                ? `Ghế ${s.seatLabel}`
                : `Khu ${s.zoneName} (x${s.qty})`}{" "}
              :{" "}
              {(s.type === "seat" ? s.price : s.price * s.qty).toLocaleString(
                "vi-VN"
              )}
              ₫
            </p>
          ))}
          <p className="font-bold mt-2">
            Tổng: {total.toLocaleString("vi-VN")}₫
          </p>
        </div>

        {/* Người dùng */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Khách hàng</h3>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>Phương thức: {paymentMethod === "PAYOS" ? "PayOS" : "VNPay"}</p>
        </div>

        {/* Chọn phương thức */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Chọn phương thức thanh toán</h3>
          <label className="block">
            <input
              type="radio"
              value="PAYOS"
              checked={paymentMethod === "PAYOS"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            PayOS
          </label>
          <label className="block mt-1">
            <input
              type="radio"
              value="VNPAY"
              checked={paymentMethod === "VNPAY"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            VNPay
          </label>
        </div>

        {/* Timer */}
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">
            Thời gian giữ chỗ: {formatTime(timeLeft)}
          </p>
        </div>

        {/* Nút xác nhận */}
        <button
          onClick={handleConfirmPayment}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold"
        >
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
}
