import React, { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                const text = await res.text();
                setMessage(text);
                setEmail("");
            } else {
                const data = await res.json();
                setError(data.message || "Đã xảy ra lỗi");
            }
        } catch (err) {
            setError("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-2xl mb-4 font-semibold">Quên mật khẩu</h2>
            <form onSubmit={handleSubmit}>
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
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}
