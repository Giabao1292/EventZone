import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewSection from "./ReviewSection";
import useAuth from "../../hooks/useAuth";

const ReviewPage = () => {
  const { user, token, loading: authLoading } = useAuth();
  const { showingTimeId } = useParams();
  const [confirmedShowings, setConfirmedShowings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Không bắt buộc đăng nhập để xem đánh giá
  // useEffect(() => {
  //     if (!authLoading && !user) navigate("/login");
  // }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchConfirmed = async () => {
      try {
        const accessToken = token || localStorage.getItem("accessToken");
        if (accessToken) {
          const res = await axios.get(
            "/api/bookings/confirmed-showing-time-ids",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setConfirmedShowings((res.data.data || []).map(Number));
        } else setConfirmedShowings([]);
      } catch {
        setConfirmedShowings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmed();
  }, [user, token]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-900">
        <span className="loading loading-spinner loading-lg text-indigo-400"></span>
      </div>
    );
  }

  const canReview = user && confirmedShowings.includes(Number(showingTimeId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-gray-900 flex flex-col items-center pt-12">
      <ReviewSection
        showingTimeId={showingTimeId}
        canReview={canReview} // Cho phép review nếu đã tham gia
        user={user}
      />
    </div>
  );
};

export default ReviewPage;
