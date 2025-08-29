import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import BackgroundEffect from "../ui/BackGround";
import backGround from "../assets/images/background/background.png";
import wishlistService from "../services/wishlistServices";
import EventCard from "../ui/EventCard";
import useAuth from "../hooks/useAuth"; // Import useAuth

export default function WishlistPage() {
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      const formatted = data.map((ev) => ({
        id: ev.id,
        eventTitle: ev.title,
        posterImage: ev.imageUrl,
        startTime: ev.date,
        isFavorite: true, // All events in wishlist are favorites
      }));
      setWishlist(formatted);
    } catch (err) {
      console.error("❌ Lỗi khi tải wishlist:", err.message);
      toast.error("Không thể tải danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleToggleWishlist = async (eventId) => {
    try {
      await wishlistService.removeFromWishlist(eventId);
      setWishlist((prev) => prev.filter((ev) => ev.id !== eventId));
      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } catch (err) {
      console.error("❌ Xoá khỏi wishlist thất bại:", err.message);
      toast.error("Lỗi khi xóa khỏi danh sách yêu thích!");
    }
  };

  const filteredWishlist = wishlist.filter((event) =>
    event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedWishlist = [...filteredWishlist].sort((a, b) =>
    a.eventTitle.localeCompare(b.eventTitle)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="text-center bg-black/80 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">
            Đang tải danh sách yêu thích...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <BackgroundEffect image={backGround} />

      <div className="text-center py-12 px-4 relative z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-4xl border border-gray-800/50">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">
            📌 Danh sách yêu thích
          </h1>
          <p className="text-gray-200 text-sm mb-2 max-w-xl mx-auto drop-shadow-md">
            Danh sách sự kiện bạn đã thêm vào yêu thích để dễ dàng theo dõi và
            đặt vé sau này.
          </p>
          <p className="text-orange-300 text-sm font-medium mb-6 drop-shadow-md">
            Bạn có thể xóa sự kiện khỏi danh sách bất cứ lúc nào hoặc nhấn vào
            sự kiện để xem chi tiết.
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm sự kiện yêu thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 bg-gray-900/80 backdrop-blur-sm border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:bg-gray-900/90"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-16 relative z-10">
        {sortedWishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-md border border-gray-800/50">
              <p className="text-2xl font-semibold text-white mb-3 drop-shadow-lg">
                {searchQuery
                  ? "🔍 Không tìm thấy sự kiện phù hợp"
                  : "🖤 Bạn chưa có sự kiện yêu thích nào"}
              </p>
              <p className="text-gray-300 mb-6 drop-shadow-md">
                {searchQuery
                  ? "Hãy thử lại với từ khóa khác."
                  : "Hãy bắt đầu bằng cách thêm sự kiện bạn quan tâm vào danh sách yêu thích!"}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-800 bg-transparent backdrop-blur-sm"
                >
                  Xóa tìm kiếm
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedWishlist.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={event.isFavorite}
                onToggleFavorite={handleToggleWishlist}
                isAuthenticated={isAuthenticated} // Pass isAuthenticated
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
