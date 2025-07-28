import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Plus,
  Clock,
  Ticket,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import apiClient from "../../api/axios";

// Mock AddressPicker component
const AddressPicker = ({ onSelect, initialValue }) => {
  return (
    <div className="space-y-3">
      <select
        className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        onChange={(e) =>
          onSelect({
            city: e.target.value,
            location: "",
            address_id: e.target.value,
          })
        }
        defaultValue={initialValue?.city || ""}
      >
        <option value="">Chọn thành phố</option>
        <option value="hanoi">Hà Nội</option>
        <option value="hcmc">TP. Hồ Chí Minh</option>
        <option value="danang">Đà Nẵng</option>
      </select>
      <input
        type="text"
        placeholder="Nhập địa chỉ cụ thể..."
        className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
        defaultValue={initialValue?.location || ""}
        onChange={(e) =>
          onSelect({
            city: initialValue?.city || "",
            location: e.target.value,
            address_id: initialValue?.address_id || "",
          })
        }
      />
    </div>
  );
};

const TimeTicketStep = ({
  eventData = {},
  handleInputChange = () => {},
  loading = false,
  eventId,
}) => {
  const [newShowing, setNewShowing] = useState({
    startTime: "",
    endTime: "",
    saleOpenTime: "",
    saleCloseTime: "",
    layoutMode: "seat",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoadingShowingTimes, setIsLoadingShowingTimes] = useState(false);
  const [hasLoadedShowingTimes, setHasLoadedShowingTimes] = useState(false);

  // Load showing times khi edit event - chỉ load một lần khi mount và chỉ khi thực sự cần
  useEffect(() => {
    const loadShowingTimes = async () => {
      if (
        eventId &&
        !hasLoadedShowingTimes &&
        (!eventData.showingTimes || eventData.showingTimes.length === 0)
      ) {
        try {
          setIsLoadingShowingTimes(true);
          const response = await apiClient.get(
            `/events/${eventId}/showing-times`
          );
          const showingTimes = response.data.data || [];

          // Update eventData với showing times từ API
          handleInputChange("showingTimes", showingTimes);
          setHasLoadedShowingTimes(true); // Đánh dấu đã load
        } catch (error) {
          console.error("Error loading showing times:", error);
        } finally {
          setIsLoadingShowingTimes(false);
        }
      }
    };

    loadShowingTimes();
  }, [eventId, hasLoadedShowingTimes, eventData.showingTimes]); // Thêm dependencies để tránh load không cần thiết

  const handleInputTimeChange = (field, value) => {
    setNewShowing((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateShowingTime = () => {
    const errors = {};
    const { startTime, endTime, saleOpenTime, saleCloseTime, layoutMode } =
      newShowing;

    // Required field validation
    if (!startTime) errors.startTime = "Thời gian bắt đầu là bắt buộc";
    if (!endTime) errors.endTime = "Thời gian kết thúc là bắt buộc";
    if (!saleOpenTime) errors.saleOpenTime = "Thời gian mở bán là bắt buộc";
    if (!saleCloseTime) errors.saleCloseTime = "Thời gian đóng bán là bắt buộc";
    if (!layoutMode) errors.layoutMode = "Chế độ layout là bắt buộc";

    // Time logic validation
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        errors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }

      // Check if event duration is reasonable (at least 30 minutes)
      const duration = end - start;
      const minDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
      if (duration < minDuration) {
        errors.endTime = "Sự kiện phải kéo dài ít nhất 30 phút";
      }
    }

    if (saleOpenTime && saleCloseTime) {
      const open = new Date(saleOpenTime);
      const close = new Date(saleCloseTime);

      if (open >= close) {
        errors.saleCloseTime = "Thời gian đóng bán phải sau thời gian mở bán";
      }
    }

    if (startTime && saleOpenTime) {
      const start = new Date(startTime);
      const open = new Date(saleOpenTime);

      if (open > start) {
        errors.saleOpenTime =
          "Thời gian mở bán phải trước hoặc bằng thời gian bắt đầu";
      }
    }

    // Check for overlapping showing times
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      const overlap = (eventData?.showingTimes || []).some((showing) => {
        const existingStart = new Date(showing.startTime);
        const existingEnd = new Date(showing.endTime);
        return (
          (start >= existingStart && start < existingEnd) ||
          (end > existingStart && end <= existingEnd) ||
          (start <= existingStart && end >= existingEnd)
        );
      });

      if (overlap) {
        errors.startTime = "Xuất chiếu bị trùng với lịch đã có";
        errors.endTime = "Xuất chiếu bị trùng với lịch đã có";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddShowingTime = () => {
    if (!validateShowingTime()) {
      return;
    }

    // Add new showing time locally with a temporary ID
    const newShowingWithTempId = {
      ...newShowing,
    };
    const updated = [...(eventData?.showingTimes || []), newShowingWithTempId];
    handleInputChange("showingTimes", updated);

    // Reset form and close
    setNewShowing({
      startTime: "",
      endTime: "",
      saleOpenTime: "",
      saleCloseTime: "",
      layoutMode: "seat",
    });
    setValidationErrors({});
    setShowAddForm(false);
  };

  const removeShowing = (index) => {
    const updated = (eventData?.showingTimes || []).filter(
      (_, i) => i !== index
    );
    handleInputChange("showingTimes", updated);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full shadow-lg">
            <Calendar className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Thời gian & Địa điểm
          </h2>
        </div>
        <p className="text-slate-600 text-lg">
          Thiết lập lịch chiếu và địa điểm tổ chức sự kiện
        </p>
      </div>

      {/* Showing Times Section */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-2xl mt-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Ticket className="text-orange-500" size={20} />
            <h3 className="text-xl text-slate-700 font-semibold">Lịch chiếu</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg shadow-orange-500/25"
            disabled={loading}
          >
            <Plus size={16} className="mr-2" />
            <span>Thêm suất chiếu</span>
          </button>
        </div>

        {/* Modal - Fixed z-index and improved backdrop */}
        {showAddForm && (
          <div
            className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddForm(false);
                setValidationErrors({});
              }
            }}
          >
            <div
              className=" bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto mb-36 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl text-slate-700 font-semibold flex items-center space-x-2">
                  <Ticket className="text-orange-500" size={20} />
                  <span>Thêm suất chiếu mới</span>
                </h4>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setValidationErrors({});
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <X className="text-slate-400 hover:text-red-500" size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  {
                    label: "Thời gian bắt đầu",
                    field: "startTime",
                    icon: Clock,
                  },
                  {
                    label: "Thời gian kết thúc",
                    field: "endTime",
                    icon: Clock,
                  },
                  { label: "Mở bán vé", field: "saleOpenTime", icon: Ticket },
                  {
                    label: "Đóng bán vé",
                    field: "saleCloseTime",
                    icon: Ticket,
                  },
                ].map(({ label, field, icon: Icon }) => (
                  <div key={field} className="space-y-2">
                    <label className="flex items-center text-sm text-slate-600 space-x-2">
                      <Icon size={16} className="text-blue-500" />
                      <span>{label} *</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={newShowing[field]}
                      onChange={(e) =>
                        handleInputTimeChange(field, e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-slate-700 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        validationErrors[field]
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
                      }`}
                      disabled={loading}
                    />
                    {validationErrors[field] && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>{validationErrors[field]}</span>
                      </p>
                    )}
                  </div>
                ))}

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="flex items-center text-sm text-slate-600 space-x-2">
                    <Ticket size={16} className="text-blue-500" />
                    <span>Loại sơ đồ *</span>
                  </label>
                  <select
                    value={newShowing.layoutMode}
                    onChange={(e) =>
                      handleInputTimeChange("layoutMode", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-white/80 border rounded-xl text-slate-700 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      validationErrors.layoutMode
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-blue-400 focus:ring-blue-500/20"
                    }`}
                    disabled={loading}
                  >
                    <option value="seat">Ghế</option>
                    <option value="zone">Khu vực</option>
                    <option value="both">Cả hai</option>
                  </select>
                  {validationErrors.layoutMode && (
                    <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{validationErrors.layoutMode}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setValidationErrors({});
                  }}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddShowingTime}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                  disabled={loading}
                >
                  <Check size={16} />
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách lịch chiếu */}
        {isLoadingShowingTimes ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Đang tải lịch chiếu...</p>
          </div>
        ) : eventData?.showingTimes?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventData.showingTimes.map((showing, index) => {
              // Kiểm tra trạng thái thiết kế layout
              const hasDesignedLayout = showing.hasDesignedLayout || false;
              const isEditMode = eventId && showing.id;

              return (
                <div
                  key={showing.id || index}
                  className={`relative bg-slate-50/80 p-6 rounded-xl border shadow-md group hover:border-slate-300 transition-all duration-300 ${
                    hasDesignedLayout
                      ? "border-green-200 bg-green-50/30"
                      : "border-slate-200"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        hasDesignedLayout
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                      }`}
                    >
                      {hasDesignedLayout ? "✓ Đã thiết kế" : "⚠ Chưa thiết kế"}
                    </span>
                  </div>

                  <button
                    onClick={() => removeShowing(index)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <X size={16} />
                  </button>

                  <div className="text-center mb-3 mt-8">
                    <div className="flex justify-center items-center space-x-2 mb-2">
                      <Ticket className="text-orange-500" size={18} />
                      <span className="text-lg font-semibold text-slate-700">
                        Xuất {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Chiếu:</span>
                      <span>{formatDateTime(showing.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kết thúc:</span>
                      <span>{formatDateTime(showing.endTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bán vé:</span>
                      <span>{formatDateTime(showing.saleOpenTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đóng bán:</span>
                      <span>{formatDateTime(showing.saleCloseTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sơ đồ:</span>
                      <span className="capitalize">
                        {showing.layoutMode === "seat"
                          ? "Ghế"
                          : showing.layoutMode === "zone"
                          ? "Khu vực"
                          : "Cả hai"}
                      </span>
                    </div>
                  </div>

                  {/* Layout Design Button */}
                  {isEditMode && (
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => {
                          // Navigate to layout designer
                          window.location.href = `/organizer/layout-designer/${showing.id}?eventId=${eventId}&isEdit=true`;
                        }}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          hasDesignedLayout
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                      >
                        {hasDesignedLayout
                          ? "Chỉnh sửa layout"
                          : "Thiết kế layout"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Ticket className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-500 text-lg">Chưa có xuất chiếu nào</p>
            <p className="text-slate-400 text-sm mt-2">
              Nhấn "Thêm xuất chiếu" để bắt đầu
            </p>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <MapPin className="text-blue-500" size={20} />
          <h3 className="text-xl text-slate-700 font-semibold">
            Địa điểm tổ chức
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-slate-600 mb-3">
              Tên địa điểm *
            </label>
            <input
              type="text"
              value={eventData?.venueName || ""}
              onChange={(e) => handleInputChange("venueName", e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              placeholder="Ví dụ: Rạp CGV Gò Vấp..."
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-3">
              Địa chỉ *
            </label>
            <AddressPicker
              onSelect={({ location, city, address_id }) => {
                handleInputChange("location", location);
                handleInputChange("city", city);
                if (address_id) handleInputChange("address_id", address_id);
              }}
              initialValue={{
                city: eventData?.city,
                location: eventData?.location,
                address_id: eventData?.address_id,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTicketStep;
