function Highlights({ highlights }) {
    if (!highlights) return null;

    return (
        <div
            className="
        w-full
        backdrop-blur-xl
        bg-black/60
        border-t border-white/10
        px-6 py-3
        flex items-center justify-center
      "
        >
            <div className="flex items-center gap-3">

                {/* Status Dot */}
                <span
                    className={`
            w-2.5 h-2.5 rounded-full
            ${highlights === "Upcoming" ? "bg-emerald-400" : ""}
            ${highlights === "Ongoing" ? "bg-yellow-400" : ""}
            ${highlights === "Completed" ? "bg-gray-400" : ""}
          `}
                />

                {/* Status Text */}
                <p className="
          font-bebas
          tracking-widest
          uppercase
          text-sm md:text-base
          text-white
        ">
                    {highlights === "Upcoming"
                        ? "Event Upcoming"
                        : highlights === "Ongoin"}
                </p>
            </div>
        </div>
    );
}

export default Highlights;
