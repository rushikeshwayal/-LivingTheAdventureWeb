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
        <div className="bg-black text-white">
            {/* HERO SECTION */}
            <section className="relative h-screen w-full overflow-hidden">

                {/* Video Background */}
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${fade ? "opacity-0" : "opacity-100"
                        }`}
                >
                    <video
                        className="w-full h-full object-cover"
                        src={activeHero.video}
                        loading="lazy"
                        poster={activeHero.thumbnail}
                        autoPlay
                        muted={!audioOn}
                        playsInline
                        preload="metadata"
                        onEnded={handleVideoEnd}
                    />
                </div>

                <div
                    className="
                    absolute inset-0 z-10
                    bg-gradient-to-b from-black/30 via-black/40 to-black
                    pointer-events-none
                    will-change-transform
                    transform-gpu
                "
                />

                {/* Hero Content */}
                <div className="relative z-10 h-full flex items-center px-10">
                    <div className="container mx-auto px-4 md:px-20 lg:px-24 ml-16">

                        <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase">
                            {activeHero.title}
                        </h1>

                        <div className="flex gap-4 mb-2 text-gray-400 text-sm capitalize">
                            {(activeHero.details || []).map(d => (
                                <span key={d}>{d}</span>
                            ))}
                        </div>

                        <p className="max-w-xl text-base md:text-lg mb-6 capitalize">
                            {activeHero.description}
                        </p>

                        <div className="flex gap-2 mb-6 text-gray-300 text-sm">
                            {(activeHero.genres || []).map((g, i) => (
                                <span key={g}>
                                    {g}
                                    {i < activeHero.genres.length - 1 && " •"}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center mb-10 relative">
                            <div className="flex gap-4 transform-gpu will-change-transform backface-hidden">
                                <button className="bg-white text-black font-bold py-3 px-8 rounded-lg transform-gpu will-change-transform backface-hidden">
                                    Book Now
                                </button>
                                <button className="bg-white/20 text-white p-3 rounded-xl px-5 transform-gpu will-change-transform backface-hidden">
                                    <GoPlus className=" h-5" />
                                </button>

                            </div>

                            {/* Thumbnails */}
                            <div className="absolute md:right-0  md:top-1  md:flex gap-2 transform-gpu will-change-transform backface-hidden py-5">
                                {heroContent.map(hero => (
                                    <button
                                        key={hero.id}
                                        onClick={() => changeHero(hero)}
                                        className={`
                                            w-24 h-16
                                            overflow-hidden rounded-lg
                                            transition-transform transition-opacity duration-300
                                            transform-gpu will-change-transform backface-hidden
                                            ${activeHero.id === hero.id
                                                ? "border-2 border-white scale-100"
                                                : "opacity-60 hover:opacity-100 scale-90 hover:scale-95"}
                                            `} >
                                        <img
                                            src={hero.thumbnail}
                                            alt={hero.title}
                                            loading="lazy"
                                            decoding="async"
                                            width="160"
                                            height="90"
                                            className="w-full h-full object-cover transform-gpu will-change-transform backface-hidden"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            </section>
        </div>
    );
}

export default Slider;
