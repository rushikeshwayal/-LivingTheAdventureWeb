import VerticalEventCard from "./VerticalEventCard";
import HorizontalEventCard from "./HorizontalCard";


const EventCard = ({ item, title }) => {
    const isSpecialType = ["Special Event", "Best Of The Year"].includes(title);
    return (
        <>
            {!isSpecialType ? (
                <div>
                    <VerticalEventCard item={item} />
                </div>
            ) : (
                <div>
                    <HorizontalEventCard item={item} />
                </div>
            )}
        </>
    );
};

export default EventCard;
