"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  fetchWithdrawableEvents,
  createWithdrawRequest,
  fetchWithdrawRequests,
} from "../../services/withdrawService";
import { getBankList } from "../../services/userServices";
import useAuth from "../../hooks/useAuth";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const WithdrawEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    selectedBankId: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",
    note: "",
    amount: "",
  });

  // Stats state
  const [stats, setStats] = useState({
    totalAvailable: 0,
    totalRequested: 0,
    totalApproved: 0,
    totalPending: 0,
  });

  useEffect(() => {
    if (isAuthenticated && user?.roles.includes("ORGANIZER")) {
      fetchEvents();
      fetchMyWithdrawRequests();
      fetchBankList();
    } else {
      setLoading(false);
      setError(
        "Bạn cần đăng nhập với vai trò Organizer để xem sự kiện có thể rút tiền."
      );
    }
  }, [isAuthenticated, user]);

  const fetchBankList = async () => {
    try {
      const banks = await getBankList();
      setBankList(banks);

      // Tự động chọn tài khoản mặc định
      const defaultBank = banks.find((bank) => bank.isDefault === 1);
      if (defaultBank) {
        setFormData((prev) => ({
          ...prev,
          selectedBankId: defaultBank.paymentId.toString(),
          bankAccountName: defaultBank.holderName,
          bankAccountNumber: defaultBank.endAccountNumber,
          bankName: defaultBank.bankName,
        }));
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách ngân hàng: ", err.message);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetchWithdrawableEvents();
      setEvents(response.data.data);
      // Tính toán stats
      const totalAvailable = response.data.data.reduce(
        (sum, event) => sum + event.availableRevenue,
        0
      );
      setStats((prev) => ({ ...prev, totalAvailable }));
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
      // Tính toán stats
      const totalRequested = response.data.data.reduce(
        (sum, req) => sum + req.amount,
        0
      );
      const totalApproved = response.data.data
        .filter((req) => req.status === "APPROVED")
        .reduce((sum, req) => sum + req.amount, 0);
      const totalPending = response.data.data.filter(
        (req) => req.status === "PENDING"
      ).length;
      setStats((prev) => ({
        ...prev,
        totalRequested,
        totalApproved,
        totalPending,
      }));
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu rút tiền: ", err.message);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setFormData((prev) => ({
      ...prev,
      amount: event.availableRevenue.toString(),
    }));
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBankSelect = (e) => {
    const selectedBankId = e.target.value;
    const selectedBank = bankList.find(
      (bank) => bank.paymentId.toString() === selectedBankId
    );

    if (selectedBank) {
      setFormData((prev) => ({
        ...prev,
        selectedBankId: selectedBankId,
        bankAccountName: selectedBank.holderName,
        bankAccountNumber: selectedBank.endAccountNumber,
        bankName: selectedBank.bankName,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const withdrawRequest = {
        eventId: selectedEvent.eventId,
        showingTimeId: selectedEvent.showingTimeId,
        amount: Number.parseFloat(formData.amount),
        bankAccountName: formData.bankAccountName,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
        note: formData.note,
      };

      await createWithdrawRequest(withdrawRequest);
      alert("Yêu cầu rút tiền đã được gửi thành công!");
      setSelectedEvent(null);
      setShowForm(false);

      // Reset form nhưng giữ lại thông tin ngân hàng mặc định
      const defaultBank = bankList.find((bank) => bank.isDefault === 1);
      setFormData({
        selectedBankId: defaultBank ? defaultBank.paymentId.toString() : "",
        bankAccountName: defaultBank ? defaultBank.holderName : "",
        bankAccountNumber: defaultBank ? defaultBank.endAccountNumber : "",
        bankName: defaultBank ? defaultBank.bankName : "",
        note: "",
        amount: "",
      });

      fetchEvents();
      fetchMyWithdrawRequests();
    } catch (err) {
      setError("Lỗi khi gửi yêu cầu rút tiền: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Quản lý rút tiền
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Theo dõi và yêu cầu rút tiền từ sự kiện của bạn
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Có thể rút</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalAvailable.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                <DollarSign className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Đã yêu cầu</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalRequested.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Đã duyệt</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalApproved.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                <CheckCircle className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Đang chờ</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalPending}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                <Clock className="text-white" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Events */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
                <DollarSign className="text-green-500" size={20} />
                <span>Sự kiện có thể rút tiền ({events.length})</span>
              </h3>
            </div>
            <div className="p-6">
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.eventId}
                      className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectEvent(event)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-700 mb-1">
                            {event.eventTitle}
                          </h4>
                          <p className="text-sm text-slate-600 mb-2">
                            {new Date(event.startTime).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-slate-500">
                              Số vé: {event.ticketsSold}
                            </span>
                            <span className="text-sm text-slate-500">
                              Doanh thu:{" "}
                              {event.totalRevenue?.toLocaleString("vi-VN")} đ
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {event.availableRevenue?.toLocaleString("vi-VN")} đ
                          </p>
                          <p className="text-xs text-slate-500">Có thể rút</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">
                    Không có sự kiện nào có thể rút tiền
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Withdraw Requests */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
                <Clock className="text-orange-500" size={20} />
                <span>Yêu cầu rút tiền ({withdrawRequests.length})</span>
              </h3>
            </div>
            <div className="p-6">
              {withdrawRequests.length > 0 ? (
                <div className="space-y-4">
                  {withdrawRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(request.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-slate-700">
                          {request.eventTitle}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {request.amount?.toLocaleString("vi-VN")} đ
                        </p>
                        <div className="text-sm text-slate-600">
                          <p>Ngân hàng: {request.bankName}</p>
                          <p>Tài khoản: {request.bankAccountNumber}</p>
                          {request.note && <p>Ghi chú: {request.note}</p>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">Chưa có yêu cầu rút tiền nào</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Withdraw Form Modal */}
        {showForm && selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
                  <CreditCard className="text-blue-500" size={20} />
                  <span>Yêu cầu rút tiền</span>
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <XCircle
                    className="text-slate-400 hover:text-red-500"
                    size={20}
                  />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-2">
                    {selectedEvent.eventTitle}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {new Date(selectedEvent.startTime).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Có thể rút:{" "}
                    {selectedEvent.availableRevenue?.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                {/* Bank Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Chọn tài khoản ngân hàng
                  </label>
                  <div className="relative">
                    <select
                      name="selectedBankId"
                      value={formData.selectedBankId}
                      onChange={handleBankSelect}
                      className="w-full h-12 px-4 pr-10 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none"
                      required
                    >
                      <option value="">Chọn tài khoản ngân hàng</option>
                      {bankList.map((bank) => (
                        <option key={bank.paymentId} value={bank.paymentId}>
                          {bank.bankName} - {bank.endAccountNumber} -{" "}
                          {bank.holderName}
                          {bank.isDefault === 1 && " (Mặc định)"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Tên chủ tài khoản
                    </label>
                    <input
                      type="text"
                      name="bankAccountName"
                      value={formData.bankAccountName}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 transition-all duration-300"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      Số tài khoản
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 transition-all duration-300"
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Tên ngân hàng
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 transition-all duration-300"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Số tiền rút
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    max={selectedEvent.availableRevenue}
                    className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105"
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawEvents;
