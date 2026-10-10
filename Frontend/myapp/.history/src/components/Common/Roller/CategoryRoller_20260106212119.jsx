import React, { useRef } from "react";
import EventCard from "../../Common/EventCard/EventCard";
import scroll from "./Scroll";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CategoryRoller = ({ title, items = [] }) => {

    const ROUTE_MAP = {
        "adventure activity": "/adventure",
        "trip": "/trip",
        "trips": "/trip",
        "trek": "/trek",
        "peak expedition": "/peak",
        "special event": "/special_event",
        "best of the year": "/best_of_the_year",
    };
    const route =
        ROUTE_MAP[title?.toLowerCase()] || "/events";
    const scrollRef = useRef(null);

    if (!items.length) return null;

    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-4 md:px-8">
                <h2 className="text-xl md:text-2xl font-bold text-white capitalize">
                    {title}
                </h2>
                <a href={route}>
                    <button className="text-sm font-semibold text-gray-400 hover:text-white transition">
                        View All &gt;
                    </button>
                </a>
            </div>

            {/* Slider */}
            <div className="relative group">
                {/* Left Button */}
                <button
                    onClick={() => scroll(scrollRef, "left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                               bg-black/50 p-2 rounded-full
                               opacity-0 group-hover:opacity-100
                               transition hover:bg-black"
                >
                    <FiChevronLeft size={24} />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-scroll scroll-smooth
                               scrollbar-hide px-4 md:px-8 py-4"
                >
                    {items.map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                            <EventCard title={title} item={item} />
                        </div>
                    ))}
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll(scrollRef, "right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                               bg-black/50 p-2 rounded-full
                               opacity-0 group-hover:opacity-100
                               transition hover:bg-black"
                >
                    <FiChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default CategoryRoller;
