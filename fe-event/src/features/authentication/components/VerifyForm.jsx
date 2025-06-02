import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  verifyRegisterApi,
  resendVerificationCode,
} from "../../../services/authServices";
import useAuth from "../../../hooks/useAuth";

const VerifyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);
  const [isResending, setIsResending] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const { login: updateAuth } = useAuth();
  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (data) => {
    try {
      setApiError(null);
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

      const response = await verifyRegisterApi(finalData);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      updateAuth(response.data);
      navigate("/home");
    } catch (error) {
      setApiError(error.response?.data?.message || "Xác thực thất bại");
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return; // chặn gửi khi đang đếm ngược

    setApiError(null);
    setResendSuccess(null);
    setIsResending(true);

    try {
      const registerData = JSON.parse(sessionStorage.getItem("registerData"));
      if (!registerData || !registerData.email) {
        setApiError("Không tìm thấy email đăng ký. Vui lòng đăng ký lại.");
        setIsResending(false);
        return;
      }

      await resendVerificationCode(registerData.email);
      setResendSuccess("Mã xác thực đã được gửi lại đến email của bạn.");
      setCountdown(60); // Bắt đầu đếm ngược 60 giây
    } catch (error) {
      setApiError(error.response?.data?.message || "Gửi lại mã thất bại");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Các input code, password, confirmPassword ... */}

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
      {resendSuccess && (
        <p className="text-green-500 text-sm">{resendSuccess}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Xác nhận
      </button>

      <button
        type="button"
        onClick={handleResendCode}
        disabled={isResending || countdown > 0}
        className={`w-full mt-3 font-semibold py-2 rounded-lg transition duration-200
          ${
            countdown > 0
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          }`}
      >
        {countdown > 0
          ? `Gửi lại mã sau ${countdown}s`
          : isResending
          ? "Đang gửi lại..."
          : "Gửi lại mã xác thực"}
      </button>
    </form>
  );
};

export default VerifyForm;
