import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Rnd } from "react-rnd";
import {
  Save,
  Plus,
  Grid3x3,
  Square,
  Trash2,
  ZoomIn,
  ZoomOut,
  Edit,
  Users,
} from "lucide-react";
import { saveShowingLayout } from "../../../services/layoutService";

const GRID_SIZE = 30;

const DEFAULT_SEAT_TYPES = [
  { name: "VIP", color: "bg-amber-500", price: 120000, capacity: 1 },
  { name: "Standard", color: "bg-emerald-500", price: 80000, capacity: 1 },
  { name: "Premium", color: "bg-purple-500", price: 150000, capacity: 1 },
];

const COLOR_OPTIONS = [
  { value: "bg-red-500", label: "Đỏ" },
  { value: "bg-blue-500", label: "Xanh dương" },
  { value: "bg-green-500", label: "Xanh lá" },
  { value: "bg-yellow-500", label: "Vàng" },
  { value: "bg-purple-500", label: "Tím" },
  { value: "bg-pink-500", label: "Hồng" },
  { value: "bg-amber-500", label: "Cam" },
  { value: "bg-emerald-500", label: "Ngọc lục bảo" },
];

export default function LayoutDesigner({ onSave }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showingTimeId] = useState(location.pathname.split("/").pop());
  const [layoutMode, setLayoutMode] = useState(
    location.state?.layoutMode || "both"
  );
  const [eventId] = useState(location.state?.eventId);

  const [seats, setSeats] = useState([]);
  const [zones, setZones] = useState([]);
  const [currentType, setCurrentType] = useState(DEFAULT_SEAT_TYPES[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [quickAddCount, setQuickAddCount] = useState(1);
  const [quickAddName, setQuickAddName] = useState("");
  const [quickAddCapacity, setQuickAddCapacity] = useState(1);
  const [seatTypes, setSeatTypes] = useState(DEFAULT_SEAT_TYPES);
  const [newSeatType, setNewSeatType] = useState({
    name: "",
    color: "bg-emerald-500",
    price: 80000,
    capacity: 1,
  });
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperties, setEditingProperties] = useState({});

  useEffect(() => {
    setSeats([]);
    setZones([]);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded text-white font-medium z-50 ${
      type === "success"
        ? "bg-green-500"
        : type === "warning"
        ? "bg-yellow-500"
        : "bg-red-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const quickAddSeats = () => {
    if (!quickAddName.trim()) {
      showToast("Vui lòng nhập tên ghế!", "warning");
      return;
    }

    let newSeats = [];
    const startX = GRID_SIZE;
    const startY = GRID_SIZE;

    for (let i = 0; i < quickAddCount; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;

      newSeats.push({
        id: Date.now() + i,
        x: startX + col * GRID_SIZE * 1.2,
        y: startY + row * GRID_SIZE * 1.2,
        label: quickAddName + (quickAddCount > 1 ? ` ${i + 1}` : ""),
        type: currentType.name,
        price: currentType.price,
        capacity: quickAddCapacity || currentType.capacity,
      });
    }
    setSeats((prev) => [...prev, ...newSeats]);
    showToast(`Đã thêm ${quickAddCount} ghế!`, "success");
    setQuickAddName("");
  };

  const addZone = () => {
    if (!quickAddName.trim()) {
      showToast("Vui lòng nhập tên khu vực!", "warning");
      return;
    }

    const newZone = {
      id: Date.now(),
      x: GRID_SIZE,
      y: GRID_SIZE,
      width: 4 * GRID_SIZE,
      height: 3 * GRID_SIZE,
      name: quickAddName,
      type: currentType.name,
      price: currentType.price,
      capacity: quickAddCapacity || currentType.capacity,
    };
    setZones((prev) => [...prev, newZone]);
    showToast(`Đã thêm khu vực "${quickAddName}"!`, "success");
    setQuickAddName("");
  };

  const deleteSelected = () => {
    if (selectedItems.length === 0) return;
    setSeats((prev) =>
      prev.filter((s) => !selectedItems.includes(`seat-${s.id}`))
    );
    setZones((prev) =>
      prev.filter((z) => !selectedItems.includes(`zone-${z.id}`))
    );
    setSelectedItems([]);
    showToast("Đã xóa!", "success");
  };

  const openEditModal = (item, type) => {
    setEditingItem({ ...item, itemType: type });
    setEditingProperties({
      label: type === "seat" ? item.label : item.name,
      price: item.price,
      capacity: item.capacity,
      type: item.type,
    });
    setShowEditModal(true);
  };

  const saveItemProperties = () => {
    if (!editingItem) return;

    if (editingItem.itemType === "seat") {
      setSeats((prev) =>
        prev.map((seat) =>
          seat.id === editingItem.id
            ? {
                ...seat,
                label: editingProperties.label,
                price: editingProperties.price,
                capacity: editingProperties.capacity,
                type: editingProperties.type,
              }
            : seat
        )
      );
    } else {
      setZones((prev) =>
        prev.map((zone) =>
          zone.id === editingItem.id
            ? {
                ...zone,
                name: editingProperties.label,
                price: editingProperties.price,
                capacity: editingProperties.capacity,
                type: editingProperties.type,
              }
            : zone
        )
      );
    }

    setShowEditModal(false);
    setEditingItem(null);
    showToast("Đã cập nhật thành công!", "success");
  };

  const handleSave = async () => {
    const format = {
      showing_time_id: showingTimeId,
      layout_mode: layoutMode,
      seats: seats.map((s) => ({
        id: s.id,
        label: s.label,
        x: Math.round(s.x / GRID_SIZE),
        y: Math.round(s.y / GRID_SIZE),
        type: s.type,
        price: s.price,
        capacity: s.capacity,
      })),
      zones: zones.map((z) => ({
        id: z.id,
        name: z.name,
        x: Math.round(z.x / GRID_SIZE),
        y: Math.round(z.y / GRID_SIZE),
        width: Math.round(z.width / GRID_SIZE),
        height: Math.round(z.height / GRID_SIZE),
        type: z.type,
        price: z.price,
        capacity: z.capacity,
      })),
    };

    try {
      await saveShowingLayout(format);
      showToast("Đã lưu thành công!", "success");
      console.log("layout:", eventId);
      navigate("/organizer/create-event", {
        state: {
          returnStep: 3,
          eventData: {
            ...location.state?.eventData,
            hasDesignedLayout: true,
            id: eventId,
          },
        },
      });
    } catch (error) {
      showToast(error.message, "error");
    }

    if (onSave) onSave(format);
  };

  const addNewSeatType = () => {
    if (!newSeatType.name.trim()) {
      showToast("Vui lòng nhập tên loại!", "warning");
      return;
    }

    const newType = {
      name: newSeatType.name,
      color: newSeatType.color,
      price: newSeatType.price,
      capacity: newSeatType.capacity,
    };

    setSeatTypes((prev) => [...prev, newType]);
    setCurrentType(newType);
    setShowAddTypeModal(false);
    setNewSeatType({
      name: "",
      color: "bg-emerald-500",
      price: 80000,
      capacity: 1,
    });
    showToast(`Đã thêm loại "${newSeatType.name}"!`, "success");
  };

  const getSeatTypeData = (typeName) => {
    return seatTypes.find((t) => t.name === typeName) || seatTypes[0];
  };

  const renderSeat = (seat) => {
    const typeData = getSeatTypeData(seat.type);
    const isSelected = selectedItems.includes(`seat-${seat.id}`);

    return (
      <Rnd
        key={seat.id}
        bounds="parent"
        size={{ width: GRID_SIZE, height: GRID_SIZE }}
        position={{ x: seat.x, y: seat.y }}
        onDragStop={(e, d) => {
          setSeats((prev) =>
            prev.map((s) => (s.id === seat.id ? { ...s, x: d.x, y: d.y } : s))
          );
        }}
        enableResizing={false}
        dragGrid={[GRID_SIZE, GRID_SIZE]}
      >
        <div
          className={`${
            typeData.color
          } text-xs font-bold flex flex-col items-center justify-center rounded shadow cursor-pointer select-none transition-all hover:scale-110 relative ${
            isSelected ? "ring-2 ring-yellow-400" : ""
          }`}
          style={{ width: "100%", height: "100%" }}
          onClick={() => {
            const itemId = `seat-${seat.id}`;
            setSelectedItems((prev) =>
              prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
            );
          }}
          onDoubleClick={() => openEditModal(seat, "seat")}
        >
          <div className="text-[8px] font-bold">{seat.label}</div>
          <div className="text-[6px]">{formatPrice(seat.price)}</div>
          {seat.capacity > 1 && (
            <div className="text-[6px] flex items-center gap-0.5">
              <Users size={6} />
              {seat.capacity}
            </div>
          )}

          {/* Edit button */}
          <button
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(seat, "seat");
            }}
          >
            <Edit size={8} className="text-white" />
          </button>
        </div>
      </Rnd>
    );
  };

  const renderZone = (zone) => {
    const typeData = getSeatTypeData(zone.type);
    const isSelected = selectedItems.includes(`zone-${zone.id}`);

    return (
      <Rnd
        key={zone.id}
        bounds="parent"
        size={{ width: zone.width, height: zone.height }}
        position={{ x: zone.x, y: zone.y }}
        onDragStop={(e, d) => {
          setZones((prev) =>
            prev.map((z) => (z.id === zone.id ? { ...z, x: d.x, y: d.y } : z))
          );
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setZones((prev) =>
            prev.map((z) =>
              z.id === zone.id
                ? {
                    ...z,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                  }
                : z
            )
          );
        }}
        dragGrid={[GRID_SIZE, GRID_SIZE]}
        resizeGrid={[GRID_SIZE, GRID_SIZE]}
      >
        <div
          className={`${
            typeData.color
          } bg-opacity-80 text-white rounded shadow w-full h-full p-2 select-none flex flex-col justify-center cursor-pointer transition-all hover:bg-opacity-90 relative ${
            isSelected ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => {
            const itemId = `zone-${zone.id}`;
            setSelectedItems((prev) =>
              prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
            );
          }}
          onDoubleClick={() => openEditModal(zone, "zone")}
        >
          <div className="text-center">
            <div className="font-bold text-xs">{zone.name}</div>
            <div className="text-[10px] mt-1">{formatPrice(zone.price)}</div>
            <div className="text-[10px] flex items-center justify-center gap-1">
              <Users size={10} />
              {zone.capacity}
            </div>
          </div>

          {/* Edit button */}
          <button
            className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(zone, "zone");
            }}
          >
            <Edit size={10} className="text-white" />
          </button>
        </div>
      </Rnd>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Layout Designer</h1>
            <p className="text-slate-400 text-sm">
              Suất chiếu #{showingTimeId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm px-2 py-1 bg-slate-700 rounded">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-3 py-2 rounded font-medium"
            >
              <Save size={16} />
              Lưu
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          {/* Mode Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Chế độ</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { value: "seat", label: "Ghế" },
                { value: "zone", label: "Khu" },
                { value: "both", label: "Cả hai" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setLayoutMode(mode.value)}
                  className={`p-2 rounded text-xs font-medium ${
                    layoutMode === mode.value
                      ? "bg-blue-500 text-white"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Types */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Loại ghế</label>
              <button
                onClick={() => setShowAddTypeModal(true)}
                className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
              >
                + Thêm
              </button>
            </div>
            <div className="space-y-1">
              {seatTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentType(type)}
                  className={`w-full p-2 rounded text-left text-xs ${
                    currentType?.name === type.name
                      ? `${type.color} text-white`
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{type.name}</span>
                    <div className="text-right">
                      <div>{formatPrice(type.price)}</div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <Users size={8} />
                        {type.capacity}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Add */}
          <div className="mb-4 p-3 bg-slate-700 rounded">
            <h3 className="font-medium mb-2 text-sm">Thêm nhanh</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder={layoutMode === "zone" ? "Tên khu vực" : "Tên ghế"}
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm"
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Số lượng"
                  className="flex-1 p-2 bg-slate-800 border border-slate-600 rounded text-sm"
                  value={quickAddCount}
                  onChange={(e) => setQuickAddCount(Number(e.target.value))}
                />
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={999}
                    placeholder="Sức chứa"
                    className="w-16 p-2 bg-slate-800 border border-slate-600 rounded text-sm"
                    value={quickAddCapacity}
                    onChange={(e) =>
                      setQuickAddCapacity(Number(e.target.value) || 1)
                    }
                  />
                </div>
              </div>
              <div className="flex gap-1">
                {(layoutMode === "seat" || layoutMode === "both") && (
                  <button
                    onClick={quickAddSeats}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 px-2 py-2 rounded text-xs"
                  >
                    <Plus size={12} />
                    Ghế
                  </button>
                )}
                {(layoutMode === "zone" || layoutMode === "both") && (
                  <button
                    onClick={addZone}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 px-2 py-2 rounded text-xs"
                  >
                    <Square size={12} />
                    Khu
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Công cụ</label>
            <div className="space-y-1">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`w-full p-2 rounded text-left text-xs flex items-center gap-2 ${
                  showGrid
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                <Grid3x3 size={14} />
                Lưới
              </button>
              {selectedItems.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="w-full p-2 rounded text-left text-xs flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 size={14} />
                  Xóa ({selectedItems.length})
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="p-3 bg-slate-700 rounded">
            <h3 className="font-medium mb-2 text-sm">Thống kê</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Ghế:</span>
                <span>{seats.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Khu vực:</span>
                <span>{zones.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng sức chứa:</span>
                <span>
                  {seats.reduce((sum, seat) => sum + seat.capacity, 0) +
                    zones.reduce((sum, zone) => sum + zone.capacity, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <div className="relative bg-slate-800 border border-slate-600 rounded overflow-hidden h-full">
            {/* Grid */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #475569 1px, transparent 1px),
                    linear-gradient(to bottom, #475569 1px, transparent 1px)
                  `,
                  backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "0 0",
                }}
              />
            )}

            <div
              className="relative"
              style={{
                width: 800,
                height: 600,
                transform: `scale(${zoom})`,
                transformOrigin: "0 0",
              }}
            >
              {(layoutMode === "seat" || layoutMode === "both") &&
                seats.map(renderSeat)}
              {(layoutMode === "zone" || layoutMode === "both") &&
                zones.map(renderZone)}
            </div>
          </div>
        </div>
      </div>

      {/* Add Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded p-4 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Thêm loại mới</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên loại"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={newSeatType.name}
                onChange={(e) =>
                  setNewSeatType({ ...newSeatType, name: e.target.value })
                }
              />
              <select
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={newSeatType.color}
                onChange={(e) =>
                  setNewSeatType({ ...newSeatType, color: e.target.value })
                }
              >
                {COLOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Giá vé"
                min="10000"
                step="10000"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={newSeatType.price}
                onChange={(e) =>
                  setNewSeatType({
                    ...newSeatType,
                    price: parseInt(e.target.value) || 0,
                  })
                }
              />
              <input
                type="number"
                placeholder="Sức chứa"
                min="1"
                max="999"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={newSeatType.capacity}
                onChange={(e) =>
                  setNewSeatType({
                    ...newSeatType,
                    capacity: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddTypeModal(false)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded"
              >
                Hủy
              </button>
              <button
                onClick={addNewSeatType}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Properties Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded p-4 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">
              Chỉnh sửa {editingItem.itemType === "seat" ? "ghế" : "khu vực"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={
                  editingItem.itemType === "seat" ? "Tên ghế" : "Tên khu vực"
                }
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={editingProperties.label || ""}
                onChange={(e) =>
                  setEditingProperties({
                    ...editingProperties,
                    label: e.target.value,
                  })
                }
              />
              <select
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={editingProperties.type}
                onChange={(e) =>
                  setEditingProperties({
                    ...editingProperties,
                    type: e.target.value,
                  })
                }
              >
                {seatTypes.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Giá vé"
                min="10000"
                step="10000"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                value={editingProperties.price || 0}
                onChange={(e) =>
                  setEditingProperties({
                    ...editingProperties,
                    price: parseInt(e.target.value) || 0,
                  })
                }
              />
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <input
                  type="number"
                  placeholder="Sức chứa"
                  min="1"
                  max="999"
                  className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded"
                  value={editingProperties.capacity || 1}
                  onChange={(e) =>
                    setEditingProperties({
                      ...editingProperties,
                      capacity: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded"
              >
                Hủy
              </button>
              <button
                onClick={saveItemProperties}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
