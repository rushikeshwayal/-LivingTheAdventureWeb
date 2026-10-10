import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";

import Hero from "../components/Hero/Hero";
import StarCard from "../components/Widgets/StarCard";
import Itinerary from "../components/Widgets/ItineraryFlow";
import InclusionsExclusions from "../components/Widgets/InclusionsExclusions";

import fetchEventByID from "../components/FetchEventByID";
import fetchScheduleByID from "../components/FetchScheduleByID";

import ScheduleHeader from "../components/EventSchedule/ScheduleHeader";
import PickupPoints from "../components/EventSchedule/PickupPoints";
import Pricing from "../components/EventSchedule/Pricing";
import Extras from "../components/EventSchedule/Extras";

function EventDetail() {
    const { id } = useParams();

    const [events, setEvents] = useState(null);
    const [eventSchedule, setEventSchedule] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1️⃣ Fetch Event
    useEffect(() => {
        let mounted = true;

        fetchEventByID(id)
            .then((data) => {
                if (mounted) setEvents(data);
            })
            .catch(() => mounted && setError("Failed to load event"))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [id]);

    // 2️⃣ Fetch Schedule AFTER event is loaded
    useEffect(() => {
        if (!events?.event_id) return;

        let mounted = true;

        fetchScheduleByID(events.event_id)
            .then((data) => {
                if (mounted) setEventSchedule(data);
            })
            .catch(() => mounted && setError("Failed to load event schedule"));

        return () => {
            mounted = false;
        };
    }, [events?.event_id]);

    // ---------------- UI STATES ----------------

    if (loading || !events) {
        return (
            <div className="text-white text-center mt-20">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center mt-20">
                {error}
            </div>
        );
    }

    return (
        <div>

            {/* HERO */}
            <Hero
                promo_video={events.promo_video_url}
                event_type={events.event_type}
                event_title={events.title}
                event_description={events.short_description}
                event_poster={events.poster_horizontal_1_url}
            />

            {/* HIGHLIGHTS */}
            <section className="relative bg-neutral-950 py-16">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">
                            Event Highlights
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Everything you need to know at a glance
                        </p>
                    </div>

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

            {/* ITINERARY */}
            <section className="bg-black">
                <Itinerary
                    itinerary={events.itinerary}
                    gallery_image_urls={events.gallery_image_urls}
                />
            </section>

            {/* INCLUSIONS */}
            <section>
                <InclusionsExclusions event={events} />
            </section>

            {/* SCHEDULE (render only if exists) */}
            {eventSchedule && (
                <>
                    <ScheduleHeader
                        start={eventSchedule.schedule_data.basic_details.start_datetime}
                        end={eventSchedule.schedule_data.basic_details.end_datetime}
                        duration={eventSchedule.schedule_data.basic_details.duration_days}
                        seats={eventSchedule.schedule_data.capacity_pricing.seats_available}
                    />

                    <PickupPoints
                        pickups={eventSchedule.schedule_data.pickups}
                    />

                    <Pricing
                        pricing={eventSchedule.schedule_data.capacity_pricing}
                    />

                    <Extras
                        extras={eventSchedule.schedule_data.extra_options}
                    />
                </>
            )}

        </div>
    );
}

export default EventDetail;
