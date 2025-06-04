import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await fetch(
        `/api/auth/reset-password?token=${token}&newPassword=${encodeURIComponent(
          newPassword
        )}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setMessage("Mật khẩu đã được cập nhật thành công");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Đã xảy ra lỗi");
      }
    } catch (err) {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    }
  };

  if (!token) {
    return <p>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Mật khẩu mới:</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <label className="block mb-2 font-medium">Xác nhận mật khẩu mới:</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cập nhật mật khẩu
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
