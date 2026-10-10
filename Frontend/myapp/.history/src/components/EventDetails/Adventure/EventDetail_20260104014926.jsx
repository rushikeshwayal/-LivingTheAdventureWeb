import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import Hero from "../components/Hero/Hero";
import StarCard from "../components/Widgets/StarCard";
import fetchEventByID from "../components/FetchEventByID";
import Itinerary from "../components/Widgets/ItineraryFlow";
import InclusionsExclusions from "../components/Widgets/InclusionsExclusions";
import fetchScheduleByID from "../components/FetchScheduleByID";
import ScheduleHeader from "../components/EventSchedule/ScheduleHeader";
import PickupPoints from "../components/EventSchedule/PickupPoints";
import Pricing from "../components/EventSchedule/Pricing";
import Extras from "../components/EventSchedule/Extras";
import Highlights from "../components/Highlighter";
function EventDetail() {
    const { id } = useParams();

    const [events, setEvents] = useState(null);
    const [eventSchedule, setEventSchedule] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Event
    useEffect(() => {
        let mounted = true;

        fetchEventByID(id)
            .then(data => mounted && setEvents(data))
            .catch(() => mounted && setError("Failed to load event"))
            .finally(() => mounted && setLoadingEvent(false));

        return () => (mounted = false);
    }, [id]);

    // Fetch Schedule (after event loaded)
    useEffect(() => {
        if (!events?.event_id) return;

        let mounted = true;
        setLoadingSchedule(true);

        fetchScheduleByID(events.event_id)
            .then(data => mounted && setEventSchedule(data[0]))
            .catch(() => mounted && setError("Failed to load schedule"))
            .finally(() => mounted && setLoadingSchedule(false));

        return () => (mounted = false);
    }, [events?.event_id]);

    if (loadingEvent) {
        return <div className="text-white text-center mt-20"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-20">{error}</div>;
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
            <section className="bg-neutral-950 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white">
                            Event Highlights
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Everything you need to know at a glance
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StarCard title="Location" value={events.location} />
                        <StarCard title="Category" value={events.adventure_activity_category} />
                        <StarCard title="Duration" value={`${events.duration_days} days • ${events.duration_nights} nights`} />
                        <StarCard title="Fitness" value={events.fitness_requirement} />
                        <StarCard title="Age" value={events.age_requirement} />
                        <StarCard title="Difficulty" value={events.adventure_difficulty_level} />
                    </div>
                </div>
            </section>

            {/* ITINERARY */}
            <Itinerary
                itinerary={events.itinerary}
                gallery_image_urls={events.gallery_image_urls}
            />

            {/* INCLUSIONS / EXCLUSIONS */}
            <InclusionsExclusions event={events} />

            {/* SCHEDULE */}
            <section className="bg-neutral-950">
                <div className=" space-y-10 py-20 px-6 max-w-7xl mx-auto">
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

                            {/* <Extras
                                extras={eventSchedule.schedule_data.extra_options}
                            /> */}
                        </>
                    )}

                    {loadingSchedule && (
                        <div className="text-center text-gray-400 mt-10">
                            Loading schedule...
                        </div>
                    )}
                </div>
            </section>

            <section className="fixed">
                <Highlights highlights={events.status} />
            </section>
        </div>
    );
}

export default EventDetail;
