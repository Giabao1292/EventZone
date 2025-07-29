"use client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  register,
  getOrganizerTypes,
  getOrganizerStatus,
  getOrganizerByUserId,
} from "../../services/organizerService";

// --- Sub Components ---

const FormSection = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg mb-6">
    {title && <h3 className="text-white text-xl font-bold mb-5">{title}</h3>}
    {children}
  </div>
);

const InputGroup = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  required = false,
  maxLength,
  value,
  onChange,
  children,
  fileName,
  filePreviewUrl,
  accept,
}) => {
  const isTextLike =
    type === "text" ||
    type === "email" ||
    type === "tel" ||
    type === "password";
  const hasCounter = maxLength && (isTextLike || type === "textarea");

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-gray-300 text-sm font-normal mb-2 ${
          required
            ? 'relative before:content-["*"] before:text-red-500 before:absolute before:-left-3'
            : ""
        }`}
      >
        {label}
      </label>
      <div className={`${hasCounter ? "relative" : ""}`}>
        {type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-600 rounded-md bg-white text-gray-900 text-base focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-y min-h-[100px]"
            required={required}
          ></textarea>
        ) : type === "select" ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-600 rounded-md bg-white text-gray-900 text-base focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            required={required}
          >
            {children}
          </select>
        ) : type === "file" ? (
          <div>
            <input
              id={id}
              name={name}
              type="file"
              accept={accept}
              onChange={onChange}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-100 file:text-green-700
                        hover:file:bg-green-200"
              required={required}
            />
            {filePreviewUrl && (
              <div className="mt-2">
                {filePreviewUrl.match("/image/") ? (
                  <img
                    src={filePreviewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="h-20 object-contain rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-500">
                    Tệp đã chọn: {fileName}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-600 rounded-md bg-white text-gray-900 text-base focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            required={required}
          />
        )}
        {hasCounter && (
          <span
            className={`absolute text-gray-500 text-sm ${
              type === "textarea"
                ? "bottom-2 right-3"
                : "top-1/2 -translate-y-1/2 right-3"
            } bg-white px-1`}
          >
            {value ? value.length : 0} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// Component thông báo trạng thái lớn ở đầu
const StatusAlert = ({ status }) => {
  console.log("🎯 StatusAlert received status:", status);

  if (status === "APPROVED") {
    return (
      <div className="bg-green-600 text-white p-6 rounded-lg mb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="rounded-full h-12 w-12 bg-white flex items-center justify-center mr-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Chúc mừng! Đơn đăng ký đã được phê duyệt
            </h2>
            <p className="text-green-100">
              Bạn đã trở thành nhà tổ chức chính thức trên nền tảng
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="bg-red-600 text-white p-6 rounded-lg mb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="rounded-full h-12 w-12 bg-white flex items-center justify-center mr-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Đơn đăng ký không được chấp thuận
            </h2>
            <p className="text-red-100">
              Rất tiếc, đơn đăng ký của bạn đã bị từ chối
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="bg-yellow-600 text-white p-6 rounded-lg mb-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="rounded-full h-12 w-12 bg-white flex items-center justify-center mr-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Đơn đăng ký đang được xét duyệt
            </h2>
            <p className="text-yellow-100">
              Chúng tôi đang xem xét đơn đăng ký của bạn
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Component thanh trạng thái ở đầu trang
const StatusBar = ({ status }) => {
  console.log("📊 StatusBar received status:", status);

  const getStatusStep = (status) => {
    switch (status) {
      case "PENDING":
        return 1;
      case "APPROVED":
        return 2;
      case "REJECTED":
        return 1;
      default:
        return 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const currentStep = getStatusStep(status);
  const statusColor = getStatusColor(status);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-white text-lg font-semibold mb-4">
        Tiến trình đăng ký nhà tổ chức
      </h3>

      <div className="flex items-center justify-between mb-4">
        {/* Bước 1: Nộp đơn */}
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              currentStep >= 1 ? statusColor : "bg-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="ml-3 text-gray-300">Nộp đơn đăng ký</span>
        </div>

        {/* Đường kẻ nối */}
        <div
          className={`flex-1 h-1 mx-4 rounded ${
            currentStep >= 2 ? statusColor : "bg-gray-600"
          }`}
        ></div>

        {/* Bước 2: Xét duyệt */}
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              currentStep >= 2
                ? statusColor
                : status === "PENDING"
                ? "bg-yellow-500"
                : "bg-gray-600"
            }`}
          >
            {status === "APPROVED" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : status === "REJECTED" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : status === "PENDING" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              "2"
            )}
          </div>
          <span className="ml-3 text-gray-300">Xét duyệt</span>
        </div>
      </div>

      {/* Thông tin trạng thái */}
      <div className="text-center">
        {status === "PENDING" && (
          <p className="text-yellow-400 font-semibold">
            Đang chờ xác nhận - Quá trình xét duyệt thường mất 24-48 giờ
          </p>
        )}
        {status === "APPROVED" && (
          <p className="text-green-400 font-semibold">
            Đã được phê duyệt - Bạn có thể bắt đầu tạo sự kiện
          </p>
        )}
        {status === "REJECTED" && (
          <p className="text-red-400 font-semibold">
            Đơn đăng ký bị từ chối - Vui lòng kiểm tra email để biết chi tiết
          </p>
        )}
      </div>
    </div>
  );
};

