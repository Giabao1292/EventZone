import React, { useEffect, useState, useRef } from "react";
import reviewService from "../../services/reviewService";
import { Star, MessageSquareText, Smile, Edit, Trash2, X, Check } from "lucide-react";
import StarRating from "./StarRating";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const avatarColors = [
    "bg-gradient-to-br from-pink-200 via-fuchsia-100 to-yellow-100",
    "bg-gradient-to-br from-yellow-200 via-orange-100 to-emerald-100",
    "bg-gradient-to-br from-emerald-100 via-lime-200 to-blue-100",
];

function getAvatarColor(idx) {
    return avatarColors[idx % avatarColors.length];
}

const ReviewSection = ({ showingTimeId, canReview, user }) => {
    const [reviews, setReviews] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [filterStar, setFilterStar] = useState(0);

    // Sửa/Xóa
    const [editId, setEditId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(0);
    const [deleting, setDeleting] = useState(false);

    const emojiPickerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmoji(false);
            }
        }
        if (showEmoji) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEmoji]);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line
    }, [showingTimeId]);

    const fetchReviews = () => {
        setLoading(true);
        reviewService
            .getReviews(showingTimeId)
            .then((data) => setReviews(data))
            .catch(() => setReviews([]))
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

    // Thêm emoji
    const addEmoji = (emoji) => {
        setContent((prev) => prev + emoji.native);
        setShowEmoji(false);
    };

    // Edit: Bấm Sửa
    const startEdit = (review) => {
        setEditId(review.reviewId);
        setEditContent(review.comment);
        setEditRating(review.rating);
    };

    // Edit: Lưu
    const handleEditSubmit = async (e, reviewId) => {
        e.preventDefault();
        if (!editContent || editRating === 0) return;
        setSubmitting(true);
        try {
            await reviewService.updateReview(
                reviewId,
                {
                    comment: editContent,
                    rating: editRating,
                },
                user.id // Đảm bảo truyền user.id
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

    // Edit: Hủy
    const cancelEdit = () => {
        setEditId(null);
        setEditContent("");
        setEditRating(0);
    };

    // Xóa bình luận
    const handleDelete = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) return;
        setDeleting(true);
        try {
            await reviewService.deleteReview(reviewId, user.id); // Đảm bảo truyền user.id
            fetchReviews();
        } catch {
            alert("Xóa bình luận thất bại!");
        } finally {
            setDeleting(false);
        }
    };

    // Tính điểm trung bình
    const avgRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
            ).toFixed(1)
            : null;

    // Lọc review theo số sao
    const filteredReviews =
        filterStar === 0 ? reviews : reviews.filter((r) => r.rating === filterStar);

    return (
        <div className="w-full max-w-[900px] mx-auto my-10">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                {/* HEADER */}
                <div className="flex flex-col items-center px-14 pt-12 pb-5 rounded-t-[40px]
                    bg-gradient-to-r from-emerald-200 via-sky-200 to-indigo-100">
                    <MessageSquareText className="w-14 h-14 text-emerald-700 mb-2" />
                    <span className="font-extrabold text-[2.4rem] text-emerald-900 tracking-tight mb-1 drop-shadow">
                        Đánh giá suất chiếu
                    </span>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[2.7rem] text-yellow-400 font-black">
                            {avgRating || "-"}
                        </span>
                        <Star className="w-10 h-10 text-yellow-400" fill="#fde047" />
                        <span className="ml-2 text-gray-700 text-xl font-medium">
                            ({reviews.length} đánh giá)
                        </span>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="flex justify-center items-center gap-3 px-12 py-6 border-b border-gray-100 bg-white">
                    <div className="flex gap-4">
                        <button
                            className={`px-6 py-2 rounded-full font-bold text-base transition-all shadow-sm
                                ${filterStar === 0
                                ? "bg-emerald-500 text-white shadow"
                                : "bg-gray-100 text-emerald-500 hover:bg-emerald-50"}`}
                            onClick={() => setFilterStar(0)}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                className={`flex items-center gap-1 px-6 py-2 rounded-full font-semibold text-base transition-all shadow-sm
                                    ${filterStar === star
                                    ? "bg-yellow-400 text-white shadow"
                                    : "bg-yellow-50 text-yellow-500 hover:bg-yellow-100"}`}
                                onClick={() => setFilterStar(star)}
                            >
                                <span className="font-bold">{star}</span>
                                <Star className="w-5 h-5" fill="#fde047" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* REVIEW LIST */}
                <div className="px-14 pt-8 pb-8 flex flex-col gap-5 max-h-[520px] overflow-y-auto bg-white">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <span className="loading loading-dots loading-lg text-emerald-400"></span>
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="text-emerald-600 text-center italic text-base py-7">
                            Không có đánh giá nào cho lựa chọn này.
                        </div>
                    ) : (
                        filteredReviews.map((r, idx) => (
                            <div
                                key={r.reviewId}
                                className="flex gap-5 items-start bg-white rounded-2xl shadow border border-gray-100 px-6 py-4"
                            >
                                <div
                                    className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow ${getAvatarColor(
                                        idx
                                    )}`}
                                >
                                    {(r.userFullName?.charAt(0) || "A").toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span>
                                            {Array(r.rating)
                                                .fill()
                                                .map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="inline w-5 h-5 text-yellow-400"
                                                        fill="#fde047"
                                                    />
                                                ))}
                                        </span>
                                        <span className="font-semibold text-gray-800 text-lg">
                                            {r.userFullName || "Ẩn danh"}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2">
                                            {r.createdAt &&
                                                new Date(r.createdAt).toLocaleString("vi-VN")}
                                        </span>
                                        {/* Nút Sửa/Xóa chỉ hiện với bình luận của user hiện tại */}
                                        {user && user.id === r.userId && editId !== r.reviewId && (
                                            <div className="flex gap-2 ml-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(r)}
                                                    title="Sửa bình luận"
                                                    className="text-blue-500 hover:bg-blue-50 rounded-full p-1"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(r.reviewId)}
                                                    title="Xóa bình luận"
                                                    className="text-red-500 hover:bg-red-50 rounded-full p-1"
                                                    disabled={deleting}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Nếu đang edit bình luận này */}
                                    {editId === r.reviewId ? (
                                        <form
                                            className="flex flex-col gap-2 mt-2"
                                            onSubmit={(e) => handleEditSubmit(e, r.reviewId)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <StarRating
                                                    value={editRating}
                                                    onChange={setEditRating}
                                                    size={28}
                                                    color="#fde047"
                                                />
                                            </div>
                                            <textarea
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-300 focus:ring-emerald-300 resize-none text-base shadow"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                required
                                                rows={2}
                                            />
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1 px-4 py-2 text-base font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    onClick={cancelEdit}
                                                >
                                                    <X className="w-5 h-5" /> Hủy
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex items-center gap-1 px-4 py-2 text-base font-semibold rounded-full bg-emerald-500 text-white shadow hover:bg-emerald-600 transition"
                                                    disabled={submitting || !editContent || editRating === 0}
                                                >
                                                    <Check className="w-5 h-5" /> Lưu
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="text-[17px] text-gray-800 font-normal break-words">
                                            {r.comment}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* REVIEW FORM */}
                <div className="px-14 py-8 bg-white rounded-b-[40px] border-t border-gray-100">
                    {canReview && user ? (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <StarRating
                                    value={rating}
                                    onChange={setRating}
                                    size={36}
                                    color="#fde047"
                                />
                                <span className="text-xl text-yellow-400 font-semibold">
                                    {rating > 0 && `${rating} sao`}
                                </span>
                            </div>
                            <div className="relative">
                                <textarea
                                    rows={3}
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-gray-900 placeholder-gray-400 focus:border-emerald-300 focus:ring-emerald-300 resize-none text-base shadow"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Cảm nghĩ của bạn về suất chiếu này? 😊"
                                    required
                                />
                                {/* Emoji button */}
                                <button
                                    type="button"
                                    className="absolute right-5 bottom-5 text-2xl text-emerald-400 hover:scale-110 active:scale-90 transition"
                                    onClick={() => setShowEmoji((show) => !show)}
                                    tabIndex={-1}
                                    aria-label="Chèn emoji"
                                >
                                    <Smile className="w-7 h-7" />
                                </button>
                                {/* Emoji Picker */}
                                {showEmoji && (
                                    <div
                                        ref={emojiPickerRef}
                                        className="absolute right-0 bottom-14 z-50"
                                    >
                                        <Picker
                                            data={data}
                                            onEmojiSelect={addEmoji}
                                            theme="light"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-12 py-3 text-lg font-bold rounded-full
                                        bg-gradient-to-tr from-emerald-400 via-emerald-500 to-lime-400
                                        hover:brightness-110
                                        text-white shadow-xl transition-all duration-150
                                        active:scale-95
                                        disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={submitting || !content || rating === 0}
                                    style={{ letterSpacing: "0.04em" }}
                                >
                                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-base text-emerald-600 italic text-center pt-2">
                            * Đăng nhập và mua vé để gửi đánh giá suất chiếu này.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
