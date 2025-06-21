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
}) => {
  const [headerLoading, setHeaderLoading] = useState(false);
  const [posterLoading, setPosterLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    <>
      <div className="space-y-6">
        {/* Tiêu đề phần upload */}
        <div className="flex items-center space-x-2 mb-6">
          <Upload className="text-red-400" size={20} />
          <span className="text-red-400 font-medium">Upload hình ảnh</span>
        </div>

        {/* Hai ô upload ảnh */}
        <div className="grid grid-cols-2 gap-6">
          {/* Header Image Upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/50">
            <div className="space-y-2">
              {!eventData.header_image ? (
                <>
                  <Upload className="mx-auto text-gray-500" size={32} />
                  <p className="text-sm text-gray-400">Header Image</p>
                  <p className="text-xs text-gray-500">Chưa chọn file</p>
                </>
              ) : (
                <img
                  src={eventData.header_image}
                  alt="Header Preview"
                  className="w-full h-32 object-cover rounded-md mx-auto mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload("header_image", e.target.files[0])
                }
                className="hidden"
                id="header-upload"
                disabled={loading || headerLoading}
              />
              <label
                htmlFor="header-upload"
                className={`cursor-pointer ${
                  loading || headerLoading
                    ? "text-gray-500"
                    : "text-blue-400 hover:text-blue-300"
                }`}
              >
                {headerLoading ? "Đang tải..." : "Chọn file"}
              </label>
            </div>
          </div>

          {/* Poster Image Upload */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/50">
            <div className="space-y-2">
              {!eventData.poster_image ? (
                <>
                  <Upload className="mx-auto text-gray-500" size={32} />
                  <p className="text-sm text-gray-400">Poster Image</p>
                  <p className="text-xs text-gray-500">Chưa chọn file</p>
                </>
              ) : (
                <img
                  src={eventData.poster_image}
                  alt="Poster Preview"
                  className="w-full h-32 object-cover rounded-md mx-auto mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload("poster_image", e.target.files[0])
                }
                className="hidden"
                id="poster-upload"
                disabled={loading || posterLoading}
              />
              <label
                htmlFor="poster-upload"
                className={`cursor-pointer ${
                  loading || posterLoading
                    ? "text-gray-500"
                    : "text-blue-400 hover:text-blue-300"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tên sự kiện *
            </label>
            <input
              type="text"
              value={eventData.event_title || ""}
              onChange={(e) => handleInputChange("event_title", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.eventTitle ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400`}
              placeholder="Nhập tên sự kiện"
              disabled={loading}
            />
            {errors.eventTitle && (
              <p className="text-xs text-red-400 mt-1">{errors.eventTitle}</p>
            )}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Danh mục *
            </label>
            <select
              value={eventData.category_id || ""}
              onChange={(e) => handleInputChange("category_id", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              disabled={loading}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Mô tả sự kiện */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mô tả sự kiện
            </label>
            <textarea
              value={eventData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
              placeholder="Mô tả chi tiết về sự kiện"
              disabled={loading}
            />
          </div>

          {/* Thời gian bắt đầu và kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thời gian bắt đầu *
              </label>
              <input
                type="datetime-local"
                value={eventData.start_time || ""}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  errors.startTime ? "border-red-500" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white`}
                disabled={loading}
              />
              {errors.startTime && (
                <p className="text-xs text-red-400 mt-1">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thời gian kết thúc *
              </label>
              <input
                type="datetime-local"
                value={eventData.end_time || ""}
                onChange={(e) => handleInputChange("end_time", e.target.value)}
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  errors.endTime ? "border-red-500" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white`}
                disabled={loading}
              />
              {errors.endTime && (
                <p className="text-xs text-red-400 mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Độ tuổi và Banner Text */}
          <div className="grid grid-cols-2 gap-4">
            {/* Độ tuổi */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Độ tuổi
              </label>
              <select
                value={eventData.age_rating || ""}
                onChange={(e) =>
                  handleInputChange("age_rating", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                disabled={loading}
              >
                <option value="">Chọn độ tuổi</option>
                <option value="All ages">Mọi lứa tuổi</option>
                <option value="18+">18+</option>
                <option value="21+">21+</option>
              </select>
            </div>

            {/* Banner Text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Banner Text
              </label>
              <input
                type="text"
                value={eventData.banner_text || ""}
                onChange={(e) =>
                  handleInputChange("banner_text", e.target.value)
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
                placeholder="Text hiển thị trên banner"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Kiểu dữ liệu props
EventInfoStep.propTypes = {
  eventData: PropTypes.shape({
    event_title: PropTypes.string.isRequired,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    age_rating: PropTypes.string,
    banner_text: PropTypes.string,
    header_image: PropTypes.string,
    poster_image: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryId: PropTypes.number.isRequired,
      categoryName: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EventInfoStep;
