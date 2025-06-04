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
import avatarDefault from "../assets/images/avtDefault.jpg"; // Ảnh mặc định
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

      const updatedData = {
        ...data,
        dateOfBirth: formattedDate,
      };

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

  // Updated handler to use the service function
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await updateUserAvatar(file); // Call the service function

      if (result.code === 200) {
        setAvatarUrl(result.data); // Update avatarUrl with new URL
        updateUser({ ...authUser, profileUrl: result.data }); // Update authUser
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

  if (!user) {
    return PageLoader;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-600 mb-2"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700"
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
        <h1 className="text-4xl font-bold text-center text-indigo-700">
          Hồ sơ cá nhân
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100"
      >
        {/* Họ tên */}
        <Field
          label="Họ và tên"
          register={register}
          name="fullname"
          error={errors.fullname?.message}
          required
        >
          {user.fullname}
        </Field>

        {/* Email */}
        <Field label="Email" readonly>
          {user.email}
        </Field>

        {/* Tên đăng nhập */}
        <Field label="Tên đăng nhập" readonly>
          {user.username}
        </Field>

        {/* Số điện thoại */}
        <Field
          label="Số điện thoại"
          register={register}
          name="phone"
          error={errors.phone?.message}
        >
          {user.phone || "Chưa cập nhật"}
        </Field>

        {/* Ngày sinh */}
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

        {/* Nút lưu */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Component phụ cho form field
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {readonly ? (
        <input
          className="mt-1 w-full border rounded px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-700"
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
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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
