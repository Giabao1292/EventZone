import React, { useEffect, useState } from "react";
import {
  fetchAllWithdrawRequests,
  approveWithdrawRequest,
  rejectWithdrawRequest,
} from "../../services/withdrawService";
import { toast } from "react-toastify";

const AdminWithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("PENDING");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetchAllWithdrawRequests();
      setRequests(res.data.data || []);
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

  const filteredRequests = requests.filter(
    (req) => req.status?.toUpperCase() === activeTab
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Chờ duyệt
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Đã duyệt
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý yêu cầu rút tiền
          </h2>
          <p className="text-gray-600">
            Xem xét và phê duyệt các yêu cầu rút tiền từ organizer
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {["PENDING", "CONFIRMED", "CANCELLED"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {getTabStats(tab)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có yêu cầu nào
            </h3>
            <p className="text-gray-500">
              Chưa có yêu cầu rút tiền nào trong trạng thái này.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-600"
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
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Yêu cầu #{req.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(req.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organizer
                        </label>
                        <p className="text-gray-900">{req.organizerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sự kiện
                        </label>
                        <p className="text-gray-900">{req.eventTitle}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suất chiếu
                        </label>
                        <p className="text-gray-900">{req.showingTime}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số tiền
                        </label>
                        <p className="text-2xl font-bold text-green-600">
                          {req.amount.toLocaleString()} VND
                        </p>
                      </div>
                      {req.status === "CANCELLED" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lý do từ chối
                          </label>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-800">
                              {req.rejectionReason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Pending Status */}
                  {req.status === "PENDING" && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lý do từ chối (nếu có)
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={submitting}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Phê duyệt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawRequests;
