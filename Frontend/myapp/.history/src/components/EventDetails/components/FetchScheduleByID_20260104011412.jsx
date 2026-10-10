import axios from "axios";

const fetchEventsByID = async (event_uuid) => {
    let response;

    response = await axios.get(
        `https://backend-theta-seven-48.vercel.app/event-schedules/by-event/${event_uuid}`
    );
    return response.data;
};

export default fetchEventsByID;
