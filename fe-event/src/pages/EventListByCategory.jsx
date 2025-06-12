import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventListByCategory = ({ categoryId }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (categoryId !== null) {
            axios.get(`http://localhost:8080/api/categories/${categoryId}`)
                .then(res => setEvents(res.data))
                .catch(err => console.error(err));
        }
    }, [categoryId]);

    return (
        <div className="event-grid">
            {events.map(event => (
                <img key={event.id} src={event.posterImage} alt={`Event ${event.id}`} style={{ width: '200px', margin: '10px' }} />
            ))}
        </div>
    );
};

export default EventListByCategory;
