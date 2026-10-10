import { Link } from "react-router-dom";

const demoEvent = {
    title: "Himalayan Basecamp Escape",
    location: "Manali, Himachal Pradesh",
    duration: "5 days · 4 nights",
    difficulty: "Moderate",
    groupSize: "8–12 travellers",
    price: 12999,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85",
};

const demoDepartures = [
    { date: "14 Nov 2026", end: "18 Nov 2026", seats: 6, pickup: "Chandigarh", price: 12999 },
    { date: "28 Nov 2026", end: "02 Dec 2026", seats: 3, pickup: "Delhi", price: 13999 },
];

function Detail({ label, value }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-white">{value}</p>
        </div>
    );
}

export default function MobilePreview() {
    return (
        <main className="min-h-screen overflow-x-clip bg-neutral-950 pb-28 text-white">
            <div className="fixed left-3 right-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-neutral-950/80 px-4 py-3 shadow-lg backdrop-blur-xl sm:left-6 sm:right-6">
                <Link to="/" className="text-sm font-semibold tracking-wide text-white">
                    LIVING <span className="text-amber-300">THE ADVENTURE</span>
                </Link>
                <span className="rounded-full bg-amber-300/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                    UI preview
                </span>
            </div>

            <section className="relative flex min-h-[82svh] items-end overflow-hidden sm:min-h-[680px]">
                <img
                    src={demoEvent.image}
                    alt="Mountain range for the demo Himalayan adventure"
                    className="absolute inset-0 h-full w-full object-cover"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/10" />
                <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-32 sm:px-8 sm:pb-20">
                    <span className="inline-flex rounded-full border border-amber-200/30 bg-black/30 px-3 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur">
                        DEMO EVENT · NOT BOOKABLE
                    </span>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200 sm:text-sm">
                        Find your next wild
                    </p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
                        {demoEvent.title}
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-gray-200 sm:text-lg">
                        Wake up above the clouds, follow mountain trails and make space for a little wonder.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <a href="#demo-schedule" className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-6 text-sm font-bold text-neutral-950 transition hover:bg-amber-200">
                            Explore departures
                        </a>
                        <a href="#demo-details" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                            Trip details
                        </a>
                    </div>
                </div>
            </section>

            <section id="demo-details" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-8 sm:py-16">
                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">The essentials</p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Small details. Big memories.</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Detail label="Location" value={demoEvent.location} />
                    <Detail label="Duration" value={demoEvent.duration} />
                    <Detail label="Difficulty" value={demoEvent.difficulty} />
                    <Detail label="Group" value={demoEvent.groupSize} />
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                        <h3 className="text-lg font-semibold">A little of everything</h3>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
                            <li>• Guided day hikes with scenic mountain views</li>
                            <li>• Local food stops and time to explore at your pace</li>
                            <li>• Small-group travel with planned pickup points</li>
                            <li>• A practical packing and preparation checklist</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.06] p-5 sm:p-7">
                        <p className="text-sm text-gray-300">Sample price from</p>
                        <p className="mt-1 text-3xl font-bold text-white">₹{demoEvent.price.toLocaleString("en-IN")}<span className="text-sm font-normal text-gray-400"> / person</span></p>
                        <p className="mt-3 text-xs leading-5 text-gray-400">Illustrative price only. This preview does not create a booking or charge a payment.</p>
                    </div>
                </div>
            </section>

            <section id="demo-schedule" className="scroll-mt-24 border-t border-white/10 bg-neutral-900/70 px-4 py-10 sm:px-8 sm:py-16">
                <div className="mx-auto max-w-6xl">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Pick your dates</p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Sample departures</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">This sample schedule demonstrates how dates, pickup locations, availability and price can be scanned on a phone.</p>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {demoDepartures.map((departure) => (
                            <article key={departure.date} className="rounded-2xl border border-white/10 bg-neutral-950 p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">Departure date</p>
                                        <h3 className="mt-1 text-lg font-semibold">{departure.date}</h3>
                                        <p className="mt-1 text-sm text-gray-400">Returns {departure.end}</p>
                                    </div>
                                    <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                        {departure.seats} sample seats
                                    </span>
                                </div>
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <Detail label="Pickup" value={departure.pickup} />
                                    <Detail label="Per person" value={`₹${departure.price.toLocaleString("en-IN")}`} />
                                </div>
                                <button type="button" disabled className="mt-5 min-h-12 w-full cursor-not-allowed rounded-full bg-white/10 px-5 text-sm font-semibold text-gray-400">
                                    Demo only · Booking disabled
                                </button>
                            </article>
                        ))}
                    </div>
                    <p className="mt-5 text-xs leading-5 text-gray-500">All event details, dates, seat counts and prices on this page are sample data for layout review only.</p>
                </div>
            </section>

            <footer className="mx-auto max-w-6xl px-5 py-8 text-center text-xs text-gray-500 sm:px-8">
                Living the Adventure · Mobile experience preview
            </footer>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-950/90 p-3 backdrop-blur-xl sm:hidden">
                <a href="#demo-schedule" className="flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-5 text-sm font-bold text-neutral-950">
                    View sample departures
                </a>
            </div>
        </main>
    );
}
