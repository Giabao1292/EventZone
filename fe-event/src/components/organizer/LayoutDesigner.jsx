"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  Brain,
} from "lucide-react";
import {
  saveShowingLayout,
  getLayoutByShowingTime,
  generateAILayout,
} from "../../services/layoutService";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const GRID_SIZE = 30; // Khôi phục lại kích thước cũ
const SEAT_SIZE = 30; // Kích thước ghế như cũ
const ZONE_MIN_SIZE = 90; // Kích thước tối thiểu cho zone

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
  console.log("LayoutDesigner component rendered");

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { eventId: urlEventId } = params; // Lấy eventId từ URL params
  const eventId =
    location.state?.eventId || location.state?.eventData?.id || urlEventId;
  const [showingTimeId, setShowingTimeId] = useState(null);
  const [layoutMode, setLayoutMode] = useState(
    location.state?.layoutMode || "both"
  );
  const [seats, setSeats] = useState([]);
  const [zones, setZones] = useState([]);
  const [currentType, setCurrentType] = useState(DEFAULT_SEAT_TYPES[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [zoom, setZoom] = useState(1); // Khôi phục zoom mặc định
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
  const [aiContent, setAiContent] = useState("");
  const [showAIContentModal, setShowAIContentModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);

  // Canvas dimensions - cố định như cũ
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    console.log("Location State:", location.state);
    console.log("URL EventId:", urlEventId);
    console.log("Final EventId:", eventId);
    console.log("Is Edit Mode:", location.state?.isEdit);
    console.log("Current Pathname:", location.pathname);
    console.log("URL Params:", params);

    // Chỉ kiểm tra eventId nếu không phải edit mode
    if (!eventId && !location.state?.isEdit) {
      alert("Không xác định được sự kiện! Bạn cần tạo sự kiện trước.");
      navigate("/organizer/create-event");
    }
  }, [eventId, navigate, urlEventId, location.state?.isEdit]);

  useEffect(() => {
    const id =
      location.state?.showingTimeId || location.pathname.split("/").pop();
    console.log("Pathname:", location.pathname);
    console.log("ShowingTimeId from state:", location.state?.showingTimeId);
    console.log("ShowingTimeId from URL:", id);
    if (!id || id === "undefined" || isNaN(Number(id))) {
      alert("Không xác định được suất chiếu (showingTimeId)!");
      navigate("/organizer");
      return;
    }
    setShowingTimeId(Number(id));
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!showingTimeId) return;
    (async () => {
      try {
        const layout = await getLayoutByShowingTime(showingTimeId);
        if (layout) {
          setSeats(layout.seats || []);
          setZones(layout.zones || []);
          if (layout.layout_mode) setLayoutMode(layout.layout_mode);
        }
      } catch (error) {
        console.error("Lỗi khi lấy layout cũ:", error);
      }
    })();
  }, [showingTimeId]);

  // Collision detection function - cải tiến
  const checkCollision = useCallback(
    (newItem, existingItems, itemType, excludeId = null) => {
      const buffer = 5; // Khoảng cách tối thiểu giữa các items

      return existingItems.some((item) => {
        if (item.id === newItem.id || item.id === excludeId) return false;

        const itemWidth =
          itemType === "seat" ? SEAT_SIZE : item.width || ZONE_MIN_SIZE;
        const itemHeight =
          itemType === "seat" ? SEAT_SIZE : item.height || ZONE_MIN_SIZE;
        const newItemWidth =
          itemType === "seat" ? SEAT_SIZE : newItem.width || ZONE_MIN_SIZE;
        const newItemHeight =
          itemType === "seat" ? SEAT_SIZE : newItem.height || ZONE_MIN_SIZE;

        return !(
          newItem.x + newItemWidth + buffer <= item.x ||
          item.x + itemWidth + buffer <= newItem.x ||
          newItem.y + newItemHeight + buffer <= item.y ||
          item.y + itemHeight + buffer <= newItem.y
        );
      });
    },
    []
  );

  // Snap to grid function
  const snapToGrid = useCallback((value) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, []);

  // Find next available position - cải tiến
  const findAvailablePosition = useCallback(
    (startX, startY, itemType) => {
      const allItems = [...seats, ...zones];
      const x = Math.max(0, snapToGrid(startX));
      const y = Math.max(0, snapToGrid(startY));

      const testItem = {
        x,
        y,
        width: itemType === "seat" ? SEAT_SIZE : ZONE_MIN_SIZE,
        height: itemType === "seat" ? SEAT_SIZE : ZONE_MIN_SIZE,
      };

      // Kiểm tra vị trí ban đầu
      if (!checkCollision(testItem, allItems, itemType)) {
        return { x, y };
      }

      // Tìm vị trí khả dụng theo pattern lưới
      for (let row = 0; row < Math.floor(canvasHeight / GRID_SIZE); row++) {
        for (let col = 0; col < Math.floor(canvasWidth / GRID_SIZE); col++) {
          const testX = col * GRID_SIZE;
          const testY = row * GRID_SIZE;

          if (
            testX + SEAT_SIZE <= canvasWidth &&
            testY + SEAT_SIZE <= canvasHeight
          ) {
            testItem.x = testX;
            testItem.y = testY;

            if (!checkCollision(testItem, allItems, itemType)) {
              return { x: testX, y: testY };
            }
          }
        }
      }

      return { x: snapToGrid(startX), y: snapToGrid(startY) };
    },
    [seats, zones, checkCollision, snapToGrid, canvasWidth, canvasHeight]
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const showToast = useCallback((message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "warning") {
      toast.warning(message);
    } else {
      toast.error(message);
    }
  }, []);

  const quickAddSeats = useCallback(() => {
    if (!quickAddName.trim())
      return showToast("Vui lòng nhập tên ghế!", "warning");

    const newSeats = [];
    let startX = GRID_SIZE;
    let startY = GRID_SIZE;

    for (let i = 0; i < quickAddCount; i++) {
      const position = findAvailablePosition(startX, startY, "seat");

      newSeats.push({
        id: "s-" + Date.now() + Math.random(),
        x: position.x,
        y: position.y,
        label: quickAddName + (quickAddCount > 1 ? ` ${i + 1}` : ""),
        type: currentType.name,
        price: currentType.price,
        capacity: quickAddCapacity || currentType.capacity,
      });

      // Update start position for next seat
      startX = position.x + GRID_SIZE * 1.5;
      if (startX > canvasWidth - SEAT_SIZE) {
        startX = GRID_SIZE;
        startY = position.y + GRID_SIZE * 1.5;
      }
    }

    setSeats((prev) => [...prev, ...newSeats]);
    showToast(`Đã thêm ${quickAddCount} ghế!`, "success");
    setQuickAddName("");
  }, [
    quickAddName,
    quickAddCount,
    currentType,
    quickAddCapacity,
    findAvailablePosition,
    showToast,
    canvasWidth,
  ]);

  const addZone = useCallback(() => {
    if (!quickAddName.trim())
      return showToast("Vui lòng nhập tên khu vực!", "warning");

    const position = findAvailablePosition(0, 0, "zone");

    setZones((prev) => [
      ...prev,
      {
        id: "z-" + Date.now() + Math.random(),
        x: position.x,
        y: position.y,
        width: ZONE_MIN_SIZE * 2,
        height: ZONE_MIN_SIZE,
        name: quickAddName,
        type: currentType.name,
        price: currentType.price,
        capacity: quickAddCapacity || currentType.capacity,
      },
    ]);
    showToast(`Đã thêm khu vực "${quickAddName}"!`, "success");
    setQuickAddName("");
  }, [
    quickAddName,
    currentType,
    quickAddCapacity,
    findAvailablePosition,
    showToast,
  ]);

  const deleteSelected = useCallback(() => {
    setSeats((prev) =>
      prev.filter((s) => !selectedItems.includes(`seat-${s.id}`))
    );
    setZones((prev) =>
      prev.filter((z) => !selectedItems.includes(`zone-${z.id}`))
    );
    setSelectedItems([]);
    showToast("Đã xóa!", "success");
  }, [selectedItems, showToast]);

  const openEditModal = useCallback((item, type) => {
    setEditingItem({ ...item, itemType: type });
    setEditingProperties({
      label: type === "seat" ? item.label : item.name,
      price: item.price,
      capacity: item.capacity,
      type: item.type,
    });
    setShowEditModal(true);
  }, []);

  const saveItemProperties = useCallback(() => {
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
  }, [editingItem, editingProperties, showToast]);

  const getSeatTypeData = useCallback(
    (typeName) => seatTypes.find((t) => t.name === typeName) || seatTypes[0],
    [seatTypes]
  );

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) {
      showToast("Vui lòng nhập prompt cho AI!", "warning");
      return;
    }

    try {
      setIsAILoading(true);
      const aiResponse = await generateAILayout(aiPrompt);
      console.log("AI Response in handleAIGenerate:", aiResponse);

      if (!aiResponse) {
        throw new Error("Không nhận được phản hồi từ AI");
      }

      setAiContent(aiResponse.content || "Không có nội dung từ AI.");
      setShowAIContentModal(true);

      if (aiResponse.seats) {
        setSeats(aiResponse.seats);
      }
      if (aiResponse.seatTypes) {
        setSeatTypes(aiResponse.seatTypes);
      }

      showToast("Đã tạo layout từ AI!", "success");
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes("timeout")) {
        errorMessage = "Yêu cầu AI mất quá lâu để xử lý. Vui lòng thử lại sau.";
      } else if (error.message.includes("Network Error")) {
        errorMessage =
          "Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra kết nối mạng hoặc trạng thái máy chủ.";
      } else if (
        error.message.includes("Phản hồi từ API không chứa dữ liệu hợp lệ")
      ) {
        errorMessage =
          "Phản hồi từ AI không hợp lệ. Vui lòng kiểm tra cấu hình máy chủ.";
      }
      showToast(errorMessage, "error");
      console.error("Lỗi khi gọi AI:", error);
    } finally {
      setIsAILoading(false);
    }
  }, [aiPrompt, showToast]);

  // Optimized seat rendering - sửa lỗi drag offset
  const renderSeat = useCallback(
    (seat) => {
      const typeData = getSeatTypeData(seat.type);
      const isSelected = selectedItems.includes(`seat-${seat.id}`);

      return (
        <Rnd
          key={seat.id}
          bounds="parent"
          size={{ width: SEAT_SIZE, height: SEAT_SIZE }}
          position={{ x: seat.x, y: seat.y }}
          onDragStop={(e, d) => {
            const newX = snapToGrid(d.x);
            const newY = snapToGrid(d.y);

            // Đảm bảo không vượt ra ngoài canvas
            const boundedX = Math.max(
              0,
              Math.min(newX, canvasWidth - SEAT_SIZE)
            );
            const boundedY = Math.max(
              0,
              Math.min(newY, canvasHeight - SEAT_SIZE)
            );

            const newSeat = { ...seat, x: boundedX, y: boundedY };
            const otherSeats = seats.filter((s) => s.id !== seat.id);
            const allOtherItems = [...otherSeats, ...zones];

            // Kiểm tra collision, nếu có thì tìm vị trí gần nhất
            if (checkCollision(newSeat, allOtherItems, "seat", seat.id)) {
              const availablePos = findAvailablePosition(
                boundedX,
                boundedY,
                "seat"
              );
              setSeats((prev) =>
                prev.map((s) =>
                  s.id === seat.id
                    ? { ...s, x: availablePos.x, y: availablePos.y }
                    : s
                )
              );
              showToast(
                "Đã tự động điều chỉnh vị trí để tránh trùng lặp!",
                "warning"
              );
            } else {
              setSeats((prev) =>
                prev.map((s) =>
                  s.id === seat.id ? { ...s, x: boundedX, y: boundedY } : s
                )
              );
            }
          }}
          enableResizing={false}
          dragGrid={[GRID_SIZE, GRID_SIZE]}
          disableDragging={false}
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
            <div className="text-[8px] font-bold truncate w-full text-center px-0.5">
              {seat.label}
            </div>
            <div className="text-[6px] truncate">{formatPrice(seat.price)}</div>
            {seat.capacity > 1 && (
              <div className="text-[6px] flex items-center gap-0.5">
                <Users size={6} />
                {seat.capacity}
              </div>
            )}
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
    },
    [
      seats,
      zones,
      selectedItems,
      getSeatTypeData,
      snapToGrid,
      checkCollision,
      openEditModal,
      showToast,
      findAvailablePosition,
      canvasWidth,
      canvasHeight,
    ]
  );

  // Optimized zone rendering - sửa lỗi drag offset
  const renderZone = useCallback(
    (zone) => {
      const typeData = getSeatTypeData(zone.type);
      const isSelected = selectedItems.includes(`zone-${zone.id}`);

      return (
        <Rnd
          key={zone.id}
          bounds="parent"
          size={{ width: zone.width, height: zone.height }}
          position={{ x: zone.x, y: zone.y }}
          onDragStop={(e, d) => {
            const newX = snapToGrid(d.x);
            const newY = snapToGrid(d.y);

            // Đảm bảo không vượt ra ngoài canvas
            const boundedX = Math.max(
              0,
              Math.min(newX, canvasWidth - zone.width)
            );
            const boundedY = Math.max(
              0,
              Math.min(newY, canvasHeight - zone.height)
            );

            const newZone = { ...zone, x: boundedX, y: boundedY };
            const otherZones = zones.filter((z) => z.id !== zone.id);
            const allOtherItems = [...seats, ...otherZones];

            if (checkCollision(newZone, allOtherItems, "zone", zone.id)) {
              const availablePos = findAvailablePosition(
                boundedX,
                boundedY,
                "zone"
              );
              setZones((prev) =>
                prev.map((z) =>
                  z.id === zone.id
                    ? { ...z, x: availablePos.x, y: availablePos.y }
                    : z
                )
              );
              showToast(
                "Đã tự động điều chỉnh vị trí để tránh trùng lặp!",
                "warning"
              );
            } else {
              setZones((prev) =>
                prev.map((z) =>
                  z.id === zone.id ? { ...z, x: boundedX, y: boundedY } : z
                )
              );
            }
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            const newWidth = Math.max(
              snapToGrid(ref.offsetWidth),
              ZONE_MIN_SIZE
            );
            const newHeight = Math.max(
              snapToGrid(ref.offsetHeight),
              ZONE_MIN_SIZE
            );
            const newX = snapToGrid(position.x);
            const newY = snapToGrid(position.y);

            // Đảm bảo không vượt ra ngoài canvas
            const boundedX = Math.max(
              0,
              Math.min(newX, canvasWidth - newWidth)
            );
            const boundedY = Math.max(
              0,
              Math.min(newY, canvasHeight - newHeight)
            );

            const newZone = {
              ...zone,
              width: newWidth,
              height: newHeight,
              x: boundedX,
              y: boundedY,
            };

            const otherZones = zones.filter((z) => z.id !== zone.id);
            const allOtherItems = [...seats, ...otherZones];

            if (checkCollision(newZone, allOtherItems, "zone", zone.id)) {
              showToast(
                "Không thể thay đổi kích thước khu vực ở vị trí này!",
                "warning"
              );
            } else {
              setZones((prev) =>
                prev.map((z) => (z.id === zone.id ? newZone : z))
              );
            }
          }}
          dragGrid={[GRID_SIZE, GRID_SIZE]}
          resizeGrid={[GRID_SIZE, GRID_SIZE]}
          minWidth={ZONE_MIN_SIZE}
          minHeight={ZONE_MIN_SIZE}
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
              <div className="font-bold text-xs truncate">{zone.name}</div>
              <div className="text-[10px] mt-1">{formatPrice(zone.price)}</div>
              <div className="text-[10px] flex items-center justify-center gap-1">
                <Users size={10} />
                {zone.capacity}
              </div>
            </div>
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
    },
    [
      zones,
      seats,
      selectedItems,
      getSeatTypeData,
      snapToGrid,
      checkCollision,
      openEditModal,
      showToast,
      findAvailablePosition,
      canvasWidth,
      canvasHeight,
    ]
  );

  const addNewSeatType = useCallback(() => {
    if (!newSeatType.name.trim()) {
      showToast("Vui lòng nhập tên loại!", "warning");
      return;
    }

    const newType = { ...newSeatType };
    setSeatTypes((prev) => [...prev, newType]);
    setCurrentType(newType);
    setShowAddTypeModal(false);
    setNewSeatType({
      name: "",
      color: "bg-emerald-500",
      price: 80000,
      capacity: 1,
    });
    showToast(`Đã thêm loại "${newType.name}"!`, "success");
  }, [newSeatType, showToast]);

  const handleSave = useCallback(async () => {
    const seatsToSend = seats.map(({ id, ...rest }) => ({
      ...rest,
      id: typeof id === "string" && id.startsWith("s-") ? null : id,
    }));

    const zonesToSend = zones.map(({ id, ...rest }) => ({
      ...rest,
      id: typeof id === "string" && id.startsWith("z-") ? null : id,
    }));

    // Lấy eventId từ nhiều nguồn khác nhau
    const effectiveEventId =
      eventId || location.state?.eventId || location.state?.eventData?.id;

    const dataToSend = {
      event_id: Number(effectiveEventId),
      showing_time_id: Number(showingTimeId),
      layout_mode: layoutMode,
      seats: seatsToSend,
      zones: zonesToSend,
    };

    if (!effectiveEventId) {
      showToast(
        "Không xác định được sự kiện! Vui lòng tạo sự kiện trước.",
        "error"
      );
      return;
    }

    try {
      await saveShowingLayout(dataToSend);
      showToast("Đã lưu thành công!", "success");

      const isEdit =
        location.pathname.includes("/edit") || location.state?.isEdit;
      const targetRoute = isEdit
        ? `/organizer/edit/${effectiveEventId}`
        : "/organizer/create-event";

      navigate(targetRoute, {
        state: {
          returnStep: 3,
          eventData: {
            ...location.state?.eventData,
            id: effectiveEventId,
            showingTimes:
              location.state?.eventData?.showingTimes?.map((st) =>
                st.id === showingTimeId
                  ? { ...st, hasDesignedLayout: true }
                  : st
              ) || [],
          },
          eventId: effectiveEventId,
        },
      });
      onSave?.(dataToSend);
    } catch (error) {
      showToast(error.message, "error");
      console.error("Lỗi khi lưu layout:", error, dataToSend);
    }
  }, [
    seats,
    zones,
    eventId,
    showingTimeId,
    layoutMode,
    location,
    navigate,
    onSave,
    showToast,
  ]);

  // Memoized stats calculation
  const stats = useMemo(
    () => ({
      seatCount: seats.length,
      zoneCount: zones.length,
      totalCapacity:
        seats.reduce((sum, seat) => sum + seat.capacity, 0) +
        zones.reduce((sum, zone) => sum + zone.capacity, 0),
    }),
    [seats, zones]
  );

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
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-sm px-2 py-1 bg-slate-700 rounded min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-3 py-2 rounded font-medium transition-colors"
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
                  className={`p-2 rounded text-xs font-medium transition-colors ${
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
                className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded transition-colors"
              >
                + Thêm
              </button>
            </div>
            <div className="space-y-1">
              {seatTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentType(type)}
                  className={`w-full p-2 rounded text-left text-xs transition-colors ${
                    currentType?.name === type.name
                      ? `${type.color} text-white`
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{type.name}</span>
                    <div className="text-right ml-2">
                      <div className="text-[10px]">
                        {formatPrice(type.price)}
                      </div>
                      <div className="flex items-center gap-1 text-[8px]">
                        <Users size={6} />
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
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Số lượng"
                  className="flex-1 p-2 bg-slate-800 border border-slate-600 rounded text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  value={quickAddCount}
                  onChange={(e) =>
                    setQuickAddCount(
                      Math.min(100, Math.max(1, Number(e.target.value)))
                    )
                  }
                />
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={999}
                    placeholder="Sức chứa"
                    className="w-16 p-2 bg-slate-800 border border-slate-600 rounded text-sm focus:border-blue-500 focus:outline-none transition-colors"
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
                    className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 px-2 py-2 rounded text-xs transition-colors"
                  >
                    <Plus size={12} />
                    Ghế
                  </button>
                )}
                {(layoutMode === "zone" || layoutMode === "both") && (
                  <button
                    onClick={addZone}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 px-2 py-2 rounded text-xs transition-colors"
                  >
                    <Square size={12} />
                    Khu
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Generate Section */}
          <div className="mb-4 p-3 bg-slate-700 rounded">
            <h3 className="font-medium mb-2 text-sm">Tạo với AI</h3>
            <div className="space-y-2">
              <textarea
                placeholder="Nhập yêu cầu cho AI (ví dụ: Tạo layout cho 50 ghế VIP)"
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-sm resize-none focus:border-purple-500 focus:outline-none transition-colors"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                style={{ minHeight: "80px" }}
                disabled={isAILoading}
              />
              <button
                onClick={handleAIGenerate}
                className={`w-full flex items-center justify-center gap-1 px-2 py-2 rounded text-xs transition-colors ${
                  isAILoading
                    ? "bg-purple-700 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
                disabled={isAILoading}
              >
                {isAILoading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <Brain size={14} />
                    Tạo từ AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Công cụ</label>
            <div className="space-y-1">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`w-full p-2 rounded text-left text-xs flex items-center gap-2 transition-colors ${
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
                  className="w-full p-2 rounded text-left text-xs flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white transition-colors"
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
                <span>{stats.seatCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Khu vực:</span>
                <span>{stats.zoneCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng sức chứa:</span>
                <span>{stats.totalCapacity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas - Cố định kích thước như cũ */}
        <div className="flex-1 p-4">
          <div className="relative bg-slate-800 border border-slate-600 rounded overflow-hidden h-full">
            {/* Grid */}
            {showGrid && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #475569 1px, transparent 1px),
                    linear-gradient(to bottom, #475569 1px, transparent 1px)
                  `,
                  backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "0 0",
                }}
              />
            )}

            <div
              className="relative"
              style={{
                width: canvasWidth,
                height: canvasHeight,
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
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                value={newSeatType.name}
                onChange={(e) =>
                  setNewSeatType({ ...newSeatType, name: e.target.value })
                }
              />
              <select
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
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
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                value={newSeatType.price}
                onChange={(e) =>
                  setNewSeatType({
                    ...newSeatType,
                    price: Number.parseInt(e.target.value) || 0,
                  })
                }
              />
              <input
                type="number"
                placeholder="Sức chứa"
                min="1"
                max="999"
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                value={newSeatType.capacity}
                onChange={(e) =>
                  setNewSeatType({
                    ...newSeatType,
                    capacity: Number.parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddTypeModal(false)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={addNewSeatType}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
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
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                value={editingProperties.label || ""}
                onChange={(e) =>
                  setEditingProperties({
                    ...editingProperties,
                    label: e.target.value,
                  })
                }
              />
              <select
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
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
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                value={editingProperties.price || 0}
                onChange={(e) =>
                  setEditingProperties({
                    ...editingProperties,
                    price: Number.parseInt(e.target.value) || 0,
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
                  className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                  value={editingProperties.capacity || 1}
                  onChange={(e) =>
                    setEditingProperties({
                      ...editingProperties,
                      capacity: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={saveItemProperties}
                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Content Modal */}
      {showAIContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded p-4 w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Nội dung từ AI</h3>
            <div className="bg-slate-700 p-3 rounded text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
              {aiContent}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAIContentModal(false)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

LayoutDesigner.propTypes = {
  onSave: PropTypes.func,
};
