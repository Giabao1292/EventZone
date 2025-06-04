import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  register as registerApi,
  resendVerificationEmail,
} from "../../../services/authServices";

const passwordCriteria = [
  {
    label: "Từ 8 - 32 ký tự",
    test: (pw) => pw.length >= 8 && pw.length <= 32,
  },
  {
    label: "Bao gồm chữ thường và số",
    test: (pw) => /[a-z]/.test(pw) && /\d/.test(pw),
  },
  {
    label: "Bao gồm ký tự đặc biệt (!,$,@,%,...)",
    test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(pw),
  },
  {
    label: "Có ít nhất 1 ký tự in hoa",
    test: (pw) => /[A-Z]/.test(pw),
  },
];

const RegisterForm = () => {
  const {
    register: formField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [apiError, setApiError] = useState(null);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [criteriaStates, setCriteriaStates] = useState(
    passwordCriteria.map(() => false)
  );
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const password = watch("password", "");

  useEffect(() => {
    const results = passwordCriteria.map((c) => c.test(password));
    setCriteriaStates(results);
    setIsPasswordValid(results.every(Boolean));
  }, [password]);

  const onSubmit = async (data) => {
    try {
      const [year, month, day] = data.dateOfBirth.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const newData = {
        ...data,
        dateOfBirth: formattedDate,
      };

      await registerApi(newData);
      setEmail(newData.email);
      setStatus("success");
      setCountdown(60);
      setCanResend(false);
      setApiError(null);
    } catch (error) {
      setApiError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      if (countdown === 1) setCanResend(true);
      return () => clearTimeout(timer);
    }
  }, [countdown, status]);

  const handleResendEmail = async () => {
    try {
      setResendMessage("");
      await resendVerificationEmail(email);
      setCountdown(60);
      setCanResend(false);
      setResendMessage("📩 Đã gửi lại email xác thực!");
    } catch (error) {
      setResendMessage("❌ Gửi lại email thất bại!");
    }
  };

  const openGmail = () => window.open("https://mail.google.com", "_blank");
  const openOutlook = () => window.open("https://outlook.live.com", "_blank");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto w-full p-6 bg-white rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold text-center text-gray-900">
        Đăng ký tài khoản
      </h2>

      {/* Các trường input */}

      <div>
        <label className="block text-xs font-medium text-gray-700">
          Họ tên
        </label>
        <input
          type="text"
          {...formField("fullName", {
            required: "Vui lòng nhập họ tên",
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700">
          Số điện thoại
        </label>
        <input
          type="text"
          {...formField("phone", {
            required: "Vui lòng nhập số điện thoại",
          })}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

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
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.dateOfBirth && (
          <p className="text-xs text-red-500 mt-1">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>
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
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      {/* Mật khẩu */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          Mật khẩu
        </label>
        <input
          type="password"
          {...formField("password", {
            required: "Vui lòng nhập mật khẩu",
            validate: () =>
              isPasswordValid || "Mật khẩu chưa hợp lệ theo tiêu chí bên dưới",
          })}
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-md focus:ring-2 transition ${
            errors.password
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-400 focus:border-blue-500"
          } outline-none`}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
        <div
          className={`mt-2 rounded-md border p-3 ${
            isPasswordValid || password.length === 0
              ? "border-gray-200 bg-gray-50"
              : "border-red-400 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`${
                isPasswordValid ? "text-green-600" : "text-red-600"
              } font-semibold`}
            >
              {isPasswordValid ? "✔" : "✖"}
            </span>
            <span
              className={`font-semibold ${
                isPasswordValid ? "text-green-700" : "text-red-700"
              }`}
            >
              {isPasswordValid ? "Mật khẩu hợp lệ" : "Mật khẩu chưa hợp lệ"}
            </span>
          </div>
          <ul className="pl-5 list-disc space-y-1">
            {passwordCriteria.map((c, i) => (
              <li key={i} className="flex items-center gap-1 text-sm">
                <span
                  className={
                    criteriaStates[i] ? "text-green-600" : "text-red-500"
                  }
                >
                  {criteriaStates[i] ? "✔" : "✖"}
                </span>
                <span
                  className={
                    criteriaStates[i] ? "text-green-700" : "text-gray-700"
                  }
                >
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {apiError && (
        <p className="text-xs text-red-500 text-center">{apiError}</p>
      )}

      <button
        type="submit"
        disabled={!isPasswordValid}
        className={`w-full ${
          isPasswordValid
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        } text-white font-medium py-2 rounded-lg transition duration-150`}
      >
        Đăng ký
      </button>

      <div className="text-center text-xs text-gray-600">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Đăng nhập
        </a>
      </div>

      {/* Thông báo sau khi đăng ký thành công */}
      {status === "success" && (
        <div className="mt-4 space-y-3 text-center">
          <p className="text-green-600 font-semibold">🎉 Đăng ký thành công!</p>
          <p className="text-sm text-gray-600">
            Vui lòng kiểm tra email <span className="font-medium">{email}</span>{" "}
            để xác thực tài khoản.
          </p>

          {resendMessage && (
            <p className="text-sm text-green-500">{resendMessage}</p>
          )}

          <button
            onClick={handleResendEmail}
            type="button"
            disabled={!canResend}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              canResend ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
            }`}
          >
            {canResend
              ? "Gửi lại email xác thực"
              : `Vui lòng đợi ${countdown}s`}
          </button>

          <div className="flex justify-center gap-4 text-sm">
            <button
              onClick={openGmail}
              type="button"
              className="text-blue-500 hover:underline"
            >
              Mở Gmail
            </button>
            <button
              onClick={openOutlook}
              type="button"
              className="text-blue-500 hover:underline"
            >
              Mở Outlook
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
