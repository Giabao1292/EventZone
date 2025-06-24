import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    console.warn("❌ Người dùng đã huỷ thanh toán.");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md text-center space-y-4">
        <div className="text-red-500 text-5xl">💸</div>
        <h2 className="text-2xl font-bold text-red-400">
          Bạn đã huỷ thanh toán
        </h2>
        <p className="text-sm text-gray-300">
          Nếu bạn thay đổi ý định, bạn có thể đặt lại chỗ và tiến hành thanh
          toán bất cứ lúc nào.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
