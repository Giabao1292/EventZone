import React, { useState, useEffect } from "react";

// --- Sub Components ---

const FormSection = ({ title, children }) => (
  <div className="bg-darkSection p-6 rounded-lg mb-6">
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
        className={`block text-grayText text-sm font-normal mb-2 ${
          required
            ? 'relative before:content-["*"] before:text-requiredRed before:absolute before:-left-3'
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
            className="w-full p-3 border border-inputBorder rounded-md bg-inputWhite text-grayDark text-base focus:border-focusPurple focus:ring-1 focus:ring-focusPurple outline-none resize-y min-h-[100px]"
            required={required}
          ></textarea>
        ) : type === "select" ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-inputBorder rounded-md bg-inputWhite text-grayDark text-base focus:border-focusPurple focus:ring-1 focus:ring-focusPurple outline-none"
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
              onChange={onChange}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-checkedGreen/10 file:text-checkedGreen
                        hover:file:bg-checkedGreen/20"
              required={required}
            />
            {filePreviewUrl && (
              <div className="mt-2">
                {filePreviewUrl.match(/image/) ? (
                  <img
                    src={filePreviewUrl}
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
            className="w-full p-3 border border-inputBorder rounded-md bg-inputWhite text-grayDark text-base focus:border-focusPurple focus:ring-1 focus:ring-focusPurple outline-none"
            required={required}
          />
        )}
        {hasCounter && (
          <span
            className={`absolute text-gray-500 text-sm ${
              type === "textarea"
                ? "bottom-2 right-3"
                : "top-1/2 -translate-y-1/2 right-3"
            } bg-inputWhite px-1`}
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
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    taxCode: "",
    orgAddress: "",
    website: "",
    businessField: "",
    orgInfo: "",
    orgLogo: null,
    orgLogoPreview: null,
    idCardFront: null,
    idCardFrontPreview: null,
    idCardBack: null,
    idCardBackPreview: null,
    businessLicense: null,
    businessLicensePreview: null,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Mock data cho dropdown (thực tế nên fetch từ API)
  useEffect(() => {
    setProvinces([
      { value: "", label: "Chọn Tỉnh/Thành" },
      { value: "hcm", label: "TP. Hồ Chí Minh" },
      { value: "hn", label: "Hà Nội" },
    ]);
  }, []);

  useEffect(() => {
    if (formData.province === "hcm") {
      setDistricts([
        { value: "", label: "Chọn Quận/Huyện" },
        { value: "q1", label: "Quận 1" },
        { value: "bt", label: "Bình Thạnh" },
      ]);
    } else if (formData.province === "hn") {
      setDistricts([
        { value: "", label: "Chọn Quận/Huyện" },
        { value: "hk", label: "Hoàn Kiếm" },
        { value: "cg", label: "Cầu Giấy" },
      ]);
    } else {
      setDistricts([{ value: "", label: "Chọn Quận/Huyện" }]);
    }
    setFormData((prev) => ({ ...prev, district: "", ward: "" }));
    // eslint-disable-next-line
  }, [formData.province]);

  useEffect(() => {
    if (formData.district === "q1") {
      setWards([
        { value: "", label: "Chọn Phường/Xã" },
        { value: "btp", label: "Bến Thành" },
        { value: "cnn", label: "Cầu Ông Lãnh" },
      ]);
    } else if (formData.district === "hk") {
      setWards([
        { value: "", label: "Chọn Phường/Xã" },
        { value: "td", label: "Tràng Tiền" },
        { value: "hc", label: "Hàng Gai" },
      ]);
    } else {
      setWards([{ value: "", label: "Chọn Phường/Xã" }]);
    }
    setFormData((prev) => ({ ...prev, ward: "" }));
    // eslint-disable-next-line
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
          [`${name}Preview`]: URL.createObjectURL(file),
        }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đăng ký thành công! (Xem dữ liệu trong console)");
    // console.log(formData); // Bật nếu muốn debug dữ liệu gửi đi
  };

  return (
    <div className="min-h-screen bg-darkBg py-10 flex justify-center items-start">
      <div className="form-container w-full max-w-4xl bg-darkContainer p-8 rounded-xl shadow-lg text-grayLight">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          Đăng Ký Trở Thành Nhà Tổ Chức
        </h2>
        <p className="text-grayText mb-8 text-center">
          Vui lòng điền đầy đủ thông tin để trở thành nhà tổ chức trên nền tảng
          của chúng tôi.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Thông tin tổ chức/doanh nghiệp */}
          <FormSection title="Thông tin Tổ chức/Doanh nghiệp">
            <InputGroup
              label="Tên tổ chức/doanh nghiệp:"
              id="orgName"
              name="orgName"
              required
              value={formData.orgName}
              onChange={handleChange}
            />
            <InputGroup
              label="Loại hình tổ chức:"
              id="orgType"
              name="orgType"
              type="select"
              required
              value={formData.orgType}
              onChange={handleChange}
            >
              <option value="">Chọn loại hình</option>
              <option value="company_ltd">Công ty TNHH</option>
              <option value="private_enterprise">Doanh nghiệp tư nhân</option>
              <option value="household_business">Hộ kinh doanh cá thể</option>
              <option value="non_profit">Tổ chức phi lợi nhuận</option>
              <option value="individual">Cá nhân</option>
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
              id="orgAddress"
              name="orgAddress"
              value={formData.orgAddress}
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
              id="businessField"
              name="businessField"
              value={formData.businessField}
              onChange={handleChange}
            />
          </FormSection>
          <FormSection title="Thông tin Tổ chức/Doanh nghiệp">
            <div className="flex flex-col md:flex-row gap-5 items-start mt-6">
              <InputGroup
                label="Thêm logo ban tổ chức (275x275):"
                id="orgLogo"
                name="orgLogo"
                type="file"
                fileName={formData.orgLogo ? formData.orgLogo.name : ""}
                filePreviewUrl={formData.orgLogoPreview}
                onChange={handleChange}
              />
              <div className="flex-grow w-full">
                <InputGroup
                  label="Thông tin chi tiết về tổ chức:"
                  id="orgInfo"
                  name="orgInfo"
                  type="textarea"
                  required
                  placeholder="Mô tả về lịch sử, sứ mệnh, hoặc các hoạt động chính của tổ chức..."
                  maxLength={2000}
                  value={formData.orgInfo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </FormSection>
          {/* Giấy tờ xác minh */}
          <FormSection title="Giấy tờ xác minh">
            <p className="text-grayText text-sm mb-4">
              Vui lòng tải lên ảnh CMND/CCCD hoặc Giấy phép kinh doanh để xác
              minh tài khoản của bạn. (Chấp nhận: JPG, PNG, PDF)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup
                label="Ảnh CMND/CCCD mặt trước (Cá nhân):"
                id="idCardFront"
                name="idCardFront"
                type="file"
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
              fileName={
                formData.businessLicense ? formData.businessLicense.name : ""
              }
              filePreviewUrl={formData.businessLicensePreview}
              onChange={handleChange}
            />
          </FormSection>

          {/* Nút gửi form */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-checkedGreen text-white py-3 px-8 rounded-lg font-bold text-lg transition-colors duration-300 hover:bg-green-600"
            >
              Đăng Ký Nhà Tổ Chức
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterOrganizerForm;
