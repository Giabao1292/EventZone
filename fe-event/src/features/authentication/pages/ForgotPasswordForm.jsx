import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
            setMessage("We have sent you a reset code. Please check your email.");
        } catch (error) {
            console.error(error);
            setMessage("Error sending email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:border-blue-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
                >
                    Send Reset Code
                </button>
                {message && (
                    <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
                )}
            </form>
        </div>
    );
}
