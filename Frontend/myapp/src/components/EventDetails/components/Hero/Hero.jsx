import { useEffect, useRef, useState } from "react";

function Hero({
    promo_video,
    event_type,
    event_title,
    event_description,
    event_poster,
}) {
    const videoRef = useRef(null);

    const [minTimePassed, setMinTimePassed] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [fade, setFade] = useState(false);

    // 1️⃣ Minimum poster time (3s)
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimePassed(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // 2️⃣ When BOTH conditions are true → fade & show video
    useEffect(() => {
        if (minTimePassed && videoReady) {
            setFade(true);

            const fadeTimer = setTimeout(() => {
                setShowVideo(true);
                setFade(false);

                // Explicit play (important)
                if (videoRef.current) {
                    videoRef.current.play().catch(() => { });
                }
            }, 1000); // fade duration

            return () => clearTimeout(fadeTimer);
        }
    }, [minTimePassed, videoReady]);

    return (
        <section className="relative min-h-[68svh] w-full overflow-hidden bg-black sm:h-[78svh] md:h-screen">

            {/* Poster (default layer) */}
            <img
                src={event_poster}
                alt={event_title}
                className={`absolute inset-0 w-full h-full object-cover
          transition-opacity duration-1000
          ${showVideo ? "opacity-0" : "opacity-100"}
        `}
                loading="eager"
            />

            {/* Video (only becomes visible when allowed) */}
            {promo_video && (
                <video
                    ref={videoRef}
                    src={promo_video}
                    muted
                    playsInline
                    preload="metadata"
                    loop
                    className={`absolute inset-0 w-full h-full object-cover
            transition-opacity duration-1000
            ${showVideo ? "opacity-100" : "opacity-0"}
          `}
                    onLoadedData={() => setVideoReady(true)}
                />
            )}

            {/* Fade layer (ONLY used during transition) */}
            <div
                className={`absolute inset-0 bg-black pointer-events-none
          transition-opacity duration-1000
          ${fade ? "opacity-100" : "opacity-0"}
        `}
            />

            {/* Gradient overlay */}
            <div className="
        absolute inset-0
        bg-gradient-to-b from-black/60 via-black/40 to-black/80
        pointer-events-none
        transform-gpu will-change-transform
      " />

            {/* Content */}
            <div className="relative z-10 flex min-h-[68svh] w-full items-end justify-center px-5 pb-16 pt-24 text-center sm:min-h-0 sm:h-full sm:items-center sm:px-8 sm:py-16">
                <div className="mx-auto max-w-3xl">
                    <p className="mb-3 text-xs uppercase tracking-[0.24em] text-amber-200 sm:text-sm md:text-base">
                        {event_type}
                    </p>

                    <h1 className="font-bebas text-5xl uppercase leading-[0.95] tracking-wide text-white drop-shadow-lg sm:text-6xl md:text-8xl md:tracking-widest">
                        {event_title}
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base md:text-lg">
                        {event_description}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Hero;
