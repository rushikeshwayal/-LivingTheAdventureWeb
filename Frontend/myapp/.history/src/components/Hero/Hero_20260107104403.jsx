import { useState, useEffect } from "react";
import fetchHero from "./FetchHero";
import Spinner from "../Spinner/Spinner";
import MainPage from "../Common/MainPage/MainPage";

function Hero({ heroType }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        setError(null);

        fetchHero(heroType)
            .then((data) => {
                if (isMounted) setEvents(data);
            })
            .catch((err) => {
                if (isMounted) setError(err.message || "Something went wrong");
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [heroType]);

    /* ---------- LOADING STATE ---------- */
    if (isLoading) {
        return (
            <div className="
        bg-black text-white
        min-h-[60vh] md:min-h-screen
        flex items-center justify-center
      ">
                <Spinner />
            </div>
        );
    }

    /* ---------- ERROR STATE ---------- */
    if (error) {
        return (
            <div className="
        bg-black text-white
        min-h-[60vh] md:min-h-screen
        flex items-center justify-center
        text-center px-4
      ">
                Error: {error}
            </div>
        );
    }

    /* ---------- EMPTY STATE ---------- */
    if (!events.length) {
        return (
            <div className="
        bg-black text-white
        min-h-[60vh] md:min-h-screen
        flex items-center justify-center
        text-center px-4
      ">
                No events found
            </div>
        );
    }

    /* ---------- MAIN HERO ---------- */
    return (
        <section
            className="
        bg-black text-white
        w-full
        min-h-[70vh] md:min-h-screen
        overflow-hidden
        relative
      "
        >
            <MainPage
                heroType={heroType}
                heroContent={events}
            />
        </section>
    );
}

export default Hero;
