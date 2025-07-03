import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/axios";

export default function PaymentAdsResultPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const verify = async () => {
      const adsId = searchParams.get("adsId");
      const paymentMethod = searchParams.get("paymentMethod") || "PAYOS";
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

      if (!adsId || !paymentMethod) {
        setStatus("fail");
        toast.error("Thiếu thông tin xác minh.");
        return;
      }

      try {
        const res = await apiClient.get("/event-ads/verify", {
          params: {
            adsId,
            paymentMethod,
            vnp_ResponseCode,
            vnp_TransactionNo,
          },
        });

        if (res.data.code === 200) {
          setStatus("success");
          toast.success("Thanh toán thành công!");
        } else {
          setStatus("fail");
          toast.error(res.data.message || "Thanh toán thất bại!");
        }
      } catch (e) {
        setStatus("fail");
        toast.error("Lỗi khi xử lý thanh toán.");
      }
    };

    verify();
  }, []);

  return (
    <div className="p-6 text-center text-white min-h-screen flex flex-col justify-center items-center bg-gray-900">
      {status === "pending" && (
        <p className="text-yellow-400">🔄 Đang xác minh thanh toán...</p>
      )}
      {status === "success" && (
        <p className="text-green-400 text-xl">
          ✅ Thanh toán thành công! Quảng cáo sự kiện đã được gửi đi để phê
          duyệt.
        </p>
      )}
      {status === "fail" && (
        <p className="text-red-500 text-xl">
          ❌ Thanh toán thất bại hoặc không hợp lệ.
        </p>
      )}
    </div>
  );
}
