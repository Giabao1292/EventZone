import React, { useEffect, useState } from "react";
import reviewService from "../../services/reviewService";
import * as eventService from "../../services/eventService";
import useAuth from "../../hooks/useAuth";
import { Star, MessageSquareText, EyeOff, Eye } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

const AdminReviewManagementPage = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [showingTimes, setShowingTimes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedShowingTime, setSelectedShowingTime] = useState("");
  const [filterStar, setFilterStar] = useState(0);
  const [search, setSearch] = useState("");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiding, setHiding] = useState({});

  // Pagination state
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Tổng reviews của toàn bộ event (all showing times)
  const [eventReviews, setEventReviews] = useState([]);

  // Load events
  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getEventsWithReviews();
        // CHUẨN HÓA LIST SỰ KIỆN
        const normalizedEvents = normalizeEventList(data || []);
        setEvents(normalizedEvents);
        if (normalizedEvents.length > 0)
          setSelectedEvent(normalizedEvents[0].id);
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

  // Load showing times khi chọn event và tổng reviews event
  useEffect(() => {
    if (!selectedEvent) {
      setShowingTimes([]);
      setSelectedShowingTime("");
      setEventReviews([]);
      setReviews([]);
      return;
    }
    const fetchShowingTimesAndEventReviews = async () => {
      setLoading(true);
      try {
        const stRes = await eventService.getEventShowingTimes(selectedEvent);
        const allShowingTimes = stRes.data || [];
        setShowingTimes(allShowingTimes);
        if (allShowingTimes.length > 0)
          setSelectedShowingTime(allShowingTimes[0].id);
        else setSelectedShowingTime("");

        // Lấy tổng reviews toàn bộ suất chiếu sự kiện (dùng cho phần tổng quan)
        const allReviewsArrays = await Promise.all(
          allShowingTimes.map((st) => reviewService.getReviews(st.id, "all"))
        );
        setEventReviews(allReviewsArrays.flat());
      } catch {
        setShowingTimes([]);
        setSelectedShowingTime("");
        setEventReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShowingTimesAndEventReviews();
  }, [selectedEvent]);

  // Load reviews cho admin với phân trang, status (all -> bỏ filter status)
  useEffect(() => {
    if (!selectedShowingTime) {
      setReviews([]);
      return;
    }

    const fetchReviewsForAdmin = async () => {
      setLoading(true);
      try {
        const reviewList = await reviewService.getReviewsForAdmin(
          selectedShowingTime,
          page,
          size,
          "all"
        );
        const reviewsData = Array.isArray(reviewList)
          ? reviewList
          : reviewList.content || [];
        setReviews(reviewsData || []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewsForAdmin();
  }, [selectedShowingTime, page, size]);

  // Lọc review theo star + search (client-side filter)
  const filteredReviews = reviews.filter((r) => {
    const starMatch = filterStar === 0 || r.rating === filterStar;
    const keyword = search.trim().toLowerCase();
    const keywordMatch =
      !keyword ||
      (r.userEmail && r.userEmail.toLowerCase().includes(keyword)) ||
      (r.comment && r.comment.toLowerCase().includes(keyword));
    return starMatch && keywordMatch;
  });

  // Tính thống kê tổng quan (event tổng)
  const eventActiveReviews = eventReviews.filter((r) => r.status === "active");
  const totalEventReviews = eventActiveReviews.length;
  const eventStarCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: eventActiveReviews.filter((r) => r.rating === star).length,
  }));
  const eventStarData = eventStarCounts.map((item) => ({
    ...item,
    percent:
      totalEventReviews === 0
        ? 0
        : Math.round((item.count / totalEventReviews) * 100),
  }));

  // Tính thống kê cho suất chiếu đã chọn (chi tiết)
  const showingActiveReviews = reviews.filter((r) => r.status === "active");
  const totalShowingReviews = showingActiveReviews.length;
  const showingStarCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: showingActiveReviews.filter((r) => r.rating === star).length,
  }));
  const showingStarData = showingStarCounts.map((item) => ({
    ...item,
    percent:
      totalShowingReviews === 0
        ? 0
        : Math.round((item.count / totalShowingReviews) * 100),
  }));

  // Ẩn / hiện bình luận (admin quyền)
  const handleToggleStatus = async (reviewId, status) => {
    setHiding((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await reviewService.updateReview(reviewId, { status }, user.id);
      // Cập nhật lại reviews hiện tại
      if (selectedShowingTime) {
        const reviewList = await reviewService.getReviewsForAdmin(
          selectedShowingTime,
          page,
          size,
          "all"
        );
        const reviewsData = Array.isArray(reviewList)
          ? reviewList
          : reviewList.content || [];
        setReviews(reviewsData || []);
      }
      // Cập nhật tổng event reviews
      if (selectedEvent) {
        const stRes = await eventService.getEventShowingTimes(selectedEvent);
        const allShowingTimes = stRes.data || [];
        const allReviewsArrays = await Promise.all(
          allShowingTimes.map((st) => reviewService.getReviews(st.id, "all"))
        );
        setEventReviews(allReviewsArrays.flat());
      }
    } catch {
      alert("Có lỗi khi cập nhật trạng thái!");
    } finally {
      setHiding((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const currentEvent = events.find((ev) => ev.id === selectedEvent);
  const currentShowingTime = showingTimes.find(
    (st) => st.id === selectedShowingTime
  );

  return (
    <div className="max-w-[1400px] mx-auto p-6 bg-gray-50 rounded-3xl shadow-lg">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold mb-8 text-green-700">
        <MessageSquareText className="w-10 h-10" /> Quản lý đánh giá
      </h1>

      {/* --- Tổng quan sự kiện (luôn hiện) --- */}
      <section className="mb-10 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-6 border-b border-green-300 pb-2 text-green-800">
          Tổng quan sự kiện:{" "}
          <span className="text-green-600">
            {currentEvent?.title || "Chưa chọn sự kiện"}
          </span>
        </h2>
        <div className="flex flex-wrap md:items-center md:gap-12">
          <div className="flex flex-col items-center justify-center text-center px-4 py-6 bg-green-100 rounded-xl shadow-inner flex-1 min-w-[180px]">
            <div className="text-4xl font-bold text-green-700">
              {totalEventReviews}
            </div>
            <div className="text-green-600 font-semibold mt-1">
              Tổng lượt đánh giá
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center px-4 py-6 bg-amber-100 rounded-xl shadow-inner flex-1 min-w-[180px] mt-6 md:mt-0">
            <div className="flex items-center gap-2 text-5xl font-extrabold text-amber-600">
              {totalEventReviews === 0
                ? "0.0"
                : (
                    eventActiveReviews.reduce((acc, r) => acc + r.rating, 0) /
                    totalEventReviews
                  ).toFixed(1)}
              <Star className="w-10 h-10" fill="#facc15" />
            </div>
            <div className="text-amber-700 font-semibold mt-1">
              Điểm đánh giá trung bình
            </div>
          </div>

          {/* Biểu đồ cột tổng quan event */}
          <div className="w-full max-w-xl mt-8 md:mt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={eventStarData}
                margin={{ top: 15, right: 20, left: 0, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="star"
                  tick={{ fontWeight: "bold", fontSize: 16 }}
                  label={{
                    value: "Số sao",
                    position: "insideBottom",
                    dy: 15,
                    fontSize: 16,
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: "Số lượng",
                    angle: -90,
                    dx: -15,
                    position: "insideLeft",
                    fontSize: 16,
                  }}
                  tick={{ fontSize: 16 }}
                />
                <Tooltip formatter={(value) => [`${value} đánh giá`]} />
                <Bar
                  dataKey="count"
                  fill="#34d399"
                  radius={[8, 8, 0, 0]}
                  barSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* --- Bộ lọc & thống kê theo suất chiếu --- */}
      <section className="mb-10 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-6 border-b border-green-300 pb-2 text-green-800">
          Thống kê chi tiết theo suất chiếu
        </h2>

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-6 mb-8">
          {/* Event Selector */}
          <div className="w-64">
            <label className="block mb-1 font-semibold text-gray-700">
              Sự kiện
            </label>
            <select
              value={selectedEvent ?? ""}
              onChange={(e) => {
                setSelectedEvent(Number(e.target.value));
                setSelectedShowingTime("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-green-400"
            >
              {events.length === 0 && <option>Chưa có sự kiện</option>}
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* Showing time selector */}
          <div className="w-64">
            <label className="block mb-1 font-semibold text-gray-700">
              Suất chiếu
            </label>
            <select
              value={selectedShowingTime ?? ""}
              onChange={(e) => setSelectedShowingTime(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-green-400"
              disabled={!selectedEvent || showingTimes.length === 0}
            >
              <option value="">Tất cả suất chiếu</option>
              {showingTimes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name ||
                    (st.startTime
                      ? new Date(st.startTime).toLocaleString("vi-VN")
                      : `Suất #${st.id}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Star filter */}
          <div className="w-40">
            <label className="block mb-1 font-semibold text-gray-700">
              Đánh giá
            </label>
            <select
              value={filterStar}
              onChange={(e) => setFilterStar(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-green-400"
            >
              <option value={0}>Tất cả</option>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} sao
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <label className="block mb-1 font-semibold text-gray-700">
              Tìm kiếm (email hoặc nội dung)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập email hoặc nội dung..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-green-400"
            />
          </div>
        </div>

        {/* Biểu đồ cột chi tiết suất chiếu */}
        <div className="mb-8 max-w-3xl">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={showingStarData}
              margin={{ top: 15, right: 20, left: 0, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="star"
                tick={{ fontWeight: "bold", fontSize: 16 }}
                label={{
                  value: "Số sao",
                  position: "insideBottom",
                  dy: 15,
                  fontSize: 16,
                }}
              />
              <YAxis
                allowDecimals={false}
                label={{
                  value: "Số lượng",
                  angle: -90,
                  dx: -15,
                  position: "insideLeft",
                  fontSize: 16,
                }}
                tick={{ fontSize: 16 }}
              />
              <Tooltip formatter={(value) => [`${value} đánh giá`]} />
              <Bar
                dataKey="count"
                fill="#059669"
                radius={[8, 8, 0, 0]}
                barSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bảng đánh giá */}
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white border border-green-300">
          <table className="min-w-full table-fixed text-gray-800">
            <colgroup>
              <col style={{ width: "40px" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "27%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead className="bg-gradient-to-r from-green-200 via-lime-100 to-cyan-100 sticky top-0">
              <tr>
                <th className="py-3 px-4 font-semibold text-left text-green-700">
                  #
                </th>
                <th className="py-3 px-4 font-semibold text-left text-green-700">
                  Email
                </th>
                <th className="py-3 px-4 font-semibold text-left text-green-700">
                  Đánh giá
                </th>
                <th className="py-3 px-4 font-semibold text-left text-green-700">
                  Bình luận
                </th>
                <th className="py-3 px-4 font-semibold text-center text-green-700">
                  Ngày gửi
                </th>
                <th className="py-3 px-4 font-semibold text-center text-green-700">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-600 text-lg"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-green-600 italic"
                  >
                    Không có đánh giá nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r, idx) => (
                  <tr
                    key={r.reviewId}
                    className={classNames(
                      r.status === "deleted" ? "opacity-60 bg-gray-50" : "",
                      idx % 2 === 1 ? "bg-gray-50" : ""
                    )}
                  >
                    <td className="px-4 py-3 text-left font-medium">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 break-words">
                      {r.userEmail || "--"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="#fde047"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-pre-line">
                      {r.comment}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString("vi-VN")
                        : ""}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className={classNames(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold transition",
                          r.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        )}
                        disabled={hiding[r.reviewId]}
                        onClick={() =>
                          handleToggleStatus(
                            r.reviewId,
                            r.status === "active" ? "deleted" : "active"
                          )
                        }
                        title={
                          r.status === "active"
                            ? "Ẩn bình luận"
                            : "Hiện bình luận"
                        }
                      >
                        {hiding[r.reviewId] ? (
                          "..."
                        ) : r.status === "active" ? (
                          <>
                            <EyeOff className="w-4 h-4" /> Ẩn
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" /> Hiện
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminReviewManagementPage;
