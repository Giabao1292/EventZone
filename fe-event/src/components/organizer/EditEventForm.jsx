import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../api/axios";
import EventCreationForm from "./EventCreationForm";

const EditEventForm = () => {
    const { id } = useParams(); // Route: /organizer/edit/:id
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        console.log("CALLING FETCH EVENT EFFECT");
        const fetchEventDetail = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await apiClient.get(`/events/detail/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data.data;

                setEventData({
                    event_title: data.eventTitle || "",        // đúng key!
                    category_id: data.categoryId?.toString() || "",
                    description: data.description || "",
                    age_rating: data.ageRating || "",
                    banner_text: data.bannerText || "",
                    header_image: data.headerImage || null,
                    poster_image: data.posterImage || null,
                    start_time: data.startTime || "",
                    end_time: data.endTime || "",
                    location: data.location || data.showingTimes?.[0]?.address?.location || "",
                    city: data.city || data.showingTimes?.[0]?.address?.city || "",
                    venueName: data.venueName || data.showingTimes?.[0]?.address?.venueName || "",
                    max_capacity: data.maxCapacity || "",
                    status_id: data.statusId || 1,
                    showingTimes: data.showingTimes || [],
                    id: data.id,
                });
            } catch (error) {
                console.log("ERROR FETCHING EVENT: ", error);
                setEventData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetail();
    }, [id]);


    if (loading) return <div>Đang tải dữ liệu sự kiện...</div>;
    if (!eventData)
        return <div>Không tìm thấy sự kiện hoặc có lỗi khi tải dữ liệu.</div>;

    return (
        <EventCreationForm
            isEdit={true}
            initialEventData={eventData}
            eventId={id}
        />
    );
};

export default EditEventForm;
