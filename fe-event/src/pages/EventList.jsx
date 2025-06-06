import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/events?page=0&limit=4')
            .then(res => {
                console.log(res.data);
                setEvents(res.data.content);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="event-list">
            <h2>Sự kiện nổi bật</h2>
            <div className="events-grid">
                {events.map(event => (
                    <div key={event.eventId} className="event-card">
                        <img src={event.posterImageUrl} alt={`Event ${event.eventId}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;
