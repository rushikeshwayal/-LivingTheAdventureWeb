import { useEffect, useState } from "react";
import fetchEventsByType from "./FetchEvent";
import VerticalEventCard from "../Common/EventCard/VerticalEventCard";
import Spinner from "../Spinner/Spinner";

function ViewAll({ event_type }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetchEventsByType(event_type)
            .then(data => {
                if (mounted) setEvents(data);
            })
            .catch(() => {
                if (mounted) setError("Failed to load events");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [event_type]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-20">
                {error}
            </div>
        );
    }

    if (!events.length) {
        return (
            <div className="text-center text-gray-400 py-20">
                No events found
            </div>
        );
    }

    return (
        <section className="bg-neutral-950 py-16">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Title */}
                <div className="mb-10 w-full flex-col items-center justify-center">
                    <div className="">
                        <h2 className="text-2xl md:text-3xl font-bebas text-white ">
                            Continue Exploring
                        </h2>
                        <p className="text-gray-400 mt-1 text-sm md:text-base">
                            Discover more adventures curated for you
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div
                    className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-6
      "
                >
                    {events.map(event => (
                        <VerticalEventCard
                            key={event.id}
                            item={event}
                        />
                    ))}
                </div>

            </div>
        </section>

    );
}

export default ViewAll;
