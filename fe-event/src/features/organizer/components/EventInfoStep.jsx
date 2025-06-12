import { Upload } from "lucide-react";
import PropTypes from "prop-types";

const EventInfoStep = ({
  eventData,
  handleInputChange,
  categories,
  loading,
}) => {
  const handleFileUpload = (field, file) => {
    handleInputChange(field, file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Upload className="text-red-400" size={20} />
        <span className="text-red-400 font-medium">Upload hình ảnh</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Header Image Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/50">
          <div className="space-y-2">
            <Upload className="mx-auto text-gray-500" size={32} />
            <p className="text-sm text-gray-400">Header Image</p>
            <p className="text-xs text-gray-500">
              {eventData.header_image
                ? eventData.header_image.name
                : "Chưa chọn file"}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("header_image", e.target.files[0])
              }
              className="hidden"
              id="header-upload"
              disabled={loading}
            />
            <label
              htmlFor="header-upload"
              className={`cursor-pointer ${
                loading ? "text-gray-500" : "text-blue-400 hover:text-blue-300"
              }`}
            >
              Chọn file
            </label>
          </div>
        </div>

        {/* Poster Image Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/50">
          <div className="space-y-2">
            <Upload className="mx-auto text-gray-500" size={32} />
            <p className="text-sm text-gray-400">Poster Image</p>
            <p className="text-xs text-gray-500">
              {eventData.poster_image
                ? eventData.poster_image.name
                : "Chưa chọn file"}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("poster_image", e.target.files[0])
              }
              className="hidden"
              id="poster-upload"
              disabled={loading}
            />
            <label
              htmlFor="poster-upload"
              className={`cursor-pointer ${
                loading ? "text-gray-500" : "text-blue-400 hover:text-blue-300"
              }`}
            >
              Chọn file
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tên sự kiện *
          </label>
          <input
            type="text"
            value={eventData.event_title}
            onChange={(e) => handleInputChange("event_title", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            placeholder="Nhập tên sự kiện"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Danh mục *
          </label>
          <select
            value={eventData.category_id}
            onChange={(e) => handleInputChange("category_id", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            disabled={loading}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mô tả sự kiện
          </label>
          <textarea
            value={eventData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
            placeholder="Mô tả chi tiết về sự kiện"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Độ tuổi
            </label>
            <select
              value={eventData.age_rating}
              onChange={(e) => handleInputChange("age_rating", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              disabled={loading}
            >
              <option value="">Chọn độ tuổi</option>
              <option value="All ages">Mọi lứa tuổi</option>
              <option value="18+">18+</option>
              <option value="21+">21+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Banner Text
            </label>
            <input
              type="text"
              value={eventData.banner_text}
              onChange={(e) => handleInputChange("banner_text", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400"
              placeholder="Text hiển thị trên banner"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
EventInfoStep.propTypes = {
  eventData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EventInfoStep;
