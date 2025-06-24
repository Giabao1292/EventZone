// src/components/DepositResult.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const DepositResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyDeposit = async () => {
      const params = new URLSearchParams(location.search);
      const eventId = params.get("eventId");
      const paymentId = params.get("paymentId") || null;
      const vnp_ResponseCode = params.get("vnp_ResponseCode");
      const paymentMethod = vnp_ResponseCode ? "VNPAY" : "PAYOS";

      try {
        const response = await axios.get("/api/events/deposit/verify", {
          params: { eventId, paymentMethod, paymentId, vnp_ResponseCode },
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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin" size={24} />
          <span>Đang xác minh đặt cọc...</span>
        </div>
      ) : (
        <div>Xác minh đặt cọc hoàn tất. Đang chuyển hướng...</div>
      )}
    </div>
  );
};

export default DepositResult;
