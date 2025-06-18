"use client";

import { useState, useEffect } from "react";
import {
  register,
  getOrganizerTypes,
} from "../../../services/organizerService";

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
            className="w-full p-3 border border-gray-600 roundemin-h-screen bg-gray-900 py-10 flex justify-center items-startd-md bg-white text-gray-900 text-base focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-y min-h-[100px]"
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

// --- Main Component ---
const RegisterOrganizerForm = () => {
  const [organizerTypes, setOrganizerTypes] = useState([]);
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const createFormData = () => {
    const data = new FormData();

    // Add text fields
    data.append("name", formData.name);
    data.append("orgTypeCode", formData.orgTypeCode);
    data.append("taxCode", formData.taxCode);
    data.append("address", formData.address);
    data.append("website", formData.website);
    data.append("businessSector", formData.businessSector);
    data.append("description", formData.description);

    // Add files
    if (formData.logo) data.append("logo", formData.logo);
    if (formData.idCardFront) data.append("idCardFront", formData.idCardFront);
    if (formData.idCardBack) data.append("idCardBack", formData.idCardBack);
    if (formData.businessLicense)
      data.append("businessLicense", formData.businessLicense);

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = createFormData();
      const result = await register(formDataToSend); // Dùng service

      setSuccess(
        "Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ."
      );
      setFormData({
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
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerTypes();
  }, []);
  return (
    <div className="min-h-screen py-10 flex justify-center items-start">
      <div className="form-container w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg text-gray-300">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Đăng Ký Trở Thành Nhà Tổ Chức
        </h2>
        <p className="text-gray-400 mb-8 text-center">
          Vui lòng điền đầy đủ thông tin để trở thành nhà tổ chức trên nền tảng
          của chúng tôi.
        </p>

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
              {/* Danh sách option mới */}
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
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-bold text-lg transition-colors duration-300 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký Nhà Tổ Chức"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizerForm;
