import React, { useEffect, useRef, useState } from "react";
import reviewService from "../../services/reviewService";
import reviewReplyService from "../../services/reviewReplyService";
import {
  Star,
  Smile,
  Edit,
  Trash2,
  X,
  Check,
  CornerDownLeft,
} from "lucide-react";
import StarRating from "./StarRating";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import useAuth from "../../hooks/useAuth";
import { usePopper } from "react-popper";

// Emoji Button
function EmojiButton({ onSelect }) {
  const [show, setShow] = useState(false);
  const btnRef = useRef(null);
  const pickerRef = useRef(null);
  const [popperEl, setPopperEl] = useState(null);
  const { styles, attributes } = usePopper(btnRef.current, popperEl, {
    placement: "bottom-end",
    modifiers: [{ name: "preventOverflow", options: { boundary: "viewport" } }],
  });

  useEffect(() => {
    if (!show) return;
    function handler(e) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setShow(false);
      }
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [show]);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        ref={btnRef}
        className="hover:bg-gray-100 active:scale-95 rounded-full p-1 text-orange-400 transition"
        style={{ background: "none" }}
        onClick={(e) => {
          e.stopPropagation();
          setShow((s) => !s);
        }}
      >
        <Smile className="w-6 h-6" />
      </button>
      {show && (
        <div
          ref={setPopperEl}
          style={{
            zIndex: 1000,
            ...styles.popper,
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.14)",
            borderRadius: 18,
            background: "#fff",
            padding: 3,
          }}
          {...attributes.popper}
        >
          <div ref={pickerRef}>
            <Picker
              data={data}
              theme="light"
              onEmojiSelect={(emoji) => {
                onSelect(emoji);
                setShow(false);
              }}
            />
          </div>
        </div>
      )}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN");
}

