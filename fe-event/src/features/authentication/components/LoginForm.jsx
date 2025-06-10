import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login, loginWithGoogle } from "../../../services/authServices";
import useAuth from "../../../hooks/useAuth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId =
  "4148311475-r0lvc33sk1i36ok7kgimvfqlhejub0p5.apps.googleusercontent.com";

const LoginForm = () => {
  const {
    register: formField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { login: updateAuth } = useAuth();
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      updateAuth(result);
      const roles = result?.roles || [];
      console.log("roles result:", roles.includes("ORGANIZER"));
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("ORGANIZER")) {
        navigate("/organizer");
      } else {
        navigate("/"); // Mặc định là user
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const result = await loginWithGoogle({ idToken });
      updateAuth(result);

      // Lấy danh sách roles từ API response
      const roles = result?.roles || [];

      // Điều hướng dựa trên vai trò
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("ORGANIZER")) {
        navigate("/organizer");
      } else {
        navigate("/"); // Mặc định là user
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Đăng nhập bằng Google thất bại"
      );
    }
  };

  const onGoogleError = () => {
    setApiError("Đăng nhập bằng Google thất bại");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...formField("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email không hợp lệ",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            {...formField("password", { required: "Vui lòng nhập mật khẩu" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2 accent-blue-500" />
            Nhớ đăng nhập
          </label>
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Đăng nhập
        </button>

        <div className="mt-5 text-center">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            useOneTap
          />
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Đăng ký
          </a>
        </div>
      </form>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
