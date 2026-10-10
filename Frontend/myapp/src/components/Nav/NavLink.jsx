const NavLink = ({ icon, label, onHover }) => (
    <div
        className="group relative flex w-full flex-col items-center justify-center sm:flex-row"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
    >
        <div className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-amber-300 sm:h-12 sm:w-12">
            <div className="flex items-center justify-center w-10 h-10">{icon}</div>
        </div>
        <span className="hidden absolute left-14 top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block">
            {label}
        </span>
    </div>
);
export default NavLink;