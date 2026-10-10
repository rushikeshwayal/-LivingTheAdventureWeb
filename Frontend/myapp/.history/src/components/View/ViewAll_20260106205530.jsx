import EventCard from "../Common/EventCard/EventCard";
function ViewAll({ event_type }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <EventCard item={event_type} title={event_type.title} />
        </div>
    );
}
export default ViewAll;