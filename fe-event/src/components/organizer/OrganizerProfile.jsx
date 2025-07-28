import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Globe,
  FileText,
  Award,
  User,
  Shield,
} from "lucide-react";

const OrganizerProfile = () => {
  const { user } = useAuth();
  const organizer = user?.organizer;

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <User className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              Không có thông tin nhà tổ chức
            </h2>
            <p className="text-slate-500">
              Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
              <Building2 className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              Hồ sơ tổ chức
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Thông tin chi tiết về tổ chức của bạn
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header với Avatar */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img
                  src={organizer.orgLogoUrl || "/images/default-logo.png"}
                  onError={(e) => {
                    const fallback = "/images/default-logo.png";
                    if (e.target.src !== window.location.origin + fallback) {
                      e.target.src = fallback;
                    }
                  }}
                  alt="Organizer Logo"
                  className="w-24 h-24 rounded-full border-4 border-white/20 object-cover shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{organizer.orgName}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    Tax Code: {organizer.taxCode}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {organizer.businessField}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ProfileItem
                icon={<MapPin className="w-5 h-5" />}
                label="Địa chỉ"
                value={organizer.orgAddress}
                color="blue"
              />
              <ProfileItem
                icon={<Globe className="w-5 h-5" />}
                label="Website"
                value={
                  <a
                    href={organizer.website}
                    className="text-blue-600 hover:text-blue-700 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {organizer.website}
                  </a>
                }
                color="green"
              />
              <ProfileItem
                icon={<FileText className="w-5 h-5" />}
                label="Mô tả"
                value={organizer.orgInfo}
                color="purple"
              />
              <ProfileItem
                icon={<Award className="w-5 h-5" />}
                label="Kinh nghiệm"
                value={organizer.experience}
                color="orange"
              />
            </div>

            {/* Ảnh giấy tờ */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">
                  Giấy tờ pháp lý
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocImage
                  label="CMND/CCCD (Mặt trước)"
                  src={organizer.idCardFrontUrl}
                  icon={<User className="w-5 h-5" />}
                />
                <DocImage
                  label="CMND/CCCD (Mặt sau)"
                  src={organizer.idCardBackUrl}
                  icon={<Shield className="w-5 h-5" />}
                />
                <DocImage
                  label="Giấy phép kinh doanh"
                  src={organizer.businessLicenseUrl}
                  icon={<Building2 className="w-5 h-5" />}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Component con hiển thị từng trường
const ProfileItem = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-slate-300 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <div className={colorClasses[color]}>{icon}</div>
        </div>
        <h4 className="font-semibold text-slate-700">{label}</h4>
      </div>
      <div className="text-slate-600">{value || "—"}</div>
    </div>
  );
};

// Component con hiển thị ảnh với fallback
const DocImage = ({
  label,
  src,
  icon,
  fallback = "/images/default-doc.png",
}) => {
  const handleImageError = (e) => {
    const absoluteFallback = window.location.origin + fallback;
    if (e.target.src !== absoluteFallback) {
      e.target.src = fallback;
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:border-slate-300 transition-all duration-300">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-orange-100 rounded-lg">
          <div className="text-orange-500">{icon}</div>
        </div>
        <h4 className="font-semibold text-slate-700 text-sm">{label}</h4>
      </div>
      <div className="relative">
        <img
          src={src || fallback}
          onError={handleImageError}
          alt={label}
          className="w-full h-48 object-cover rounded-lg border border-slate-200 shadow-sm"
        />
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
            <div className="text-center">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Chưa có ảnh</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerProfile;
