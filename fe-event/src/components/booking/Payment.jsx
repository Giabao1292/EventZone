import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Fake voucher, thay bằng API thật nếu cần
const fakeVouchers = [
    { id: 1, label: "Giảm 70.000đ", minOrder: 1000000, value: 70000, code: "VOUCHER70K", expired: "30/06/2025" },
    { id: 2, label: "Giảm 20.000đ", minOrder: 400000, value: 20000, code: "VOUCHER20K", expired: "30/06/2025" }
];

const COUNTDOWN_TIME = 15 * 60; // 15 phút

export default function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { event, showing, selection, customer } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [voucherInput, setVoucherInput] = useState("");
    const [voucherModal, setVoucherModal] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [vouchers, setVouchers] = useState([]);

    // --- Countdown timer ---
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME);
    const [timeoutModal, setTimeoutModal] = useState(false);

    // Tổng tiền gốc
    const totalPrice = Array.isArray(selection)
        ? selection.reduce((sum, s) => sum + (s.price || s.zone?.price || 0) * (s.qty || 1), 0)
        : 0;

    // Check thiếu data
    useEffect(() => {
        if (!event || !showing || !selection || !customer) {
            alert("Thông tin đặt vé không hợp lệ. Vui lòng chọn vé lại.");
            navigate("/");
        }
    }, [event, showing, selection, customer, navigate]);

    // Load voucher
    useEffect(() => {
        setVouchers(fakeVouchers);
    }, []);

    // --- Handle countdown ---
    useEffect(() => {
        // Nếu hết giờ
        if (timeLeft <= 0) {
            setTimeoutModal(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Helper
    const eventTitle = event?.title || event?.eventTitle || showing?.eventTitle || "Tên sự kiện";
    const startTime = showing?.startTime || event?.startTime || event?.dateTime || "";

    // Chọn voucher từ modal
    const handleSelectVoucher = (v) => {
        setVoucherInput(v.code);
        setSelectedVoucher(v);
        setVoucherModal(false);
    };

    // Áp dụng voucher khi nhập mã
    const handleApplyVoucher = () => {
        const found = vouchers.find(v => v.code.trim().toUpperCase() === voucherInput.trim().toUpperCase());
        if (found) setSelectedVoucher(found);
        else setSelectedVoucher(null);
    };

    // Tổng giảm giá & tổng sau giảm giá
    const discount = selectedVoucher ? Math.min(selectedVoucher.value, totalPrice) : 0;
    const finalTotal = totalPrice - discount;

    // Format time mm:ss
    const formatTime = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    // Thanh toán thành công giả lập
    const handlePayment = () => {
        setIsLoading(true);
        axios.post('/api/bookings', {
            eventId: event?._id,
            showingId: showing?._id,
            selection,
            customer,
            voucher: selectedVoucher?.code || voucherInput
        })
            .then(res => {
                alert('Đặt vé thành công!');
                // Có thể chuyển hướng sang trang "Vé của tôi" hoặc trang xác nhận
                navigate("/my-tickets");
            })
            .catch(err => {
                console.error(err);
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            })
            .finally(() => setIsLoading(false));
    };

    // Khi hết thời gian giữ vé
    const handleTimeoutBack = () => {
        navigate("/select-seats", { state: { event, showing } });
    };

    if (!event || !showing || !selection || !customer) return null;

    return (
        <div className="min-h-screen w-full bg-[#101827] flex flex-col">
            {/* HEADER */}
            <div className="w-full bg-gradient-to-br from-[#182c43] to-[#1c2234] px-16 py-9 flex justify-between items-center">
                <div>
                    <div className="text-3xl font-bold text-white mb-2">{eventTitle}</div>
                    <div className="flex items-center gap-8 text-[#cdd2ee] text-lg font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="text-[#70ffd7]">🕒</span>
                            <span>
                                {startTime
                                    ? new Date(startTime).toLocaleString("vi-VN")
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-[#16233a] px-10 py-5 rounded-2xl shadow flex flex-col items-center">
                    <span className="text-[#a8f5bf] text-lg font-semibold mb-2">Hoàn tất thanh toán trong</span>
                    <span className="text-4xl font-bold text-[#50fa78] tracking-widest">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* 2 CỘT */}
            <div className="w-full flex flex-row gap-16 px-16 py-16 justify-center items-start max-w-8xl mx-auto">
                {/* BÊN TRÁI */}
                <div className="flex-1 flex justify-end">
                    <div className="w-full max-w-2xl bg-[#171e30] rounded-3xl shadow-2xl border border-[#242c43] p-16 flex flex-col gap-12">
                        {/* Thông tin nhận vé */}
                        <div>
                            <div className="text-2xl font-bold text-[#58ffa7] mb-3 uppercase tracking-wide">Thông tin nhận vé</div>
                            <div className="text-base text-white mb-1">
                                Vé điện tử sẽ được hiển thị trong mục <b>"Vé của tôi"</b> của tài khoản <span className="font-semibold text-[#70ffd7]">{customer.email}</span>
                            </div>
                        </div>
                        {/* Mã khuyến mãi */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-2xl font-bold text-[#58ffa7]">Mã khuyến mãi</span>
                                <button
                                    className="ml-4 text-[#41ff9b] font-bold hover:underline"
                                    type="button"
                                    onClick={() => setVoucherModal(true)}
                                >
                                    Chọn voucher
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="bg-[#232841] border border-[#374151] rounded-xl px-6 py-4 text-white w-full text-lg"
                                    placeholder="Nhập mã giảm giá (nếu có)"
                                    value={voucherInput}
                                    onChange={e => setVoucherInput(e.target.value)}
                                    disabled={timeLeft <= 0}
                                />
                                <button
                                    className="bg-gradient-to-r from-[#44fdc7] to-[#7fffd9] hover:from-[#7fffd9] hover:to-[#44fdc7] transition font-bold py-2 px-8 rounded-2xl shadow-xl text-[#202938] text-lg"
                                    type="button"
                                    onClick={handleApplyVoucher}
                                    disabled={timeLeft <= 0}
                                >
                                    Áp dụng
                                </button>
                            </div>
                            {selectedVoucher && (
                                <div className="text-[#a8f5bf] mt-2 font-semibold">
                                    Đã áp dụng: <span className="text-[#15e29b]">{selectedVoucher.label}</span>
                                </div>
                            )}
                        </div>
                        {/* Phương thức thanh toán */}
                        <div>
                            <div className="text-2xl font-bold text-[#58ffa7] mb-4 uppercase tracking-wide">Phương thức thanh toán</div>
                            <div className="space-y-6">
                                <label className="flex items-center gap-3">
                                    <input type="radio" checked readOnly className="accent-[#41ff9b] w-6 h-6" />
                                    <span className="text-white font-semibold text-xl">VNPay/Mobile Banking app</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/VNPay_logo.png" alt="VNPay Logo" width="44" height="44" />
                                </label>
                                <label className="flex items-center gap-3 opacity-50">
                                    <input type="radio" disabled />
                                    <span className="text-white text-xl">ShopeePay</span>
                                    <img src="/shopeepay.png" alt="ShopeePay" className="w-12 h-12 object-contain ml-2" />
                                </label>
                                <label className="flex items-center gap-3 opacity-50">
                                    <input type="radio" disabled />
                                    <span className="text-white text-xl">Credit/Debit Card</span>
                                    <img src="/visa.png" alt="Visa" className="w-12 h-12 object-contain ml-2" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BÊN PHẢI */}
                <div className="flex-1 flex justify-start">
                    <div className="w-full max-w-2xl bg-[#171e30] rounded-3xl shadow-2xl border border-[#242c43] p-14 flex flex-col">
                        <div className="flex justify-between items-center mb-6 font-bold text-white text-2xl">
                            <span>Thông tin đặt vé</span>
                            <button
                                className="text-[#36c7ff] text-lg hover:text-[#82f7ee]"
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={isLoading || timeLeft <= 0}
                            >
                                Chọn lại vé
                            </button>
                        </div>
                        <div className="mb-6">
                            <div className="grid grid-cols-4 gap-0 text-[#7cc6b2] font-semibold text-xl mb-2 px-2">
                                <span>Loại vé</span>
                                <span className="text-right">Đơn giá</span>
                                <span className="text-right">Số lượng</span>
                                <span className="text-right">Thành tiền</span>
                            </div>
                            {Array.isArray(selection) && selection.map((s, i) => {
                                const label = s.zone?.zoneName || s.type || "Vé";
                                const qty = s.qty || 1;
                                const price = s.zone?.price || s.price || 0;
                                return (
                                    <div
                                        key={i}
                                        className="grid grid-cols-4 gap-0 items-center py-3 text-xl font-medium text-white px-2"
                                    >
                                        <span>{label}</span>
                                        <span className="text-right">{price.toLocaleString("vi-VN")} đ</span>
                                        <span className="text-right">{qty}</span>
                                        <span className="text-right">{(qty * price).toLocaleString("vi-VN")} đ</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="border-b border-[#283047] my-4" />
                        <div className="flex flex-col gap-2 text-xl mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-300 font-semibold">Tạm tính</span>
                                <span className="text-white">{totalPrice.toLocaleString("vi-VN")} đ</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-[#ff7474] font-semibold">Giảm giá</span>
                                    <span className="text-[#ff7474]">- {discount.toLocaleString("vi-VN")} đ</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center py-4 font-bold text-3xl border-t border-[#283047] mt-2">
                            <span className="text-[#4cf77f]">Tổng cộng</span>
                            <span className="text-[#4cf77f]">{finalTotal.toLocaleString("vi-VN")} đ</span>
                        </div>
                        {/* Nút thanh toán */}
                        <button
                            className="w-full mt-10 bg-gradient-to-r from-[#44fdc7] to-[#7fffd9] hover:from-[#7fffd9] hover:to-[#44fdc7] transition text-[#202938] font-bold py-4 rounded-2xl shadow-xl text-2xl"
                            onClick={handlePayment}
                            disabled={isLoading || timeLeft <= 0}
                        >
                            {isLoading ? "Đang xử lý..." : "Thanh toán"}
                        </button>
                        <div className="text-center text-lg text-[#7bc3be] mt-6">
                            Sau khi thanh toán, vé sẽ được hiển thị trong tài khoản của bạn.
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL VOUCHER */}
            {voucherModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-5">
                            <div className="font-bold text-2xl">Chọn voucher</div>
                            <button className="text-gray-400 text-3xl font-bold" onClick={() => setVoucherModal(false)}>×</button>
                        </div>
                        <div className="space-y-4 max-h-[350px] overflow-auto">
                            {vouchers.length === 0 && (
                                <div className="text-center text-gray-500 py-8">Chưa có voucher nào</div>
                            )}
                            {vouchers.map(v => (
                                <label
                                    key={v.id}
                                    className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:border-[#4cf77f] transition ${selectedVoucher?.id === v.id ? "border-[#4cf77f] bg-[#f3fffa]" : "border-gray-300"}`}
                                >
                                    <input
                                        type="radio"
                                        checked={selectedVoucher?.id === v.id}
                                        onChange={() => handleSelectVoucher(v)}
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-xl text-[#e32]">{v.label}</div>
                                        <div className="text-gray-600 text-base">Đơn tối thiểu {v.minOrder.toLocaleString("vi-VN")}đ</div>
                                        <div className="text-sky-600 text-sm underline cursor-pointer">Xem điều kiện</div>
                                        <div className="text-gray-400 text-xs">HSD: {v.expired}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end mt-8 gap-4">
                            <button className="px-7 py-3 rounded-xl border text-[#19ba7a] border-[#19ba7a] font-bold text-lg" onClick={() => setVoucherModal(false)}>Hủy bỏ</button>
                            <button
                                className="px-10 py-3 rounded-xl bg-[#19ba7a] text-white font-bold text-lg"
                                onClick={() => setVoucherModal(false)}
                            >Xong</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL hết giờ */}
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
