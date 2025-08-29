import { useEffect, useRef, useState } from "react";
import { verifyPayment } from "../../services/bookingService";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Home,
  History,
  Star,
} from "lucide-react";

export default function PaymentResult() {
  const called = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const orderId = searchParams.get("orderId");
    const paymentMethod = searchParams.get("paymentMethod") || "PAYOS";
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    const verify = async () => {
      try {
        await verifyPayment(orderId, paymentMethod, vnp_ResponseCode);
        toast.success("Thanh toán thành công!");
        setStatus("success");
      } catch (err) {
        console.error(err);
        toast.error("Thanh toán thất bại hoặc đã bị huỷ.");
        setStatus("error");
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Loading State */}
        {status === "loading" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-white/20 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-spin">
                <Loader2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Đang xác minh thanh toán
            </h2>
            <p className="text-gray-300">Vui lòng chờ trong giây lát...</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-4 h-4 text-yellow-900" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Thanh toán thành công!
            </h1>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-4 mb-6 border border-green-400/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-lg font-semibold text-white">
                  +20 điểm thưởng
                </span>
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-sm text-green-200">
                Chúc mừng! Bạn đã nhận được điểm thưởng
              </p>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Vé của bạn đã được xác nhận thành công.
              <br />
              <span className="text-emerald-300 font-medium">
                Hẹn gặp bạn tại sự kiện! 🎉
              </span>
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/booking-history")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <History className="w-5 h-5" />
                <span>Xem lịch sử đặt vé</span>
              </button>

              <button
                onClick={() => navigate("/home")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center shadow-lg mb-6">
              <XCircle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Thanh toán thất bại
            </h1>

            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl p-4 mb-6 border border-red-400/30">
              <p className="text-gray-300 leading-relaxed">
                Có thể bạn đã huỷ thanh toán hoặc liên kết đã hết hạn.
                <br />
                <span className="text-red-300 font-medium">
                  Đừng lo lắng, bạn có thể thử lại!
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/home")}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Về trang chủ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