// Component hiển thị trạng thái chi tiết
const StatusDetails = ({ status, onResubmit }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/organizer");
  };

  const handleResubmit = () => {
    if (onResubmit) {
      onResubmit();
    }
  };

  console.log("📝 StatusDetails received status:", status);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-white text-xl font-bold mb-4">Chi tiết trạng thái</h3>

      {status === "PENDING" && (
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 mb-6">
          <h4 className="text-yellow-400 font-semibold mb-2">
            Đang xử lý đơn đăng ký
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Đơn đăng ký của bạn đang được xem xét bởi đội ngũ quản trị. Chúng
            tôi sẽ kiểm tra:
          </p>
          <ul className="text-gray-300 text-sm space-y-1 mb-4">
            <li>• Thông tin tổ chức/doanh nghiệp</li>
            <li>• Giấy tờ xác minh danh tính</li>
            <li>• Giấy phép kinh doanh (nếu có)</li>
            <li>• Tính hợp lệ của các tài liệu</li>
          </ul>
          <p className="text-gray-300 text-sm">
            Bạn sẽ nhận được email thông báo kết quả trong vòng 24-48 giờ làm
            việc.
          </p>
        </div>
      )}

      {status === "APPROVED" && (
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 mb-6">
          <h4 className="text-green-400 font-semibold mb-2">
            Tài khoản nhà tổ chức đã được kích hoạt
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Chúc mừng! Bạn đã trở thành nhà tổ chức chính thức. Bây giờ bạn có
            thể:
          </p>
          <ul className="text-gray-300 text-sm space-y-1 mb-6">
            <li>• Tạo và quản lý các sự kiện</li>
            <li>• Bán vé trực tuyến</li>
            <li>• Theo dõi doanh thu và thống kê</li>
            <li>• Quản lý thông tin khách hàng</li>
            <li>• Sử dụng các công cụ marketing</li>
          </ul>
          <div className="flex gap-3">
            <button
              onClick={handleClick}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Bắt đầu tạo sự kiện đầu tiên
            </button>
          </div>
        </div>
      )}

      {status === "REJECTED" && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-6 mb-6">
          <h4 className="text-red-400 font-semibold mb-2">
            Lý do từ chối đơn đăng ký
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Đơn đăng ký của bạn không đáp ứng các yêu cầu. Các lý do phổ biến
            bao gồm:
          </p>
          <ul className="text-gray-300 text-sm space-y-1 mb-4">
            <li>• Thông tin cá nhân/tổ chức không chính xác</li>
            <li>• Giấy tờ tùy thân không rõ ràng hoặc hết hạn</li>
            <li>• Giấy phép kinh doanh không hợp lệ</li>
            <li>• Không đáp ứng điều kiện về độ tuổi hoặc năng lực</li>
            <li>• Thông tin mô tả tổ chức không đầy đủ</li>
          </ul>
          <div className="bg-red-800/50 p-4 rounded-lg mb-4">
            <p className="text-red-200 text-sm font-medium mb-2">
              Bước tiếp theo:
            </p>
            <p className="text-gray-300 text-sm">
              Vui lòng kiểm tra email để biết chi tiết cụ thể về lý do từ chối.
              Bạn có thể chỉnh sửa thông tin và nộp đơn mới sau khi khắc phục
              các vấn đề.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleResubmit}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Gửi lại đơn đăng ký
            </button>
            <a
              href="tel:0352038856"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      )}

      <div className="text-gray-400 text-sm border-t border-gray-700 pt-4">
        <p>Ngày nộp đơn: {new Date().toLocaleDateString("vi-VN")}</p>
      </div>
    </div>
  );
};

