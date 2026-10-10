function Spinner({ label = "Loading", className = "" }) {
    return (
        <div role="status" aria-live="polite" className={`flex min-h-48 w-full flex-col items-center justify-center gap-3 text-white/60 ${className}`}>
            <span className="relative flex h-10 w-10 items-center justify-center" aria-hidden="true">
                <span className="absolute inset-0 rounded-full border-2 border-white/10" />
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-amber-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
            </span>
            <span className="text-xs font-medium tracking-wide">{label}…</span>
        </div>
    );
}

export default Spinner;
