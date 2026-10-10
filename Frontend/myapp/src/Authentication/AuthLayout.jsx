import { Link } from "react-router-dom";
import Logo from "../components/Common/Logo/logo.jsx";

export default function AuthLayout({ eyebrow, title, description, children }) {
    return (
        <main
            className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#080909] px-4 py-24 text-white sm:px-6"
            style={{
                backgroundImage: "url(https://images.pexels.com/photos/14394294/pexels-photo-14394294.jpeg)",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="absolute inset-0 -z-10 bg-[#080909]/70" aria-hidden="true" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/80 via-black/55 to-[#9b6a2c]/25" aria-hidden="true" />
            <div className="absolute -left-24 top-1/4 -z-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />

            <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
                <Link to="/" aria-label="Living the Adventure home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
                    <Logo />
                </Link>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur transition hover:border-amber-300/60 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                    <span aria-hidden="true">←</span>
                    <span className="hidden sm:inline">Back to exploring</span>
                    <span className="sm:hidden">Home</span>
                </Link>
            </header>

            <section className="w-full max-w-[460px]">
                <div className="rounded-3xl border border-white/15 bg-[#101110]/85 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-9">
                    <div className="mb-7">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-300">{eyebrow}</p>
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
                        <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
                    </div>
                    {children}
                </div>
                <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-white/55">
                    By continuing, you agree to our{" "}
                    <Link className="text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-amber-200" to="/terms-conditions">Terms</Link>
                    {" "}and{" "}
                    <Link className="text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-amber-200" to="/privacy-policy">Privacy Policy</Link>.
                </p>
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-white/35">Find your next great escape</p>
            </section>
            <div id="recaptcha-container" />
        </main>
    );
}
