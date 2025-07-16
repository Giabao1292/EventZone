import React, { useEffect, useState, useRef } from "react";
import reviewService from "../services/reviewService";
import reviewReplyService from "../services/reviewReplyService";
import * as eventService from "../services/eventService";
import useAuth from "../hooks/useAuth";
import {
    Star, MessageSquareText, CornerDownLeft, Smile,
    EyeOff, Eye, X as CloseIcon, Pencil, Trash2, Save, X, List
} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// Hook: detect click outside for modal/picker
function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
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
    const [showEmoji, setShowEmoji] = useState({});
    const [hiding, setHiding] = useState({});

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalReviewId, setModalReviewId] = useState(null);

    // Sửa reply trong modal
    const [editReplyId, setEditReplyId] = useState(null);
    const [editReplyContent, setEditReplyContent] = useState("");

    // Thêm reply trong modal
    const [modalReplyContent, setModalReplyContent] = useState("");
    const [modalReplying, setModalReplying] = useState(false);

    // Emoji picker ref
    const [emojiPickerReviewId, setEmojiPickerReviewId] = useState(null);
    const emojiPickerRef = useRef(null);

    // Modal emoji ref
    const modalEmojiRef = useRef();

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
            setLoading(true);
            try {
                const res = await eventService.getEventShowingTimes(selectedEvent);
                setShowingTimes(res.data || []);
                if (res.data && res.data.length > 0) setSelectedShowingTime(res.data[0].id);
                else setSelectedShowingTime("");
            } catch {
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
                const reviewList = await reviewService.getReviews(selectedShowingTime, "all");
                setReviews(reviewList || []);
                let replyMap = {};
                await Promise.all(
                    (reviewList || []).map(async (r) => {
                        try {
                            const replyList = await reviewReplyService.getRepliesByReview(r.reviewId);
                            replyMap[r.reviewId] = replyList || [];
                        } catch {
                            replyMap[r.reviewId] = [];
                        }
                    })
                );
                setReplies(replyMap);
            } catch {
                setReviews([]);
                setReplies({});
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [selectedShowingTime]);

    // Lọc reviews theo search/star
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

    // Gửi reply (ngay trên bảng, khi chưa có reply nào)
    const handleReply = async (reviewId) => {
        if (!replyContent[reviewId]?.trim()) return;
        setReplying((prev) => ({ ...prev, [reviewId]: true }));
        try {
            await reviewReplyService.createReply({
                reviewId,
                content: replyContent[reviewId],
            });
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

    // Mở modal xem tất cả reply
    const openReplyModal = (reviewId) => {
        setModalReviewId(reviewId);
        setShowModal(true);
        setEditReplyId(null);
        setEditReplyContent("");
        setModalReplyContent("");
    };

    const closeReplyModal = () => {
        setShowModal(false);
        setModalReviewId(null);
        setEditReplyId(null);
        setEditReplyContent("");
        setModalReplyContent("");
    };

    // Thêm reply trong modal
    const handleAddModalReply = async () => {
        if (!modalReplyContent.trim() || !modalReviewId) return;
        setModalReplying(true);
        try {
            await reviewReplyService.createReply({
                reviewId: modalReviewId,
                content: modalReplyContent,
            });
            const newReply = await reviewReplyService.getRepliesByReview(modalReviewId);
            setReplies((prev) => ({ ...prev, [modalReviewId]: newReply }));
            setModalReplyContent("");
        } catch {
            alert("Phản hồi thất bại!");
        } finally {
            setModalReplying(false);
        }
    };

    // Sửa reply trong modal
    const handleEditReply = (reply) => {
        setEditReplyId(reply.id);
        setEditReplyContent(reply.content);
    };

    const handleUpdateReply = async (reply) => {
        if (!editReplyContent.trim()) return;
        setModalReplying(true);
        try {
            await reviewReplyService.updateReply(reply.id, {
                reviewId: modalReviewId,
                content: editReplyContent,
            });
            setEditReplyId(null);
            setEditReplyContent("");
            const newReplyList = await reviewReplyService.getRepliesByReview(modalReviewId);
            setReplies((prev) => ({ ...prev, [modalReviewId]: newReplyList }));
        } catch {
            alert("Cập nhật phản hồi thất bại!");
        } finally {
            setModalReplying(false);
        }
    };

    // Xóa reply trong modal
    const handleDeleteReply = async (reply) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) return;
        setModalReplying(true);
        try {
            await reviewReplyService.deleteReply(reply.id);
            const newReplyList = await reviewReplyService.getRepliesByReview(modalReviewId);
            setReplies((prev) => ({ ...prev, [modalReviewId]: newReplyList }));
        } catch {
            alert("Xóa phản hồi thất bại!");
        } finally {
            setModalReplying(false);
        }
    };

    // Emoji picker: đóng khi click outside
    useClickOutside(emojiPickerRef, () => {
        if (emojiPickerReviewId !== null) {
            setShowEmoji(prev => ({ ...prev, [emojiPickerReviewId]: false }));
            setEmojiPickerReviewId(null);
        }
    });

    if (showModal && modalEmojiRef.current) {
        useClickOutside(modalEmojiRef, () => setShowEmoji((prev) => ({ ...prev, ["modal"]: false })));
    }

    const currentEvent = events.find((ev) => ev.id === selectedEvent);
    const currentShowingTime = showingTimes.find((st) => st.id === selectedShowingTime);

    // Render một reply mới nhất
    function renderLastReply(reviewId) {
        const list = replies[reviewId] || [];
        if (list.length === 0) return null;
        const last = list[list.length - 1];
        return (
            <div className="rounded-xl bg-emerald-900/70 text-emerald-100 px-5 py-4 shadow text-base relative mb-1 border border-emerald-700">
                <div>{last.content}</div>
                <div className="text-sm text-emerald-200 mt-1">
                    {last.createdAt && new Date(last.createdAt).toLocaleString("vi-VN")}
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
        select, select option, input[type="text"], input[type="search"], input#searchInput {
          color: #fff !important;
          background: #181A24 !important;
        }
        .review-deleted {
          opacity: 0.5;
          background: #2d2e34 !important;
        }
        .modal-bg {
          background: rgba(0,0,0,0.64);
        }
        .custom-scroll::-webkit-scrollbar { width: 6px; background: #292b36; border-radius: 10px;}
        .custom-scroll::-webkit-scrollbar-thumb { background: #5eead4; border-radius: 10px;}
      `}</style>

            {/* ---- Modal ---- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-bg">
                    <div className="bg-[#151822] max-w-xl w-full rounded-2xl shadow-2xl p-7 relative custom-scroll border border-emerald-700"
                         style={{ maxHeight: "92vh", overflowY: "auto" }}>
                        <button
                            className="absolute top-3 right-3 bg-emerald-950/70 hover:bg-emerald-900 p-2 rounded-full shadow"
                            onClick={closeReplyModal}
                        >
                            <CloseIcon className="w-5 h-5 text-emerald-300" />
                        </button>
                        <h2 className="font-bold text-lg text-emerald-300 mb-2 flex items-center gap-2">
                            <List className="w-6 h-6" /> Tất cả phản hồi của tổ chức
                        </h2>
                        <div className="mb-6 border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-900/30 text-emerald-200">
                            {reviews.find(r => r.reviewId === modalReviewId)?.comment || "—"}
                        </div>
                        {/* List reply, thêm custom-scroll */}
                        <div className="space-y-3 mb-6 max-h-[48vh] overflow-y-auto pr-1 custom-scroll">
                            {(replies[modalReviewId] || []).length === 0 ? (
                                <div className="text-emerald-400 italic">Chưa có phản hồi nào.</div>
                            ) : (
                                (replies[modalReviewId] || []).map((reply) => (
                                    <div key={reply.id} className="relative rounded-xl bg-emerald-900/70 text-emerald-100 px-5 py-4 shadow text-base flex items-start gap-3 border border-emerald-700">
                                        <div className="flex-1">
                                            {editReplyId === reply.id ? (
                                                <form
                                                    className="flex items-center gap-2"
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        handleUpdateReply(reply);
                                                    }}
                                                >
                                                    <input
                                                        value={editReplyContent}
                                                        onChange={e => setEditReplyContent(e.target.value)}
                                                        className="flex-1 rounded-full px-4 py-2 border border-emerald-600 focus:outline-emerald-400 bg-[#20242f] text-base text-emerald-100"
                                                        disabled={modalReplying}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-emerald-600 text-white rounded-full px-3 py-1 font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                                                        disabled={modalReplying || !editReplyContent.trim()}
                                                    >
                                                        <Save className="w-4 h-4" /> Lưu
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bg-gray-700 text-gray-200 rounded-full px-3 py-1 font-bold hover:bg-gray-600 transition flex items-center gap-1"
                                                        onClick={() => setEditReplyId(null)}
                                                    >
                                                        <X className="w-4 h-4" /> Hủy
                                                    </button>
                                                </form>
                                            ) : (
                                                <>
                                                    <span>{reply.content}</span>
                                                    <div className="text-sm text-emerald-200 mt-2">
                                                        {reply.createdAt && new Date(reply.createdAt).toLocaleString("vi-VN")}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {(user?.organizer || user?.isAdmin) && editReplyId !== reply.id && (
                                            <div className="flex flex-col gap-1 ml-2">
                                                <button
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
                                                    onClick={() => handleEditReply(reply)}
                                                    disabled={modalReplying}
                                                >
                                                    <Pencil className="w-4 h-4" /> Sửa
                                                </button>
                                                <button
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:underline"
                                                    onClick={() => handleDeleteReply(reply)}
                                                    disabled={modalReplying}
                                                >
                                                    <Trash2 className="w-4 h-4" /> Xóa
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Thêm phản hồi mới */}
                        {(user?.organizer || user?.isAdmin) && (
                            <form
                                className="flex items-center gap-2"
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleAddModalReply();
                                }}
                            >
                                <input
                                    value={modalReplyContent}
                                    onChange={e => setModalReplyContent(e.target.value)}
                                    className="flex-1 rounded-full px-4 py-2 border border-emerald-700 focus:outline-emerald-400 bg-[#22252e] text-base text-emerald-100"
                                    placeholder="Thêm phản hồi mới..."
                                    disabled={modalReplying}
                                />
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="text-xl text-emerald-400 hover:scale-110 active:scale-90 transition"
                                        onClick={() =>
                                            setShowEmoji((prev) => ({
                                                ...prev,
                                                ["modal"]: !prev["modal"],
                                            }))
                                        }
                                        tabIndex={-1}
                                        aria-label="Chèn emoji"
                                    >
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    {showEmoji["modal"] && (
                                        <div
                                            ref={modalEmojiRef}
                                            className="absolute z-30"
                                            style={{ right: 0, bottom: "2.5rem" }}
                                        >
                                            <Picker
                                                data={data}
                                                onEmojiSelect={(emoji) =>
                                                    setModalReplyContent((prev) => prev + emoji.native)
                                                }
                                                theme="dark"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 bg-gray-900 rounded-full shadow p-1 hover:bg-gray-800"
                                                onClick={() =>
                                                    setShowEmoji((prev) => ({
                                                        ...prev,
                                                        ["modal"]: false,
                                                    }))
                                                }
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="ml-2 bg-emerald-600 text-white rounded-full px-5 py-2 text-base font-bold hover:bg-emerald-700 transition flex items-center gap-2"
                                    disabled={modalReplying || !modalReplyContent.trim()}
                                >
                                    <CornerDownLeft className="w-5 h-5" />
                                    Gửi
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full max-w-[1400px] mx-auto px-2 py-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-extrabold text-emerald-300 mb-8 flex items-center gap-3">
                    <MessageSquareText className="w-10 h-10 text-emerald-400" />
                    Quản lý đánh giá sự kiện
                </h1>

                {/* Thống kê + biểu đồ */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    {/* Tổng số review + tỉ lệ */}
                    <div className="bg-[#181A24] rounded-2xl shadow p-7 flex flex-col justify-between border border-emerald-800/50">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                <span className="text-xl font-bold text-emerald-400">
                  Tổng đánh giá: <span className="text-3xl">{totalReviews}</span>
                </span>
                                <div className="mt-2 text-emerald-200 text-base">
                                    <b>Sự kiện:</b> <span className="text-emerald-300">{currentEvent?.title || currentEvent?.name || "Chưa chọn"}</span>
                                    <br />
                                    <b>Suất chiếu:</b> <span className="text-emerald-300">{currentShowingTime ? new Date(currentShowingTime.startTime).toLocaleString("vi-VN") : "Chưa chọn"}</span>
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
                                <span className="block text-base mt-1 text-emerald-400">Điểm TB</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {starData.map(item => (
                                <div key={item.star} className="flex items-center gap-4">
                  <span className="inline-flex items-center w-16 text-base">
                    {item.star} <Star className="w-5 h-5 mx-1 text-yellow-400" fill="#fde047" />
                  </span>
                                    <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            style={{
                                                width: `${item.percent}%`,
                                                background: "linear-gradient(90deg,#34d399,#facc15)",
                                            }}
                                            className="h-full"
                                        ></div>
                                    </div>
                                    <span className="ml-2 min-w-[44px] text-right font-semibold text-emerald-100 text-base">
                    {item.count} ({item.percent}%)
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Biểu đồ cột */}
                    <div className="bg-[#181A24] rounded-2xl shadow p-7 flex flex-col justify-center border border-emerald-800/50">
                        <div className="font-bold text-lg text-emerald-400 mb-2">Biểu đồ số lượng đánh giá theo sao</div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={starData} margin={{top: 20, right: 30, left: 0, bottom: 10}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="star" tick={{fontWeight: 'bold', fontSize: 16, fill: "#6ee7b7"}} label={{ value: "Số sao", position: 'insideBottom', dy: 14, fontSize: 16, fill: "#34d399" }}/>
                                <YAxis allowDecimals={false} label={{ value: "Số lượng", angle: -90, dx: -10, position: 'insideLeft', fontSize: 16, fill: "#34d399" }} tick={{fontSize: 16, fill: "#6ee7b7"}} />
                                <Tooltip contentStyle={{background: "#222", color: "#fff"}} formatter={(value, name) => [`${value} đánh giá`, 'Số lượng']} />
                                <Bar dataKey="count" name="Số lượng" fill="#34d399" radius={[8, 8, 0, 0]} barSize={32}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="flex flex-wrap gap-8 items-center mb-10 bg-[#1b202c] shadow p-6 rounded-2xl border border-emerald-700/30">
                    <div className="flex flex-col min-w-[260px]">
                        <label htmlFor="eventFilter" className="mb-1 font-semibold text-emerald-100 text-base">
                            Sự kiện
                        </label>
                        <select
                            id="eventFilter"
                            value={selectedEvent ?? ""}
                            onChange={(e) => setSelectedEvent(Number(e.target.value))}
                            className="min-w-[260px] px-4 py-2 rounded-xl border border-gray-700 focus:outline-emerald-400 text-base"
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
                        <label htmlFor="showingTimeFilter" className="mb-1 font-semibold text-emerald-100 text-base">
                            Suất chiếu
                        </label>
                        <select
                            id="showingTimeFilter"
                            value={selectedShowingTime ?? ""}
                            onChange={(e) => setSelectedShowingTime(Number(e.target.value))}
                            className="min-w-[260px] px-4 py-2 rounded-xl border border-gray-700 focus:outline-emerald-400 text-base"
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
                        <label htmlFor="starFilter" className="mb-1 font-semibold text-emerald-100 text-base">
                            Đánh giá
                        </label>
                        <select
                            id="starFilter"
                            value={filterStar}
                            onChange={(e) => setFilterStar(Number(e.target.value))}
                            className="px-4 py-2 rounded-xl border border-gray-700 focus:outline-emerald-400 text-base"
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
                        <label htmlFor="searchInput" className="mb-1 font-semibold text-emerald-100 text-base">
                            Tìm kiếm (theo email hoặc nội dung)
                        </label>
                        <input
                            id="searchInput"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm email/nội dung..."
                            className="px-4 py-2 rounded-xl border border-gray-700 focus:outline-emerald-400 text-base bg-[#181A24]"
                            type="text"
                        />
                    </div>
                </div>

                {/* Bảng review */}
                <div className="overflow-x-auto bg-[#181A24] rounded-2xl shadow-lg border border-emerald-700/30">
                    <table className="w-full table-fixed text-base text-emerald-100">
                        <colgroup>
                            <col style={{ width: "48px" }} />
                            <col style={{ width: "24%" }} />
                            <col style={{ width: "13%" }} />
                            <col style={{ width: "22%" }} />
                            <col style={{ width: "14%" }} />
                            <col style={{ width: "27%" }} />
                        </colgroup>
                        <thead className="bg-gradient-to-r from-emerald-900 via-cyan-900 to-blue-900 sticky top-0 border-b border-emerald-700">
                        <tr>
                            <th className="px-4 py-4 font-bold text-emerald-300 text-lg text-center">#</th>
                            <th className="px-4 py-4 font-bold text-emerald-300 text-lg text-left">Email</th>
                            <th className="px-4 py-4 font-bold text-emerald-300 text-lg text-left">Đánh giá</th>
                            <th className="px-4 py-4 font-bold text-emerald-300 text-lg text-left">Bình luận</th>
                            <th className="px-4 py-4 font-bold text-emerald-300 text-lg text-center">Ngày gửi</th>
                            <th className="px-4 py-4 font-bold text-emerald-300 text-lg text-center">Phản hồi tổ chức</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-lg text-emerald-300">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-emerald-400 italic text-lg">
                                    Không có đánh giá nào.
                                </td>
                            </tr>
                        ) : (
                            filteredReviews.map((r, idx) => (
                                <tr
                                    key={r.reviewId}
                                    className={classNames(
                                        r.status === "deleted" ? "review-deleted" : "",
                                        "border-b border-emerald-800/40",
                                        idx % 2 === 1 ? "bg-emerald-900/5" : ""
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
                                                            ? "bg-emerald-800/70 hover:bg-emerald-700/90 text-emerald-100 border border-emerald-600"
                                                            : "bg-yellow-700/30 hover:bg-yellow-900/40 text-yellow-200 border border-yellow-700"
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
                                        {/* Hiện reply cuối cùng và nút xem tất cả */}
                                        {replies[r.reviewId] && replies[r.reviewId].length > 0 ? (
                                            <div>
                                                {renderLastReply(r.reviewId)}
                                                {replies[r.reviewId].length > 1 && (
                                                    <button
                                                        className="text-emerald-300 font-semibold text-xs hover:underline mt-2 flex items-center gap-1"
                                                        onClick={() => openReplyModal(r.reviewId)}
                                                    >
                                                        <List className="w-4 h-4" /> Xem tất cả ({replies[r.reviewId].length})
                                                    </button>
                                                )}
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
                                                    className="flex-1 rounded-full px-4 py-2 border border-emerald-700 focus:outline-emerald-400 bg-[#181A24] text-base text-emerald-100"
                                                    placeholder="Phản hồi đánh giá..."
                                                    disabled={replying[r.reviewId]}
                                                    type="text"
                                                />
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        className="text-xl text-emerald-400 hover:scale-110 active:scale-90 transition"
                                                        onClick={() => {
                                                            setShowEmoji((prev) => ({
                                                                ...prev,
                                                                [r.reviewId]: !prev[r.reviewId],
                                                            }));
                                                            setEmojiPickerReviewId(r.reviewId);
                                                        }}
                                                        tabIndex={-1}
                                                        aria-label="Chèn emoji"
                                                    >
                                                        <Smile className="w-5 h-5" />
                                                    </button>
                                                    {showEmoji[r.reviewId] && (
                                                        <div
                                                            ref={emojiPickerRef}
                                                            className="absolute z-30"
                                                            style={{ right: 0, bottom: "2.5rem" }}
                                                        >
                                                            <Picker
                                                                data={data}
                                                                onEmojiSelect={(emoji) =>
                                                                    setReplyContent((prev) => ({
                                                                        ...prev,
                                                                        [r.reviewId]: (prev[r.reviewId] || "") + emoji.native,
                                                                    }))
                                                                }
                                                                theme="dark"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-2 right-2 bg-gray-900 rounded-full shadow p-1 hover:bg-gray-800"
                                                                onClick={() =>
                                                                    setShowEmoji((prev) => ({
                                                                        ...prev,
                                                                        [r.reviewId]: false,
                                                                    }))
                                                                }
                                                            >
                                                                <CloseIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="ml-2 bg-emerald-600 text-white rounded-full px-5 py-2 text-base font-bold hover:bg-emerald-700 transition flex items-center gap-2"
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
