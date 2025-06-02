import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register as registerApi } from "../../../services/authServices";

const RegisterForm = () => {
  const {
    register: formField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const [year, month, day] = data.dateOfBirth.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const newData = {
        ...data,
        dateOfBirth: formattedDate,
      };

      await registerApi(newData);

      sessionStorage.setItem("registerData", JSON.stringify(newData));

      navigate("/verify-email");
    } catch (error) {
      setApiError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto w-full p-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-center text-gray-900">
        Đăng ký tài khoản
      </h2>

      {/* Tên đăng nhập */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Tên đăng nhập
        </label>
        <input
          type="text"
          {...formField("username", {
            required: "Vui lòng nhập tên đăng nhập",
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
        />
        {errors.username && (
          <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* Họ tên */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Họ tên
        </label>
        <input
          type="text"
          {...formField("fullName", {
            required: "Vui lòng nhập họ tên",
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...formField("email", {
            required: "Vui lòng nhập email",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Email không hợp lệ",
            },
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Số điện thoại */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          type="text"
          {...formField("phone", {
            required: "Vui lòng nhập số điện thoại",
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Ngày sinh */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Ngày sinh
        </label>
        <input
          type="date"
          {...formField("dateOfBirth", {
            required: "Vui lòng chọn ngày sinh",
            validate: (value) => {
              const today = new Date().toISOString().split("T")[0];
              return value <= today || "Ngày sinh không hợp lệ";
            },
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition"
        />
        {errors.dateOfBirth && (
          <p className="text-xs text-red-500 mt-1">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      {/* Lỗi API */}
      {apiError && (
        <p className="text-xs text-red-500 text-center">{apiError}</p>
      )}

      {/* Nút submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-150"
      >
        Đăng ký
      </button>

      {/* Chuyển đến đăng nhập */}
      <div className="text-center text-xs text-gray-600">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Đăng nhập
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
