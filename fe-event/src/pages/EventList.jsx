import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/events?page=0&limit=100')
            .then(res => {
                console.log("API response:", res.data);
                setEvents(res.data.content || res.data);
            })
            .catch(err => console.error("API lỗi: " ,err));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-black mb-6">Tất cả sự kiện</h2>

            {events.length === 0 ? (
                <p className="text-white">Không có sự kiện nào.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {events.map((event) => (
                        <div
                            key={event.eventId}
                            className="bg-white rounded-lg shadow overflow-hidden"
                        >
                            <img
                                src={event.posterImageUrl}
                                // alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                            {/*<div className="p-2 font-semibold text-black text-center">*/}
                            {/*    {event.title || `Sự kiện #${event.eventId}`}*/}
                            {/*</div>*/}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
