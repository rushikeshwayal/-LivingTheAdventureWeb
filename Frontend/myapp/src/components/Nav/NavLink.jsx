const NavLink = ({ icon, label, active = false }) => (
    <span
        className={[
            "group relative flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-200",
            active
                ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.06] hover:text-white",
        ].join(" ")}
    >
        <span className="flex items-center justify-center" aria-hidden="true">{icon}</span>
        <span className="pointer-events-none absolute left-14 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#171b18] px-3 py-2 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            {label}
        </span>
    </span>
);

export default NavLink;
