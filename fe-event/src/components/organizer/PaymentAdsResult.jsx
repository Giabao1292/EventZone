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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center max-w-md">
        {status === "pending" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-yellow-500 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <p className="text-yellow-600 font-medium">
              Đang xác minh thanh toán...
            </p>
          </div>
        )}
        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
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
            <h3 className="text-lg font-semibold text-gray-900">
              Thanh toán thành công!
            </h3>
            <p className="text-gray-600">
              Quảng cáo sự kiện đã được gửi đi để phê duyệt.
            </p>
          </div>
        )}
        {status === "fail" && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Thanh toán thất bại
            </h3>
            <p className="text-gray-600">
              Thanh toán thất bại hoặc không hợp lệ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
