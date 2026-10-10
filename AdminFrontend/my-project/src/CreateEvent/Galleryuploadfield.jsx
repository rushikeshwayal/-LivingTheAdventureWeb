import { useRef, useState } from "react";
import API from "../api";

function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Multi-file variant of ImageUploadField — uploads each selected file to
 * POST /upload/image individually (backend only accepts one file per call)
 * and appends each returned URL to the `values` array.
 */
export default function GalleryUploadField({ label, folder, values, onChange, helperText }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [library, setLibrary] = useState([]);
    const [showLibrary, setShowLibrary] = useState(false);
    const [tags, setTags] = useState("");
    const inputRef = useRef(null);

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setError("");
        setUploading(true);

        const uploaded = [];
        const rejected = [];
        try {
            for (const file of files) {
                const isHeic =
                    /\.heic$|\.heif$/i.test(file.name) ||
                    file.type === "image/heic" ||
                    file.type === "image/heif";
                if (isHeic) {
                    rejected.push(file.name);
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", folder);
                formData.append("name", file.name.replace(/\.[^.]+$/, ""));
                formData.append("tags", tags);

                const res = await API.post("/upload/image", formData, {
                    headers: getAuthHeaders(),
                });

                if (res.data?.url && typeof res.data.url === "string" && res.data.url.trim()) {
                    uploaded.push(res.data.url);
                }
            }
            onChange([...values, ...uploaded].filter((u) => typeof u === "string" && u.trim()));
            if (rejected.length) {
                setError(
                    `Skipped ${rejected.join(", ")} — HEIC/HEIF photos aren't viewable in most browsers. Convert to JPG or PNG first.`
                );
            }
        } catch (err) {
            setError(err.response?.data?.message || "Some files failed to upload.");
            if (uploaded.length) onChange([...values, ...uploaded]);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const removeAt = (idx) => {
        onChange(values.filter((_, i) => i !== idx));
    };

    return (
        <div>
            <label className="block text-xs font-medium tracking-wide text-[#6E6A5E] uppercase mb-2">
                {label}
            </label>

            <div className="mb-2 flex gap-2"><input className="border p-2 text-sm" aria-label="Gallery tags" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} /><button type="button" className="border px-3" onClick={async () => {setShowLibrary(true); try {const r = await API.get("/storage/search", {params:{folder,q:search},headers:getAuthHeaders()}); setLibrary(r.data.results || []);} catch {setError("Unable to load media");}}}>Browse existing</button></div>
            {showLibrary && <div className="mb-3 border p-3"><input aria-label="Search gallery" className="border p-2" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search media" /><button type="button" onClick={async()=>{try{const r=await API.get("/storage/search",{params:{folder,q:search},headers:getAuthHeaders()});setLibrary(r.data.results||[]);}catch{setError("Search failed");}}}>Search</button><button type="button" onClick={()=>setShowLibrary(false)}>Close</button><div className="grid grid-cols-4 gap-2">{library.map(asset=><button key={asset.id} type="button" onClick={()=>onChange([...new Set([...values,asset.url])])}><img src={asset.preview_url} alt={asset.name} className="h-20 w-full object-cover" /><span className="text-xs">{asset.name}</span></button>)}</div></div>}
            <div className="flex flex-wrap gap-3">
                {values.map((url, i) => (
                    <div
                        key={url + i}
                        className="relative h-24 w-24 rounded-sm overflow-hidden border border-[#1B222C]/10 group"
                    >
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeAt(i)}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-[#1B222C]/70 text-[#F5F2E9] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#9C4A3C] transition-all"
                            aria-label="Remove image"
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                <div
                    onClick={() => !uploading && inputRef.current?.click()}
                    className="relative h-24 w-24 rounded-sm border border-dashed border-[#1B222C]/20 bg-[#1B222C]/[0.02] cursor-pointer hover:border-[#A9782F]/60 transition-colors flex items-center justify-center"
                >
                    {uploading ? (
                        <span className="h-4 w-4 rounded-full border-2 border-[#1B222C]/20 border-t-[#A9782F] animate-spin" />
                    ) : (
                        <span className="text-2xl text-[#6E6A5E] leading-none">+</span>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        className="hidden"
                    />
                </div>
            </div>

            {helperText && !error && (
                <p className="mt-1.5 text-xs text-[#6E6A5E]/70">{helperText}</p>
            )}
            {error && <p className="mt-1.5 text-xs text-[#9C4A3C]">{error}</p>}
        </div>
    );
}