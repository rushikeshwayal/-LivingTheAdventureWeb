import { useRef, useState } from "react";
import API from "../api";

function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Uploads a single file to POST /upload/image (folder param groups it in
 * storage — "cover", "poster_horizontal_1", "promo_video", etc.) and hands
 * the returned public URL back via onChange. Works for images and video;
 * pass accept="video/*" + kind="video" for the promo video field.
 */
export default function ImageUploadField({
    label,
    folder,
    value,
    onChange,
    accept = "image/*",
    kind = "image",
    helperText,
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError("");

        // Chrome/Brave/Edge can't render HEIC/HEIF in an <img>/<video> tag —
        // only Safari can. The upload would succeed but never preview, so
        // catch it here instead of shipping an unviewable image.
        const isHeic =
            /\.heic$|\.heif$/i.test(file.name) ||
            file.type === "image/heic" ||
            file.type === "image/heif";
        if (isHeic) {
            setError(
                "This is a HEIC/HEIF photo (common on iPhone) — most browsers can't display it. Please convert it to JPG or PNG first."
            );
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await API.post("/upload/image", formData, {
                headers: getAuthHeaders(),
            });

            if (res.data?.url) {
                onChange(res.data.url);
            } else {
                setError("Upload didn't return a URL.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed. Try again.");
        } finally {
            setUploading(false);
            // allow re-selecting the same file
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium tracking-wide text-[#6E6A5E] uppercase mb-2">
                {label}
            </label>

            <div
                onClick={() => !uploading && inputRef.current?.click()}
                className="relative group h-36 rounded-sm border border-dashed border-[#1B222C]/20 bg-[#1B222C]/[0.02] overflow-hidden cursor-pointer hover:border-[#A9782F]/60 transition-colors"
            >
                {value ? (
                    kind === "video" ? (
                        <video src={value} className="h-full w-full object-cover" muted />
                    ) : (
                        <img src={value} alt="" className="h-full w-full object-cover" />
                    )
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-1.5 text-[#6E6A5E]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="9" cy="9" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                        </svg>
                        <span className="text-xs">Click to upload</span>
                    </div>
                )}

                {value && (
                    <div className="absolute inset-0 bg-[#1B222C]/0 group-hover:bg-[#1B222C]/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-[#F5F2E9] text-xs font-medium px-3 py-1.5 bg-[#1B222C]/60 rounded-sm">
                            Replace
                        </span>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-[#F5F2E9]/80 flex items-center justify-center">
                        <span className="h-5 w-5 rounded-full border-2 border-[#1B222C]/20 border-t-[#A9782F] animate-spin" />
                    </div>
                )}

                {value && !uploading && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange("");
                        }}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-[#1B222C]/70 text-[#F5F2E9] flex items-center justify-center hover:bg-[#9C4A3C] transition-colors"
                        aria-label="Remove"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFile}
                    className="hidden"
                />
            </div>

            {helperText && !error && (
                <p className="mt-1.5 text-xs text-[#6E6A5E]/70">{helperText}</p>
            )}
            {error && <p className="mt-1.5 text-xs text-[#9C4A3C]">{error}</p>}
        </div>
    );
}