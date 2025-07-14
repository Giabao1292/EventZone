// src/components/DepositStep.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "../../api/axios"; // Adjust path to match your project

const DepositStep = ({ eventData, eventId, loading, setLoading }) => {
  const [depositAmount, setDepositAmount] = useState(100000); // Example deposit amount
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");

  const handleCreateDeposit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/events/deposit", {
        eventId,
        paymentMethod,
        amount: depositAmount,
        description: `Deposit for event`,
      });

      console.log("Deposit response:", response.data); // Debug
      const { checkoutUrl } = response.data.data;
      window.location.href = checkoutUrl; // Redirect to payment gateway
    } catch (error) {
      toast.error("Lỗi tạo link đặt cọc: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Thanh Toán Đặt Cọc</h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">
          Chọn Phương Thức Thanh Toán
        </h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="text-white w-full p-2 rounded-md bg-gray-700 border border-gray-600"
        >
          <option value="VNPAY">VNPAY</option>
          <option value="PAYOS">PayOS</option>
        </select>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400">
            Số Tiền Đặt Cọc
          </label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className="mt-1 text-white w-full p-2 rounded-md bg-gray-700 border border-gray-600"
            min="10000"
          />
        </div>
        <button
          onClick={handleCreateDeposit}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded-md font-semibold ${
            loading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              Đang xử lý...
            </span>
          ) : (
            "Tiến Hành Thanh Toán"
          )}
        </button>
      </div>
    </div>
  );
};

DepositStep.propTypes = {
  eventData: PropTypes.object.isRequired,
  eventId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default DepositStep;
