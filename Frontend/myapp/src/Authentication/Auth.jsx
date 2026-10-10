import { useEffect, useState } from "react";
import axios from "axios";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaKey, FaPhone, FaSpinner } from "react-icons/fa";
import { auth as firebaseAuth } from "./firebase";
import { apiUrl } from "../api/config.js";
import AuthLayout from "./AuthLayout.jsx";

const normalizePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    throw new Error("Enter a valid 10-digit Indian mobile number.");
};

const inputClass = "w-full rounded-xl border border-white/15 bg-black/35 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/70 focus:ring-4 focus:ring-amber-300/10 disabled:cursor-not-allowed disabled:opacity-50";

export default function Auth() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (timer <= 0) return undefined;
        const interval = window.setInterval(() => setTimer((current) => Math.max(0, current - 1)), 1000);
        return () => window.clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (otpSent) document.getElementById("login-otp-input")?.focus();
    }, [otpSent]);

    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", { size: "invisible" });
    };

    const sendOtp = async () => {
        setError("");
        setSuccess("");
        let cleanPhone;
        try {
            cleanPhone = normalizePhone(phone);
        } catch (err) {
            setError(err.message);
            return;
        }

        setLoading(true);
        try {
            setupRecaptcha();
            const result = await signInWithPhoneNumber(firebaseAuth, cleanPhone, window.recaptchaVerifier);
            setConfirmation(result);
            setOtpSent(true);
            setOtp("");
            setTimer(60);
            setSuccess("Verification code sent. Check your messages.");
        } catch (err) {
            console.error("Unable to send login OTP", err);
            if (err.code === "auth/invalid-phone-number") setError("That phone number doesn't look valid. Check it and try again.");
            else if (err.code === "auth/too-many-requests") setError("Too many attempts. Please wait a little before trying again.");
            else setError(err.message?.includes("valid 10-digit") ? err.message : "We couldn't send your code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const checkUser = async (token) => {
        try {
            const response = await axios.post(apiUrl("/auth/firebase/verify"), {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "LOGIN") {
                window.location.assign("/");
                return;
            }
            setError("We couldn't find an account for this number. Create an account to continue.");
        } catch (err) {
            console.error("Unable to verify login account", err);
            setError(err.response?.data?.detail || "We couldn't verify your account right now. Please try again.");
        }
    };

    const verifyOtp = async () => {
        setError("");
        setSuccess("");
        if (otp.length !== 6) {
            setError("Enter the 6-digit verification code.");
            return;
        }
        if (!confirmation) {
            setError("This verification session has expired. Request a new code.");
            return;
        }

        setLoading(true);
        try {
            const result = await confirmation.confirm(otp);
            const token = await result.user.getIdToken();
            await checkUser(token);
        } catch (err) {
            console.error("Unable to verify login OTP", err);
            if (err.code === "auth/invalid-verification-code") setError("That code is incorrect. Check it and try again.");
            else if (err.code === "auth/code-expired") setError("That code has expired. Request a new one.");
            else setError("We couldn't verify that code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setOtpSent(false);
        setConfirmation(null);
        setOtp("");
        await sendOtp();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (loading) return;
        if (otpSent) verifyOtp();
        else sendOtp();
    };

    return (
        <AuthLayout eyebrow="Welcome back" title="Your next adventure awaits." description="Sign in securely with your mobile number. We'll send you a one-time verification code.">
            {success && (
                <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3.5 text-sm text-emerald-100">
                    <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-300" />
                    <span>{success}</span>
                </div>
            )}
            {error && (
                <div role="alert" className="mb-5 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3.5 text-sm leading-5 text-rose-100">
                    {error}
                    {error.includes("Create an account") && (
                        <Link to="/signup" className="ml-1 font-semibold text-amber-200 underline underline-offset-4 hover:text-amber-100">Sign up</Link>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="login-phone" className="mb-2 block text-sm font-medium text-white/85">Mobile number</label>
                    <div className="relative">
                        <FaPhone aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-300/80" />
                        <input
                            id="login-phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            placeholder="10-digit mobile number"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                            disabled={otpSent || loading}
                            maxLength={10}
                            aria-describedby="login-phone-help"
                            className={inputClass}
                        />
                    </div>
                    <p id="login-phone-help" className="mt-2 text-xs text-white/45">India (+91) · We'll never display your number publicly.</p>
                </div>

                {otpSent && (
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label htmlFor="login-otp-input" className="text-sm font-medium text-white/85">Verification code</label>
                            <button type="button" onClick={() => { setOtpSent(false); setConfirmation(null); setOtp(""); setError(""); setSuccess(""); }} className="text-xs font-medium text-amber-200 transition hover:text-amber-100">Change number</button>
                        </div>
                        <div className="relative">
                            <FaKey aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-300/80" />
                            <input
                                id="login-otp-input"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="Enter 6-digit code"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                                maxLength={6}
                                className={inputClass + " text-center tracking-[0.45em]"}
                            />
                        </div>
                        <div className="mt-3 text-xs text-white/55">
                            {timer > 0 ? <>You can request another code in <span className="font-semibold text-white/80">{timer}s</span>.</> : (
                                <button type="button" onClick={resendOtp} disabled={loading} className="font-semibold text-amber-200 transition hover:text-amber-100 disabled:opacity-50">Resend code</button>
                            )}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || (!otpSent && phone.replace(/\D/g, "").length !== 10) || (otpSent && otp.length !== 6)}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-300 px-5 py-3.5 font-bold text-[#17130c] shadow-lg shadow-amber-950/20 transition duration-200 hover:from-amber-200 hover:to-orange-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/25 disabled:cursor-not-allowed disabled:opacity-45"
                >
                    {loading ? <><FaSpinner className="animate-spin" /> Please wait…</> : otpSent ? <>Verify and sign in <FaArrowRight className="transition-transform group-hover:translate-x-1" /></> : <>Send verification code <FaArrowRight className="transition-transform group-hover:translate-x-1" /></>}
                </button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">New here?</span>
                <span className="h-px flex-1 bg-white/10" />
            </div>
            <p className="text-center text-sm text-white/65">
                Start planning your next escape.{" "}
                <Link to="/signup" className="font-semibold text-amber-200 underline decoration-amber-200/40 underline-offset-4 transition hover:text-amber-100">Create an account</Link>
            </p>
        </AuthLayout>
    );
}
