// src/components/TopEventsCardGrid.jsx
import React, { useEffect, useState } from "react";
import { getTopEvents } from "../services/revenueService";
import wishlistService from "../services/wishlistServices";
import EventCard from "./EventCard";
import { toast } from "react-toastify";

const TopEventsCardGrid = () => {
  const [events, setEvents] = useState([]);
  const [wishlistEventIds, setWishlistEventIds] = useState(new Set());

  // Fetch Top Events
  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const res = await getTopEvents();
        setEvents(res.data.data);
      } catch (error) {
        console.error("Error fetching top events", error);
      }
    };
    fetchTopEvents();
  }, []);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlist = await wishlistService.getWishlist();
        const ids = new Set(wishlist.map((event) => event.id));
        setWishlistEventIds(ids);
      } catch (err) {
        console.error("Error loading wishlist:", err.message);
        toast.error("Không thể tải danh sách yêu thích.");
      }
    };
    fetchWishlist();
  }, []);

  // Toggle Favorite
  const toggleFavorite = async (eventId) => {
    const isInWishlist = wishlistEventIds.has(eventId);

    // ⚡️ Cập nhật UI ngay lập tức
    setWishlistEventIds((prev) => {
      const newSet = new Set(prev);
      if (isInWishlist) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(eventId);
        toast.info("Đã xóa khỏi danh sách yêu thích");
      } else {
        await wishlistService.addToWishlist(eventId);
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      // ❗ Nếu thất bại → khôi phục lại trạng thái ban đầu
      setWishlistEventIds((prev) => {
        const reverted = new Set(prev);
        if (isInWishlist) {
          reverted.add(eventId);
        } else {
          reverted.delete(eventId);
        }
        return reverted;
      });
      console.error("Failed to update wishlist:", error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((ev) => (
        <EventCard
          key={ev.id}
          event={ev}
          isFavorite={wishlistEventIds.has(ev.id)}
          onToggleFavorite={() => toggleFavorite(ev.id)}
        />
      ))}
    </div>
  );
};

export default TopEventsCardGrid;
