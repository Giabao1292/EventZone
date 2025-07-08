import React, { useEffect, useState } from "react";
import reviewService from "../services/reviewService";
import reviewReplyService from "../services/reviewReplyService";
import useAuth from "../hooks/useAuth";
import { Star, MessageSquareText, CornerDownLeft, Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ReviewManagementPage = () => {
    const { user } = useAuth();

    // State cho lọc
    const [events, setEvents] = useState([]);
    const [showingTimes, setShowingTimes] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedShowingTime, setSelectedShowingTime] = useState(null);
    const [filterStar, setFilterStar] = useState(0);
    const [search, setSearch] = useState("");

    // State cho bảng
    const [reviews, setReviews] = useState([]);
    const [replies, setReplies] = useState({});
    const [loading, setLoading] = useState(false);

    // Reply state
    const [replyContent, setReplyContent] = useState({});
    const [replying, setReplying] = useState({});
    const [showEmoji, setShowEmoji] = useState({});

    // Lấy danh sách event của organizer khi vào trang
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // API lấy sự kiện của organizer
                const res = await fetch("/api/events/myevents", { headers: { Authorization: `Bearer ${user.token}` } });
                const data = await res.json();
                setEvents(data.data || []);
                if (data.data && data.data.length > 0) setSelectedEvent(data.data[0].id);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchEvents();
    }, [user]);

    // Lấy suất chiếu khi chọn event
    useEffect(() => {
        const fetchShowingTimes = async () => {
            setLoading(true);
            try {
                if (selectedEvent) {
                    const res = await fetch(`/api/events/${selectedEvent}/showing-times`, { headers: { Authorization: `Bearer ${user.token}` } });
                    const data = await res.json();
                    setShowingTimes(data.data || []);
                    if (data.data && data.data.length > 0) setSelectedShowingTime(data.data[0].id);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchShowingTimes();
    }, [selectedEvent, user]);

    // Lấy review khi chọn showingTime
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                if (selectedShowingTime) {
                    // Gọi API lấy review của suất chiếu
                    const reviewData = await reviewService.getReviews(selectedShowingTime);
                    setReviews(reviewData);
                    // Lấy replies cho tất cả reviews
                    let replyMap = {};
                    await Promise.all(
                        reviewData.map(async (r) => {
                            try {
                                const replyList = await reviewReplyService.getRepliesByReview(r.reviewId, user.token);
                                replyMap[r.reviewId] = replyList;
                            } catch { replyMap[r.reviewId] = []; }
                        })
                    );
                    setReplies(replyMap);
                }
            } finally {
                setLoading(false);
            }
        };
        if (selectedShowingTime) fetchReviews();
    }, [selectedShowingTime, user]);

    // Lọc theo sao và tìm kiếm
    const filteredReviews = reviews.filter((r) => {
        const starMatch = filterStar === 0 || r.rating === filterStar;
        const keyword = search.trim().toLowerCase();
        const keywordMatch =
            !keyword ||
            r.userFullName?.toLowerCase().includes(keyword) ||
            r.userEmail?.toLowerCase().includes(keyword) ||
            r.comment?.toLowerCase().includes(keyword);
        return starMatch && keywordMatch;
    });

    // Gửi phản hồi
    const handleReply = async (reviewId) => {
        if (!replyContent[reviewId]?.trim()) return;
        setReplying((prev) => ({ ...prev, [reviewId]: true }));
        try {
            const payload = {
                reviewId,
                organizerId: user.organizer?.id ?? user.organizerId,
                content: replyContent[reviewId]
            };
            await reviewReplyService.createReply(payload, user.token);
            setReplyContent((prev) => ({ ...prev, [reviewId]: "" }));
            // Reload replies
            const newReply = await reviewReplyService.getRepliesByReview(reviewId, user.token);
            setReplies((prev) => ({ ...prev, [reviewId]: newReply }));
        } catch {
            alert("Phản hồi thất bại!");
        } finally {
            setReplying((prev) => ({ ...prev, [reviewId]: false }));
        }
    };

    // Giao diện
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-emerald-800 mb-7 flex items-center gap-2">
                <MessageSquareText className="w-8 h-8 text-emerald-500" />
                Quản lý đánh giá sự kiện
            </h1>
            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-4 items-center mb-8 bg-white shadow p-4 rounded-xl border border-emerald-100">
                <select value={selectedEvent || ""} onChange={e => setSelectedEvent(Number(e.target.value))}
                        className="px-4 py-2 rounded-lg border border-gray-200">
                    {events.map(ev => (
                        <option value={ev.id} key={ev.id}>{ev.title || ev.name || `Sự kiện #${ev.id}`}</option>
                    ))}
                </select>
                <select value={selectedShowingTime || ""} onChange={e => setSelectedShowingTime(Number(e.target.value))}
                        className="px-4 py-2 rounded-lg border border-gray-200">
                    {showingTimes.map(st => (
                        <option value={st.id} key={st.id}>
                            {st.name || st.startTime ? new Date(st.startTime).toLocaleString("vi-VN") : `Suất #${st.id}`}
                        </option>
                    ))}
                </select>
                <select value={filterStar} onChange={e => setFilterStar(Number(e.target.value))}
                        className="px-4 py-2 rounded-lg border border-gray-200">
                    <option value={0}>Tất cả</option>
                    {[5,4,3,2,1].map(star => (
                        <option value={star} key={star}>{star} sao</option>
                    ))}
                </select>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên/email/nội dung..."
                       className="px-4 py-2 rounded-lg border border-gray-200 flex-1 min-w-[220px]" />
            </div>

            {/* Bảng đánh giá */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-emerald-100">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-gradient-to-r from-emerald-200 via-lime-100 to-cyan-100 sticky top-0">
                    <tr>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base">#</th>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base text-left">Người mua</th>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base text-left">Email</th>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base text-left">Đánh giá</th>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base text-left">Bình luận</th>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base">Ngày gửi</th>
                        <th className="px-4 py-3 font-bold text-emerald-700 text-base">Phản hồi tổ chức</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={7} className="text-center py-10">Đang tải...</td></tr>
                    ) : filteredReviews.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-7 text-emerald-500 italic">Không có đánh giá nào.</td></tr>
                    ) : filteredReviews.map((r, idx) => (
                        <tr key={r.reviewId} className={classNames("border-b", idx % 2 === 1 ? "bg-emerald-50/20" : "")}>
                            <td className="px-4 py-3 text-center font-semibold">{idx+1}</td>
                            <td className="px-4 py-3 font-medium">{r.userFullName}</td>
                            <td className="px-4 py-3">{r.userEmail || "--"}</td>
                            <td className="px-4 py-3">
                  <span className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="#fde047"/>)}
                  </span>
                            </td>
                            <td className="px-4 py-3 whitespace-pre-line">{r.comment}</td>
                            <td className="px-4 py-3 text-xs">{r.createdAt && new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                            <td className="px-4 py-3 min-w-[210px]">
                                {/* Hiển thị phản hồi đầu tiên (1 review chỉ cho 1 reply) */}
                                {replies[r.reviewId] && replies[r.reviewId].length > 0 ? (
                                    <div className="rounded bg-emerald-100 text-emerald-900 px-3 py-2 shadow text-sm relative">
                                        {replies[r.reviewId][0].content}
                                        <div className="text-xs text-gray-500 mt-1">
                                            {replies[r.reviewId][0].createdAt && new Date(replies[r.reviewId][0].createdAt).toLocaleString("vi-VN")}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <form
                                            className="flex items-center gap-2"
                                            onSubmit={e => {
                                                e.preventDefault();
                                                handleReply(r.reviewId);
                                            }}
                                        >
                                            <input
                                                value={replyContent[r.reviewId] || ""}
                                                onChange={e =>
                                                    setReplyContent(prev => ({ ...prev, [r.reviewId]: e.target.value }))
                                                }
                                                className="flex-1 rounded-full px-3 py-2 border border-emerald-300 focus:outline-emerald-400 bg-white text-sm"
                                                placeholder="Phản hồi đánh giá..."
                                                disabled={replying[r.reviewId]}
                                            />
                                            <button
                                                type="button"
                                                className="text-xl text-emerald-400 hover:scale-110 active:scale-90 transition"
                                                onClick={() =>
                                                    setShowEmoji(prev => ({
                                                        ...prev,
                                                        [r.reviewId]: !prev[r.reviewId],
                                                    }))
                                                }
                                                tabIndex={-1}
                                                aria-label="Chèn emoji"
                                            >
                                                <Smile className="w-5 h-5" />
                                            </button>
                                            {showEmoji[r.reviewId] && (
                                                <div className="absolute z-30" style={{ right: 0, bottom: "2.5rem" }}>
                                                    <Picker
                                                        data={data}
                                                        onEmojiSelect={emoji =>
                                                            setReplyContent(prev => ({
                                                                ...prev,
                                                                [r.reviewId]: (prev[r.reviewId] || "") + emoji.native,
                                                            }))
                                                        }
                                                        theme="light"
                                                    />
                                                </div>
                                            )}
                                            <button
                                                type="submit"
                                                className="ml-1 bg-emerald-500 text-white rounded-full px-4 py-2 text-sm font-bold hover:bg-emerald-600 transition flex items-center gap-1"
                                                disabled={replying[r.reviewId] || !replyContent[r.reviewId]?.trim()}
                                            >
                                                <CornerDownLeft className="w-4 h-4" />
                                                Gửi
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewManagementPage;
