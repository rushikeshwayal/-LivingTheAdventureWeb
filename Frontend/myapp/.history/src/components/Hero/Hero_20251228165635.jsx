import { useState, useEffect } from "react";
import fetchHero from "./FetchHero";
import ADVSlider from '../Common/Slider/Slider'
import Spinner from "../Spinner/Spinner";
import MainPage from "../Common/MainPage/MainPage";

function Hero({ heroType }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; // 🛡 prevent memory leaks

        setIsLoading(true);
        setError(null);

        fetchHero(heroType)
            .then((data) => {
                if (isMounted) setEvents(data);
            })
            .catch((err) => {
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [heroType]);

    if (isLoading)
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );

    if (error)
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                Error: {error}
            </div>
        );

    if (!events.length)
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                No events found
            </div>
        );

    return (
        <div className="bg-black text-white min-h-screen font-sans overflow-hidden relative">
            <MainPage heroType={heroType} heroContent={events} />
        </div>
    );
}

export default Hero;
