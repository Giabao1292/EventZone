import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, CalendarClock, Ticket, BadgeDollarSign, Users2 } from "lucide-react";

const SOFT_COLORS = [
    "#A5B4FC", "#6EE7B7", "#FECACA", "#FDE68A", "#C7D2FE",
    "#FBCFE8", "#FCD34D", "#E0E7FF", "#FDBA74", "#BFDBFE",
];

export default function SelectSeats({ showingId, onComplete }) {
    const [layout, setLayout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Chọn khu vực và ghế tách riêng
    const [zoneSelections, setZoneSelections] = useState([]);
    const [seatSelections, setSeatSelections] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/events/showing-times/${showingId}/layout`)
            .then(({ data }) => setLayout(data.data))
            .catch(() => setError("Không thể tải sơ đồ"))
            .finally(() => setLoading(false));
    }, [showingId]);

    if (loading) return <div className="w-full h-[80vh] flex items-center justify-center text-2xl text-slate-200 bg-gradient-to-br from-[#1c2030] via-[#1e2237] to-[#23233a] animate-pulse">Đang tải sơ đồ…</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!layout) return null;

    const {
        eventTitle,
        startTime,
        location,
        zones = [],
        seats = [],
    } = layout;

    // Tổng tiền
    const total =
        zoneSelections.reduce((sum, s) => sum + s.zone.price * s.qty, 0) +
        seatSelections.reduce((sum, s) => sum + s.price, 0);

    // Danh sách mức giá duy nhất cho zone & seat
    const priceList = [
        ...zones.map(z => ({ type: z.type, price: z.price, key: `zone|${z.type}|${z.price}` })),
        ...seats.map(s => ({ type: s.type, price: s.price, key: `seat|${s.type}|${s.price}` }))
    ]
        .filter(item => item.price)
        .reduce((acc, cur) => {
            if (!acc.some(i => i.key === cur.key)) acc.push(cur);
            return acc;
        }, []);

    // Map mỗi mức giá về màu pastel/muted
    const priceColorMap = Object.fromEntries(
        priceList.map((item, idx) => [item.key, SOFT_COLORS[idx % SOFT_COLORS.length]])
    );

    // ==== Chọn ZONE ====
    const toggleZone = zone => {
        setZoneSelections(cur => {
            const exists = cur.find(s => s.zone.id === zone.id);
            if (exists) {
                return cur.filter(s => s.zone.id !== zone.id);
            } else {
                return [...cur, { zone, qty: 1 }];
            }
        });
    };
    const updateQty = (zoneId, qty) => {
        setZoneSelections(cur =>
            cur.map(s =>
                s.zone.id === zoneId
                    ? { ...s, qty: Math.min(Math.max(1, qty), s.zone.capacity) }
                    : s
            )
        );
    };

    // ==== Chọn SEAT ====
    const toggleSeat = seat => {
        setSeatSelections(cur => {
            const exists = cur.find(s => s.id === seat.id);
            if (exists) {
                return cur.filter(s => s.id !== seat.id);
            } else {
                return [...cur, seat];
            }
        });
    };

    const ZONE_SCALE = 25;

    // Sơ đồ phù hợp theo dữ liệu
    const renderMap = () => {
        // Có cả zones và seats
        if (zones.length > 0 && seats.length > 0) {
            return (
                <div className="relative w-full" style={{ maxWidth: 700, height: 480 }}>
                    {/* Zones */}
                    {zones.map(zone => {
                        const selected = zoneSelections.some(s => s.zone.id === zone.id);
                        const priceKey = `zone|${zone.type}|${zone.price}`;
                        const bgColor = priceColorMap[priceKey] || "#EEE";
                        return (
                            <div
                                key={`zone-${zone.id}`}
                                onClick={() => toggleZone(zone)}
                                className={`
                                    absolute flex items-center justify-center text-base font-semibold rounded-2xl shadow-lg cursor-pointer border-2 transition-all
                                    ${selected ? "ring-4 ring-blue-300 border-blue-400 scale-[1.05] z-10" : "hover:scale-105 border-transparent z-10"}
                                `}
                                style={{
                                    left: zone.x * ZONE_SCALE,
                                    top: zone.y * ZONE_SCALE,
                                    width: zone.width * ZONE_SCALE,
                                    height: zone.height * ZONE_SCALE,
                                    background: bgColor,
                                    color: "#1e293b",
                                    opacity: selected ? 1 : 0.94,
                                    boxShadow: selected ? "0 4px 18px 0 #a5b4fc88" : "0 2px 8px 0 #b4b4d8cc"
                                }}
                                title={`${zone.zoneName} — ${zone.price.toLocaleString("vi-VN")}₫`}
                            >
                                {zone.zoneName}
                            </div>
                        );
                    })}
                    {/* Seats */}
                    {seats.map(seat => {
                        const selected = seatSelections.some(s => s.id === seat.id);
                        const priceKey = `seat|${seat.type}|${seat.price}`;
                        const bgColor = priceColorMap[priceKey] || "#EEE";
                        return (
                            <div
                                key={`seat-${seat.id}`}
                                onClick={() => toggleSeat(seat)}
                                className={`
                                    absolute flex items-center justify-center text-xs font-bold rounded-full border-2 shadow cursor-pointer
                                    transition-all
                                    ${selected ? "ring-4 ring-blue-300 border-blue-400 scale-110 z-20" : "hover:scale-105 border-transparent z-20"}
                                `}
                                style={{
                                    left: seat.x * 1,
                                    top: seat.y * 1,
                                    width: 24,
                                    height: 24,
                                    background: bgColor,
                                    color: "#1e293b",
                                    opacity: selected ? 1 : 0.94,
                                    boxShadow: selected ? "0 2px 10px #a5b4fc66" : "0 1px 5px #8db4e899"
                                }}
                                title={`${seat.seatLabel} — ${seat.price?.toLocaleString("vi-VN") ?? ""}₫`}
                            >
                                {seat.seatLabel}
                            </div>
                        );
                    })}
                </div>
            );
        }
        // Chỉ zones
        if (zones.length > 0) {
            return (
                <div className="relative w-full" style={{ maxWidth: 700, height: 480 }}>
                    {zones.map(zone => {
                        const selected = zoneSelections.some(s => s.zone.id === zone.id);
                        const priceKey = `zone|${zone.type}|${zone.price}`;
                        const bgColor = priceColorMap[priceKey] || "#EEE";
                        return (
                            <div
                                key={`zone-${zone.id}`}
                                onClick={() => toggleZone(zone)}
                                className={`
                                    absolute flex items-center justify-center text-base font-semibold rounded-2xl shadow-lg cursor-pointer border-2 transition-all
                                    ${selected ? "ring-4 ring-blue-300 border-blue-400 scale-[1.05] z-10" : "hover:scale-105 border-transparent z-10"}
                                `}
                                style={{
                                    left: zone.x * ZONE_SCALE,
                                    top: zone.y * ZONE_SCALE,
                                    width: zone.width * ZONE_SCALE,
                                    height: zone.height * ZONE_SCALE,
                                    background: bgColor,
                                    color: "#1e293b",
                                    opacity: selected ? 1 : 0.94,
                                    boxShadow: selected ? "0 4px 18px 0 #a5b4fc88" : "0 2px 8px 0 #b4b4d8cc"
                                }}
                                title={`${zone.zoneName} — ${zone.price.toLocaleString("vi-VN")}₫`}
                            >
                                {zone.zoneName}
                            </div>
                        );
                    })}
                </div>
            );
        }
        // Chỉ seats
        if (seats.length > 0) {
            return (
                <div className="relative w-full" style={{ maxWidth: 700, height: 480 }}>
                    {seats.map(seat => {
                        const selected = seatSelections.some(s => s.id === seat.id);
                        const priceKey = `seat|${seat.type}|${seat.price}`;
                        const bgColor = priceColorMap[priceKey] || "#EEE";
                        return (
                            <div
                                key={`seat-${seat.id}`}
                                onClick={() => toggleSeat(seat)}
                                className={`
                                    absolute flex items-center justify-center text-xs font-bold rounded-full border-2 shadow cursor-pointer
                                    transition-all
                                    ${selected ? "ring-4 ring-blue-300 border-blue-400 scale-110 z-20" : "hover:scale-105 border-transparent z-20"}
                                `}
                                style={{
                                    left: seat.x * 1,
                                    top: seat.y * 1,
                                    width: 24,
                                    height: 24,
                                    background: bgColor,
                                    color: "#1e293b",
                                    opacity: selected ? 1 : 0.94,
                                    boxShadow: selected ? "0 2px 10px #a5b4fc66" : "0 1px 5px #8db4e899"
                                }}
                                title={`${seat.seatLabel} — ${seat.price?.toLocaleString("vi-VN") ?? ""}₫`}
                            >
                                {seat.seatLabel}
                            </div>
                        );
                    })}
                </div>
            );
        }
        // Không có gì
        return <div className="text-sky-300 text-center">Không có dữ liệu sơ đồ</div>;
    };

    return (
        <div className="h-screen w-full bg-[#181e2a] grid grid-cols-3 overflow-hidden">
            {/* LEFT+MIDDLE: Sơ đồ (zone/seat) chiếm 2 cột */}
            <div className="col-span-2 flex flex-col items-center h-full p-4">
                <h3 className="text-sky-200 text-lg text-center mb-4 font-semibold flex items-center justify-center gap-2">
                    <Ticket className="w-6 h-6 text-sky-400" />
                    Chọn khu vực và/hoặc ghế
                </h3>
                <div className="flex justify-center items-start w-full flex-1 gap-12">
                    {renderMap()}
                </div>
                <div className="flex flex-wrap justify-center gap-5 mt-auto mb-2">
                    {priceList.map((p, idx) => (
                        <div
                            key={p.key}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl shadow text-slate-800 text-lg font-semibold"
                            style={{ background: priceColorMap[p.key], border: "2px solid #b4b4d8" }}
                        >
                            <BadgeDollarSign className="w-6 h-6 text-sky-400" />
                            <span>{p.type}: {Number(p.price).toLocaleString("vi-VN")}₫</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* RIGHT: Info + selections */}
            <div
                className="col-span-1 flex flex-col h-full p-0"
                style={{
                    background: "linear-gradient(120deg,rgba(27,34,51,0.98) 55%,rgba(30,39,59,0.98) 120%)",
                    color: "#f5f6fa",
                    borderLeft: "1.5px solid #31375b"
                }}
            >
                <div className="flex-1 overflow-auto p-4 flex flex-col gap-5">
                    {/* Thông tin sự kiện */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-extrabold flex items-center gap-2 text-sky-200 drop-shadow tracking-wide">
                            <Ticket className="w-6 h-6 text-sky-200" />
                            {eventTitle}
                        </h2>
                        <div className="flex items-center gap-2 text-lg text-sky-100">
                            <CalendarClock className="w-5 h-5 text-sky-200" />
                            {startTime ? new Date(startTime).toLocaleString("vi-VN") : ""}
                        </div>
                        <div className="flex items-center gap-2 text-lg text-sky-100">
                            <MapPin className="w-5 h-5 text-sky-200" />
                            {location}
                        </div>
                    </div>
                    {/* Giá */}
                    <div>
                        <h3 className="font-semibold mb-2 text-sky-100 text-sm flex items-center gap-2">
                            <BadgeDollarSign className="w-4 h-4 text-sky-200" />
                            BẢNG GIÁ & MÀU
                        </h3>
                        <ul>
                            {priceList.length === 0 && (
                                <li className="text-gray-400 text-sm">Chưa có dữ liệu giá.</li>
                            )}
                            {priceList.map((p, idx) => (
                                <li key={idx} className="flex items-center space-x-2 text-slate-100 text-sm mb-1 font-semibold">
                                    <span style={{
                                        width: 20,
                                        height: 20,
                                        display: "inline-block",
                                        borderRadius: 5,
                                        background: priceColorMap[p.key],
                                        border: "2px solid #b4b4d8",
                                        marginRight: 8,
                                        boxShadow: "0 0 3px #b4b4d8bb"
                                    }} />
                                    <span>
                                        {p.type}: <b>{Number(p.price).toLocaleString("vi-VN")}₫</b>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Chọn số lượng khu vực */}
                    <div className="space-y-4 flex-1 overflow-auto">
                        {zoneSelections.length > 0 && (
                            <>
                                <div className="text-sky-200 font-bold mb-2">Khu vực đã chọn</div>
                                {zoneSelections.map(sel => (
                                    <div key={sel.zone.id} className="flex items-center justify-between rounded-lg bg-[#21294b] px-3 py-2 shadow">
                                        <span className="font-medium text-sky-100 flex items-center gap-2">
                                            <Users2 className="w-4 h-4" />
                                            {sel.zone.zoneName}
                                        </span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={sel.zone.capacity}
                                            value={sel.qty}
                                            onChange={e => updateQty(sel.zone.id, Number(e.target.value))}
                                            className="w-16 border border-sky-400 rounded p-1 text-center bg-[#171d2b] text-white focus:outline-none focus:border-sky-400"
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                        {seatSelections.length > 0 && (
                            <div className="mt-3">
                                <div className="text-sky-200 font-bold mb-2">Ghế đã chọn</div>
                                {seatSelections.map(seat => (
                                    <div key={seat.id} className="flex justify-between items-center rounded px-3 py-2 bg-[#22294d] mb-2">
                                        <span className="font-medium text-white">{seat.seatLabel}</span>
                                        <span className="text-white font-semibold">{seat.price?.toLocaleString("vi-VN")}₫</span>
                                        <button className="text-pink-300 hover:text-pink-500 font-bold text-sm px-2"
                                                onClick={() => toggleSeat(seat)}>
                                            Xoá
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {zoneSelections.length + seatSelections.length === 0 && (
                            <p className="text-sky-300">Chưa có khu vực hoặc ghế nào được chọn.</p>
                        )}
                    </div>
                </div>
                <div className="p-4 pt-2 border-t border-[#273151] bg-transparent">
                    <button
                        onClick={() => onComplete([
                            ...zoneSelections.map(s => ({
                                type: "zone",
                                zone: s.zone,
                                qty: s.qty,
                                price: s.zone.price,
                                zoneName: s.zone.zoneName,
                            })),
                            ...seatSelections.map(s => ({
                                type: "seat",
                                seatId: s.id,
                                seatLabel: s.seatLabel,
                                price: s.price,
                                qty: 1,
                            }))
                        ])}
                        disabled={zoneSelections.length + seatSelections.length === 0}
                        className="w-full bg-gradient-to-r from-sky-400/90 to-[#1e233a] hover:from-sky-400 hover:to-[#6EE7B7] transition text-white text-lg py-2 rounded-xl font-bold shadow-xl tracking-wider disabled:opacity-50"
                    >
                        Tiếp tục — {total.toLocaleString("vi-VN")}₫
                    </button>
                </div>
            </div>
        </div>
    );
}
