import { useState, useEffect } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getEventTitle(event, showing) {
    return event?.title || event?.eventTitle || showing?.eventTitle || "Tên sự kiện";
}
function getStartTime(event, showing) {
    return showing?.startTime || event?.startTime || event?.dateTime || "";
}

export default function CustomerInfo({ event, showing, selection, onComplete }) {
    const navigate = useNavigate();

    // Khi chưa chọn vé
    if (!selection || selection.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#101827] text-white text-xl font-bold">
                Bạn chưa chọn vé nào!
            </div>
        );
    }

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    // Countdown
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [timeoutModal, setTimeoutModal] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeoutModal(true);
            return;
        }
        const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const totalPrice = selection.reduce(
        (a, s) => a + ((s.price || (s.zone?.price ?? 0)) * (s.qty || 1)), 0
    );

    const eventTitle = getEventTitle(event, showing);
    const startTime = getStartTime(event, showing);

    // Khi hết giờ, quay lại chọn vé
    function handleTimeoutBack() {
        navigate(-1);
    }

    // Khi nhấn Tiếp tục
    const handleContinue = (e) => {
        e.preventDefault();
        if (!name || !phone || !email || timeLeft <= 0) return;
        // Gửi dữ liệu sang BookingPage để navigate sang payment
        onComplete({ name, phone, email });
    };

    return (
        <div className="min-h-screen w-full bg-[#101827] flex flex-col">
            {/* HEADER FULL WIDTH */}
            <div className="w-full bg-gradient-to-br from-[#182c43] to-[#1c2234] px-12 py-7 flex justify-between items-center">
                <div>
                    <div className="text-2xl font-bold text-white mb-2">{eventTitle}</div>
                    <div className="flex items-center gap-8 text-[#cdd2ee] text-lg font-semibold">
                        <div className="flex items-center gap-2">
                            <CalendarClock className="w-5 h-5 text-[#70ffd7]" />
                            <span>
                                {startTime
                                    ? new Date(startTime).toLocaleString("vi-VN")
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#16233a] px-10 py-5 rounded-2xl shadow flex flex-col items-center">
                    <span className="text-[#a8f5bf] text-lg font-semibold mb-2">Hoàn tất đặt vé trong</span>
                    <span className="text-4xl font-bold text-[#50fa78] tracking-widest">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* 2 CỘT FORM VÀ THÔNG TIN VÉ */}
            <div className="w-full flex flex-row gap-12 px-12 py-14 justify-center items-start max-w-7xl mx-auto">
                {/* FORM KHÁCH HÀNG */}
                <div className="flex-1 flex justify-end">
                    <div className="w-full max-w-xl bg-[#171e30] rounded-3xl shadow-2xl border border-[#242c43] p-12">
                        <h2 className="text-2xl font-bold text-[#58ffa7] mb-10 uppercase tracking-wide text-center">
                            ĐIỀN THÔNG TIN CÁ NHÂN
                        </h2>
                        <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                            <div>
                                <label className="block font-semibold mb-2 text-white text-lg">
                                    <span className="text-[#f36]">*</span> Họ & tên
                                </label>
                                <input
                                    className="w-full bg-[#232841] rounded-xl p-4 text-white border border-[#242c43] focus:outline-[#58ffa7] text-lg"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="Điền câu trả lời của bạn"
                                    disabled={timeLeft <= 0}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-white text-lg">
                                    <span className="text-[#f36]">*</span> Số điện thoại
                                </label>
                                <input
                                    className="w-full bg-[#232841] rounded-xl p-4 text-white border border-[#242c43] focus:outline-[#58ffa7] text-lg"
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                    placeholder="Điền câu trả lời của bạn"
                                    disabled={timeLeft <= 0}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-white text-lg">Email</label>
                                <input
                                    className="w-full bg-[#232841] rounded-xl p-4 text-white border border-[#242c43] focus:outline-[#58ffa7] text-lg"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="Điền câu trả lời của bạn"
                                    disabled={timeLeft <= 0}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                {/* THÔNG TIN VÉ */}
                <div className="flex-1 flex justify-start">
                    <div className="w-full max-w-xl bg-[#171e30] rounded-3xl shadow-2xl border border-[#242c43] p-10 flex flex-col">
                        <div className="flex justify-between items-center mb-4 font-bold text-white text-lg">
                            <span>Thông tin đặt vé</span>
                            <button
                                className="text-[#36c7ff] text-sm hover:text-[#82f7ee]"
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={timeLeft <= 0}
                            >
                                Chọn lại vé
                            </button>
                        </div>
                        <div className="mb-3">
                            <div className="grid grid-cols-4 gap-0 text-[#7cc6b2] font-semibold text-base mb-2 px-2">
                                <span>Loại vé</span>
                                <span className="text-right">Đơn giá</span>
                                <span className="text-right">Số lượng</span>
                                <span className="text-right">Thành tiền</span>
                            </div>
                            {selection.map((s, i) => {
                                const label = s.zone?.zoneName || s.type || "Vé";
                                const qty = s.qty || 1;
                                const price = s.zone?.price || s.price || 0;
                                return (
                                    <div
                                        key={i}
                                        className="grid grid-cols-4 gap-0 items-center py-2 text-lg font-medium text-white px-2"
                                    >
                                        <span>{label}</span>
                                        <span className="text-right">{price.toLocaleString("vi-VN")} đ</span>
                                        <span className="text-right">{qty}</span>
                                        <span className="text-right">{(qty * price).toLocaleString("vi-VN")} đ</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-b border-[#283047] my-3" />
                        <div className="flex justify-between py-2 font-bold text-[#4cf77f] text-xl">
                            <span>Tổng cộng</span>
                            <span>{totalPrice?.toLocaleString("vi-VN")} đ</span>
                        </div>
                        {/* Nút tiếp tục */}
                        <button
                            className="w-full mt-8 bg-gradient-to-r from-[#44fdc7] to-[#7fffd9] hover:from-[#7fffd9] hover:to-[#44fdc7] transition text-[#202938] font-bold py-3 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xl"
                            onClick={handleContinue}
                            disabled={!name || !phone || !email || timeLeft <= 0}
                        >
                            Tiếp tục <ArrowRight size={22} />
                        </button>
                        <div className="text-center text-sm text-[#7bc3be] mt-4">
                            Vui lòng trả lời tất cả câu hỏi để tiếp tục
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal hết giờ */}
            {timeoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl px-10 py-8 shadow-lg max-w-[90vw] text-center flex flex-col items-center">
                        <span className="text-2xl font-bold text-red-600 mb-4">Hết thời gian giữ vé</span>
                        <p className="text-lg text-gray-800 mb-6">
                            Bạn đã hết thời gian giữ vé.<br />Vui lòng chọn lại chỗ ngồi để tiếp tục đặt vé.
                        </p>
                        <button
                            onClick={handleTimeoutBack}
                            className="bg-[#44fdc7] hover:bg-[#2fdbb2] transition text-[#202938] font-bold py-2 px-8 rounded-xl text-lg"
                        >
                            Quay lại chọn vé
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
