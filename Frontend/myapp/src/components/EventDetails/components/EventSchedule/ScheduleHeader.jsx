import { MdOutlineAccessTime, MdOutlinePeople } from "react-icons/md";

function formatDate(value) {
    if (!value) return "Date to be announced";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date to be announced";

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function ScheduleHeader({ start, end, duration, seats }) {
    return (
        <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 text-left shadow-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                Plan your adventure
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
                Event schedule
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                Choose a departure, pickup location and group size to see your booking total.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Departure</p>
                    <p className="mt-1 text-sm font-medium text-white">{formatDate(start)}</p>
                    <p className="text-sm text-gray-400">to {formatDate(end)}</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <MdOutlineAccessTime className="shrink-0 text-xl text-amber-300" />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Duration</p>
                        <p className="mt-1 text-sm font-medium text-white">
                            {duration ? `${duration} days` : "To be confirmed"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <MdOutlinePeople className="shrink-0 text-xl text-amber-300" />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Availability</p>
                        <p className="mt-1 text-sm font-medium text-white">
                            {Number.isFinite(Number(seats)) ? `${seats} seats left` : "Check availability"}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ScheduleHeader;