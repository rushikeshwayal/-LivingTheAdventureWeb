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
    }, [heroType]);

    if (loading)
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );

    if (error)
        return (
            <div className="bg-black text-red-500 min-h-screen flex items-center justify-center">
                {error}
            </div>
        );

    return (
        <div
            className="
        min-h-screen font-sans
        px-4 sm:px-6
        mt-6 sm:mt-4
        ml-0 lg:ml-20
        bg-black
      "
        >
            <EventCollection heroType={heroType} data={events} />
        </div>
    );
};

export default Event;
