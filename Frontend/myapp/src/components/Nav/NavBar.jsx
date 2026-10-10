import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSuitcaseRolling, FaHiking, FaCampground, FaMountain, FaTree, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Logo from "../Common/Logo/logo";

const NAV_ITEMS = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/trips", label: "Trips", icon: FaSuitcaseRolling },
    { to: "/treks", label: "Treks", icon: FaHiking },
    { to: "/adventure-activity", label: "Activities", icon: FaCampground },
    { to: "/peak-expedition", label: "Expeditions", icon: FaMountain },
    { to: "/park-development-design", label: "Park design", icon: FaTree },
];

function NavBar() {
    const { user } = useAuth();
    const location = useLocation();
    const profilePath = user ? "/profile" : "/auth";

    const linkClass = (active) => [
        "group relative flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-200",
        active ? "bg-amber-300/10 text-amber-200" : "text-white/60 hover:bg-white/[0.06] hover:text-white",
    ].join(" ");

    return (
        <>
            <Link
                to="/"
                aria-label="Living the Adventure home"
                className="fixed left-1.5 top-3 z-50 hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#101310]/90 shadow-lg backdrop-blur md:flex"
            >
                <span className="text-xl font-black text-amber-300">L<span className="text-white">A</span></span>
            </Link>

            <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0c0f0d]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:inset-y-0 md:left-0 md:right-auto md:flex md:w-[76px] md:flex-col md:items-center md:justify-center md:border-r md:border-t-0 md:bg-[#0c0f0d]/90 md:px-2 md:py-24">
                <div className="grid grid-cols-7 gap-1 md:flex md:w-full md:flex-col md:gap-2">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                        const active = to === "/" ? location.pathname === "/" : location.pathname === to || location.pathname.startsWith(`${to}/`);
                        return (
                            <Link key={to} to={to} aria-label={label} aria-current={active ? "page" : undefined} title={label} className={linkClass(active)}>
                                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                                <span className="hidden text-xs md:inline">{label}</span>
                                {active && <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-amber-300 md:bottom-auto md:left-0 md:top-1/2 md:h-5 md:w-0.5 md:-translate-y-1/2 md:translate-x-0" />}
                            </Link>
                        );
                    })}
                    <Link to={profilePath} aria-label="Profile" title="Profile" aria-current={location.pathname === profilePath ? "page" : undefined} className={linkClass(location.pathname === profilePath)}>
                        <FaUserCircle className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                        <span className="hidden text-xs md:inline">Profile</span>
                    </Link>
                </div>
            </nav>
        </>
    );
}

export default NavBar;
