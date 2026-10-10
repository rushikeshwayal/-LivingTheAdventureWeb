import { useRef } from "react";
import Spinner from "../../Spinner/Spinner";
import useHoverDetails from "./useHoverDetails";
import { GoPlus } from "react-icons/go";

const HorizontalEventCard = ({ item }) => {
    const cardRef = useRef(null);

    const {
        isHovered,
        details,
        isLoading,
        handleMouseEnter,
        handleMouseLeave,
    } = useHoverDetails(item);

    return (
        <div
            ref={cardRef}
            className="shrink-0 w-full max-w-md group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a href={`/eventDetails/${item.id}`} className="block">
                <div
                    className={`
            relative aspect-[5/3]
            rounded-lg overflow-hidden bg-gray-800
            transition-all duration-300
            ${isHovered
                            ? "shadow-xl ring-1 ring-white/20"
                            : "group-hover:shadow-lg"}
          `}
                >
                    {/* Image */}
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        width="480"
                        height="288"
                        className={`
              w-full h-full object-cover
              transition-transform duration-300
              transform-gpu will-change-transform backface-hidden
              ${isHovered ? "scale-105 brightness-75" : "group-hover:scale-102"}
            `}
                    />

                    {/* Gradient */}
                    <div
                        className="
              absolute inset-0
              bg-gradient-to-r from-black/70 via-black/30 to-transparent
              pointer-events-none
              transform-gpu will-change-transform
            "
                    />

                    {/* Loader */}
                    {isHovered && isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                            <Spinner />
                        </div>
                    )}

                    {/* Hover Content */}
                    {isHovered && !isLoading && (
                        <div className="absolute inset-0 flex flex-col justify-end p-3 z-20">
                            <h3 className="text-sm font-semibold text-white truncate mb-0.5">
                                {item.name}
                            </h3>

                            <p className="text-xs text-gray-300 line-clamp-2 mb-2">
                                {details?.short_description || item.description}
                            </p>

                            <div className="flex gap-2">
                                <button className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-md">
                                    Book
                                </button>
                                <div className="border rounded-md w-7 h-7 border-gray-500 flex items-center justify-center">
                                    <button className="  text-white ">
                                        <GoPlus />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
};

export default HorizontalEventCard;
