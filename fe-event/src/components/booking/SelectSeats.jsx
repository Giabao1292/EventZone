import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  MapPin,
  CalendarClock,
  Ticket,
  BadgeDollarSign,
  Users2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import apiClient from "../../api/axios";

// Bảng màu được tối ưu cho nền tối
const SOFT_COLORS = [
  "#A5B4FC", // Xanh nhạt
  "#6EE7B7", // Xanh lá nhạt
  "#FECACA", // Hồng nhạt
  "#FDE68A", // Vàng nhạt
  "#D8B4FE", // Tím nhạt
  "#FBCFE8", // Hồng phấn
  "#FCD34D", // Vàng sáng
  "#BAE6FD", // Xanh dương nhạt
  "#FDBA74", // Cam nhạt
  "#A5B4FC", // Lặp lại để đảm bảo đủ màu
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
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState(null);
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

  const fetchVouchers = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/vouchers/me");
      console.log("Raw voucher API response:", data);
      if (data.code === 200) {
        const validVouchers = data.data.redeemedVouchers.filter((voucher) => {
          const now = new Date();
          const validFrom = new Date(voucher.validFrom);
          const validUntil = new Date(voucher.validUntil);
          return now >= validFrom && now <= validUntil && voucher.status === 1;
        });
        console.log("Valid redeemed vouchers:", validVouchers);
        setVouchers(validVouchers);
        const welcomeVoucher = validVouchers.find(
          (v) => v.voucherCode === "WELCOME10"
        );
        if (welcomeVoucher) {
          setSelectedVoucher(welcomeVoucher);
          console.log("Auto-selected Voucher:", welcomeVoucher);
        } else {
          console.log("No WELCOME10 voucher found in valid redeemed vouchers");
        }
      } else {
        setVoucherError("Không thể tải danh sách voucher");
        console.log("Voucher API error:", data.message);
      }
    } catch (err) {
      console.error("Lỗi tải voucher:", err);
      setVoucherError("Không thể tải danh sách voucher");
    }
  }, []);

  useEffect(() => {
    fetchLayout();
    fetchVouchers();
  }, [fetchLayout, fetchVouchers]);

  if (loading) {
    return (
      <div className="min-h-screen  bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-200 text-lg">Đang tải sơ đồ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent  flex items-center justify-center">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-red-500/30 rounded-xl shadow-lg shadow-slate-900/50 p-6 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Có lỗi xảy ra</h3>
            <p className="text-slate-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!layout) return null;

  const { eventTitle, startTime, location, zones = [], seats = [] } = layout;

  const totalBeforeDiscount =
    zoneSelections.reduce((sum, s) => sum + s.zone.price * s.qty, 0) +
    seatSelections.reduce((sum, s) => sum + s.price, 0);
  const total = selectedVoucher
    ? Math.max(0, totalBeforeDiscount - selectedVoucher.discountAmount)
    : totalBeforeDiscount;

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

  const isZoneAvailable = (zone) => {
    const selectedQty = zoneSelections
      .filter((s) => s.zone.id === zone.id)
      .reduce((sum, s) => sum + s.qty, 0);
    return selectedQty < zone.capacity;
  };

  const toggleZone = (zone) => {
    if (!isZoneAvailable(zone)) return;
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
      cur.map((s) => {
        if (s.zone.id === zoneId) {
          const availableQty =
            s.zone.capacity -
            cur
              .filter((sel) => sel.zone.id === zoneId)
              .reduce((sum, sel) => sum + sel.qty, 0) +
            s.qty;
          return { ...s, qty: Math.min(Math.max(1, qty), availableQty) };
        }
        return s;
      })
    );
  };

  const toggleSeat = (seat) => {
    if (!seat.available) return;
    setSeatSelections((cur) => {
      const exists = cur.find((s) => s.id === seat.id);
      if (exists) {
        return cur.filter((s) => s.id !== seat.id);
      } else {
        return [...cur, seat];
      }
    });
  };

  const validateVoucher = (voucher, total) => {
    if (!voucher) {
      console.log("No voucher selected for validation");
      return true;
    }
    const now = new Date();
    const validFrom = new Date(voucher.validFrom);
    const validUntil = new Date(voucher.validUntil);
    console.log("Validating voucher:", {
      voucher,
      total,
      now,
      validFrom,
      validUntil,
    });
    if (now < validFrom || now > validUntil) {
      setVoucherError("Voucher đã hết hạn");
      console.log("Voucher validation failed: Expired");
      return false;
    }
    if (voucher.discountAmount > total) {
      setVoucherError("Giá trị voucher lớn hơn tổng đơn hàng");
      console.log("Voucher validation failed: Discount exceeds total");
      return false;
    }
    console.log("Voucher validation passed");
    return true;
  };

  const handleVoucherChange = (e) => {
    const voucher = vouchers.find(
      (v) => v.voucherId === Number(e.target.value)
    );
    setSelectedVoucher(voucher || null);
    setVoucherError(null);
    console.log("Selected Voucher:", voucher);
  };

  const handleContinue = () => {
    if (
      selectedVoucher &&
      !validateVoucher(selectedVoucher, totalBeforeDiscount)
    ) {
      console.log("Voucher validation failed:", {
        selectedVoucher,
        totalBeforeDiscount,
      });
      return;
    }
    const payload = [
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
      ...(selectedVoucher
        ? [{ type: "voucher", voucherId: selectedVoucher.voucherId }]
        : []),
    ];
    console.log("Payload sent to handleStep1Complete:", payload);
    handleStep1Complete(payload);
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
        <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
          <div className="mb-6 text-center"></div>
          <div
            style={{
              width: containerWidth,
              height: containerHeight,
              overflow: "hidden",
            }}
          >
            <div style={layoutStyle}>
              {zones.map((zone) => {
                const selected = zoneSelections.some(
                  (s) => s.zone.id === zone.id
                );
                const available = isZoneAvailable(zone);
                const priceKey = `zone|${zone.type}|${zone.price}`;
                const bgColor = available
                  ? priceColorMap[priceKey] || "#64748b"
                  : "#374151";

                return (
                  <div
                    key={`zone-${zone.id}`}
                    onClick={() => toggleZone(zone)}
                    className={`
                      absolute flex items-center justify-center text-sm font-semibold rounded-lg shadow-md shadow-slate-900/30 border-2 transition-all cursor-pointer
                      ${
                        selected
                          ? "ring-4 ring-blue-400/50 border-blue-400 scale-105 z-10"
                          : available
                          ? "hover:scale-105 border-transparent hover:shadow-lg hover:shadow-slate-900/50"
                          : "cursor-not-allowed border-gray-600 opacity-60"
                      }
                    `}
                    style={{
                      left: zone.x,
                      top: zone.y,
                      width: zone.width,
                      height: zone.height,
                      background: bgColor,
                      color: available ? "#1e293b" : "#9CA3AF",
                    }}
                    title={
                      available
                        ? `${zone.name} — ${zone.price.toLocaleString(
                            "vi-VN"
                          )}₫ (Còn ${
                            zone.capacity -
                            zoneSelections
                              .filter((s) => s.zone.id === zone.id)
                              .reduce((sum, s) => sum + s.qty, 0)
                          } chỗ)`
                        : `${zone.name} — Khu vực đã đầy`
                    }
                  >
                    {zone.name}
                  </div>
                );
              })}

              {seats.map((seat) => {
                const selected = seatSelections.some((s) => s.id === seat.id);
                const priceKey = `seat|${seat.type}|${seat.price}`;
                const bgColor = seat.available
                  ? priceColorMap[priceKey] || "#64748b"
                  : "#374151";

                return (
                  <div
                    key={`seat-${seat.id}`}
                    onClick={() => toggleSeat(seat)}
                    className={`
                      absolute flex items-center justify-center text-xs font-bold rounded-full border-2 shadow-md shadow-slate-900/30 transition-all
                      ${
                        seat.available
                          ? selected
                            ? "ring-4 ring-blue-400/50 border-blue-400 scale-110 z-20 cursor-pointer"
                            : "hover:scale-105 cursor-pointer border-transparent hover:shadow-lg hover:shadow-slate-900/50"
                          : "cursor-not-allowed border-gray-600 opacity-60"
                      }
                    `}
                    style={{
                      left: seat.x,
                      top: seat.y,
                      width: GRID_SIZE,
                      height: GRID_SIZE,
                      background: bgColor,
                      color: seat.available ? "#1e293b" : "#9CA3AF",
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
        </div>
      );
    }

    return (
      <div className="text-center text-slate-200 bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl p-8 shadow-lg shadow-slate-900/50">
        <Ticket className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <p>Không có dữ liệu sơ đồ</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="grid lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {/* Left Column - Seat Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{eventTitle}</h1>
                <div className="flex items-center gap-6 text-sm text-slate-200 mt-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-blue-400" />
                    {startTime
                      ? new Date(startTime).toLocaleString("vi-VN")
                      : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Map */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-2">
                Sơ đồ chỗ ngồi
              </h2>
              <p className="text-slate-200 text-sm">
                Nhấn vào khu vực hoặc ghế để chọn
              </p>
            </div>
            <div className="flex justify-center">{renderMap()}</div>
          </div>
        </div>

        {/* Right Column - Selection Summary & Price Legend */}
        <div className="space-y-6">
          {/* Price Legend */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BadgeDollarSign className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-bold text-white">Bảng giá</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {priceList.map((p, idx) => (
                <div
                  key={p.key}
                  className="flex items-center gap-3 p-4 rounded-lg border border-slate-600 transition-all hover:border-slate-500 hover:shadow-md hover:shadow-slate-900/50 bg-slate-700/30"
                  style={{
                    backgroundColor: `${priceColorMap[p.key]}15`,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded border-2 shadow-sm"
                    style={{
                      backgroundColor: priceColorMap[p.key],
                      borderColor: priceColorMap[p.key],
                    }}
                  />
                  <div>
                    <div className="font-semibold text-white">{p.type}</div>
                    <div className="text-sm text-slate-200 font-medium">
                      {Number(p.price).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Selections */}
          {zoneSelections.length > 0 && (
            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">
                  Khu vực đã chọn
                </h3>
              </div>
              <div className="space-y-3">
                {zoneSelections.map((sel) => (
                  <div
                    key={sel.zone.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 shadow-md shadow-slate-900/30"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {sel.zone.name}
                      </div>
                      <div className="text-sm text-slate-200">
                        {sel.zone.price.toLocaleString("vi-VN")}₫ / vé
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(sel.zone.id, sel.qty - 1)}
                        disabled={sel.qty <= 1}
                        className="w-8 h-8 rounded-full border border-slate-500 bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-white">
                        {sel.qty}
                      </span>
                      <button
                        onClick={() => updateQty(sel.zone.id, sel.qty + 1)}
                        disabled={sel.qty >= sel.zone.capacity}
                        className="w-8 h-8 rounded-full border border-slate-500 bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seat Selections */}
          {seatSelections.length > 0 && (
            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Ghế đã chọn</h3>
              <div className="space-y-3">
                {seatSelections.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600 shadow-md shadow-slate-900/30"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        Ghế {seat.label}
                      </div>
                      <div className="text-sm text-slate-200">
                        {seat.price?.toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSeat(seat)}
                      className="w-8 h-8 rounded-full text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {zoneSelections.length + seatSelections.length === 0 && (
            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Chưa chọn chỗ ngồi
                </h3>
                <p className="text-sm text-slate-200">
                  Nhấn vào khu vực hoặc ghế trên sơ đồ để chọn
                </p>
              </div>
            </div>
          )}

          {/* Total & Continue Button */}
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-600 rounded-xl shadow-lg shadow-slate-900/50 p-6">
            <div className="space-y-4">
              {/* Voucher Selection */}
              {vouchers.length > 0 && (
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">
                    Chọn Voucher
                  </label>
                  <select
                    value={selectedVoucher?.voucherId || ""}
                    onChange={handleVoucherChange}
                    className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Chọn voucher giảm giá"
                  >
                    <option value="">Không sử dụng voucher</option>
                    {vouchers.map((voucher) => (
                      <option key={voucher.voucherId} value={voucher.voucherId}>
                        {voucher.voucherName} (
                        {voucher.discountAmount.toLocaleString("vi-VN")}₫)
                      </option>
                    ))}
                  </select>
                  {voucherError && (
                    <p className="text-red-400 text-sm mt-2">{voucherError}</p>
                  )}
                </div>
              )}

              {/* Total Price */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-600">
                <span className="text-lg font-semibold text-white">
                  Tổng cộng:
                </span>
                <div className="text-right">
                  {selectedVoucher && (
                    <span className="block text-sm text-slate-200 line-through">
                      {totalBeforeDiscount.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                  <span className="text-2xl font-bold text-blue-400">
                    {total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={zoneSelections.length + seatSelections.length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white py-4 rounded-xl text-lg font-semibold transition-all shadow-md shadow-slate-900/50 hover:shadow-lg hover:shadow-slate-900/70"
              >
                Tiếp tục thanh toán
              </button>

              {zoneSelections.length + seatSelections.length > 0 && (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {zoneSelections.length + seatSelections.length} mục đã chọn
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