const ReviewSection = ({ showingTimeId, canReview, organizerId, onClose }) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState({});
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterStar, setFilterStar] = useState(0);

  // Edit, reply, state
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [replyContent, setReplyContent] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});
  const [replySubmitting, setReplySubmitting] = useState({});
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState("");

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [showingTimeId]);

  const fetchReplies = async (reviewsList) => {
    const all = {};
    await Promise.all(
      reviewsList.map(async (r) => {
        try {
          const data = await reviewReplyService.getRepliesByReview(r.reviewId);
          all[r.reviewId] = data || [];
        } catch {
          all[r.reviewId] = [];
        }
      })
    );
    setReplies(all);
  };

  const fetchReviews = () => {
    setLoading(true);
    reviewService
      .getReviews(showingTimeId)
      .then((data) => {
        setReviews(data);
        fetchReplies(data);
      })
      .catch(() => {
        setReviews([]);
        setReplies({});
      })
      .finally(() => setLoading(false));
  };

  // Gửi review mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || rating === 0) return;
    setSubmitting(true);
    try {
      await reviewService.submitReview(
        showingTimeId,
        { comment: content, rating },
        user.id
      );
      setContent("");
      setRating(0);
      fetchReviews();
    } catch {
      alert("Gửi đánh giá thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const startEdit = (review) => {
    setEditId(review.reviewId);
    setEditContent(review.comment);
    setEditRating(review.rating);
  };
  const handleEditSubmit = async (e, reviewId) => {
    e.preventDefault();
    if (!editContent || editRating === 0) return;
    setSubmitting(true);
    try {
      await reviewService.updateReview(
        reviewId,
        { comment: editContent, rating: editRating },
        user.id
      );
      setEditId(null);
      setEditContent("");
      setEditRating(0);
      fetchReviews();
    } catch {
      alert("Sửa bình luận thất bại!");
    } finally {
      setSubmitting(false);
    }
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditContent("");
    setEditRating(0);
  };
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?"))
      return;
    setDeleting(true);
    try {
      await reviewService.deleteReview(reviewId, user.id);
      fetchReviews();
    } catch {
      alert("Xóa bình luận thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  // --- REPLY ---
  const toggleReplyBox = (reviewId) => {
    setShowReplyBox((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
    setReplyContent((prev) => ({ ...prev, [reviewId]: "" }));
  };
  const handleReplySubmit = async (reviewId) => {
    if (!replyContent[reviewId]?.trim()) return;
    setReplySubmitting((prev) => ({ ...prev, [reviewId]: true }));
    try {
      if (!user) {
        alert("Bạn cần đăng nhập với tài khoản tổ chức để phản hồi!");
        return;
      }
      const req = { reviewId, content: replyContent[reviewId] };
      await reviewReplyService.createReply(req);
      setReplyContent((prev) => ({ ...prev, [reviewId]: "" }));
      setShowReplyBox((prev) => ({ ...prev, [reviewId]: false }));
      fetchReviews();
    } catch {
      alert("Gửi phản hồi thất bại!");
    } finally {
      setReplySubmitting((prev) => ({ ...prev, [reviewId]: false }));
    }
  };
  // Edit/Xóa reply
  const startEditReply = (reply) => {
    setEditReplyId(reply.id);
    setEditReplyContent(reply.content);
  };
  const handleEditReplySubmit = async (reply, reviewId) => {
    if (!editReplyContent) return;
    setReplySubmitting((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await reviewReplyService.updateReply(reply.id, {
        reviewId,
        content: editReplyContent,
      });
      setEditReplyId(null);
      setEditReplyContent("");
      fetchReviews();
    } catch {
      alert("Sửa phản hồi thất bại!");
    } finally {
      setReplySubmitting((prev) => ({ ...prev, [reviewId]: false }));
    }
  };
  const handleDeleteReply = async (reply, reviewId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá phản hồi này?")) return;
    setReplySubmitting((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await reviewReplyService.deleteReply(reply.id);
      fetchReviews();
    } catch {
      alert("Xoá phản hồi thất bại!");
    } finally {
      setReplySubmitting((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // UI
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;
  const filteredReviews =
    filterStar === 0 ? reviews : reviews.filter((r) => r.rating === filterStar);

  // Tab style (Cam nhẹ, shadow, hover nâng lên)
  const tabClass = (n) =>
    `px-4 py-2 rounded-full font-medium text-sm border-none shadow-sm transition-all
        ${
          filterStar === n
            ? "bg-gradient-to-tr from-orange-400 to-amber-400 text-white shadow-lg hover:-translate-y-0.5"
            : "bg-white text-orange-500 border border-orange-200 hover:bg-orange-50 hover:shadow"
        }`;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/30 flex items-center justify-center">
      <div
        className="relative rounded-3xl"
        style={{
          width: "100%",
          maxWidth: 800,
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.88)",
          boxShadow:
            "0 16px 60px 0 rgba(40,40,40,0.22), 0 1.5px 8px 0 rgba(255,122,0,0.13)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Nút đóng (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-5 right-5 z-50 p-2 rounded-full text-gray-400 bg-white/90 hover:bg-gray-100 shadow transition"
        >
          <X className="w-6 h-6" />
        </button>
        <div
          className="flex flex-col px-10 pt-10 pb-6"
          style={{
            height: "100%",
            minHeight: 320,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          {/* Star Summary */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[36px] font-bold text-orange-400 drop-shadow-lg">
              {avgRating || "-"}
            </span>
            <Star
              className="w-9 h-9 text-orange-400 drop-shadow"
              fill="#FDBA74"
            />
            <span className="ml-2 text-gray-500 text-lg font-medium">
              ({reviews.length} đánh giá)
            </span>
          </div>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <button className={tabClass(0)} onClick={() => setFilterStar(0)}>
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                className={tabClass(star)}
                onClick={() => setFilterStar(star)}
              >
                {star} <Star className="w-4 h-4 inline" />
              </button>
            ))}
          </div>
          {/* Review List */}
          <div
            className="flex flex-col gap-5 mb-7"
            style={{
              maxHeight: 320,
              overflowY: "auto",
              paddingRight: 8,
            }}
          >
            {loading ? (
              <div className="text-center text-orange-400 py-10 font-semibold">
                Đang tải...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-gray-400 text-center py-4 italic">
                Chưa có đánh giá nào.
              </div>
            ) : (
              filteredReviews.map((r, idx) => (
                <div
                  key={r.reviewId}
                  className="bg-white/90 rounded-2xl px-7 py-5 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  style={{
                    boxShadow:
                      "0 3px 18px 0 rgba(255,149,30,0.08), 0 1.5px 7px 0 rgba(40,41,61,0.09)",
                  }}
                >
                  {/* User row */}
                  <div className="flex gap-3 items-center mb-1">
                    <div className="w-11 h-11 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-full flex items-center justify-center text-lg font-bold text-orange-500 shadow">
                      {(r.userFullName?.charAt(0) ?? "A").toUpperCase()}
                    </div>
                    <span className="font-semibold text-lg text-gray-900">
                      {r.userFullName ?? "Ẩn danh"}
                    </span>
                    <span className="flex ml-2">
                      {Array(r.rating)
                        .fill()
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-orange-400"
                            fill="#FDBA74"
                          />
                        ))}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {formatDate(r.createdAt)}
                    </span>
                    {/* Edit/Delete */}
                    {user && user.id === r.userId && editId !== r.reviewId && (
                      <div className="flex gap-2 ml-2">
                        <button
                          type="button"
                          onClick={() => startEdit(r)}
                          title="Sửa"
                          className="p-1 rounded hover:bg-orange-50 text-orange-400"
                        >
                          <Edit size={19} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.reviewId)}
                          title="Xóa"
                          className="p-1 rounded hover:bg-gray-100 text-gray-400"
                          disabled={deleting}
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Nếu đang edit bình luận */}
                  {editId === r.reviewId ? (
                    <form
                      className="flex flex-col gap-2 mb-2"
                      onSubmit={(e) => handleEditSubmit(e, r.reviewId)}
                    >
                      <div className="flex gap-2 mb-1 items-center">
                        <StarRating
                          value={editRating}
                          onChange={setEditRating}
                          size={24}
                          color="#FDBA74"
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-300 resize-none text-base"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          required
                          rows={2}
                          placeholder="Nhập nội dung chỉnh sửa..."
                        />
                        <div className="absolute right-2 bottom-2">
                          <EmojiButton
                            onSelect={(emoji) =>
                              setEditContent((prev) => prev + emoji.native)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end mt-1">
                        <button
                          type="button"
                          className="flex items-center gap-1 px-4 py-1 text-base font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                          onClick={cancelEdit}
                        >
                          <X className="w-4 h-4" /> Hủy
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1 px-4 py-1 text-base font-semibold rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg transition"
                          disabled={
                            submitting || !editContent || editRating === 0
                          }
                        >
                          <Check className="w-4 h-4" /> Lưu
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-[16px] text-gray-900 mb-1">
                      {r.comment}
                    </div>
                  )}

                  {/* Reply List + Reply Box */}
                  <div className="ml-8 mt-2 flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-2">
                    {replies[r.reviewId] &&
                      replies[r.reviewId].length > 0 &&
                      replies[r.reviewId].map((reply) =>
                        editReplyId === reply.id ? (
                          <form
                            key={reply.id}
                            className="flex flex-col gap-1 mb-2"
                          >
                            <div className="relative">
                              <textarea
                                value={editReplyContent}
                                onChange={(e) =>
                                  setEditReplyContent(e.target.value)
                                }
                                className="w-full rounded-xl border px-3 py-2"
                                rows={2}
                                required
                                placeholder="Nhập nội dung chỉnh sửa..."
                              />
                              <div className="absolute right-2 bottom-2">
                                <EmojiButton
                                  onSelect={(emoji) =>
                                    setEditReplyContent(
                                      (prev) => prev + emoji.native
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                className="px-4 py-1 bg-gray-100 rounded"
                                onClick={() => setEditReplyId(null)}
                              >
                                Huỷ
                              </button>
                              <button
                                type="button"
                                className="px-4 py-1 bg-gradient-to-tr from-orange-400 to-amber-400 text-white rounded shadow"
                                disabled={replySubmitting[r.reviewId]}
                                onClick={() =>
                                  handleEditReplySubmit(reply, r.reviewId)
                                }
                              >
                                Lưu
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div
                            key={reply.id}
                            className="flex items-start gap-2 bg-orange-50 rounded-xl p-3 mb-1 border border-orange-200 shadow"
                            style={{
                              boxShadow: "0 2px 12px 0 rgba(255,168,77,0.11)",
                            }}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-orange-200 to-amber-100 flex items-center justify-center font-bold text-orange-500">
                              O
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-orange-500 text-sm mb-1">
                                Phản hồi từ BTC
                              </div>
                              <div className="text-gray-800 text-[15px]">
                                {reply.content}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatDate(reply.createdAt)}
                              </div>
                            </div>
                            {user &&
                              (user.organizer?.id ?? user.organizerId) ===
                                reply.organizerId && (
                                <div className="flex flex-col gap-1 ml-2">
                                  <button
                                    className="text-orange-400 hover:text-orange-500"
                                    title="Sửa"
                                    onClick={() => startEditReply(reply)}
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-orange-300"
                                    title="Xoá"
                                    onClick={() =>
                                      handleDeleteReply(reply, r.reviewId)
                                    }
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              )}
                          </div>
                        )
                      )}
                    {/* Reply input bên dưới */}
                    {user &&
                      (user.roles?.includes("ORGANIZER") ||
                        user.role === "ORGANIZER") &&
                      user.organizerId === organizerId &&
                      showReplyBox[r.reviewId] && (
                        <form
                          className="flex items-end gap-2 mt-2 bg-white z-10 pt-1"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleReplySubmit(r.reviewId);
                          }}
                        >
                          <div className="relative flex-1">
                            <textarea
                              value={replyContent[r.reviewId] || ""}
                              onChange={(e) =>
                                setReplyContent((prev) => ({
                                  ...prev,
                                  [r.reviewId]: e.target.value,
                                }))
                              }
                              className="w-full pr-12 rounded-xl border border-orange-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-orange-300 resize-none text-base shadow"
                              required
                              rows={2}
                              placeholder="Phản hồi bình luận này..."
                            />
                            <div className="absolute right-2 bottom-2">
                              <EmojiButton
                                onSelect={(emoji) =>
                                  setReplyContent((prev) => ({
                                    ...prev,
                                    [r.reviewId]:
                                      (prev[r.reviewId] || "") + emoji.native,
                                  }))
                                }
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 text-white shadow hover:-translate-y-0.5 hover:shadow-lg transition"
                            disabled={
                              replySubmitting[r.reviewId] ||
                              !replyContent[r.reviewId]
                            }
                          >
                            <CornerDownLeft className="w-5 h-5" /> Gửi
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                            onClick={() => toggleReplyBox(r.reviewId)}
                          >
                            <X className="w-5 h-5" /> Hủy
                          </button>
                        </form>
                      )}
                    {/* Nút "Phản hồi" */}
                    {!showReplyBox[r.reviewId] &&
                      user &&
                      (user.roles?.includes("ORGANIZER") ||
                        user.role === "ORGANIZER") &&
                      user.organizerId === organizerId && (
                        <button
                          className="flex items-center gap-2 mt-1 px-4 py-1 rounded-full bg-orange-50 text-orange-500 font-semibold text-sm hover:bg-orange-100 transition shadow"
                          onClick={() => toggleReplyBox(r.reviewId)}
                        >
                          <CornerDownLeft className="w-4 h-4" /> Phản hồi
                        </button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Review Form - Chỉ hiển thị khi có thể review */}
          {canReview ? (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 items-end mt-auto rounded-2xl bg-white/95 shadow-lg px-4 py-3 border border-orange-50"
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    size={22}
                    color="#FDBA74"
                  />
                  <span className="text-base text-orange-400 font-semibold">
                    {rating > 0 && `${rating} sao`}
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-orange-300 resize-none text-base"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Cảm nghĩ của bạn về suất chiếu này? 😊"
                    required
                  />
                  <div className="absolute right-2 bottom-2">
                    <EmojiButton
                      onSelect={(emoji) =>
                        setContent((prev) => prev + emoji.native)
                      }
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="px-8 py-2 text-lg font-bold rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                disabled={submitting || !content || rating === 0}
              >
                {submitting ? "Đang gửi..." : "Gửi"}
              </button>
            </form>
          ) : (
            <div className="mt-auto rounded-2xl bg-orange-50/80 shadow-lg px-6 py-4 border border-orange-100 text-center">
              {!user ? (
                <div>
                  <p className="text-orange-600 font-medium mb-2">
                    Bạn cần đăng nhập để đánh giá
                  </p>
                  <p className="text-orange-500 text-sm">
                    Hãy đăng nhập và tham gia sự kiện để chia sẻ trải nghiệm của
                    bạn
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-orange-600 font-medium mb-2">
                    Bạn chưa tham gia sự kiện này
                  </p>
                  <p className="text-orange-500 text-sm">
                    Chỉ những người đã tham gia mới có thể đánh giá sự kiện
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
