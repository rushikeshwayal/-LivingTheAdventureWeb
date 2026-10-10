import axios from "axios";

const fetchEvents = async (item) => {
    const response = await axios.get(
        `https://backend-theta-seven-48.vercel.app/events/${item.id}`
    );
    return response.data;
};

export default fetchEvents;