// --- Main Component ---
const RegisterOrganizerForm = () => {
  const [organizerTypes, setOrganizerTypes] = useState([]);
  const [organizerStatus, setOrganizerStatus] = useState(null);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrganizerTypes = async () => {
    try {
      const response = await getOrganizerTypes();
      if (response.code === 200) {
        setOrganizerTypes(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch organizer types:", err);
    }
  };

  const fetchOrganizerStatus = async () => {
    try {
      const response = await getOrganizerStatus();
      if (response.code === 200 && response.data) {
        setOrganizerStatus(response.data); // response.data là string trực tiếp
        setHasExistingApplication(true);

        // Nếu bị từ chối, load thông tin cũ để user có thể chỉnh sửa
        if (response.data === "REJECTED") {
          try {
            const organizerResponse = await getOrganizerByUserId();
            if (organizerResponse) {
              setFormData((prev) => ({
                ...prev,
                name: organizerResponse.orgName || "",
                orgTypeCode: organizerResponse.orgType?.typeCode || "",
                taxCode: organizerResponse.taxCode || "",
                address: organizerResponse.orgAddress || "",
                website: organizerResponse.website || "",
                businessSector: organizerResponse.businessField || "",
                description: organizerResponse.orgInfo || "",
              }));
            }
          } catch (err) {
            console.log("Không thể load thông tin organizer cũ:", err);
          }
        }
        return response.data;
      }
    } catch (err) {
      console.error("No existing organizer application found");
      setHasExistingApplication(false);
    }
    return null;
  };

  const [formData, setFormData] = useState({
    name: "",
    orgTypeCode: "",
    taxCode: "",
    address: "",
    website: "",
    businessSector: "",
    description: "",
    logo: null,
    logoPreview: null,
    idCardFront: null,
    idCardFrontPreview: null,
    idCardBack: null,
    idCardBackPreview: null,
    businessLicense: null,
    businessLicensePreview: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB");
          return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
          setError("Only JPG, PNG, and PDF files are allowed");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          [name]: file,
          [`${name}Preview`]: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        }));
        setError("");
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: null,
          [`${name}Preview`]: null,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = [];

    // Kiểm tra các trường bắt buộc
    if (!formData.name || formData.name.trim() === "") {
      errors.push("Tên tổ chức/doanh nghiệp là bắt buộc");
    }

    if (!formData.orgTypeCode || formData.orgTypeCode === "") {
      errors.push("Loại hình tổ chức là bắt buộc");
    }

    if (!formData.taxCode || formData.taxCode.trim() === "") {
      errors.push("Mã số thuế/đăng ký kinh doanh là bắt buộc");
    }

    if (!formData.address || formData.address.trim() === "") {
      errors.push("Địa chỉ là bắt buộc");
    }

    if (!formData.businessSector || formData.businessSector.trim() === "") {
      errors.push("Lĩnh vực kinh doanh chính là bắt buộc");
    }

    // Kiểm tra các file bắt buộc
    if (!formData.idCardFront) {
      errors.push("CCCD mặt trước là bắt buộc");
    }

    if (!formData.idCardBack) {
      errors.push("CCCD mặt sau là bắt buộc");
    }

    if (!formData.businessLicense) {
      errors.push("Giấy phép kinh doanh là bắt buộc");
    }

    if (!formData.logo) {
      errors.push("Logo tổ chức là bắt buộc");
    }

    // Kiểm tra website URL nếu có
    if (formData.website && formData.website.trim() !== "") {
      const websitePattern = /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\/#?]?.*$/;
      if (!websitePattern.test(formData.website)) {
        errors.push("URL website không hợp lệ");
      }
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const files = [
      formData.idCardFront,
      formData.idCardBack,
      formData.businessLicense,
      formData.logo,
    ];
    const fileNames = [
      "CCCD mặt trước",
      "CCCD mặt sau",
      "Giấy phép kinh doanh",
      "Logo tổ chức",
    ];

    files.forEach((file, index) => {
      if (file && file.size > maxSize) {
        errors.push(`${fileNames[index]} quá lớn (tối đa 5MB)`);
      }
    });

    return errors;
  };

  const createFormData = () => {
    const data = new FormData();

    // Add text fields
    data.append("name", formData.name);
    data.append("orgTypeCode", formData.orgTypeCode);
    data.append("taxCode", formData.taxCode);
    data.append("address", formData.address);
    data.append("website", formData.website || "");
    data.append("businessSector", formData.businessSector);
    data.append("description", formData.description || "");

    // Add files (validation đã đảm bảo files tồn tại)
    data.append("logo", formData.logo);
    data.append("idCardFront", formData.idCardFront);
    data.append("idCardBack", formData.idCardBack);
    data.append("businessLicense", formData.businessLicense);

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validation trước khi submit
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join("\n"));
        setSubmitting(false);
        return;
      }

      const formDataToSend = createFormData();

      // Tăng timeout và xử lý lỗi timeout thông minh hơn
      const result = await register(formDataToSend);

      // Sau khi đăng ký thành công, set trạng thái và chuyển sang view status
      setOrganizerStatus("PENDING"); // Set trực tiếp string
      setHasExistingApplication(true);
    } catch (err) {
      // Xử lý lỗi timeout - có thể đăng ký thành công nhưng response chậm
      if (err.message.includes("timeout") || err.code === "ECONNABORTED") {
        // Hiển thị thông báo đặc biệt cho timeout
        setError(
          "Quá trình tải lên có thể mất nhiều thời gian hơn dự kiến. Đơn đăng ký của bạn có thể đã được gửi thành công. Vui lòng tải lại trang sau vài phút để kiểm tra trạng thái."
        );
      } else {
        setError(err.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      setLoading(true);
      await Promise.all([fetchOrganizerTypes(), fetchOrganizerStatus()]);
      setLoading(false);
    };

    initializeComponent();
  }, []);

  // Thêm useEffect để debug organizerStatus
  useEffect(() => {
    console.log("🔍 Debug organizerStatus:", organizerStatus);
    console.log("🔍 Debug hasExistingApplication:", hasExistingApplication);
    console.log("🔍 Debug status type:", typeof organizerStatus);
  }, [organizerStatus, hasExistingApplication]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen  py-10 flex justify-center items-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  // Nếu đã có đơn đăng ký, chỉ hiển thị trang trạng thái
  if (hasExistingApplication) {
    return (
      <div className="min-h-screen  py-10">
        <div className="max-w-4xl mx-auto px-4">
          <StatusAlert status={organizerStatus} />
          <StatusBar status={organizerStatus} />
          <StatusDetails
            status={organizerStatus}
            onResubmit={() => {
              setHasExistingApplication(false);
              setError("");
            }}
          />
        </div>
      </div>
    );
  }

  // Hiển thị form đăng ký nếu chưa có đơn
  return (
    <div className="min-h-screen  py-10 flex justify-center items-start">
      <div className="form-container w-full max-w-4xl  p-8 rounded-xl shadow-lg text-gray-300">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Đăng Ký Trở Thành Nhà Tổ Chức
        </h2>
        <p className="text-gray-400 mb-4 text-center">
          Vui lòng điền đầy đủ thông tin để trở thành nhà tổ chức trên nền tảng
          của chúng tôi.
        </p>

        {organizerStatus === "REJECTED" && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            <div className="font-bold mb-2">🔄 Gửi lại đơn đăng ký:</div>
            <p className="text-sm">
              Đơn đăng ký trước của bạn đã bị từ chối. Vui lòng kiểm tra và cập
              nhật thông tin theo phản hồi từ admin, sau đó gửi lại đơn mới.
            </p>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          <div className="font-bold mb-2">📋 Yêu cầu đăng ký:</div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Tất cả thông tin cơ bản là bắt buộc</li>
            <li>CCCD mặt trước và mặt sau (ảnh hoặc PDF, tối đa 5MB)</li>
            <li>Giấy phép kinh doanh (ảnh hoặc PDF, tối đa 5MB)</li>
            <li>Logo tổ chức (ảnh, tối đa 5MB)</li>
            <li>Website (nếu có) phải đúng định dạng URL</li>
          </ul>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="font-bold mb-2">⚠️ Lỗi Validation:</div>
            <div className="whitespace-pre-line">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Thông tin tổ chức/doanh nghiệp */}
          <FormSection title="Thông tin Tổ chức/Doanh nghiệp">
            <InputGroup
              label="Tên tổ chức/doanh nghiệp:"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <InputGroup
              label="Loại hình tổ chức:"
              id="orgTypeCode"
              name="orgTypeCode"
              type="select"
              required
              value={formData.orgTypeCode}
              onChange={handleChange}
            >
              <option value="">Chọn loại hình</option>
              {organizerTypes.map((type) => (
                <option key={type.typeCode} value={type.typeCode}>
                  {type.typeName}
                </option>
              ))}
            </InputGroup>

            <InputGroup
              label="Mã số thuế/Mã số kinh doanh:"
              id="taxCode"
              name="taxCode"
              required
              value={formData.taxCode}
              onChange={handleChange}
            />
            <InputGroup
              label="Địa chỉ trụ sở chính:"
              id="address"
              name="address"
              value={formData.address}
              required
              onChange={handleChange}
            />
            <InputGroup
              label="Website/Trang mạng xã hội:"
              id="website"
              name="website"
              placeholder="VD: https://www.yourcompany.com"
              value={formData.website}
              onChange={handleChange}
            />
            <InputGroup
              label="Lĩnh vực hoạt động chính:"
              id="businessSector"
              name="businessSector"
              required
              value={formData.businessSector}
              onChange={handleChange}
            />
          </FormSection>

          <FormSection title="Thông tin chi tiết">
            <div className="flex flex-col md:flex-row gap-5 items-start mt-6">
              <InputGroup
                label="Thêm logo ban tổ chức (275x275):"
                id="logo"
                name="logo"
                type="file"
                accept="image/jpeg,image/png"
                fileName={formData.logo ? formData.logo.name : ""}
                filePreviewUrl={formData.logoPreview}
                onChange={handleChange}
              />
              <div className="flex-grow w-full">
                <InputGroup
                  label="Thông tin chi tiết về tổ chức:"
                  id="description"
                  name="description"
                  type="textarea"
                  required
                  placeholder="Mô tả về lịch sử, sứ mệnh, hoặc các hoạt động chính của tổ chức..."
                  maxLength={2000}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </FormSection>

          {/* Giấy tờ xác minh */}
          <FormSection title="Giấy tờ xác minh">
            <p className="text-gray-400 text-sm mb-4">
              Vui lòng tải lên ảnh CMND/CCCD hoặc Giấy phép kinh doanh để xác
              minh tài khoản của bạn. (Chấp nhận: JPG, PNG, PDF - Tối đa 5MB)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Ảnh CMND/CCCD mặt trước (Cá nhân):"
                id="idCardFront"
                name="idCardFront"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                required
                fileName={formData.idCardFront ? formData.idCardFront.name : ""}
                filePreviewUrl={formData.idCardFrontPreview}
                onChange={handleChange}
              />
              <InputGroup
                label="Ảnh CMND/CCCD mặt sau (Cá nhân):"
                id="idCardBack"
                name="idCardBack"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                required
                fileName={formData.idCardBack ? formData.idCardBack.name : ""}
                filePreviewUrl={formData.idCardBackPreview}
                onChange={handleChange}
              />
            </div>
            <InputGroup
              label="Giấy phép đăng ký kinh doanh (Tổ chức/Doanh nghiệp):"
              id="businessLicense"
              name="businessLicense"
              required
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              fileName={
                formData.businessLicense ? formData.businessLicense.name : ""
              }
              filePreviewUrl={formData.businessLicensePreview}
              onChange={handleChange}
            />
          </FormSection>

          {/* Nút gửi form */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              {error.includes("timeout") && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Tải lại trang để kiểm tra
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-bold text-lg transition-colors duration-300 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang xử lý..." : "Đăng Ký Nhà Tổ Chức"}
            </button>
            {submitting && (
              <p className="text-gray-400 text-sm mt-2">
                Đang tải lên tài liệu, quá trình này có thể mất vài phút...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizerForm;
