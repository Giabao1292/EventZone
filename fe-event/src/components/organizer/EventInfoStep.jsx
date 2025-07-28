import { useState } from "react";
import PropTypes from "prop-types";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadImage } from "../../services/imagesService";

const EventInfoStep = ({
  eventData,
  handleInputChange,
  categories,
  loading,
  onNextStep,
}) => {
  const [headerLoading, setHeaderLoading] = useState(false);
  const [posterLoading, setPosterLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Đảm bảo categoryId là string để select hoạt động tốt
  const categoryValue =
    eventData.categoryId !== undefined && eventData.categoryId !== null
      ? String(eventData.categoryId)
      : "";

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    if (field === "header_image") setHeaderLoading(true);
    if (field === "poster_image") setPosterLoading(true);

    try {
      const imageUrl = await uploadImage(file);
      handleInputChange(field, imageUrl);
      toast.success(
        `${
          field === "header_image" ? "Header" : "Poster"
        } đã tải lên thành công!`
      );
    } catch (error) {
      toast.error(`Lỗi khi tải lên ${field}: ${error.message}`);
    } finally {
      if (field === "header_image") setHeaderLoading(false);
      if (field === "poster_image") setPosterLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
          Thông tin sự kiện
        </h2>
        <p className="text-slate-600">
          Thiết lập thông tin cơ bản cho sự kiện của bạn
        </p>
      </div>

      {/* Tiêu đề phần upload */}
      <div className="flex items-center space-x-2 mb-6">
        <Upload className="text-blue-500" size={20} />
        <span className="text-blue-600 font-medium">Upload hình ảnh</span>
      </div>

      {/* Hai ô upload ảnh */}
      <div className="grid grid-cols-2 gap-6">
        {/* Header Image Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white/80 backdrop-blur-sm hover:border-blue-400 transition-all duration-300">
          <div className="space-y-2">
            {!eventData.headerImage ? (
              <>
                <Upload className="mx-auto text-slate-400" size={32} />
                <p className="text-sm text-slate-600">Header Image</p>
                <p className="text-xs text-slate-500">Chưa chọn file</p>
              </>
            ) : (
              <img
                src={eventData.headerImage}
                alt="Header Preview"
                className="w-full h-32 object-cover rounded-lg mx-auto mb-2 shadow-md"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("headerImage", e.target.files[0])
              }
              className="hidden"
              id="header-upload"
              disabled={loading || headerLoading}
            />
            <label
              htmlFor="header-upload"
              className={`cursor-pointer ${
                loading || headerLoading
                  ? "text-slate-400"
                  : "text-blue-500 hover:text-blue-600"
              }`}
            >
              {headerLoading ? "Đang tải..." : "Chọn file"}
            </label>
          </div>
        </div>

        {/* Poster Image Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white/80 backdrop-blur-sm hover:border-orange-400 transition-all duration-300">
          <div className="space-y-2">
            {!eventData.posterImage ? (
              <>
                <Upload className="mx-auto text-slate-400" size={32} />
                <p className="text-sm text-slate-600">Poster Image</p>
                <p className="text-xs text-slate-500">Chưa chọn file</p>
              </>
            ) : (
              <img
                src={eventData.posterImage}
                alt="Poster Preview"
                className="w-full h-32 object-cover rounded-lg mx-auto mb-2 shadow-md"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("posterImage", e.target.files[0])
              }
              className="hidden"
              id="poster-upload"
              disabled={loading || posterLoading}
            />
            <label
              htmlFor="poster-upload"
              className={`cursor-pointer ${
                loading || posterLoading
                  ? "text-slate-400"
                  : "text-orange-500 hover:text-orange-600"
              }`}
            >
              {posterLoading ? "Đang tải..." : "Chọn file"}
            </label>
          </div>
        </div>
      </div>

      {/* Các trường thông tin sự kiện */}
      <div className="space-y-4">
        {/* Tên sự kiện */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Tên sự kiện *
          </label>
          <input
            type="text"
            value={eventData.eventTitle || ""}
            onChange={(e) => handleInputChange("eventTitle", e.target.value)}
            className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-slate-700 placeholder-slate-400 ${
              errors.eventTitle
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
            }`}
            placeholder="Nhập tên sự kiện"
            disabled={loading}
          />
          {errors.eventTitle && (
            <p className="text-xs text-red-500 mt-1">{errors.eventTitle}</p>
          )}
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Danh mục *
          </label>
          <select
            value={categoryValue}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 transition-all duration-300"
            disabled={loading}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={String(cat.categoryId)}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả sự kiện */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Mô tả sự kiện
          </label>
          <textarea
            value={eventData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 transition-all duration-300"
            placeholder="Mô tả chi tiết về sự kiện"
            disabled={loading}
          />
        </div>

        {/* Thời gian bắt đầu và kết thúc */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Thời gian bắt đầu *
            </label>
            <input
              type="datetime-local"
              value={eventData.startTime || ""}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-slate-700 ${
                errors.startTime
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
              }`}
              disabled={loading}
            />
            {errors.startTime && (
              <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Thời gian kết thúc *
            </label>
            <input
              type="datetime-local"
              value={eventData.endTime || ""}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-slate-700 ${
                errors.endTime
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
              }`}
              disabled={loading}
            />
            {errors.endTime && (
              <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Độ tuổi và Banner Text */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Độ tuổi
            </label>
            <select
              value={eventData.ageRating || ""}
              onChange={(e) => handleInputChange("ageRating", e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 transition-all duration-300"
              disabled={loading}
            >
              <option value="">Chọn độ tuổi</option>
              <option value="All ages">Mọi lứa tuổi</option>
              <option value="18+">18+</option>
              <option value="21+">21+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Banner Text
            </label>
            <input
              type="text"
              value={eventData.bannerText || ""}
              onChange={(e) => handleInputChange("bannerText", e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 transition-all duration-300"
              placeholder="Text hiển thị trên banner"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Kiểu dữ liệu props
EventInfoStep.propTypes = {
  eventData: PropTypes.shape({
    eventTitle: PropTypes.string,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    ageRating: PropTypes.string,
    bannerText: PropTypes.string,
    headerImage: PropTypes.string,
    posterImage: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }).isRequired,

  handleInputChange: PropTypes.func.isRequired,
  onNextStep: PropTypes.func,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      categoryName: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EventInfoStep;
