import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/axios";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get("orderId");
      const paymentMethod = searchParams.get("paymentMethod") || "PAYOS";
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      if (!orderId || !paymentMethod) {
        setStatus("error");
        return;
      }

      try {
        await apiClient.get(`/bookings/verify`, {
          params: { orderId, paymentMethod, vnp_ResponseCode },
        });
        toast.success("Thanh toán thành công!");
        setStatus("success");
      } catch (err) {
        console.error(err);
        toast.error("Thanh toán thất bại hoặc đã bị huỷ.");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      {status === "loading" && (
        <p className="text-lg">🔄 Đang xác minh thanh toán...</p>
      )}
      {status === "success" && (
        <>
          <p className="text-2xl font-bold text-green-400 mb-4">
            ✅ Thanh toán thành công!
          </p>
          <p>Vé của bạn đã được xác nhận. Hẹn gặp bạn tại sự kiện 🎉</p>
        </>
      )}
      {status === "error" && (
        <>
          <p className="text-2xl font-bold text-red-400 mb-4">
            ❌ Thanh toán thất bại!
          </p>
          <p>Có thể bạn đã huỷ hoặc liên kết đã hết hạn.</p>
        </>
      )}
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}
