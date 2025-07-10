import React, { useEffect, useState } from "react";
import reviewService from "../services/reviewService";
import reviewReplyService from "../services/reviewReplyService";
import * as eventService from "../services/eventService";
import useAuth from "../hooks/useAuth";
import { Star, MessageSquareText, CornerDownLeft, Smile, EyeOff, Eye } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const ReviewManagementPage = () => {
    const { user } = useAuth();

    const [events, setEvents] = useState([]);
    const [showingTimes, setShowingTimes] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedShowingTime, setSelectedShowingTime] = useState("");
    const [filterStar, setFilterStar] = useState(0);
    const [search, setSearch] = useState("");

    const [reviews, setReviews] = useState([]);
    const [replies, setReplies] = useState({});
    const [loading, setLoading] = useState(false);

    const [replyContent, setReplyContent] = useState({});
    const [replying, setReplying] = useState({});
    const [showEmoji, setShowEmoji] = useState({});
    const [hiding, setHiding] = useState({});

    // Lấy sự kiện của organizer
    useEffect(() => {
        if (!user) return;
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await eventService.getMyEvents(user.token);
                setEvents(data || []);
                if (data && data.length > 0) setSelectedEvent(data[0].id);
                else setSelectedEvent("");
            } catch (error) {
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
            setLoading(true);
            try {
                const res = await eventService.getEventShowingTimes(selectedEvent);
                setShowingTimes(res.data || []);
                if (res.data && res.data.length > 0) setSelectedShowingTime(res.data[0].id);
                else setSelectedShowingTime("");
            } catch (error) {
                setShowingTimes([]);
                setSelectedShowingTime("");
            } finally {
                setLoading(false);
            }
        };
        fetchShowingTimes();
    }, [selectedEvent]);

    // Lấy reviews và replies khi đổi suất chiếu
    useEffect(() => {
        if (!selectedShowingTime) {
            setReviews([]);
            setReplies({});
            return;
        }
        const fetchReviews = async () => {
            setLoading(true);
            try {
                // Lấy tất cả review (active + deleted) cho organizer
                const reviewList = await reviewService.getReviews(selectedShowingTime, "all");
                setReviews(reviewList || []);
                let replyMap = {};
                await Promise.all(
                    (reviewList || []).map(async (r) => {
                        try {
                            const replyList = await reviewReplyService.getRepliesByReview(r.reviewId);
                            replyMap[r.reviewId] = replyList;
                        } catch {
                            replyMap[r.reviewId] = [];
                        }
                    })
                );
                setReplies(replyMap);
            } catch (error) {
                setReviews([]);
                setReplies({});
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [selectedShowingTime]);

    // Lọc reviews theo search/star, không ẩn review nào khỏi bảng cho organizer
    const filteredReviews = reviews.filter((r) => {
        const starMatch = filterStar === 0 || r.rating === filterStar;
        const keyword = search.trim().toLowerCase();
        const keywordMatch =
            !keyword ||
            (r.userEmail && r.userEmail.toLowerCase().includes(keyword)) ||
            (r.comment && r.comment.toLowerCase().includes(keyword));
        return starMatch && keywordMatch;
    });

    // Thống kê số lượng và tỉ lệ review theo sao (chỉ tính review "active")
    const reviewActive = reviews.filter(r => r.status === "active");
    const starCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviewActive.filter(r => r.rating === star).length,
    }));
    const totalReviews = reviewActive.length;
    const starData = starCounts.map(item => ({
        ...item,
        percent: totalReviews === 0 ? 0 : Math.round((item.count / totalReviews) * 100),
    }));

    // Gửi reply
    const handleReply = async (reviewId) => {
        if (!replyContent[reviewId]?.trim()) return;
        setReplying((prev) => ({ ...prev, [reviewId]: true }));
        try {
            const payload = {
                reviewId,
                organizerId: user.organizer?.id ?? user.organizerId,
                content: replyContent[reviewId],
            };
            await reviewReplyService.createReply(payload);
            setReplyContent((prev) => ({ ...prev, [reviewId]: "" }));
            const newReply = await reviewReplyService.getRepliesByReview(reviewId);
            setReplies((prev) => ({ ...prev, [reviewId]: newReply }));
        } catch {
            alert("Phản hồi thất bại!");
        } finally {
            setReplying((prev) => ({ ...prev, [reviewId]: false }));
        }
    };

    // Ẩn/hiện bình luận
    const handleToggleStatus = async (reviewId, status) => {
        setHiding((prev) => ({ ...prev, [reviewId]: true }));
        try {
            await reviewService.updateReview(reviewId, { status }, user.id);
            const reviewList = await reviewService.getReviews(selectedShowingTime, "all");
            setReviews(reviewList || []);
        } catch {
            alert("Có lỗi khi cập nhật trạng thái!");
        } finally {
            setHiding((prev) => ({ ...prev, [reviewId]: false }));
        }
    };

    const currentEvent = events.find((ev) => ev.id === selectedEvent);
    const currentShowingTime = showingTimes.find((st) => st.id === selectedShowingTime);

    return (
        <>
            <style>{`
                select, select option {
                    color: #222 !important;
                    background: #fff !important;
                }
                input[type="text"], input[type="search"], input#searchInput {
                    color: #222 !important;
                    background: #fff !important;
                }
                tr.review-deleted {
                    opacity: 0.55;
                    background: #f3f4f6 !important;
                }
            `}</style>
            <div className="w-full max-w-[1400px] mx-auto px-2 py-8 bg-gray-900 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-extrabold text-emerald-400 mb-8 flex items-center gap-3">
                    <MessageSquareText className="w-10 h-10 text-emerald-500" />
                    Quản lý đánh giá sự kiện
                </h1>

                {/* Thống kê + biểu đồ */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    {/* Tổng số review + tỉ lệ */}
                    <div className="bg-white rounded-2xl shadow p-7 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <span className="text-xl font-bold text-emerald-500">
                                    Tổng đánh giá: <span className="text-3xl">{totalReviews}</span>
                                </span>
                                <div className="mt-2 text-gray-700 text-base">
                                    <b>Sự kiện:</b> <span className="text-emerald-600">{currentEvent?.title || currentEvent?.name || "Chưa chọn"}</span>
                                    <br />
                                    <b>Suất chiếu:</b> <span className="text-emerald-600">{currentShowingTime ? new Date(currentShowingTime.startTime).toLocaleString("vi-VN") : "Chưa chọn"}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-4xl text-amber-400 font-bold flex items-center">
                                    {totalReviews === 0
                                        ? "0.0"
                                        : (
                                            reviewActive.reduce((s, r) => s + r.rating, 0) / totalReviews
                                        ).toFixed(1)
                                    }
                                    <Star className="w-7 h-7 ml-2" fill="#facc15" />
                                </span>
                                <span className="block text-base mt-1 text-gray-500">Điểm TB</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {starData.map(item => (
                                <div key={item.star} className="flex items-center gap-4">
                                    <span className="inline-flex items-center w-16 text-base">
                                        {item.star} <Star className="w-5 h-5 mx-1 text-yellow-400" fill="#fde047" />
                                    </span>
                                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            style={{
                                                width: `${item.percent}%`,
                                                background: "linear-gradient(90deg,#34d399,#facc15)",
                                            }}
                                            className="h-full"
                                        ></div>
                                    </div>
                                    <span className="ml-2 min-w-[44px] text-right font-semibold text-gray-700 text-base">
                                        {item.count} ({item.percent}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Biểu đồ cột */}
                    <div className="bg-white rounded-2xl shadow p-7 flex flex-col justify-center">
                        <div className="font-bold text-lg text-emerald-600 mb-2">Biểu đồ số lượng đánh giá theo sao</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={starData} margin={{top: 20, right: 30, left: 0, bottom: 10}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="star" tick={{fontWeight: 'bold', fontSize: 16}} label={{ value: "Số sao", position: 'insideBottom', dy: 14, fontSize: 16 }}/>
                                <YAxis allowDecimals={false} label={{ value: "Số lượng", angle: -90, dx: -10, position: 'insideLeft', fontSize: 16 }} tick={{fontSize: 16}} />
                                <Tooltip formatter={(value, name) => [`${value} đánh giá`, 'Số lượng']} />
                                <Bar dataKey="count" name="Số lượng" fill="#34d399" radius={[8, 8, 0, 0]} barSize={32}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="flex flex-wrap gap-8 items-center mb-10 bg-white shadow p-6 rounded-2xl border border-emerald-200">
                    <div className="flex flex-col min-w-[260px]">
                        <label htmlFor="eventFilter" className="mb-1 font-semibold text-gray-700 text-base">
                            Sự kiện
                        </label>
                        <select
                            id="eventFilter"
                            value={selectedEvent ?? ""}
                            onChange={(e) => setSelectedEvent(Number(e.target.value))}
                            className="min-w-[260px] px-4 py-2 rounded-xl border border-gray-300 focus:outline-emerald-400 text-base"
                        >
                            {events.length === 0 && <option value="">Chưa có sự kiện</option>}
                            {events.map((ev) => (
                                <option key={ev.id} value={ev.id}>
                                    {ev.title || ev.name || `Sự kiện #${ev.id}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[260px]">
                        <label htmlFor="showingTimeFilter" className="mb-1 font-semibold text-gray-700 text-base">
                            Suất chiếu
                        </label>
                        <select
                            id="showingTimeFilter"
                            value={selectedShowingTime ?? ""}
                            onChange={(e) => setSelectedShowingTime(Number(e.target.value))}
                            className="min-w-[260px] px-4 py-2 rounded-xl border border-gray-300 focus:outline-emerald-400 text-base"
                        >
                            {showingTimes.length === 0 && <option value="">Chưa có suất chiếu</option>}
                            {showingTimes.map((st) => (
                                <option key={st.id} value={st.id}>
                                    {st.name || (st.startTime ? new Date(st.startTime).toLocaleString("vi-VN") : `Suất #${st.id}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[160px]">
                        <label htmlFor="starFilter" className="mb-1 font-semibold text-gray-700 text-base">
                            Đánh giá
                        </label>
                        <select
                            id="starFilter"
                            value={filterStar}
                            onChange={(e) => setFilterStar(Number(e.target.value))}
                            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-emerald-400 text-base"
                        >
                            <option value={0}>Tất cả</option>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <option key={star} value={star}>
                                    {star} sao
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col min-w-[200px]">
                        <label htmlFor="searchInput" className="mb-1 font-semibold text-gray-700 text-base">
                            Tìm kiếm (theo email hoặc nội dung)
                        </label>
                        <input
                            id="searchInput"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm email/nội dung..."
                            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-emerald-400 text-base"
                            type="text"
                        />
                    </div>
                </div>

                {/* Bảng review */}
                <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-emerald-200">
                    <table className="w-full table-fixed text-base text-gray-800">
                        <colgroup>
                            <col style={{ width: "48px" }} />
                            <col style={{ width: "24%" }} />
                            <col style={{ width: "13%" }} />
                            <col style={{ width: "22%" }} />
                            <col style={{ width: "14%" }} />
                            <col style={{ width: "27%" }} />
                        </colgroup>
                        <thead className="bg-gradient-to-r from-emerald-200 via-lime-100 to-cyan-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-4 font-bold text-emerald-700 text-lg text-center">#</th>
                            <th className="px-4 py-4 font-bold text-emerald-700 text-lg text-left">Email</th>
                            <th className="px-4 py-4 font-bold text-emerald-700 text-lg text-left">Đánh giá</th>
                            <th className="px-4 py-4 font-bold text-emerald-700 text-lg text-left">Bình luận</th>
                            <th className="px-4 py-4 font-bold text-emerald-700 text-lg text-center">Ngày gửi</th>
                            <th className="px-4 py-4 font-bold text-emerald-700 text-lg text-center">Phản hồi tổ chức</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-lg">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-emerald-500 italic text-lg">
                                    Không có đánh giá nào.
                                </td>
                            </tr>
                        ) : (
                            filteredReviews.map((r, idx) => (
                                <tr
                                    key={r.reviewId}
                                    className={classNames(
                                        r.status === "deleted" ? "review-deleted" : "",
                                        "border-b",
                                        idx % 2 === 1 ? "bg-emerald-50/20" : ""
                                    )}
                                >
                                    <td className="px-4 py-5 text-center font-semibold">{idx + 1}</td>
                                    <td className="px-4 py-5 break-words">{r.userEmail || "--"}</td>
                                    <td className="px-4 py-5">
                                        <span className="flex items-center gap-1">
                                            {[...Array(r.rating)].map((_, i) => (
                                                <Star key={i} className="w-6 h-6 text-yellow-400" fill="#fde047" />
                                            ))}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 whitespace-pre-line">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="flex-1 break-words">{r.comment}</span>
                                            {(user?.organizer || user?.isAdmin) && (
                                                <button
                                                    className={classNames(
                                                        "ml-2 inline-flex items-center gap-1 text-sm rounded px-3 py-1 font-semibold shadow transition",
                                                        r.status === "active"
                                                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                                                            : "bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300"
                                                    )}
                                                    disabled={hiding[r.reviewId]}
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            r.reviewId,
                                                            r.status === "active" ? "deleted" : "active"
                                                        )
                                                    }
                                                    title={r.status === "active" ? "Ẩn bình luận này" : "Hiện bình luận lại"}
                                                    style={{ minWidth: 75 }}
                                                >
                                                    {hiding[r.reviewId]
                                                        ? "..."
                                                        : r.status === "active"
                                                            ? (<><EyeOff className="w-4 h-4" /> Ẩn</>)
                                                            : (<><Eye className="w-4 h-4" /> Hiện</>)
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        {r.createdAt && new Date(r.createdAt).toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-4 py-5 min-w-[250px] break-words">
                                        {replies[r.reviewId] && replies[r.reviewId].length > 0 ? (
                                            <div className="rounded-xl bg-emerald-100 text-emerald-900 px-5 py-4 shadow text-base relative">
                                                {replies[r.reviewId][0].content}
                                                <div className="text-sm text-gray-500 mt-2">
                                                    {replies[r.reviewId][0].createdAt &&
                                                        new Date(replies[r.reviewId][0].createdAt).toLocaleString("vi-VN")}
                                                </div>
                                            </div>
                                        ) : (
                                            <form
                                                className="flex items-center gap-2"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleReply(r.reviewId);
                                                }}
                                            >
                                                <input
                                                    value={replyContent[r.reviewId] || ""}
                                                    onChange={(e) =>
                                                        setReplyContent((prev) => ({ ...prev, [r.reviewId]: e.target.value }))
                                                    }
                                                    className="flex-1 rounded-full px-4 py-2 border border-emerald-300 focus:outline-emerald-400 bg-white text-base"
                                                    placeholder="Phản hồi đánh giá..."
                                                    disabled={replying[r.reviewId]}
                                                    type="text"
                                                    style={{ color: "#222", background: "#fff" }}
                                                />
                                                <button
                                                    type="button"
                                                    className="text-xl text-emerald-400 hover:scale-110 active:scale-90 transition"
                                                    onClick={() =>
                                                        setShowEmoji((prev) => ({
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
                                                    <div className="absolute z-30" style={{ right: 0, bottom: "3.5rem" }}>
                                                        <Picker
                                                            data={data}
                                                            onEmojiSelect={(emoji) =>
                                                                setReplyContent((prev) => ({
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
                                                    className="ml-2 bg-emerald-500 text-white rounded-full px-5 py-2 text-base font-bold hover:bg-emerald-600 transition flex items-center gap-2"
                                                    disabled={replying[r.reviewId] || !replyContent[r.reviewId]?.trim()}
                                                >
                                                    <CornerDownLeft className="w-5 h-5" />
                                                    Gửi
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ReviewManagementPage;