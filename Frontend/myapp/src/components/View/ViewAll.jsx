import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchEventsByType from "./FetchEvent";
import VerticalEventCard from "../Common/EventCard/VerticalEventCard";
import Spinner from "../Spinner/Spinner";
import { getApiErrorMessage } from "../../api/errors.js";
import { useAuth } from "../../context/AuthContext";
import { fetchFavourites, toggleFavourite } from "../../api/favourites";

const TYPE_LABELS = {
    adventure: "Adventure activities",
    trip: "Trips",
    trek: "Treks",
    peak: "Peak expeditions",
    special_event: "Special events",
    best_of_the_year: "Best of the year",
};

function ViewAll({ event_type, state }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [favourites, setFavourites] = useState(new Set());
    const { user } = useAuth();

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchEventsByType(event_type, state);
                let favouriteIds = [];
                if (user) {
                    const token = await user.getIdToken();
                    favouriteIds = await fetchFavourites(token);
                }
                if (!mounted) return;
                setEvents(Array.isArray(data) ? data : []);
                setFavourites(new Set(favouriteIds));
            } catch (err) {
                if (mounted) setError(getApiErrorMessage(err, "We couldn't load these adventures."));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [event_type, state, user]);

    const handleToggleFavourite = async (eventId) => {
        if (!user) {
            window.location.assign("/auth");
            return;
        }

        const wasFavourite = favourites.has(eventId);
        setFavourites((current) => {
            const next = new Set(current);
            if (wasFavourite) next.delete(eventId);
            else next.add(eventId);
            return next;
        });

        try {
            const token = await user.getIdToken();
            const serverState = await toggleFavourite(eventId, token);
            setFavourites((current) => {
                const next = new Set(current);
                if (serverState) next.add(eventId);
                else next.delete(eventId);
                return next;
            });
        } catch (err) {
            setFavourites((current) => {
                const next = new Set(current);
                if (wasFavourite) next.add(eventId);
                else next.delete(eventId);
                return next;
            });
            console.error("Could not update favourite", err);
        }
    };

    const title = TYPE_LABELS[event_type] || event_type?.replaceAll("_", " ") || "Adventures";

    return (
        <main className="app-page min-h-screen pb-16 pt-10 md:pb-12 md:pl-[76px]">
            <section className="app-container">
                <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="app-eyebrow">Curated for the curious</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{state ? `${state} ${title.toLowerCase()}` : title}</h1>
                        <p className="app-muted mt-3 max-w-xl text-sm leading-6">Find your next escape, explore new places, and make your time outdoors count.</p>
                    </div>
                    <Link to="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white/75 transition hover:border-amber-300/40 hover:text-amber-200">
                        <span aria-hidden="true">←</span> Back to home
                    </Link>
                </header>

                {loading ? (
                    <Spinner label="Finding adventures" className="min-h-[40vh]" />
                ) : error ? (
                    <div role="alert" className="app-panel mx-auto flex max-w-2xl flex-col items-center p-8 text-center sm:p-12">
                        <p className="text-lg font-semibold text-white">We hit a small trail block.</p>
                        <p className="app-muted mt-2 text-sm leading-6">{error}</p>
                        <button type="button" onClick={() => window.location.reload()} className="app-button-primary mt-5">Try again</button>
                    </div>
                ) : events.length === 0 ? (
                    <div className="app-panel mx-auto flex max-w-2xl flex-col items-center p-8 text-center sm:p-12">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-2xl text-amber-200" aria-hidden="true">✦</span>
                        <h2 className="mt-4 text-xl font-semibold text-white">Something exciting is on the way</h2>
                        <p className="app-muted mt-2 max-w-md text-sm leading-6">There aren't any adventures in this collection just yet. Check back soon or browse another category.</p>
                        <Link to="/" className="app-button-primary mt-5">Explore homepage</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                        {events.map((event) => {
                            const eventId = event.event_uuid ?? event.id;
                            return (
                                <VerticalEventCard
                                    key={eventId}
                                    item={event}
                                    isFavourite={favourites.has(eventId)}
                                    onToggleFavourite={handleToggleFavourite}
                                />
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ViewAll;
