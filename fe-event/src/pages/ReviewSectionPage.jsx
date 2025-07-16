import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";
import { getReviewableEvents } from "../services/eventService";
import CategoryNav from "../ui/CategoryNav";
import EventCard from "../ui/EventCard";

export default function ReviewSectionPage() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [eventsPage, setEventsPage] = useState({
        content: [],
        totalElements: 0,
        totalPages: 1,
        number: 0,
        size: 20,
    });

    // Lấy danh sách category
    useEffect(() => {
        getCategories().then((cats) => {
            setCategories(cats);
        });
    }, []);

    // Gọi API lấy events reviewable khi search/category/page thay đổi
    useEffect(() => {
        setLoading(true);
        getReviewableEvents(page, 20, search, selectedCategoryId)
            .then((res) => setEventsPage(res))
            .finally(() => setLoading(false));
    }, [page, search, selectedCategoryId]);

    // Search submit handler
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // reset về page đầu khi search mới
    };


    // Render phân trang đẹp hơn
    const renderPagination = () => {
        if (eventsPage.totalPages <= 1) return null;
        const pages = [];
        for (let i = 0; i < eventsPage.totalPages; i++) {
            // Hiển thị các nút đầu, cuối, và các nút xung quanh trang hiện tại
            if (
                i === 0 ||
                i === eventsPage.totalPages - 1 ||
                Math.abs(i - eventsPage.number) <= 2
            ) {
                pages.push(
                    <button
                        key={i}
                        className={`px-3 py-2 rounded transition-all mx-0.5 font-semibold border border-gray-500
                        ${eventsPage.number === i
                            ? "bg-yellow-400 text-black border-yellow-400 shadow"
                            : "bg-gray-800 text-white hover:bg-yellow-300 hover:text-black"}`}
                        onClick={() => setPage(i)}
                        disabled={loading || eventsPage.number === i}
                    >
                        {i + 1}
                    </button>
                );
            } else if (
                (i === eventsPage.number - 3 && i > 0) ||
                (i === eventsPage.number + 3 && i < eventsPage.totalPages - 1)
            ) {
                pages.push(
                    <span key={i} className="px-2 text-gray-400 select-none">...</span>
                );
            }
        }

        return (
            <div className="flex justify-center mt-6 items-center gap-1">
                <button
                    className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={loading || eventsPage.number === 0}
                >
                    &lt;
                </button>
                {pages}
                <button
                    className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage(p => Math.min(eventsPage.totalPages - 1, p + 1))}
                    disabled={loading || eventsPage.number === eventsPage.totalPages - 1}
                >
                    &gt;
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#181A22] text-white flex flex-col">
            <div className="flex-1">
                <div className="relative z-10 pt-8 pb-4">
                    <CategoryNav
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />
                    <div className="flex flex-col items-center gap-2 mt-6 mb-5">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-center drop-shadow">
                            Đánh giá các sự kiện đã kết thúc
                        </h1>
                        <p className="text-gray-400 text-center text-base md:text-lg font-normal">
                            Xem và tìm kiếm nhận xét từ cộng đồng cho những sự kiện bạn quan tâm
                        </p>
                    </div>
                    <form
                        className="max-w-md mx-auto mt-0 mb-2 w-full relative"
                        onSubmit={handleSearch}
                        autoComplete="off"
                    >
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.3-4.3" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm kiếm sự kiện theo tên..."
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-[#23263a] border border-gray-700 shadow focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 transition"
                        />
                    </form>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                    {loading ? (
                        <div className="text-center text-gray-400 py-16">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-4">
                            {eventsPage.content.length > 0
                                ? eventsPage.content.map((event) => (
                                    <EventCard key={event.id} event={event} showReviewButton />
                                ))
                                : <div className="text-gray-400 text-center w-full py-12">
                                    Không có sự kiện phù hợp.
                                </div>
                            }
                        </div>
                    )}
                    {/* Pagination */}
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
}
