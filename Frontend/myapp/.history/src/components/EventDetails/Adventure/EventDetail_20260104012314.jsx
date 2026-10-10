import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import Hero from "../components/Hero/Hero";
import StarCard from "../components/Widgets/StarCard";
import fetchEventByID from "../components/FetchEventByID";
import Itinerary from "../components/Widgets/ItineraryFlow";
import InclusionsExclusions from "../components/Widgets/InclusionsExclusions";
function EventDetail() {
    const { id } = useParams();
    const [eventSchedule, setEventSchedule] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        fetchEventByID(id)
            .then((data) => mounted && setEvents(data))
            .catch(() => mounted && setError("Failed to load events"))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        fetchScheduleByID(events.event_id)
            .then((data) => mounted && setEventSchedule(data))
            .catch(() => mounted && setError("Failed to load event schedule"))
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        }
    }, []);

    if (loading) return <div className="text-white text-center mt-20">
        <Spinner />
    </div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;
    return (
        <div>
            <Hero promo_video={events.promo_video_url}
                event_type={events.event_type}
                event_title={events.title}
                event_description={events.short_description}
                event_poster={events.poster_horizontal_1_url} />

            <section className="relative bg-neutral-950 py-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Section Heading */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">
                            Event Highlights
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Everything you need to know at a glance
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StarCard title="Location" value={events.location} />
                        <StarCard title="Category" value={events.adventure_activity_category} />
                        <StarCard
                            title="Duration"
                            value={`${events.duration_days} days • ${events.duration_nights} nights`}
                        />
                        <StarCard title="Fitness" value={events.fitness_requirement} />
                        <StarCard title="Age" value={events.age_requirement} />
                        <StarCard title="Difficulty" value={events.adventure_difficulty_level} />
                    </div>

                </div>
            </section>
            <section className="bg-black">
                <Itinerary itinerary={events.itinerary} gallery_image_urls={events.gallery_image_urls} />
            </section>
            <section>
                <InclusionsExclusions event={events} />
            </section>
            <ScheduleHeader
                start={basic_details.start_datetime}
                end={basic_details.end_datetime}
                duration={basic_details.duration_days}
                seats={capacity_pricing.seats_available}
            />

            {/* Pickup Points */}
            <PickupPoints pickups={pickups} />

            {/* Pricing */}
            <Pricing pricing={capacity_pricing} />

            {/* Inclusions / Exclusions */}
            <Extras extras={extra_options} />

        </div>
    );
}
export default EventDetail;