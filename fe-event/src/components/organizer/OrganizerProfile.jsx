import { useAuth } from "../../context/AuthContext";

const OrganizerProfile = () => {
  const { user } = useAuth();
  const organizer = user?.organizer;

  if (!organizer) {
    return (
      <p className="text-center text-red-500 font-semibold">
        Không có thông tin nhà tổ chức.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-[#1f1f2b] rounded-2xl shadow-md text-white">
      {/* Avatar + Tên tổ chức */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={organizer.orgLogoUrl || "/images/default-logo.png"}
          onError={(e) => {
            const fallback = "/images/default-logo.png";
            if (e.target.src !== window.location.origin + fallback) {
              e.target.src = fallback;
            }
          }}
          alt="Organizer Logo"
          className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover mb-4"
        />
        <h2 className="text-2xl font-semibold">{organizer.orgName}</h2>
        <p className="text-gray-400 mt-1">Tax Code: {organizer.taxCode}</p>
        <p className="text-gray-400">Field: {organizer.businessField}</p>
      </div>

      {/* Thông tin */}
      <div className="space-y-4">
        <ProfileItem label="Address" value={organizer.orgAddress} />
        <ProfileItem
          label="Website"
          value={
            <a
              href={organizer.website}
              className="text-blue-400 underline"
              target="_blank"
              rel="noreferrer"
            >
              {organizer.website}
            </a>
          }
        />
        <ProfileItem label="Description" value={organizer.orgInfo} />
        <ProfileItem label="Experience" value={organizer.experience} />
      </div>

      {/* Ảnh giấy tờ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <DocImage label="ID Card (Front)" src={organizer.idCardFrontUrl} />
        <DocImage label="ID Card (Back)" src={organizer.idCardBackUrl} />
        <DocImage label="Business License" src={organizer.businessLicenseUrl} />
      </div>
    </div>
  );
};

// Component con hiển thị từng trường
const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <div className="px-4 py-2 bg-[#2a2a3b] rounded-lg font-medium">
      {value || "—"}
    </div>
  </div>
);

// Component con hiển thị ảnh với fallback
const DocImage = ({ label, src, fallback = "" }) => {
  const handleImageError = (e) => {
    const absoluteFallback = window.location.origin + fallback;
    if (e.target.src !== absoluteFallback) {
      e.target.src = fallback;
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-300 mb-1">{label}</p>
      <img
        src={src || fallback}
        onError={handleImageError}
        alt={label}
        className="w-full h-48 object-contain bg-[#2a2a3b] rounded-lg border border-gray-600"
      />
    </div>
  );
};

export default OrganizerProfile;
