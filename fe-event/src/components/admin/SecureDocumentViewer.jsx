import { useState } from "react";
import PropTypes from "prop-types";
import { secureDocumentService } from "../../services/secureDocumentService";
import { Eye, Download, AlertCircle } from "lucide-react";

const SecureDocumentViewer = ({ organizerId, documentType, title }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewDocument = async () => {
    setLoading(true);
    setError(null);

    try {
      let url;
      switch (documentType) {
        case "front":
          url = await secureDocumentService.getCCCDFrontUrl(organizerId);
          break;
        case "back":
          url = await secureDocumentService.getCCCDBackUrl(organizerId);
          break;
        case "license":
          url = await secureDocumentService.getBusinessLicenseUrl(organizerId);
          break;
        default:
          throw new Error("Invalid document type");
      }

      setImageUrl(url);
    } catch (err) {
      setError(err.message || "Không thể tải tài liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${title}_${organizerId}.jpg`;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleViewDocument}
            disabled={loading}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Eye className="w-4 h-4 mr-1" />
            {loading ? "Đang tải..." : "Xem"}
          </button>
          {imageUrl && (
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Tải xuống
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-w-md mx-auto rounded-lg shadow-sm"
            onError={() => setError("Không thể hiển thị hình ảnh")}
          />
        </div>
      )}
    </div>
  );
};

SecureDocumentViewer.propTypes = {
  organizerId: PropTypes.number.isRequired,
  documentType: PropTypes.oneOf(["front", "back", "license"]).isRequired,
  title: PropTypes.string.isRequired,
};

export default SecureDocumentViewer;
