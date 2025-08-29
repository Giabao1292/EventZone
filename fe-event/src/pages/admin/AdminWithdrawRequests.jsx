"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchAllWithdrawRequests,
  approveWithdrawRequest,
  rejectWithdrawRequest,
} from "../../services/withdrawService";
import { toast } from "react-toastify";
import {
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  Eye,
  Building2,
  Hash,
  UserCheck,
} from "lucide-react";

const AdminWithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalPending: 0,
    totalConfirmed: 0,
    totalCancelled: 0,
    totalAmount: 0,
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetchAllWithdrawRequests();
      const requestsData = res.data.data || [];
      setRequests(requestsData);

      // Calculate stats
      const totalPending = requestsData.filter(
        (req) => req.status === "PENDING"
      ).length;
      const totalConfirmed = requestsData.filter(
        (req) => req.status === "CONFIRMED"
      ).length;
      const totalCancelled = requestsData.filter(
        (req) => req.status === "CANCELLED"
      ).length;
      const totalAmount = requestsData.reduce(
        (sum, req) => sum + (req.amount || 0),
        0
      );

      setStats({
        totalPending,
        totalConfirmed,
        totalCancelled,
        totalAmount,
      });
    } catch (error) {
      toast.error("Lỗi khi tải yêu cầu rút tiền");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setSubmitting(true);
    try {
      await approveWithdrawRequest(id);
      toast.success("Phê duyệt thành công");
      fetchRequests();
    } catch (error) {
      toast.error("Lỗi khi phê duyệt");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (id) => {
    const reason = rejectionReason[id] || "";
    if (!reason.trim()) {
      toast.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    setSubmitting(true);
    try {
      await rejectWithdrawRequest(id, reason);
      toast.success("Từ chối thành công");
      fetchRequests();
    } catch (error) {
      toast.error("Lỗi khi từ chối");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const filteredRequests = requests.filter(
    (req) => req.status?.toUpperCase() === activeTab
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Chờ duyệt
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Đã duyệt
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getTabStats = (status) => {
    return requests.filter((req) => req.status?.toUpperCase() === status)
      .length;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quản lý yêu cầu rút tiền
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Xem xét và phê duyệt các yêu cầu rút tiền từ organizer
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.totalPending}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full">
                <Clock className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalConfirmed}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                <CheckCircle className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-red-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Từ chối</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.totalCancelled}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                <XCircle className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Tổng tiền</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                <DollarSign className="text-white" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex border-b border-slate-200">
            {["PENDING", "CONFIRMED", "CANCELLED"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>
                    {tab === "PENDING" && "Chờ duyệt"}
                    {tab === "CONFIRMED" && "Đã duyệt"}
                    {tab === "CANCELLED" && "Từ chối"}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {getTabStats(tab)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {filteredRequests.length === 0 ? (
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Không có yêu cầu nào
            </h3>
            <p className="text-slate-500">
              Chưa có yêu cầu rút tiền nào trong trạng thái này.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req, index) => (
              <motion.div
                key={req.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Yêu cầu #{req.id}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDateTime(req.requestedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(req.status)}
                      <button
                        onClick={() => handleViewDetail(req)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200"
                      >
                        <Eye className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-50/50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <label className="text-sm font-medium text-slate-700">
                          Organizer
                        </label>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {req.organizerName || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        <label className="text-sm font-medium text-slate-700">
                          Sự kiện
                        </label>
                      </div>
                      <p className="text-slate-900 font-semibold">
                        {req.eventTitle || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        <label className="text-sm font-medium text-slate-700">
                          Số tiền
                        </label>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(req.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Bank Account Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-slate-800">
                        Thông tin tài khoản ngân hàng
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Tên ngân hàng
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {req.bankName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Số tài khoản
                        </label>
                        <p className="text-sm font-semibold text-slate-800 font-mono">
                          {req.bankAccountNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Chủ tài khoản
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {req.bankAccountName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  {req.note && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-yellow-600" />
                        <label className="text-sm font-medium text-yellow-800">
                          Ghi chú
                        </label>
                      </div>
                      <p className="text-sm text-yellow-800">{req.note}</p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {req.status === "CANCELLED" && req.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <label className="text-sm font-medium text-red-800">
                          Lý do từ chối
                        </label>
                      </div>
                      <p className="text-sm text-red-800">
                        {req.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Processing Info */}
                  {req.processedAt && (
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <UserCheck className="w-4 h-4 text-slate-600" />
                        <label className="text-sm font-medium text-slate-700">
                          Thời gian xử lý
                        </label>
                      </div>
                      <p className="text-sm text-slate-800">
                        {formatDateTime(req.processedAt)}
                      </p>
                    </div>
                  )}

                  {/* Actions for Pending Status */}
                  {req.status === "PENDING" && (
                    <div className="border-t border-slate-200 pt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Lý do từ chối (nếu có)
                        </label>
                        <textarea
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Nhập lý do từ chối..."
                          value={rejectionReason[req.id] || ""}
                          onChange={(e) =>
                            setRejectionReason({
                              ...rejectionReason,
                              [req.id]: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={submitting}
                          className="px-6 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-red-500/10 hover:shadow-xl hover:scale-105"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={submitting}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-green-500/25 hover:shadow-xl hover:scale-105"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Phê duyệt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
                  <Hash className="text-blue-500" size={24} />
                  <span>Chi tiết yêu cầu #{selectedRequest.id}</span>
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <XCircle
                    className="text-slate-400 hover:text-red-500"
                    size={24}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-500" />
                      Thông tin cơ bản
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          ID yêu cầu
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          #{selectedRequest.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Organizer
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {selectedRequest.organizerName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Trạng thái
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(selectedRequest.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-500" />
                      Thông tin sự kiện
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          ID sự kiện
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          #{selectedRequest.eventId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Tên sự kiện
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {selectedRequest.eventTitle || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          ID suất chiếu
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          #{selectedRequest.showingTimeId || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                      Thời gian
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Thời gian yêu cầu
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {formatDateTime(selectedRequest.requestedAt)}
                        </p>
                      </div>
                      {selectedRequest.processedAt && (
                        <div>
                          <label className="text-xs font-medium text-slate-600">
                            Thời gian xử lý
                          </label>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatDateTime(selectedRequest.processedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                      Thông tin tài chính
                    </h4>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(selectedRequest.amount)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Số tiền yêu cầu rút
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                      Thông tin ngân hàng
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Tên ngân hàng
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {selectedRequest.bankName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Số tài khoản
                        </label>
                        <p className="text-sm font-semibold text-slate-800 font-mono">
                          {selectedRequest.bankAccountNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Tên chủ tài khoản
                        </label>
                        <p className="text-sm font-semibold text-slate-800">
                          {selectedRequest.bankAccountName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedRequest.note && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Ghi chú từ Organizer
                      </h4>
                      <p className="text-sm text-yellow-800">
                        {selectedRequest.note}
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === "CANCELLED" &&
                    selectedRequest.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Lý do từ chối
                        </h4>
                        <p className="text-sm text-red-800">
                          {selectedRequest.rejectionReason}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawRequests;
