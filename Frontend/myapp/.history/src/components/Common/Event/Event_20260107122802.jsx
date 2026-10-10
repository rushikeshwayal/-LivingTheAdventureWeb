import React, { useEffect, useState } from "react";
import EventCollection from "../EventCollection/EventCollection";
import fetchEvents from "./FetchEvent";
import Spinner from "../../Spinner/Spinner";

const Event = ({ heroType }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        fetchEvents(heroType)
            .then((data) => mounted && setEvents(data))
            .catch(() => mounted && setError("Failed to load events"))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) return <div className="text-white text-center mt-20">
        <Spinner />
    </div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

    return (
        <div className="min-h-screen font-sans ml-10 mt-4">
            <EventCollection heroType={heroType} data={events} />
        </div>
    );
};

export default Event;
