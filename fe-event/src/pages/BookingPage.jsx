import React, { useState } from "react";
import { Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import SelectSeats from "../components/booking/SelectSeats";
import CustomerInfo from "../components/booking/CustomerInfo";
import Payment from "../components/booking/Payment";
import Header from "../ui/Header";

export default function BookingPage() {
    const { showingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy data event và showing được truyền từ EventDetail
    const { event, showing } = location.state || {};

    // State quản lý lựa chọn và khách hàng
    const [selection, setSelection] = useState(null);
    const [customer, setCustomer] = useState({ name: "", email: "" });

    // Khi hoàn thành chọn khu vực/ghế
    const handleStep1Complete = (sel) => {
        setSelection(sel);
        navigate("info", { state: { event, showing, selection: sel } });
    };

    // Khi hoàn thành nhập thông tin khách hàng
    const handleStep2Complete = (data) => {
        setCustomer(data);
        navigate(`/book/${showingId}/payment`, { state: { event, showing, selection, customer: data } });
    };




    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <Header />

            {/* Nội dung chính */}
            <main className="flex-1 flex overflow-hidden">
                <Routes>
                    <Route
                        path=""
                        element={
                            <SelectSeats
                                showingId={showingId}
                                event={event}
                                showing={showing}
                                onComplete={handleStep1Complete}
                            />
                        }
                    />
                    <Route
                        path="info"
                        element={
                            <CustomerInfo
                                event={event}
                                showing={showing}
                                selection={selection}
                                onComplete={handleStep2Complete}
                            />
                        }
                    />
                    <Route path="payment" element={<Payment />} />
                </Routes>
            </main>
        </div>
    );
}
