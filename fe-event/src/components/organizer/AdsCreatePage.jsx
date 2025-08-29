import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Upload, Image, Video, X, Eye } from "lucide-react";
import { uploadImage } from "../../services/imagesService";
import apiClient from "../../api/axios";

const AdsCreatePage = () => {
  const { eventId } = useParams();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    totalPrice: 0,
    bannerImageUrl: "",
    paymentMethod: "VNPAY",
  });
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(false);

  const calculatePrice = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffDays = Math.max(
      1,
      Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1
    );
    return diffDays * 2000;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (name === "startDate" || name === "endDate") {
      updated.totalPrice = calculatePrice(
        name === "startDate" ? value : form.startDate,
        name === "endDate" ? value : form.endDate
      );
    }

    setForm(updated);
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP) hoặc video (MP4, WebM)"
      );
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File không được lớn hơn 10MB");
      return;
    }

    setBannerFile(file);
    setBannerLoading(true);

    try {
      const imageUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, bannerImageUrl: imageUrl }));

      // Create preview
      if (file.type.startsWith("image/")) {
        setBannerPreview(URL.createObjectURL(file));
      } else {
        setBannerPreview(URL.createObjectURL(file));
      }

      toast.success("Banner đã được tải lên thành công!");
    } catch (error) {
      toast.error(`Lỗi khi tải lên banner: ${error.message}`);
      setBannerFile(null);
    } finally {
      setBannerLoading(false);
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setForm((prev) => ({ ...prev, bannerImageUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/event-ads/create-and-pay", {
        eventId: parseInt(eventId),
        startDate: form.startDate,
        endDate: form.endDate,
        totalPrice: form.totalPrice,
        bannerImageUrl: form.bannerImageUrl,
        paymentMethod: form.paymentMethod,
      });

      const { checkoutUrl } = response.data.data;
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đã có lỗi xảy ra khi tạo quảng cáo hoặc thanh toán!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = bannerFile?.type?.startsWith("video/");

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg p-8 rounded-xl mt-12 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Tạo quảng cáo sự kiện #{eventId}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ngày kết thúc
          </label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            min={form.startDate || new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Giá quảng cáo (VNĐ)
          </label>
          <input
            type="number"
            name="totalPrice"
            value={form.totalPrice}
            readOnly
            className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-700 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">
            Giá: 2,000 VNĐ/ngày ×{" "}
            {form.startDate && form.endDate
              ? Math.max(
                  1,
                  Math.ceil(
                    (new Date(form.endDate) - new Date(form.startDate)) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                )
              : 0}{" "}
            ngày
          </p>
        </div>

        {/* Banner Upload Section */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">
            Banner quảng cáo (Ảnh/Video)
          </label>

          {!bannerPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center space-x-2 text-blue-500">
                    <Image className="w-5 h-5" />
                    <span className="text-sm">Ảnh</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-500">
                    <Video className="w-5 h-5" />
                    <span className="text-sm">Video</span>
                  </div>
                </div>

                <Upload className="mx-auto text-gray-400" size={32} />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Kéo thả file hoặc click để chọn
                  </p>
                  <p className="text-xs text-gray-500">
                    Hỗ trợ: JPG, PNG, GIF, WebP, MP4, WebM (Tối đa 10MB)
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleBannerUpload(e.target.files[0])}
                  className="hidden"
                  id="banner-upload"
                  disabled={bannerLoading}
                />
                <label
                  htmlFor="banner-upload"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md cursor-pointer transition-colors ${
                    bannerLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {bannerLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tải lên...
                    </>
                  ) : (
                    "Chọn file"
                  )}
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {isVideo ? (
                  <video
                    src={bannerPreview}
                    controls
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>

              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("banner-upload");
                    if (input) input.click();
                  }}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  title="Thay đổi file"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={removeBanner}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Xóa banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  ✅ Banner đã được tải lên thành công
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {bannerFile?.name} (
                  {(bannerFile?.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Phương thức thanh toán
          </label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="VNPAY">VNPAY</option>
            <option value="PAYOS">PAYOS</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !form.startDate || !form.endDate}
          className={`w-full py-3 text-white font-semibold rounded-md transition ${
            loading || !form.startDate || !form.endDate
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang xử lý..." : "Tạo quảng cáo & Thanh toán"}
        </button>
      </form>
    </div>
  );
};

export default AdsCreatePage;
