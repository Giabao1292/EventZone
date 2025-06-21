import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getUserDetail,
  updateUserDetail,
  updateUserAvatar,
} from "../services/userServices"; // Import updateUserAvatar
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import avatarDefault from "../assets/images/profile/avtDefault.jpg"; // Ảnh mặc định
import useAuth from "../hooks/useAuth";
import PageLoader from "../ui/PageLoader";

const ProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    authUser?.profileUrl || avatarDefault
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      phone: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserDetail();
        setUser(data);
        const formattedData = {
          ...data,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
        };
        reset(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
        toast.error("Không thể tải dữ liệu người dùng!");
      }
    };

    fetchUser();
  }, [reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const [year, month, day] = data.dateOfBirth.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      const updatedData = { ...data, dateOfBirth: formattedDate };
      const updated = await updateUserDetail(updatedData);
      setUser(updated);

      reset({
        ...updated,
        dateOfBirth: updated.dateOfBirth
          ? new Date(updated.dateOfBirth).toISOString().split("T")[0]
          : "",
      });

      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await updateUserAvatar(file);

      if (result.code === 200) {
        setAvatarUrl(result.data);
        updateUser({ ...authUser, profileUrl: result.data });
        toast.success("Cập nhật avatar thành công!");
      } else {
        toast.error("Cập nhật avatar thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi upload avatar:", error);
      toast.error(error.message || "Có lỗi xảy ra khi upload avatar!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-white">
      <div className="flex flex-col items-center mb-10 relative">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 shadow-md"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700 shadow"
          >
            ✏️
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <h1 className="text-3xl font-bold text-indigo-400 mt-4">
          Hồ sơ cá nhân
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#1D1F29] border border-[#2A2B33] shadow-lg rounded-2xl p-8 space-y-6"
      >
        <Field
          label="Họ và tên"
          register={register}
          name="fullname"
          error={errors.fullname?.message}
          required
        >
          {user.fullname}
        </Field>

        <Field label="Email" readonly>
          {user.email}
        </Field>

        <Field label="Tên đăng nhập" readonly>
          {user.username}
        </Field>

        <Field
          label="Số điện thoại"
          register={register}
          name="phone"
          error={errors.phone?.message}
        >
          {user.phone || "Chưa cập nhật"}
        </Field>

        <Field
          label="Ngày sinh"
          register={register}
          name="dateOfBirth"
          type="date"
          error={errors.dateOfBirth?.message}
        >
          {user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
            : "Chưa cập nhật"}
        </Field>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white px-5 py-2 rounded-xl transition-all duration-300"
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable field component
const Field = ({
  label,
  children,
  register,
  name,
  type = "text",
  error,
  required = false,
  readonly = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {readonly ? (
        <input
          className="mt-1 w-full border border-[#2A2B33] rounded-xl px-4 py-2 bg-[#12141D] text-gray-400 cursor-not-allowed"
          value={children}
          disabled
        />
      ) : (
        <>
          <input
            type={type}
            {...register(
              name,
              required ? { required: `${label} không được để trống` } : {}
            )}
            className="w-full bg-[#12141D] border border-[#2A2B33] text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-gray-400"
          />
          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        </>
      )}
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  register: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default ProfilePage;
