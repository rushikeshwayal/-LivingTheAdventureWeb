const Itinerary = ({ itinerary, gallery_image_urls }) => {
    // Split itinerary into points (handles ; , or new lines)
    const points =
        itinerary
            ?.split(/[;,]\s*|\n+/)
            .map(p => p.trim())
            .filter(Boolean) || [];

    const galleryImages = (gallery_image_urls || []).slice(0, 4);

    return (
        <section className="bg-neutral-950 py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-white">
                        Trip Itinerary
                    </h2>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        A breakdown of your adventure experience
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    <div className="flex flex-col justify-center  space-y-6 h-full">

                        {points.map((point, index) => (
                            <div
                                key={index}
                                className="
        flex gap-6 items-start
        p-5
        rounded-2xl
        bg-white/[0.03]
        border border-white/10
        hover:bg-white/[0.06]
        transition-colors duration-300
      "
                            >

                                {/* Number */}
                                <div className="
        w-14 h-14
        rounded-full
        bg-neutral-900
        border border-white/30
        flex items-center justify-center
        text-lg font-bold text-white
        shrink-0
      ">
                                    {index + 1}
                                </div>

                                {/* Text */}
                                <p className="
        text-lg
        font-semibold
        text-white/90
        leading-relaxed
        tracking-wide
      ">
                                    {point}
                                </p>

                            </div>
                        ))}
                    </div>


                    {/* Gallery */}
                    {galleryImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {galleryImages.map((url, i) => (
                                <div
                                    key={i}
                                    className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    aspect-[3/2]
                    bg-neutral-800
                    group
                  "
                                >
                                    <img
                                        src={url}
                                        alt={`Itinerary view ${i + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="
                      w-full h-full object-cover
                      transition-transform duration-700
                      group-hover:scale-105
                    "
                                    />

                                    <div className="
                    absolute inset-0
                    bg-gradient-to-t from-black/40 via-transparent to-transparent
                    pointer-events-none
                  " />
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default Itinerary;
