import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyRegisterApi } from "../../../services/authServices";

const VerifyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const registerData = JSON.parse(sessionStorage.getItem("registerData"));
      if (!registerData) {
        setApiError("Không tìm thấy dữ liệu đăng ký. Vui lòng đăng ký lại.");
        return;
      }

      if (data.password !== data.confirmPassword) {
        setApiError("Mật khẩu xác nhận không khớp.");
        return;
      }

      const finalData = {
        ...registerData,
        password: data.password,
        code: data.code,
      };

      await verifyRegisterApi(finalData);
      sessionStorage.removeItem("registerData");
      navigate("/login");
    } catch (error) {
      setApiError(error.response?.data?.message || "Xác thực thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mã xác thực
        </label>
        <input
          type="text"
          {...register("code", { required: "Vui lòng nhập mã xác thực" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.code && (
          <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <input
          type="password"
          {...register("password", { required: "Vui lòng nhập mật khẩu" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nhập lại mật khẩu
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Xác nhận
      </button>
    </form>
  );
};

export default VerifyForm;
