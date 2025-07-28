import { useState, useEffect } from "react";
import eventRescheduleService from "../../services/eventRescheduleService";
import { X } from "lucide-react";

export default function RescheduleRequestsModal({
  eventId,
  onClose,
  adminUserId,
}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [showingTimes, setShowingTimes] = useState([]);
  const [selectedShowingTime, setSelectedShowingTime] = useState(null);

  // Load tất cả yêu cầu dời lịch theo eventId
  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [eventId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await eventRescheduleService.getRequestsByEventId(eventId);

      // Sắp xếp yêu cầu: PENDING mới nhất lên đầu, sau đó đến APPROVED/REJECTED
      const sortedData = (data || []).sort((a, b) => {
        // Ưu tiên PENDING lên đầu
        if (a.status === "PENDING" && b.status !== "PENDING") {
          return -1;
        }
        if (a.status !== "PENDING" && b.status === "PENDING") {
          return 1;
        }

        // Nếu cùng trạng thái, sắp xếp theo thời gian tạo mới nhất
        const dateA = new Date(a.requestedAt);
        const dateB = new Date(b.requestedAt);
        return dateB - dateA; // Mới nhất lên đầu
      });

      setRequests(sortedData);

      // Group by showingTimeId
      const group = {};
      sortedData.forEach((r) => {
        if (!group[r.showingTimeId]) group[r.showingTimeId] = [];
        group[r.showingTimeId].push(r);
      });

      // Tạo mảng showingTime với các suất chiếu có yêu cầu dời lịch
      const showingTimeList = Object.entries(group).map(([id, reqs]) => ({
        id,
        count: reqs.length,
        oldStartTime: reqs[0].oldStartTime,
        oldEndTime: reqs[0].oldEndTime,
      }));
      setShowingTimes(showingTimeList);

      // Nếu đang chọn suất chiếu mà nó không còn yêu cầu, tự động bỏ chọn
      if (
        selectedShowingTime &&
        !showingTimeList.some((st) => st.id === selectedShowingTime)
      ) {
        setSelectedShowingTime(null);
      }
    } catch {
      setRequests([]);
      setShowingTimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler duyệt yêu cầu
  const handleApprove = async (requestId) => {
    setActionLoading(true);
    try {
      await eventRescheduleService.approveRequest(requestId, adminUserId);
      alert("Duyệt yêu cầu thành công!");
      await fetchRequests();
    } catch (error) {
      alert("Duyệt yêu cầu thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // Handler từ chối yêu cầu
  const handleReject = async () => {
    if (!rejectNote) return alert("Vui lòng nhập lý do từ chối");
    setActionLoading(true);
    try {
      await eventRescheduleService.rejectRequest(
        selectedRejectId,
        adminUserId,
        rejectNote
      );
      alert("Từ chối yêu cầu thành công!");
      setRejectNote("");
      setSelectedRejectId(null);
      await fetchRequests();
    } catch (error) {
      alert("Từ chối yêu cầu thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // Lấy danh sách yêu cầu theo suất chiếu đã chọn
  const filteredRequests = selectedShowingTime
    ? requests.filter(
        (r) => String(r.showingTimeId) === String(selectedShowingTime)
      )
    : [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="relative bg-white rounded-lg max-w-2xl w-full p-0 shadow-xl">
        {/* Header sticky gồm title và nút X */}
        <div className="sticky top-0 bg-white z-20 p-4 flex justify-between items-center rounded-t-lg border-b">
          <h2 className="text-xl font-bold">Yêu cầu dời lịch sự kiện</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Nội dung */}
        <div className="overflow-auto p-6 max-h-[70vh]">
          {/* Danh sách suất chiếu có yêu cầu */}
          <div>
            <div className="mb-3 font-medium">
              Danh sách suất chiếu có yêu cầu:
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {showingTimes.length === 0 && (
                <span className="text-gray-500">
                  Không có suất chiếu nào có yêu cầu dời lịch.
                </span>
              )}
              {showingTimes.map((st) => (
                <button
                  key={st.id}
                  className={`px-3 py-1 rounded ${
                    selectedShowingTime === st.id
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  } relative flex items-center`}
                  onClick={() => setSelectedShowingTime(st.id)}
                >
                  {new Date(st.oldStartTime).toLocaleString()} -{" "}
                  {new Date(st.oldEndTime).toLocaleString()}
                  <span className="ml-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Danh sách yêu cầu dời lịch của suất chiếu đang chọn */}
          {selectedShowingTime && (
            <ul>
              {filteredRequests.length === 0 ? (
                <div className="text-gray-500 mb-2">
                  Chưa có yêu cầu nào cho suất chiếu này.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <li
                    key={req.id}
                    className={`border p-3 rounded mb-3 ${
                      req.status === "PENDING"
                        ? "border-yellow-300 bg-yellow-50"
                        : req.status === "APPROVED"
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                    }`}
                  >
                    <p>
                      <b>Thời gian cũ:</b>{" "}
                      {new Date(req.oldStartTime).toLocaleString()} -{" "}
                      {new Date(req.oldEndTime).toLocaleString()}
                    </p>
                    <p>
                      <b>Thời gian yêu cầu:</b>{" "}
                      {new Date(req.requestedStartTime).toLocaleString()} -{" "}
                      {new Date(req.requestedEndTime).toLocaleString()}
                    </p>
                    <p>
                      <b>Lý do:</b> {req.reason}
                    </p>
                    <p>
                      <b>Người yêu cầu:</b> {req.requestedByName}
                    </p>
                    <p>
                      <b>Thời gian yêu cầu:</b>{" "}
                      {new Date(req.requestedAt).toLocaleString("vi-VN")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          req.status === "PENDING"
                            ? "bg-yellow-500 text-white"
                            : req.status === "APPROVED"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {req.status === "PENDING"
                          ? "⏳ Chờ duyệt"
                          : req.status === "APPROVED"
                          ? "✅ Đã duyệt"
                          : "❌ Từ chối"}
                      </span>
                      {req.status === "PENDING" && (
                        <span className="text-xs text-yellow-600 font-medium">
                          Cần xử lý ngay
                        </span>
                      )}
                    </div>
                    {req.status === "REJECTED" && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <b className="text-red-700">Lý do từ chối:</b>{" "}
                        <span className="text-red-600">
                          {req.adminNote || "(Không ghi chú)"}
                        </span>
                        <br />
                        {req.approvedByName && (
                          <span className="text-xs text-gray-500">
                            Từ chối bởi: {req.approvedByName}{" "}
                            {req.respondedAt
                              ? `- ${new Date(
                                  req.respondedAt
                                ).toLocaleString()}`
                              : ""}
                          </span>
                        )}
                      </div>
                    )}
                    {req.status === "APPROVED" && req.approvedByName && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <b className="text-green-700">Đã duyệt bởi:</b>{" "}
                        <span className="text-green-600">
                          {req.approvedByName}
                        </span>
                        {req.respondedAt && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({new Date(req.respondedAt).toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}
                    {req.status === "PENDING" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          disabled={actionLoading}
                          className="px-3 py-1 bg-green-500 text-white rounded"
                          onClick={() => handleApprove(req.id)}
                        >
                          Duyệt
                        </button>
                        <button
                          disabled={actionLoading}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => setSelectedRejectId(req.id)}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                    {selectedRejectId === req.id && (
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          className="w-full border p-2 rounded"
                          placeholder="Nhập lý do từ chối..."
                          value={rejectNote}
                          onChange={(e) => setRejectNote(e.target.value)}
                        />
                        <button
                          disabled={actionLoading}
                          className="mt-2 px-4 py-1 bg-red-600 text-white rounded"
                          onClick={handleReject}
                        >
                          Gửi lý do từ chối
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
