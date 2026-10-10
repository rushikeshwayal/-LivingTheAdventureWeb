import axios from "axios";

const fetchEventsByID = async (event_id) => {
    let response;

    response = await axios.get(
        `https://backend-theta-seven-48.vercel.app/events/${event_id}`
    );
    return response.data;
};

export default fetchEventsByID;
