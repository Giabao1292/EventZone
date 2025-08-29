import { useEffect, useState } from "react";
import { getAdsByStatus, reviewAds } from "../../services/adsService";
import { toast } from "react-toastify";
import { Eye, X, Filter } from "lucide-react";

export default function AdminAdsReviewPage() {
  const [adsList, setAdsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const fetchAds = async (status = "PENDING") => {
    try {
      const res = await getAdsByStatus(0, 20, "createdAt", {
        status: status,
      });
      setAdsList(res.data.data || []);
    } catch (error) {
      toast.error("❌ Không thể tải danh sách: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(statusFilter);
  }, [statusFilter]);

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
      fetchAds(statusFilter);
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

  // Logic ưu tiên hiển thị: Banner > Poster > Default
  const getDisplayMedia = (ads) => {
    const isValidUrl = (url) => {
      if (!url || typeof url !== "string") return false;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (ads.bannerImageUrl && isValidUrl(ads.bannerImageUrl)) {
      return {
        url: ads.bannerImageUrl,
        type:
          ads.bannerImageUrl.includes(".mp4") ||
          ads.bannerImageUrl.includes(".webm")
            ? "video"
            : "image",
        isBanner: true,
      };
    }
    if (ads.posterImage && isValidUrl(ads.posterImage)) {
      return {
        url: ads.posterImage,
        type: "image",
        isBanner: false,
      };
    }
    return {
      url: "/placeholder.svg",
      type: "image",
      isBanner: false,
    };
  };

  const openPreviewModal = (ads) => {
    setSelectedAd(ads);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAd(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        label: "Chờ duyệt",
        color: "bg-yellow-100",
        textColor: "text-yellow-800",
      },
      APPROVED: {
        label: "Đã duyệt",
        color: "bg-green-100",
        textColor: "text-green-800",
      },
      REJECTED: {
        label: "Bị từ chối",
        color: "bg-red-100",
        textColor: "text-red-800",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-100",
      textColor: "text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusTitle = () => {
    switch (statusFilter) {
      case "PENDING":
        return "📋 Quảng cáo chờ duyệt";
      case "APPROVED":
        return "✅ Quảng cáo đã duyệt";
      case "REJECTED":
        return "❌ Quảng cáo bị từ chối";
      case "ALL":
        return "📊 Tất cả quảng cáo";
      default:
        return "📋 Quảng cáo";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getStatusTitle()}</h1>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
            <option value="ALL">Tất cả</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : adsList.length === 0 ? (
        <p className="text-gray-500">Không có quảng cáo nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adsList.map((ads) => {
            const displayMedia = getDisplayMedia(ads);

            return (
              <div
                key={ads.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition duration-300"
              >
                {/* Media Display */}
                <div className="relative">
                  {displayMedia.type === "video" ? (
                    <video
                      src={displayMedia.url}
                      className="w-full h-52 object-cover"
                      controls
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={displayMedia.url}
                      alt={displayMedia.isBanner ? "Banner" : "Poster"}
                      className="w-full h-52 object-cover"
                    />
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {displayMedia.isBanner && (
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {displayMedia.type === "video"
                          ? "🎬 VIDEO"
                          : "🖼️ BANNER"}
                      </div>
                    )}
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {getStatusBadge(ads.status)}
                    </div>
                  </div>

                  {/* Preview Button */}
                  <button
                    onClick={() => openPreviewModal(ads)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {ads.eventTitle}
                  </h2>
                  <p className="text-sm text-gray-600">
                    👤 {ads.organizerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    📅 {formatDate(ads.startDate)} → {formatDate(ads.endDate)}
                  </p>

                  <p className="text-sm text-gray-600">
                    💰{" "}
                    {ads.totalPrice
                      ? `${ads.totalPrice.toLocaleString()} VND`
                      : "Chưa có giá"}
                  </p>

                  {/* Media Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Media hiển thị:</strong>
                    </p>
                    <div className="flex items-center space-x-2">
                      {displayMedia.isBanner ? (
                        <>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            Banner{" "}
                            {displayMedia.type === "video" ? "Video" : "Ảnh"}
                          </span>
                          {ads.posterImage && (
                            <span className="text-xs text-gray-500">
                              (Có poster dự phòng)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Poster Ảnh
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Only show for PENDING status */}
                  {ads.status === "PENDING" && (
                    <div className="pt-4 flex gap-3 justify-end">
                      <button
                        onClick={() => handleReview(ads.id, "APPROVED")}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
                      >
                        ✅ Duyệt
                      </button>
                      <button
                        onClick={() => handleReview(ads.id, "REJECTED")}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
                      >
                        ❌ Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {showModal && selectedAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết quảng cáo: {selectedAd.eventTitle}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Media Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Media Preview
                  </h3>

                  {/* Banner/Video */}
                  {selectedAd.bannerImageUrl && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">
                        Banner/Video:
                      </h4>
                      {selectedAd.bannerImageUrl.includes(".mp4") ||
                      selectedAd.bannerImageUrl.includes(".webm") ? (
                        <video
                          src={selectedAd.bannerImageUrl}
                          className="w-full rounded-lg"
                          controls
                          autoPlay
                          muted
                          loop
                        />
                      ) : (
                        <img
                          src={selectedAd.bannerImageUrl}
                          alt="Banner"
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  {/* Poster */}
                  {selectedAd.posterImage && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">
                        Poster:
                      </h4>
                      <img
                        src={selectedAd.posterImage}
                        alt="Poster"
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin sự kiện
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">
                        Tên sự kiện:
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedAd.eventTitle}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">
                        Nhà tổ chức:
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedAd.organizerName}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">
                        Thời gian quảng cáo:
                      </label>
                      <p className="text-gray-900 font-medium">
                        {formatDate(selectedAd.startDate)} →{" "}
                        {formatDate(selectedAd.endDate)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Chi phí:</label>
                      <p className="text-gray-900 font-medium">
                        {selectedAd.totalPrice
                          ? `${selectedAd.totalPrice.toLocaleString()} VND`
                          : "Chưa có giá"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">
                        Trạng thái:
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(selectedAd.status)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Only show for PENDING status */}
                  {selectedAd.status === "PENDING" && (
                    <div className="pt-6 flex gap-3">
                      <button
                        onClick={() => {
                          handleReview(selectedAd.id, "APPROVED");
                          closeModal();
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-medium transition-colors"
                      >
                        ✅ Duyệt quảng cáo
                      </button>
                      <button
                        onClick={() => {
                          handleReview(selectedAd.id, "REJECTED");
                          closeModal();
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white font-medium transition-colors"
                      >
                        ❌ Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
