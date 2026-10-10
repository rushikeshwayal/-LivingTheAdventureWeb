import { Link } from "react-router-dom";

const FOOTER_GROUPS = [
    {
        title: "Discover",
        links: [
            { to: "/trips", label: "Trips" },
            { to: "/treks", label: "Treks" },
            { to: "/adventure-activity", label: "Adventure activities" },
            { to: "/peak-expedition", label: "Peak expeditions" },
        ],
    },
    {
        title: "Company",
        links: [
            { to: "/about", label: "About us" },
            { to: "/contact-us", label: "Contact us" },
            { to: "/help", label: "Help center" },
        ],
    },
    {
        title: "Policies",
        links: [
            { to: "/privacy-policy", label: "Privacy policy" },
            { to: "/terms-conditions", label: "Terms & conditions" },
            { to: "/refund-policy", label: "Refund policy" },
        ],
    },
];

function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0b0e0c] pb-24 pt-12 md:pb-8 md:pl-[76px]">
            <div className="app-container">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-sm font-black text-[#17130c]">LA</span>
                            Living the Adventure
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-white/50">
                            Find the places, trails and experiences that make getting outdoors unforgettable.
                        </p>
                        <Link to="/contact-us" className="mt-4 inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-amber-300/40 hover:text-amber-200">
                            Get in touch <span className="ml-2" aria-hidden="true">↗</span>
                        </Link>
                    </div>
                    {FOOTER_GROUPS.map((group) => (
                        <div key={group.title}>
                            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">{group.title}</h2>
                            <ul className="mt-4 space-y-3">
                                {group.links.map((link) => (
                                    <li key={link.to}><Link to={link.to} className="app-link text-sm">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Living the Adventure. All rights reserved.</p>
                    <p>Made for the curious and the outdoors-minded.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
