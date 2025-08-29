import { useEffect, useState } from "react";
import reviewService from "../services/reviewService";
import reviewReplyService from "../services/reviewReplyService";
import * as eventService from "../services/eventService";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquareText,
  EyeOff,
  Eye,
  X as CloseIcon,
  Pencil,
  Trash2,
  Save,
  X,
  Filter,
  Search,
  MessageCircle,
} from "lucide-react";

// Hàm chuẩn hóa tên sự kiện để luôn có .title cho FE sử dụng
function normalizeEventList(rawEvents) {
  if (!Array.isArray(rawEvents)) return [];
  return rawEvents.map((ev) => ({
    ...ev,
    // Ưu tiên lấy title hoặc eventTitle, name, eventName, hoặc fallback
    title:
      ev.title ||
      ev.eventTitle ||
      ev.name ||
      ev.eventName ||
      `Sự kiện #${ev.id}`,
  }));
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ReviewManagementPage = () => {
  const { user } = useAuth();

  // State
  const [events, setEvents] = useState([]);
  const [showingTimes, setShowingTimes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedShowingTime, setSelectedShowingTime] = useState("");
  const [filterStar, setFilterStar] = useState(0);
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(false);

  // Reply state
  const [replyContent, setReplyContent] = useState({});
  const [replying, setReplying] = useState({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalReviewId, setModalReviewId] = useState(null);

  // Sửa reply trong modal
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  // Thêm reply trong modal
  const [modalReplyContent, setModalReplyContent] = useState("");
  const [modalReplying, setModalReplying] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    repliedCount: 0,
    hiddenCount: 0,
  });

  // Lấy sự kiện có đánh giá của organizer hiện tại
  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getMyEventsWithReviews(user.token);
        // CHUẨN HÓA LIST SỰ KIỆN
        const normalizedEvents = normalizeEventList(data || []);
        setEvents(normalizedEvents);
        if (normalizedEvents.length > 0)
          setSelectedEvent(normalizedEvents[0].id);
        else setSelectedEvent("");
      } catch {
        setEvents([]);
        setSelectedEvent("");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  // Lấy suất chiếu khi đổi event
  useEffect(() => {
    if (!selectedEvent) {
      setShowingTimes([]);
      setSelectedShowingTime("");
      return;
    }
    const fetchShowingTimes = async () => {
      try {
        const response = await eventService.getEventShowingTimes(selectedEvent);
        const data = response.data || [];
        setShowingTimes(data);
        if (data && data.length > 0) setSelectedShowingTime(data[0].id);
        else setSelectedShowingTime("");
      } catch {
        setShowingTimes([]);
        setSelectedShowingTime("");
      }
    };
    fetchShowingTimes();
  }, [selectedEvent]);

  // Lấy reviews khi đổi showing time
  useEffect(() => {
    if (!selectedShowingTime) {
      setReviews([]);
      return;
    }
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await reviewService.getReviews(selectedShowingTime, "all");
        setReviews(data || []);

        // Tính toán stats
        const totalReviews = data?.length || 0;
        const avgRating =
          totalReviews > 0
            ? data.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            : 0;
        const repliedCount =
          data?.filter((review) => review.replies?.length > 0).length || 0;
        const hiddenCount =
          data?.filter((review) => review.status === "deleted").length || 0;

        setStats({
          totalReviews,
          avgRating: Math.round(avgRating * 10) / 10,
          repliedCount,
          hiddenCount,
        });
      } catch {
        setReviews([]);
        setStats({
          totalReviews: 0,
          avgRating: 0,
          repliedCount: 0,
          hiddenCount: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [selectedShowingTime]);

  // Lấy replies cho từng review
  useEffect(() => {
    const fetchReplies = async () => {
      const repliesData = {};
      for (const review of reviews) {
        try {
          const data = await reviewReplyService.getRepliesByReviewId(
            review.reviewId
          );
          repliesData[review.reviewId] = data || [];
        } catch {
          repliesData[review.reviewId] = [];
        }
      }
      setReplies(repliesData);
    };
    if (reviews.length > 0) {
      fetchReplies();
    }
  }, [reviews]);

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.comment?.toLowerCase().includes(search.toLowerCase()) ||
      review.userEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStar = filterStar === 0 || review.rating === filterStar;
    return matchesSearch && matchesStar;
  });

  const handleReply = async (reviewId) => {
    if (!replyContent[reviewId]?.trim()) return;

    setReplying((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await reviewReplyService.createReply(reviewId, replyContent[reviewId]);
      setReplyContent((prev) => ({ ...prev, [reviewId]: "" }));
      // Refresh replies
      const newReplies = await reviewReplyService.getRepliesByReviewId(
        reviewId
      );
      setReplies((prev) => ({ ...prev, [reviewId]: newReplies }));
    } catch (error) {
      console.error("Lỗi khi trả lời:", error);
    } finally {
      setReplying((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleToggleStatus = async (reviewId, status) => {
    try {
      await reviewService.updateReview(reviewId, { status }, user.id);
      setReviews((prev) =>
        prev.map((review) =>
          review.reviewId === reviewId ? { ...review, status: status } : review
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const openReplyModal = (reviewId) => {
    setModalReviewId(reviewId);
    setShowModal(true);
    setModalReplyContent("");
  };

  const closeReplyModal = () => {
    setShowModal(false);
    setModalReviewId(null);
    setModalReplyContent("");
    setEditReplyId(null);
    setEditReplyContent("");
  };

  const handleAddModalReply = async () => {
    if (!modalReplyContent.trim()) return;

    setModalReplying(true);
    try {
      await reviewReplyService.createReply(modalReviewId, modalReplyContent);
      setModalReplyContent("");
      // Refresh replies
      const newReplies = await reviewReplyService.getRepliesByReviewId(
        modalReviewId
      );
      setReplies((prev) => ({ ...prev, [modalReviewId]: newReplies }));
    } catch (error) {
      console.error("Lỗi khi thêm reply:", error);
    } finally {
      setModalReplying(false);
    }
  };

  const handleEditReply = (reply) => {
    setEditReplyId(reply.id);
    setEditReplyContent(reply.content);
  };

  const handleUpdateReply = async (reply) => {
    if (!editReplyContent.trim()) return;

    try {
      await reviewReplyService.updateReply(reply.id, editReplyContent);
      setEditReplyId(null);
      setEditReplyContent("");
      // Refresh replies
      const newReplies = await reviewReplyService.getRepliesByReviewId(
        modalReviewId
      );
      setReplies((prev) => ({ ...prev, [modalReviewId]: newReplies }));
    } catch (error) {
      console.error("Lỗi khi cập nhật reply:", error);
    }
  };

  const handleDeleteReply = async (reply) => {
    if (!window.confirm("Bạn có chắc muốn xóa reply này?")) return;

    try {
      await reviewReplyService.deleteReply(reply.id);
      // Refresh replies
      const newReplies = await reviewReplyService.getRepliesByReviewId(
        modalReviewId
      );
      setReplies((prev) => ({ ...prev, [modalReviewId]: newReplies }));
    } catch (error) {
      console.error("Lỗi khi xóa reply:", error);
    }
  };

  function renderLastReply(reviewId) {
    const reviewReplies = replies[reviewId] || [];
    if (reviewReplies.length === 0) return null;

    const lastReply = reviewReplies[reviewReplies.length - 1];
    return (
      <div className="mt-2 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Phản hồi cuối:
          </span>
          <span className="text-xs text-slate-500">
            {new Date(lastReply.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{lastReply.content}</p>
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
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Quản lý đánh giá
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Theo dõi và phản hồi đánh giá từ khách hàng
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
                <p className="text-slate-600 text-sm font-medium">
                  Tổng đánh giá
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalReviews}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                <MessageCircle className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Điểm trung bình
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.avgRating.toFixed(1)} ⭐
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full">
                <Star className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Đã phản hồi
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.repliedCount}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                <MessageSquareText className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Đã ẩn</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.hiddenCount}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                <EyeOff className="text-white" size={20} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-200/50 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="text-blue-500" size={20} />
            <h3 className="text-xl font-semibold text-slate-700">
              Bộ lọc đánh giá
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Sự kiện
              </label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">Chọn sự kiện</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Suất chiếu
              </label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={selectedShowingTime}
                onChange={(e) => setSelectedShowingTime(e.target.value)}
                disabled={!selectedEvent}
              >
                <option value="">Chọn suất chiếu</option>
                {showingTimes.map((st) => (
                  <option key={st.id} value={st.id}>
                    {new Date(st.startTime).toLocaleString("vi-VN")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Đánh giá
              </label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                value={filterStar}
                onChange={(e) => setFilterStar(Number(e.target.value))}
              >
                <option value={0}>Tất cả sao</option>
                <option value={5}>5 sao</option>
                <option value={4}>4 sao</option>
                <option value={3}>3 sao</option>
                <option value={2}>2 sao</option>
                <option value={1}>1 sao</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm theo nội dung hoặc tên..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
              <MessageCircle className="text-blue-500" size={20} />
              <span>Danh sách đánh giá ({filteredReviews.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center space-x-2 text-slate-600">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải đánh giá...</span>
              </div>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.reviewId}
                  className="p-6 hover:bg-slate-50/50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={classNames(
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-slate-300",
                                "w-4 h-4"
                              )}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {review.status === "deleted" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Đã ẩn
                          </span>
                        )}
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {review.userEmail?.charAt(0) || "U"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-700">
                              {review.userEmail}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openReplyModal(review.reviewId)}
                                className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                              >
                                <MessageSquareText className="w-4 h-4 mr-1" />
                                Phản hồi
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleStatus(
                                    review.reviewId,
                                    review.status === "deleted"
                                      ? "active"
                                      : "deleted"
                                  )
                                }
                                className={classNames(
                                  "inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200",
                                  review.status === "deleted"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                )}
                              >
                                {review.status === "deleted" ? (
                                  <>
                                    <Eye className="w-4 h-4 mr-1" />
                                    Hiện
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-1" />
                                    Ẩn
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-700 mb-3">
                            {review.comment}
                          </p>

                          {renderLastReply(review.reviewId)}

                          {/* Quick Reply */}
                          <div className="mt-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Viết phản hồi nhanh..."
                                className="flex-1 h-10 px-3 rounded-lg bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                                value={replyContent[review.reviewId] || ""}
                                onChange={(e) =>
                                  setReplyContent((prev) => ({
                                    ...prev,
                                    [review.reviewId]: e.target.value,
                                  }))
                                }
                                onKeyPress={(e) =>
                                  e.key === "Enter" &&
                                  handleReply(review.reviewId)
                                }
                              />
                              <button
                                onClick={() => handleReply(review.reviewId)}
                                disabled={
                                  replying[review.reviewId] ||
                                  !replyContent[review.reviewId]?.trim()
                                }
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {replying[review.reviewId]
                                  ? "Đang gửi..."
                                  : "Gửi"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-slate-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Không có đánh giá</p>
                <p className="text-sm">
                  Hãy thử thay đổi bộ lọc hoặc chọn sự kiện khác
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Reply Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-700 flex items-center space-x-2">
                  <MessageSquareText className="text-blue-500" size={20} />
                  <span>Quản lý phản hồi</span>
                </h3>
                <button
                  onClick={closeReplyModal}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <CloseIcon
                    className="text-slate-400 hover:text-red-500"
                    size={20}
                  />
                </button>
              </div>

              {/* Existing Replies */}
              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-slate-700">
                  Phản hồi hiện tại:
                </h4>
                {(replies[modalReviewId] || []).map((reply) => (
                  <div key={reply.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">
                        {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditReply(reply)}
                          className="p-1 hover:bg-blue-100 rounded transition-colors duration-200"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteReply(reply)}
                          className="p-1 hover:bg-red-100 rounded transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {editReplyId === reply.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editReplyContent}
                          onChange={(e) => setEditReplyContent(e.target.value)}
                          className="w-full p-3 rounded-lg bg-white border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                          rows={3}
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateReply(reply)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors duration-200"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Lưu
                          </button>
                          <button
                            onClick={() => {
                              setEditReplyId(null);
                              setEditReplyContent("");
                            }}
                            className="px-3 py-1 bg-slate-500 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors duration-200"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700">{reply.content}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Reply */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">
                  Thêm phản hồi mới:
                </h4>
                <div className="space-y-2">
                  <textarea
                    value={modalReplyContent}
                    onChange={(e) => setModalReplyContent(e.target.value)}
                    placeholder="Viết phản hồi của bạn..."
                    className="w-full p-4 rounded-xl bg-white/80 border border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleAddModalReply}
                      disabled={modalReplying || !modalReplyContent.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {modalReplying ? "Đang gửi..." : "Gửi phản hồi"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagementPage;
