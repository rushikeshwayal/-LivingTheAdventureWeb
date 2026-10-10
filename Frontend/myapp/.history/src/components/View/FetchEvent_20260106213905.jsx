import axios from "axios";

const fetchEventsByType = async (event_type) => {
    const response = await axios.get(
        `https://backend-theta-seven-48.vercel.app/events/by-type/${event_type}`
    );

    return response.data.map(event => ({
        id: event.id,
        title: event.title,
        imageUrl: event.cover_image_url,
        description: event.short_description,
        category: event.adventure_activity_category,
        difficulty: event.adventure_difficulty_level,
        durationDays: event.duration_days,
        durationNights: event.duration_nights,
        location: event.location,
        raw: event // optional: keep original
    }));
};

export default fetchEventsByType;
