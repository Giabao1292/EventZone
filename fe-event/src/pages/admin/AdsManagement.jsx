import { useEffect, useState } from "react";
import { getAdsByStatus, reviewAds } from "../../services/adsService";
import { toast } from "react-toastify";

export default function AdminAdsReviewPage() {
  const [adsList, setAdsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    try {
      const res = await getAdsByStatus(0, 20, "createdAt", {
        status: "PENDING",
      });
      setAdsList(res.data.data || []);
    } catch (error) {
      toast.error("❌ Không thể tải danh sách: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleReview = async (adsId, status) => {
    try {
      let reason = null;
      if (status === "REJECTED") {
        reason = prompt("Nhập lý do từ chối:");
        if (!reason) return;
      }

      await reviewAds(adsId, status, reason);
      toast.success(
        status === "APPROVED" ? "✅ Duyệt thành công" : "❌ Từ chối thành công"
      );
      fetchAds();
    } catch (err) {
      toast.error("⚠️ " + err.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">📋 Quảng cáo chờ duyệt</h1>

      {loading ? (
        <p className="text-gray-400">Đang tải dữ liệu...</p>
      ) : adsList.length === 0 ? (
        <p className="text-gray-300">Không có quảng cáo nào đang chờ duyệt.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adsList.map((ads) => (
            <div
              key={ads.id}
              className="bg-gradient-to-br from-[#1f1f1f] to-[#2c2c2c] rounded-lg overflow-hidden border border-gray-700 shadow-lg hover:shadow-2xl transition duration-300"
            >
              {ads.posterImage && (
                <img
                  src={ads.posterImage}
                  alt="Poster"
                  className="w-full h-52 object-cover"
                />
              )}

              <div className="p-5 space-y-2">
                <h2 className="text-lg font-bold">{ads.eventTitle}</h2>
                <p className="text-sm text-gray-400">👤 {ads.organizerName}</p>
                <p className="text-sm text-gray-400">
                  📅 {formatDate(ads.startDate)} → {formatDate(ads.endDate)}
                </p>

                <p className="text-sm text-gray-400">
                  💰{" "}
                  {ads.totalPrice
                    ? `${ads.totalPrice.toLocaleString()} VND`
                    : "Chưa có giá"}
                </p>

                {ads.bannerImageUrl && (
                  <img
                    src={ads.bannerImageUrl}
                    alt="Banner"
                    className="mt-2 w-full h-32 object-cover rounded-md"
                  />
                )}

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    onClick={() => handleReview(ads.id, "APPROVED")}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium"
                  >
                    ✅ Duyệt
                  </button>
                  <button
                    onClick={() => handleReview(ads.id, "REJECTED")}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium"
                  >
                    ❌ Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
