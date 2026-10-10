import { Link } from "react-router-dom";

function AuthButton() {
    return (
        <nav aria-label="Account actions" className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#101110]/85 p-1.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-2">
                <Link
                    to="/auth"
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                    Login
                </Link>
                <Link
                    to="/signup"
                    className="rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-2.5 text-sm font-bold text-[#17130c] shadow-sm transition hover:from-amber-200 hover:to-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101110]"
                >
                    Sign up
                </Link>
            </div>
        </nav>
    );
}

export default AuthButton;
