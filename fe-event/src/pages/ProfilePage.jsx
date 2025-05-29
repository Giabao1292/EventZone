import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
      username: user?.username || "",
    },
  });

  // Set form values when user data loads
  useState(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("dateOfBirth", user.dateOfBirth);
      setValue("username", user.username);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Call API to update user info
      const response = await axios.put("/api/user/profile", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      // Update user context
      if (updateUser) {
        updateUser(response.data.user);
      }

      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-lg text-gray-700 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user.fullname?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600">
            Quản lý và xem thông tin tài khoản của bạn
          </p>
        </div>

        {/* Profile Card */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Chi tiết tài khoản
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 font-medium"
                  >
                    ✏️ Chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 space-y-6">
              {/* Full Name */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Họ và tên
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register("fullname", {
                        required: "Họ tên không được để trống",
                        minLength: {
                          value: 2,
                          message: "Họ tên phải có ít nhất 2 ký tự",
                        },
                      })}
                      className="w-full p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-lg"
                      placeholder="Nhập họ và tên"
                    />
                    {errors.fullname && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500 transition-all duration-200 group-hover:bg-indigo-50">
                    <svg
                      className="w-5 h-5 text-indigo-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-lg text-gray-800 font-medium">
                      {user.fullname}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Email
                </label>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-green-500 transition-all duration-200 group-hover:bg-green-50">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a3 3 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-lg text-gray-800">{user.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register("phone", {
                        required: "Số điện thoại không được để trống",
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: "Số điện thoại phải có 10-11 chữ số",
                        },
                      })}
                      className="w-full p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-lg"
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 transition-all duration-200 group-hover:bg-blue-50">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-lg text-gray-800">{user.phone}</span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Ngày sinh
                </label>
                {isEditing ? (
                  <div>
                    <input
                      {...register("dateOfBirth", {
                        required: "Ngày sinh không được để trống",
                      })}
                      type="date"
                      className="w-full p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-lg"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 transition-all duration-200 group-hover:bg-purple-50">
                    <svg
                      className="w-5 h-5 text-purple-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-lg text-gray-800">
                      {user.dateOfBirth}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
              {isEditing ? (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
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
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Thông tin tài khoản</p>
                  <span className="text-sm text-gray-400">
                    Nhấn Chỉnh sửa để cập nhật thông tin
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
