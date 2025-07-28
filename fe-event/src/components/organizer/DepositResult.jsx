// src/components/DepositResult.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import apiClient from "../../api/axios";

const DepositResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyDeposit = async () => {
      const params = new URLSearchParams(location.search);
      const eventId = params.get("eventId");
      const orderCode = params.get("orderCode");
      const paymentId = params.get("paymentId") || null;
      const vnp_ResponseCode = params.get("vnp_ResponseCode");
      const paymentMethod = vnp_ResponseCode ? "VNPAY" : "PAYOS";

      try {
        const response = await apiClient.get("/events/deposit/verify", {
          params: {
            eventId,
            paymentMethod,
            paymentId,
            vnp_ResponseCode,
            orderCode,
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Verification response:", response.data); // Debug
        if (response.data.code === 200) {
          toast.success(
            "Đặt cọc thành công, sự kiện đã được gửi để phê duyệt!"
          );
          setTimeout(() => navigate("/organizer"), 2000);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Lỗi xác minh đặt cọc: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyDeposit();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {loading ? (
          <div className="flex items-center space-x-3 text-gray-700">
            <Loader2 className="animate-spin text-blue-500" size={24} />
            <span>Đang xác minh đặt cọc...</span>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác minh hoàn tất
            </h3>
            <p className="text-gray-600">Đang chuyển hướng...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositResult;
