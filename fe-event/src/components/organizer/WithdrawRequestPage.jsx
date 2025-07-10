import React, { useState, useEffect } from "react";
import {
  fetchWithdrawableEvents,
  createWithdrawRequest,
  fetchWithdrawRequests,
} from "../../services/withdrawService";
import useAuth from "../../hooks/useAuth";

const WithdrawEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
    note: "",
    amount: "",
  });

  useEffect(() => {
    if (isAuthenticated && user?.roles.includes("ORGANIZER")) {
      fetchEvents();
      fetchMyWithdrawRequests();
    } else {
      setLoading(false);
      setError(
        "Bạn cần đăng nhập với vai trò Organizer để xem sự kiện có thể rút tiền."
      );
    }
  }, [isAuthenticated, user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetchWithdrawableEvents();
      setEvents(response.data.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách sự kiện: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyWithdrawRequests = async () => {
    try {
      const response = await fetchWithdrawRequests();
      setWithdrawRequests(response.data.data);
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu rút tiền: ", err.message);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData({ ...formData, amount: event.availableRevenue.toString() });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const withdrawRequest = {
        eventId: selectedEvent.eventId,
        showingTimeId: selectedEvent.showingTimeId,
        amount: parseFloat(formData.amount),
        bankAccountName: formData.bankAccountName,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
        note: formData.note,
      };

      await createWithdrawRequest(withdrawRequest);
      alert("Yêu cầu rút tiền đã được gửi thành công!");
      setSelectedEvent(null);
      setFormData({
        bankAccountName: "",
        bankAccountNumber: "",
        bankName: "",
        note: "",
        amount: "",
      });
      fetchEvents();
      fetchMyWithdrawRequests();
    } catch (err) {
      setError("Lỗi khi gửi yêu cầu rút tiền: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-gray-300 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Sự kiện có thể rút tiền
          </h1>
          <p className="text-gray-400">
            Quản lý và rút tiền từ các sự kiện của bạn
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-400 text-lg">
              Không có sự kiện nào đủ điều kiện rút tiền.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.showingTimeId}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {event.eventTitle}
                  </h2>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {new Date(event.startTime).toLocaleString()} -{" "}
                      {new Date(event.endTime).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-green-900 bg-opacity-50 border border-green-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-200">Số tiền có thể rút:</span>
                    <span className="text-green-400 font-bold text-lg">
                      {Number.isInteger(event.availableRevenue)
                        ? `${event.availableRevenue} VND`
                        : `${event.availableRevenue.toLocaleString("vi-VN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })} VND`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectEvent(event)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  Rút tiền
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Danh sách yêu cầu đã gửi */}
        {withdrawRequests.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Yêu cầu rút tiền đã gửi
            </h2>
            <div className="space-y-4">
              {withdrawRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between text-gray-300 text-sm">
                    <div>
                      <p className="font-medium text-white">{req.eventTitle}</p>
                      <p>
                        Suất chiếu: {new Date(req.startTime).toLocaleString()} -{" "}
                        {new Date(req.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>
                        Số tiền:{" "}
                        <span className="text-green-400 font-semibold">
                          {req.amount.toLocaleString("vi-VN")} VND
                        </span>
                      </p>
                      <p>
                        Trạng thái:{" "}
                        <span
                          className={
                            req.status === "PENDING"
                              ? "text-yellow-400"
                              : req.status === "APPROVED"
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {req.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Modal rút tiền */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Tạo yêu cầu rút tiền
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên tài khoản ngân hàng
                  </label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData.bankAccountName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Số tài khoản ngân hàng
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Số tiền rút
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    required
                    max={selectedEvent.availableRevenue}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Tối đa:{" "}
                    {selectedEvent.availableRevenue.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawEvents;
