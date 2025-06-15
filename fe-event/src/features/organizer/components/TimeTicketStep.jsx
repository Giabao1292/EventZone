import { useState } from "react";
import { Calendar, MapPin, Plus, Clock, Ticket, X, Check } from "lucide-react";
import AddressPicker from "./AddressPicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleInputTimeChange = (field, value) => {
    setNewShowing((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddShowingTime = () => {
    const { startTime, endTime, saleOpenTime, saleCloseTime, layoutMode } =
      newShowing;
    if (
      !startTime ||
      !endTime ||
      !saleOpenTime ||
      !saleCloseTime ||
      !layoutMode
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin xuất chiếu.");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const open = new Date(saleOpenTime);
    const close = new Date(saleCloseTime);

    if (start >= end) {
      toast.error("Thời gian bắt đầu phải trước thời gian kết thúc.");
      return;
    }
    if (open >= close) {
      toast.error("Thời gian mở bán phải trước thời gian đóng bán.");
      return;
    }
    if (open > start) {
      toast.error("Thời gian mở bán phải trước hoặc bằng thời gian bắt đầu.");
      return;
    }

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
      toast.error("Xuất chiếu bị trùng với lịch đã có.");
      return;
    }

    const updated = [...(eventData?.showingTimes || []), newShowing];
    handleInputChange("showingTimes", updated);

    setNewShowing({
      startTime: "",
      endTime: "",
      saleOpenTime: "",
      saleCloseTime: "",
      layoutMode: "seat",
    });
    setShowAddForm(false);

    toast.success("Thêm xuất chiếu thành công!");
  };

  const removeShowing = (index) => {
    const updated = (eventData?.showingTimes || []).filter(
      (_, i) => i !== index
    );
    handleInputChange("showingTimes", updated);
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Calendar className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Thời gian & Địa điểm
            </h2>
          </div>
          <p className="text-gray-400 text-lg">
            Thiết lập lịch chiếu và địa điểm tổ chức sự kiện
          </p>
        </div>

        {/* Showing Times Section */}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Ticket className="text-purple-400" size={20} />
              <h3 className="text-xl text-white font-semibold">Lịch chiếu</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:scale-105 transition-all duration-200"
              disabled={loading}
            >
              <Plus size={16} />
              <span>Thêm xuất chiếu</span>
            </button>
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl text-white font-semibold flex items-center space-x-2">
                    <Ticket className="text-purple-400" size={20} />
                    <span>Thêm xuất chiếu mới</span>
                  </h4>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-gray-700 rounded-full"
                  >
                    <X className="text-gray-400" size={20} />
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
                      <label className="flex items-center text-sm text-gray-300 space-x-2">
                        <Icon size={16} className="text-blue-400" />
                        <span>{label} *</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={newShowing[field]}
                        onChange={(e) =>
                          handleInputTimeChange(field, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                        disabled={loading}
                      />
                    </div>
                  ))}
                  {/* Layout Mode */}
                  <div className="space-y-2 col-span-1">
                    <label className="flex items-center text-sm text-gray-300 space-x-2">
                      <Ticket size={16} className="text-blue-400" />
                      <span>Loại sơ đồ *</span>
                    </label>
                    <select
                      value={newShowing.layoutMode}
                      onChange={(e) =>
                        handleInputTimeChange("layoutMode", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                      disabled={loading}
                    >
                      <option value="seat">Ghế</option>
                      <option value="zone">Khu vực</option>
                      <option value="both">Cả hai</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddShowingTime}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl"
                  >
                    <Check size={16} />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách lịch chiếu */}
          {eventData?.showingTimes?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventData.showingTimes.map((showing, index) => (
                <div
                  key={index}
                  className="relative bg-gray-800/80 p-6 rounded-xl border border-gray-600 shadow-md group"
                >
                  <button
                    onClick={() => removeShowing(index)}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                  <div className="text-center mb-3">
                    <div className="flex justify-center items-center space-x-2 mb-2">
                      <Ticket className="text-purple-400" size={18} />
                      <span className="text-lg font-semibold text-white">
                        Xuất {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-white">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400 text-lg">Chưa có xuất chiếu nào</p>
              <p className="text-gray-500 text-sm mt-2">
                Nhấn "Thêm xuất chiếu" để bắt đầu
              </p>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <MapPin className="text-red-400" size={20} />
            <h3 className="text-xl text-white font-semibold">
              Địa điểm tổ chức
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Tên địa điểm *
              </label>
              <input
                type="text"
                value={eventData?.venueName || ""}
                onChange={(e) => handleInputChange("venueName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white"
                placeholder="Ví dụ: Rạp CGV Gò Vấp..."
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Địa chỉ *
              </label>
              <AddressPicker
                onSelect={({ location, city }) => {
                  handleInputChange("location", location);
                  handleInputChange("city", city);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTicketStep;
