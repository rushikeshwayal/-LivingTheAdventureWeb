import axios from "axios";

const fetchEventsByType = async (event_type) => {
    let response;

    response = await axios.get(
        `https://backend-theta-seven-48.vercel.app/events/by-type/${event_type}`
    );
    return response.data;
};

export default fetchEventsByType;
