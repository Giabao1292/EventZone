import React, { useEffect, useState } from "react";
import { voucherServices } from "../services/voucherServices";
import { toast } from "react-toastify";

const MyVouchers = () => {
  const [redeemedVouchers, setRedeemedVouchers] = useState([]);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRedeem = async (voucherId) => {
    try {
      await voucherServices.redeemVoucher(voucherId);
      toast.success("Đổi voucher thành công!");
      fetchVouchers(); // Reload lại danh sách
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đổi voucher thất bại");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  if (loading) return <div className="text-white p-4">Đang tải...</div>;

  return (
    <div className="p-6 text-white">
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
                </div>
                <button
                  onClick={() => handleRedeem(v.voucherId)}
                  className="ml-4 px-4 py-2 bg-[#FF664F] hover:bg-[#e5533e] text-white rounded-xl transition"
                >
                  Đổi ngay
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
