import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const text = await res.text();
        toast.success(text || "Yêu cầu đặt lại mật khẩu đã được gửi");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.message || "Đã xảy ra lỗi");
      }
    } catch (err) {
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow relative">
      <ToastContainer position="top-right" />
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        </div>
      )}

      <h2 className="text-2xl mb-4 font-semibold">Quên mật khẩu</h2>
      <form
        onSubmit={handleSubmit}
        className={isLoading ? "pointer-events-none opacity-50" : ""}
      >
        <label className="block mb-2 font-medium">Nhập email của bạn:</label>
        <input
          type="email"
          required
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Gửi yêu cầu
        </button>
      </form>
    </div>
  );
}
