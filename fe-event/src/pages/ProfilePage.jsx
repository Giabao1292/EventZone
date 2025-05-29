// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUserDetail, updateUserDetail } from "../services/userServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      username: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserDetail();
        setUser(data);
        reset(data);
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
      reset(updated);
      setIsEditing(false);
      toast.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(user);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        Hồ sơ cá nhân
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-100"
      >
        {/* Họ tên */}
        <Field
          label="Họ và tên"
          isEditing={isEditing}
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
          isEditing={isEditing}
          register={register}
          name="phone"
        >
          {user.phone || "Chưa cập nhật"}
        </Field>

        {/* Ngày sinh */}
        <Field
          label="Ngày sinh"
          isEditing={isEditing}
          register={register}
          name="dateOfBirth"
          type="date"
        >
          {user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
            : "Chưa cập nhật"}
        </Field>

        {/* Nút điều khiển */}
        <div className="flex justify-end gap-4 pt-6">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
            >
              ✏️ Chỉnh sửa
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Component phụ cho form field
import PropTypes from "prop-types";

const Field = ({
  label,
  children,
  isEditing,
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
      {isEditing && !readonly ? (
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
      ) : readonly ? (
        <input
          className="mt-1 w-full border rounded px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-700"
          value={children}
          disabled
        />
      ) : (
        <p className="mt-1 text-lg text-gray-800">{children}</p>
      )}
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  isEditing: PropTypes.bool,
  register: PropTypes.func,
  name: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default ProfilePage;
