import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  MapPin,
  CalendarClock,
  Ticket,
  BadgeDollarSign,
  Users2,
} from "lucide-react";
import apiClient from "../../api/axios";

const SOFT_COLORS = [
  "#A5B4FC",
  "#6EE7B7",
  "#FECACA",
  "#FDE68A",
  "#C7D2FE",
  "#FBCFE8",
  "#FCD34D",
  "#E0E7FF",
  "#FDBA74",
  "#BFDBFE",
];

const GRID_SIZE = 30;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function SelectSeats() {
  const { event, showing, showingId, handleStep1Complete } = useOutletContext();
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoneSelections, setZoneSelections] = useState([]);
  const [seatSelections, setSeatSelections] = useState([]);
  const isLayoutLoaded = useRef(false);

  const fetchLayout = useCallback(async () => {
    if (isLayoutLoaded.current) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await apiClient.get(
        `/events/showing-times/${showingId}/layout`
      );
      setLayout({
        eventTitle: event?.title || data.data.eventTitle,
        startTime: showing?.startTime || data.data.startTime,
        location: event?.location || data.data.location,
        zones: data.data.zones.map((z) => ({
          ...z,
          name: z.name || z.zoneName,
        })),
        seats: data.data.seats.map((s) => ({
          ...s,
          label: s.label || s.seatLabel,
        })),
      });
      isLayoutLoaded.current = true;
    } catch (err) {
      console.error("Lỗi tải sơ đồ:", err);
      setError("Không thể tải sơ đồ");
    } finally {
      setLoading(false);
    }
  }, [showingId, event, showing]);

  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  if (loading)
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-2xl text-slate-200 bg-gradient-to-br from-[#1c2030] via-[#1e2237] to-[#23233a] animate-pulse">
        Đang tải sơ đồ…
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!layout) return null;

  const { eventTitle, startTime, location, zones = [], seats = [] } = layout;

  const total =
    zoneSelections.reduce((sum, s) => sum + s.zone.price * s.qty, 0) +
    seatSelections.reduce((sum, s) => sum + s.price, 0);

  const priceList = [
    ...zones.map((z) => ({
      type: z.type,
      price: z.price,
      key: `zone|${z.type}|${z.price}`,
    })),
    ...seats.map((s) => ({
      type: s.type,
      price: s.price,
      key: `seat|${s.type}|${s.price}`,
    })),
  ]
    .filter((item) => item.price)
    .reduce((acc, cur) => {
      if (!acc.some((i) => i.key === cur.key)) acc.push(cur);
      return acc;
    }, []);

  const priceColorMap = Object.fromEntries(
    priceList.map((item, idx) => [
      item.key,
      SOFT_COLORS[idx % SOFT_COLORS.length],
    ])
  );

  const toggleZone = (zone) => {
    setZoneSelections((cur) => {
      const exists = cur.find((s) => s.zone.id === zone.id);
      if (exists) {
        return cur.filter((s) => s.zone.id !== zone.id);
      } else {
        return [...cur, { zone, qty: 1 }];
      }
    });
  };

  const updateQty = (zoneId, qty) => {
    setZoneSelections((cur) =>
      cur.map((s) =>
        s.zone.id === zoneId
          ? { ...s, qty: Math.min(Math.max(1, qty), s.zone.capacity) }
          : s
      )
    );
  };

  const toggleSeat = (seat) => {
    if (!seat.available) return; // Prevent selection of unavailable seats
    setSeatSelections((cur) => {
      const exists = cur.find((s) => s.id === seat.id);
      if (exists) {
        return cur.filter((s) => s.id !== seat.id);
      } else {
        return [...cur, seat];
      }
    });
  };

  const renderMap = () => {
    const containerWidth = 700;
    const containerHeight = 480;
    const scale = Math.min(
      containerWidth / CANVAS_WIDTH,
      containerHeight / CANVAS_HEIGHT
    );

    const layoutStyle = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      position: "relative",
    };

    if (zones.length > 0 || seats.length > 0) {
      return (
        <div style={{ width: containerWidth, height: containerHeight }}>
          <div style={layoutStyle}>
            {zones.map((zone) => {
              const selected = zoneSelections.some(
                (s) => s.zone.id === zone.id
              );
              const priceKey = `zone|${zone.type}|${zone.price}`;
              const bgColor = priceColorMap[priceKey] || "#EEE";
              return (
                <div
                  key={`zone-${zone.id}`}
                  onClick={() => toggleZone(zone)}
                  className={`
                    absolute flex items-center justify-center text-base font-semibold rounded-2xl shadow-lg cursor-pointer border-2 transition-all
                    ${
                      selected
                        ? "ring-4 ring-blue-300 border-blue-400 scale-[1.05] z-10"
                        : "hover:scale-105 border-transparent z-10"
                    }
                  `}
                  style={{
                    left: zone.x,
                    top: zone.y,
                    width: zone.width,
                    height: zone.height,
                    background: bgColor,
                    color: "#1e293b",
                    opacity: selected ? 1 : 0.94,
                    boxShadow: selected
                      ? "0 4px 18px 0 #a5b4fc88"
                      : "0 2px 8px 0 #b4b4d8cc",
                  }}
                  title={`${zone.name} — ${zone.price.toLocaleString(
                    "vi-VN"
                  )}₫`}
                >
                  {zone.name}
                </div>
              );
            })}
            {seats.map((seat) => {
              const selected = seatSelections.some((s) => s.id === seat.id);
              const priceKey = `seat|${seat.type}|${seat.price}`;
              const bgColor = seat.available
                ? priceColorMap[priceKey] || "#EEE"
                : "#6B7280"; // Gray for unavailable
              return (
                <div
                  key={`seat-${seat.id}`}
                  onClick={() => toggleSeat(seat)}
                  className={`
                    absolute flex items-center justify-center text-xs font-bold rounded-full border-2 shadow transition-all
                    ${
                      seat.available
                        ? selected
                          ? "ring-4 ring-blue-300 border-blue-400 scale-110 z-20"
                          : "hover:scale-105 cursor-pointer border-transparent z-20"
                        : "cursor-not-allowed border-gray-500 z-10 opacity-70"
                    }
                  `}
                  style={{
                    left: seat.x,
                    top: seat.y,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                    background: bgColor,
                    color: seat.available ? "#1e293b" : "#D1D5DB",
                    boxShadow: selected
                      ? "0 2px 10px #a5b4fc66"
                      : "0 1px 5px #8db4e899",
                  }}
                  title={
                    seat.available
                      ? `${seat.label} — ${seat.price?.toLocaleString(
                          "vi-VN"
                        )}₫`
                      : `${seat.label} — Ghế đã được đặt`
                  }
                >
                  {seat.label}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div className="text-sky-300 text-center">Không có dữ liệu sơ đồ</div>
    );
  };

  return (
    <div className="h-screen w-full bg-[#181e2a] grid grid-cols-3 overflow-hidden">
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
              style={{
                background: priceColorMap[p.key],
                border: "2px solid #b4b4d8",
              }}
            >
              <BadgeDollarSign className="w-6 h-6 text-sky-400" />
              <span>
                {p.type}: {Number(p.price).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="col-span-1 flex flex-col h-full p-0"
        style={{
          background:
            "linear-gradient(120deg,rgba(27,34,51,0.98) 55%,rgba(30,39,59,0.98) 120%)",
          color: "#f5f6fa",
          borderLeft: "1.5px solid #31375b",
        }}
      >
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-5">
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
                <li
                  key={idx}
                  className="flex items-center space-x-2 text-slate-100 text-sm mb-1 font-semibold"
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      display: "inline-block",
                      borderRadius: 5,
                      background: priceColorMap[p.key],
                      border: "2px solid #b4b4d8",
                      marginRight: 8,
                      boxShadow: "0 0 3px #b4b4d8bb",
                    }}
                  />
                  <span>
                    {p.type}: <b>{Number(p.price).toLocaleString("vi-VN")}₫</b>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 flex-1 overflow-auto">
            {zoneSelections.length > 0 && (
              <>
                <div className="text-sky-200 font-bold mb-2">
                  Khu vực đã chọn
                </div>
                {zoneSelections.map((sel) => (
                  <div
                    key={sel.zone.id}
                    className="flex items-center justify-between rounded-lg bg-[#21294b] px-3 py-2 shadow"
                  >
                    <span className="font-medium text-sky-100 flex items-center gap-2">
                      <Users2 className="w-4 h-4" />
                      {sel.zone.name}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={sel.zone.capacity}
                      value={sel.qty}
                      onChange={(e) =>
                        updateQty(sel.zone.id, Number(e.target.value))
                      }
                      className="w-16 border border-sky-400 rounded p-1 text-center bg-[#171d2b] text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                ))}
              </>
            )}
            {seatSelections.length > 0 && (
              <div className="mt-3">
                <div className="text-sky-200 font-bold mb-2">Ghế đã chọn</div>
                {seatSelections.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex justify-between items-center rounded px-3 py-2 bg-[#22294d] mb-2"
                  >
                    <span className="font-medium text-white">{seat.label}</span>
                    <span className="text-white font-semibold">
                      {seat.price?.toLocaleString("vi-VN")}₫
                    </span>
                    <button
                      className="text-pink-300 hover:text-pink-500 font-bold text-sm px-2"
                      onClick={() => toggleSeat(seat)}
                    >
                      Xoá
                    </button>
                  </div>
                ))}
              </div>
            )}
            {zoneSelections.length + seatSelections.length === 0 && (
              <p className="text-sky-300">
                Chưa có khu vực hoặc ghế nào được chọn.
              </p>
            )}
          </div>
        </div>
        <div className="p-4 pt-2 border-t border-[#273151] bg-transparent">
          <button
            onClick={() =>
              handleStep1Complete([
                ...zoneSelections.map((s) => ({
                  type: "zone",
                  zoneId: s.zone.id,
                  qty: s.qty,
                  price: s.zone.price,
                  zoneName: s.zone.name,
                })),
                ...seatSelections.map((s) => ({
                  type: "seat",
                  seatId: s.id,
                  seatLabel: s.label,
                  price: s.price,
                  qty: 1,
                })),
              ])
            }
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
