import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrganizerDetails } from "../../services/organizerService";
import { adminService } from "../../services/adminService";
import SecureDocumentViewer from "../../components/admin/SecureDocumentViewer";
import { Shield, User, Building, Calendar, MapPin, Globe } from "lucide-react";

const OrganizerDocumentsPage = () => {
  console.log("🔍 OrganizerDocumentsPage component initialized");

  const { organizerId } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 OrganizerDocumentsPage useEffect triggered");
    console.log("🔍 organizerId from params:", organizerId);

    const fetchOrganizerDetails = async () => {
      console.log("🔍 Starting fetchOrganizerDetails...");
      try {
        setLoading(true);
        console.log("🔍 Calling getOrganizerDetails with ID:", organizerId);
        const response = await getOrganizerDetails(organizerId);
        console.log("🔍 Organizer details response:", response);

        console.log("🔍 Full response structure:", response);
        console.log("🔍 Response keys:", Object.keys(response));
        console.log("🔍 Response.data:", response.data);
        console.log("🔍 Response.code:", response.code);

        // Backend trả về ResponseData {code, message, data}
        // Frontend nhận được response.data từ axios
        if (response && response.code === 200 && response.data) {
          console.log("🔍 Setting organizer data:", response.data);
          setOrganizer(response.data);
        } else {
          console.log("🔍 Error response:", response);
          setError(response?.message || "Không thể tải thông tin nhà tổ chức");
        }
      } catch (err) {
        console.error("🔍 Error fetching organizer details:", err);
        console.error("🔍 Error details:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
        });
        // Handle different error response formats
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Không thể tải thông tin nhà tổ chức");
        }
      } finally {
        console.log("🔍 Setting loading to false");
        setLoading(false);
      }
    };

    if (organizerId) {
      console.log("🔍 organizerId exists, calling fetchOrganizerDetails");
      fetchOrganizerDetails();
    } else {
      console.log("🔍 No organizerId, setting error");
      setError("Không có ID nhà tổ chức");
      setLoading(false);
    }
  }, [organizerId]);

  console.log("🔍 Component render state:", {
    loading,
    error,
    organizer: !!organizer,
    organizerId,
  });

  if (loading) {
    console.log("🔍 Rendering loading state");
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    console.log("🔍 Rendering error state:", {
      error,
      hasOrganizer: !!organizer,
    });
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Lỗi</h2>
            <p className="text-red-600">
              {error || "Không tìm thấy thông tin nhà tổ chức"}
            </p>
            <div className="mt-4 text-sm text-red-500">
              <p>Organizer ID: {organizerId}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Has Organizer: {!!organizer}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("🔍 Rendering main component");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Test Header */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="text-yellow-800 font-medium">Debug Info:</h3>
          <p className="text-yellow-700 text-sm">Organizer ID: {organizerId}</p>
          <p className="text-yellow-700 text-sm">
            Loading: {loading.toString()}
          </p>
          <p className="text-yellow-700 text-sm">Error: {error || "None"}</p>
          <p className="text-yellow-700 text-sm">
            Has Organizer: {!!organizer}
          </p>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Tài liệu CCCD - Nhà tổ chức
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  try {
                    const response = await adminService.migrateDocuments();
                    alert("Migration completed: " + response.message);
                    window.location.reload();
                  } catch (err) {
                    alert("Migration failed: " + err.message);
                  }
                }}
                className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Migrate Documents
              </button>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  organizer.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : organizer.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {organizer.status === "APPROVED"
                  ? "Đã phê duyệt"
                  : organizer.status === "PENDING"
                  ? "Chờ phê duyệt"
                  : "Từ chối"}
              </span>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tên tổ chức</p>
                  <p className="font-medium text-gray-900">
                    {organizer.orgName}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Người đại diện</p>
                  <p className="font-medium text-gray-900">
                    {organizer.user?.fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="font-medium text-gray-900">
                    {organizer.orgAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Ngày đăng ký</p>
                  <p className="font-medium text-gray-900">
                    {new Date(organizer.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {organizer.website && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={organizer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {organizer.website}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Mã số thuế</p>
                  <p className="font-medium text-gray-900">
                    {organizer.taxCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            Tài liệu xác minh
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SecureDocumentViewer
              organizerId={parseInt(organizerId)}
              documentType="front"
              title="CCCD Mặt trước"
            />

            <SecureDocumentViewer
              organizerId={parseInt(organizerId)}
              documentType="back"
              title="CCCD Mặt sau"
            />

            <SecureDocumentViewer
              organizerId={parseInt(organizerId)}
              documentType="license"
              title="Giấy phép kinh doanh"
            />
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Bảo mật tài liệu
                </h4>
                <p className="text-sm text-blue-700">
                  Tất cả tài liệu CCCD được bảo vệ bằng kiểm soát truy cập ở
                  backend. Chỉ admin và chủ sở hữu mới có quyền truy cập các tài
                  liệu này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDocumentsPage;
