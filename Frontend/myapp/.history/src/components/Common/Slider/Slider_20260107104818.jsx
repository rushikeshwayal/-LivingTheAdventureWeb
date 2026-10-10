import { useState, useEffect, useMemo } from "react";
import { GoPlus } from "react-icons/go";

function Slider({ heroContent = [] }) {
    const initialHero = useMemo(() => heroContent[0] || null, [heroContent]);

    const [activeHero, setActiveHero] = useState(initialHero);
    const [audioOn, setAudioOn] = useState(false);
    const [fade, setFade] = useState(false);

    // Sync when heroContent changes
    useEffect(() => {
        if (heroContent.length) setActiveHero(heroContent[0]);
    }, [heroContent]);

    if (!activeHero) return null;

    const currentIndex = heroContent.findIndex(
        h => h.id === activeHero.id
    );

    const changeHero = (hero) => {
        if (!hero || hero.id === activeHero.id) return;
        setFade(true);
        setTimeout(() => {
            setActiveHero(hero);
            setFade(false);
        }, 300);
    };

    const handleVideoEnd = () => {
        const next =
            heroContent[(currentIndex + 1) % heroContent.length];
        changeHero(next);
    };

    return (
        <section
            className="
        relative
        w-full
        min-h-[70vh] md:min-h-screen
        bg-black text-white
        overflow-hidden
      "
        >
            {/* VIDEO BACKGROUND */}
            <div
                className={`
          absolute inset-0
          transition-opacity duration-300
          ${fade ? "opacity-0" : "opacity-100"}
        `}
            >
                <video
                    className="w-full h-full object-cover"
                    src={activeHero.video}
                    poster={activeHero.thumbnail}
                    autoPlay
                    muted={!audioOn}
                    playsInline
                    preload="metadata"
                    onEnded={handleVideoEnd}
                />
            </div>

            {/* GRADIENT OVERLAY */}
            <div
                className="
          absolute inset-0 z-10
          bg-gradient-to-b from-black/40 via-black/40 to-black
          pointer-events-none
        "
            />

            {/* CONTENT */}
            <div
                className="
          relative z-20
          h-full
          flex items-center
          px-4 sm:px-6 md:px-16 lg:px-24
        "
            >
                <div className="max-w-3xl">

                    {/* TITLE */}
                    <h1 className="
            text-2xl sm:text-3xl md:text-4xl
            font-bold uppercase
            mb-4
          ">
                        {activeHero.title}
                    </h1>

                    {/* META */}
                    <div className="flex flex-wrap gap-3 mb-3 text-gray-400 text-xs sm:text-sm capitalize">
                        {(activeHero.details || []).map(d => (
                            <span key={d}>{d}</span>
                        ))}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="
            max-w-xl
            text-sm sm:text-base md:text-lg
            mb-6
            capitalize
          ">
                        {activeHero.description}
                    </p>

                    {/* GENRES */}
                    <div className="flex flex-wrap gap-2 mb-6 text-gray-300 text-xs sm:text-sm">
                        {(activeHero.genres || []).map((g, i) => (
                            <span key={g}>
                                {g}
                                {i < activeHero.genres.length - 1 && " •"}
                            </span>
                        ))}
                    </div>

                    {/* CTA + THUMBNAILS */}
                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">

                        {/* CTA BUTTONS */}
                        <div className="flex gap-4">
                            <button className="
                bg-white text-black
                font-bold
                py-2.5 sm:py-3
                px-6 sm:px-8
                rounded-lg
              ">
                                Book Now
                            </button>

                            <button className="
                bg-white/20 text-white
                p-3 rounded-xl
                flex items-center justify-center
              ">
                                <GoPlus className="h-5 w-5" />
                            </button>
                        </div>

                        {/* THUMBNAILS */}
                        <div className="
              flex gap-2
              sm:absolute sm:right-0 sm:top-1
              overflow-x-auto sm:overflow-visible
              pb-2
            ">
                            {heroContent.map(hero => (
                                <button
                                    key={hero.id}
                                    onClick={() => changeHero(hero)}
                                    className={`
                    w-20 h-12 sm:w-24 sm:h-16
                    overflow-hidden rounded-lg
                    transition-all duration-300
                    ${activeHero.id === hero.id
                                            ? "border-2 border-white opacity-100"
                                            : "opacity-60 hover:opacity-100"}
                  `}
                                >
                                    <img
                                        src={hero.thumbnail}
                                        alt={hero.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Slider;
