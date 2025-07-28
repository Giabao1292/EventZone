import { useEffect, useState } from "react";
import { voucherServices } from "../services/voucherServices";
import { getUserDetail } from "../services/userServices";
import { toast } from "react-toastify";

const MyVouchers = () => {
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  const fetchVouchers = async () => {
    try {
      const res = await voucherServices.getMyVouchers();
      setRedeemedVouchers(res.data.redeemedVouchers || []);
      setAvailableVouchers(res.data.availableVouchers || []);
    } catch (err) {
      toast.error("Không thể tải dữ liệu voucher");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const userData = await getUserDetail();
      setUserPoints(userData.points || 0);
    } catch (err) {
      console.error("Không thể tải điểm tích lũy:", err);
    }
  };

  const handleRedeem = async (voucherId) => {
    try {
      await voucherServices.redeemVoucher(voucherId);
      toast.success("Đổi voucher thành công!");
      fetchVouchers(); // Reload lại danh sách voucher
      fetchUserPoints(); // Reload lại điểm tích lũy (đã bị trừ khi đổi voucher)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đổi voucher thất bại");
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchUserPoints();
  }, []);

  if (loading) return <div className="text-white p-4">Đang tải...</div>;

  return (
    <div className="p-6 text-white">
      {/* Hiển thị điểm tích lũy hiện tại */}
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              💎 Điểm tích lũy
            </h1>
            <p className="text-indigo-100">
              Sử dụng điểm để đổi voucher giảm giá
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{userPoints}</div>
            <div className="text-indigo-100">điểm</div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">🎟️ Voucher bạn đã sở hữu</h2>
        {redeemedVouchers.length === 0 ? (
          <p className="text-gray-400">Bạn chưa sở hữu voucher nào.</p>
        ) : (
          <div className="grid gap-4">
            {redeemedVouchers.map((v) => (
              <div
                key={v.voucherId}
                className="bg-[#1D1F29] p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-lg">{v.voucherName}</div>
                  <div className="text-sm text-gray-300">
                    Mã: {v.voucherCode} | Giảm: {v.discountAmount} | HSD:{" "}
                    {v.validUntil}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">⭐ Voucher bạn có thể đổi</h2>
        {availableVouchers.length === 0 ? (
          <p className="text-gray-400">
            Hiện bạn chưa đủ điểm để đổi voucher nào.
          </p>
        ) : (
          <div className="grid gap-4">
            {availableVouchers.map((v) => (
              <div
                key={v.voucherId}
                className="bg-[#12141D] p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-lg">{v.voucherName}</div>
                  <div className="text-sm text-gray-300">
                    Mã: {v.voucherCode} | Giảm: {v.discountAmount} | Cần:{" "}
                    {v.requiredPoints} điểm | HSD: {v.validUntil}
                  </div>
                  {/* Hiển thị trạng thái có đủ điểm hay không */}
                  <div
                    className={`text-xs mt-1 ${
                      userPoints >= v.requiredPoints
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {userPoints >= v.requiredPoints
                      ? "✅ Đủ điểm để đổi"
                      : "❌ Thiếu điểm"}
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(v.voucherId)}
                  disabled={userPoints < v.requiredPoints}
                  className={`ml-4 px-4 py-2 rounded-xl transition ${
                    userPoints >= v.requiredPoints
                      ? "bg-[#FF664F] hover:bg-[#e5533e] text-white"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {userPoints >= v.requiredPoints
                    ? "Đổi ngay"
                    : "Không đủ điểm"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyVouchers;
