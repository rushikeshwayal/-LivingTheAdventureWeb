import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ImagePlus, Layers3, Plus, RefreshCw, Search, Sparkles, Trash2, Pencil, X } from "lucide-react";
import API from "../api";
import Navbar from "../components/Navbar/NavBar";

const ink = "#1B222C";
const paper = "#F5F2E9";
const brass = "#A9782F";
const emptyForm = {
    event_id: "",
    title: "",
    rank: 1,
    hero_type: "Home",
    video_url: "",
    thumbnail_image_url: "",
    description: "",
    details: [],
    genres: [],
    status: "draft",
    active: true,
};
const fieldClass = "w-full rounded-sm border border-[#1B222C]/15 bg-white px-3 py-2.5 text-sm text-[#1B222C] outline-none transition focus:border-[#A9782F] focus:ring-2 focus:ring-[#A9782F]/10";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-[#6E6A5E]";

function getError(error) {
    const detail = error?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((entry) => entry.msg).join(", ");
    return error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
}

function TextListEditor({ label, values, onChange, placeholder }) {
    const [draft, setDraft] = useState("");
    const add = () => {
        const value = draft.trim();
        if (!value || values.includes(value)) return;
        onChange([...values, value]);
        setDraft("");
    };
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="flex gap-2">
                <input
                    className={fieldClass}
                    value={draft}
                    placeholder={placeholder}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            add();
                        }
                    }}
                />
                <button type="button" onClick={add} className="rounded-sm border border-[#1B222C]/15 px-4 text-sm hover:border-[#A9782F]">Add</button>
            </div>
            {values.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{values.map((value, index) => (
                <span key={value + index} className="inline-flex items-center gap-2 rounded-full bg-[#1B222C]/[.06] px-3 py-1.5 text-xs text-[#1B222C]">
                    {value}
                    <button type="button" aria-label={`Remove ${value}`} onClick={() => onChange(values.filter((_, i) => i !== index))} className="text-[#9C4A3C]">×</button>
                </span>
            ))}</div>}
        </div>
    );
}

function Field({ label, hint, children }) {
    return <div><label className={labelClass}>{label}</label>{children}{hint && <p className="mt-1.5 text-xs text-[#6E6A5E]">{hint}</p>}</div>;
}

export default function HeroManagementPage() {
    const [heroes, setHeroes] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const [heroResponse, eventResponse] = await Promise.all([
                API.get("/heroes/", { params: { skip: 0, limit: 200 } }),
                API.get("/events/", { params: { skip: 0, limit: 500 } }),
            ]);
            setHeroes(Array.isArray(heroResponse.data) ? heroResponse.data : []);
            setEvents(Array.isArray(eventResponse.data) ? eventResponse.data : []);
        } catch (err) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setError("");
        setNotice("");
        setFormOpen(true);
    };
    const openEdit = (hero) => {
        setEditingId(hero.id);
        setForm({
            event_id: hero.event_id || "",
            title: hero.title || "",
            rank: hero.rank ?? 1,
            hero_type: hero.hero_type || "Home",
            video_url: hero.video_url || "",
            thumbnail_image_url: hero.thumbnail_image_url || "",
            description: hero.description || "",
            details: Array.isArray(hero.details) ? hero.details : [],
            genres: Array.isArray(hero.genres) ? hero.genres : [],
            status: hero.status || "draft",
            active: hero.active === true || String(hero.active).toLowerCase() === "true",
        });
        setError("");
        setNotice("");
        setFormOpen(true);
    };

    const visibleHeroes = useMemo(() => heroes.filter((hero) => {
        const matchesType = typeFilter === "all" || (hero.hero_type || "").toLowerCase() === typeFilter.toLowerCase();
        const query = search.trim().toLowerCase();
        const eventTitle = events.find((event) => event.event_id === hero.event_id)?.title || "";
        return matchesType && (!query || `${hero.title || ""} ${eventTitle} ${hero.description || ""}`.toLowerCase().includes(query));
    }), [heroes, events, typeFilter, search]);

    const counts = useMemo(() => ({
        total: heroes.length,
        active: heroes.filter((hero) => hero.active === true || String(hero.active).toLowerCase() === "true").length,
        home: heroes.filter((hero) => (hero.hero_type || "").toLowerCase() === "home").length,
    }), [heroes]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");
        if (!form.event_id) {
            setError("Choose an event to link to this hero.");
            return;
        }
        if (!form.title.trim()) {
            setError("Enter a title for the hero.");
            return;
        }
        setSaving(true);
        const payload = {
            event_id: form.event_id,
            title: form.title.trim(),
            rank: Number(form.rank) || 1,
            hero_type: form.hero_type.trim() || "Home",
            video_url: form.video_url.trim() || null,
            thumbnail_image_url: form.thumbnail_image_url.trim() || null,
            description: form.description.trim() || null,
            details: form.details,
            genres: form.genres,
            status: form.status,
            active: form.active,
        };
        try {
            if (editingId === null) {
                await API.post("/heroes/", payload);
                setNotice("Hero created successfully.");
            } else {
                await API.put(`/heroes/${editingId}`, payload);
                setNotice("Hero updated successfully.");
            }
            setFormOpen(false);
            await load();
        } catch (err) {
            setError(getError(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (hero) => {
        if (!window.confirm(`Delete hero "${hero.title || "Untitled"}"? This cannot be undone.`)) return;
        setDeletingId(hero.id);
        setError("");
        setNotice("");
        try {
            await API.delete(`/heroes/${hero.id}`);
            setHeroes((current) => current.filter((item) => item.id !== hero.id));
            setNotice("Hero deleted.");
        } catch (err) {
            setError(getError(err));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: paper, color: ink }}>
            <Navbar />
            <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:py-10">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.3em] text-[#4B5842]">Content studio</p>
                        <h1 className="font-serif text-3xl sm:text-4xl">Hero management</h1>
                        <p className="mt-2 max-w-2xl text-sm text-[#6E6A5E]">Choose which events appear in the home-page hero and manage their copy, media, order and visibility.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={load} className="inline-flex items-center gap-2 rounded-sm border border-[#1B222C]/15 bg-white px-4 py-2.5 text-sm hover:border-[#A9782F]"><RefreshCw size={16}/> Refresh</button>
                        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-sm bg-[#1B222C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#A9782F]"><Plus size={17}/> Create hero</button>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                        { label: "Total hero entries", value: counts.total, icon: <Layers3 size={18}/> },
                        { label: "Home hero entries", value: counts.home, icon: <Sparkles size={18}/> },
                        { label: "Marked active", value: counts.active, icon: <ImagePlus size={18}/> },
                    ].map((item) => <div key={item.label} className="flex items-center gap-4 border border-[#1B222C]/10 bg-white p-5">
                        <div className="flex h-11 w-11 items-center justify-center bg-[#A9782F]/10 text-[#A9782F]">{item.icon}</div>
                        <div><p className="font-serif text-2xl">{item.value}</p><p className="mt-1 text-xs uppercase tracking-wider text-[#6E6A5E]">{item.label}</p></div>
                    </div>)}
                </div>

                {error && <div role="alert" className="mb-5 border-l-2 border-[#9C4A3C] bg-[#9C4A3C]/[.06] px-4 py-3 text-sm text-[#9C4A3C]">{error}</div>}
                {notice && <div role="status" className="mb-5 border-l-2 border-[#4B5842] bg-[#4B5842]/[.06] px-4 py-3 text-sm text-[#4B5842]">{notice}</div>}

                {formOpen && <div className="mb-7 border border-[#A9782F]/35 bg-white p-5 sm:p-7">
                    <div className="mb-6 flex items-start justify-between gap-3">
                        <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#A9782F]">{editingId === null ? "New entry" : "Edit entry"}</p><h2 className="mt-1 font-serif text-2xl">{editingId === null ? "Create a hero" : "Update hero"}</h2><p className="mt-1 text-sm text-[#6E6A5E]">A hero entry connects an existing event to the homepage presentation.</p></div>
                        <button type="button" onClick={() => setFormOpen(false)} aria-label="Close form" className="rounded-sm p-2 hover:bg-[#1B222C]/5"><X size={18}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Linked event">
                                <select required className={fieldClass} value={form.event_id} onChange={(e) => update("event_id", e.target.value)}>
                                    <option value="">Choose an event…</option>
                                    {events.map((event) => <option key={event.event_id} value={event.event_id}>{event.title} · {event.location || "No location"}</option>)}
                                </select>
                                {events.length === 0 && <p className="mt-1.5 text-xs text-[#9C4A3C]">No events loaded. Create an event first or refresh.</p>}
                            </Field>
                            <Field label="Hero title">
                                <input required className={fieldClass} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Featured adventure title"/>
                            </Field>
                            <Field label="Hero type" hint='Use "Home" for the homepage section consumed by the current client.'>
                                <select className={fieldClass} value={form.hero_type} onChange={(e) => update("hero_type", e.target.value)}>
                                    <option value="Home">Home</option>
                                    <option value="Trip">Trip</option>
                                    <option value="Track">Track</option>
                                </select>
                            </Field>
                            <Field label="Display rank" hint="Smaller numbers can be used for items you want first.">
                                <input className={fieldClass} type="number" min="0" step="1" value={form.rank} onChange={(e) => update("rank", e.target.value)}/>
                            </Field>
                            <Field label="Thumbnail image URL" hint="Paste a public image URL.">
                                <input className={fieldClass} type="url" value={form.thumbnail_image_url} onChange={(e) => update("thumbnail_image_url", e.target.value)} placeholder="https://…"/>
                            </Field>
                            <Field label="Video URL" hint="Optional; paste a public video URL.">
                                <input className={fieldClass} type="url" value={form.video_url} onChange={(e) => update("video_url", e.target.value)} placeholder="https://…"/>
                            </Field>
                            <Field label="Status">
                                <select className={fieldClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </Field>
                            <Field label="Active">
                                <select className={fieldClass} value={form.active ? "true" : "false"} onChange={(e) => update("active", e.target.value === "true")}>
                                    <option value="true">Active</option><option value="false">Inactive</option>
                                </select>
                            </Field>
                            <div className="md:col-span-2"><Field label="Description"><textarea rows={3} className={fieldClass} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short copy used alongside the featured content."/></Field></div>
                            <TextListEditor label="Details" values={form.details} onChange={(value) => update("details", value)} placeholder="Add detail and press Enter"/>
                            <TextListEditor label="Genres" values={form.genres} onChange={(value) => update("genres", value)} placeholder="Add genre and press Enter"/>
                        </div>
                        {form.thumbnail_image_url && <div className="max-w-sm"><p className={labelClass}>Thumbnail preview</p><img src={form.thumbnail_image_url} alt="Hero thumbnail preview" className="h-40 w-full rounded-sm border border-[#1B222C]/10 object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }}/></div>}
                        <div className="flex flex-wrap justify-end gap-3 border-t border-[#1B222C]/10 pt-5">
                            <button type="button" onClick={() => setFormOpen(false)} className="rounded-sm px-4 py-2.5 text-sm text-[#6E6A5E] hover:bg-[#1B222C]/5">Cancel</button>
                            <button type="submit" disabled={saving || events.length === 0} className="rounded-sm bg-[#1B222C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A9782F] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : editingId === null ? "Create hero" : "Save changes"}</button>
                        </div>
                    </form>
                </div>}

                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6A5E]"/>
                        <input className={`${fieldClass} pl-9`} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hero or linked event…"/>
                    </div>
                    <select className={fieldClass + " sm:max-w-52"} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">All hero types</option><option value="Home">Home</option><option value="Trip">Trip</option><option value="Track">Track</option>
                    </select>
                </div>

                <div className="mb-16 overflow-hidden border border-[#1B222C]/10 bg-white">
                    <div className="flex items-center justify-between border-b border-[#1B222C]/10 px-5 py-4"><div><h2 className="font-serif text-xl">Hero entries</h2><p className="mt-1 text-xs text-[#6E6A5E]">Manage the content featured on the customer-facing site.</p></div><span className="text-xs text-[#6E6A5E]">{visibleHeroes.length} shown</span></div>
                    {loading ? <div className="space-y-3 p-5">{[1,2,3].map((item) => <div key={item} className="h-20 animate-pulse bg-[#1B222C]/5"/>)}</div> :
                        visibleHeroes.length === 0 ? <div className="px-5 py-14 text-center"><Layers3 className="mx-auto mb-3 text-[#A9782F]" size={28}/><p className="font-serif text-xl">No hero entries found</p><p className="mt-1 text-sm text-[#6E6A5E]">Create your first hero or adjust your search.</p><button onClick={openCreate} className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#1B222C] px-4 py-2.5 text-sm text-white hover:bg-[#A9782F]"><Plus size={16}/> Create hero</button></div> :
                        <div className="divide-y divide-[#1B222C]/10">{visibleHeroes.map((hero) => {
                            const linkedEvent = events.find((event) => event.event_id === hero.event_id);
                            const isActive = hero.active === true || String(hero.active).toLowerCase() === "true";
                            return <motion.article layout key={hero.id} className="grid gap-4 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:p-5">
                                <div className="h-24 overflow-hidden bg-[#1B222C]/5">{hero.thumbnail_image_url ? <img src={hero.thumbnail_image_url} alt="" className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center text-[#6E6A5E]"><ImagePlus size={24}/></div>}</div>
                                <div className="min-w-0">
                                    <div className="mb-1 flex flex-wrap items-center gap-2"><h3 className="font-serif text-xl">{hero.title || "Untitled hero"}</h3><span className="rounded-full bg-[#A9782F]/10 px-2.5 py-1 text-[11px] uppercase tracking-wide text-[#A9782F]">{hero.hero_type || "Unspecified"}</span><span className={`rounded-full px-2.5 py-1 text-[11px] ${isActive ? "bg-[#4B5842]/10 text-[#4B5842]" : "bg-[#9C4A3C]/10 text-[#9C4A3C]"}`}>{isActive ? "Active" : "Inactive"}</span></div>
                                    <p className="text-sm text-[#6E6A5E]">{linkedEvent?.title || "Linked event not found"} · Rank {hero.rank ?? "—"}</p>
                                    <p className="mt-1 line-clamp-2 text-sm text-[#1B222C]/75">{hero.description || "No description added."}</p>
                                </div>
                                <div className="flex gap-2 sm:flex-col"><button onClick={() => openEdit(hero)} className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#1B222C]/15 px-3 py-2 text-sm hover:border-[#A9782F]"><Pencil size={14}/> Edit</button><button disabled={deletingId === hero.id} onClick={() => handleDelete(hero)} className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#9C4A3C]/25 px-3 py-2 text-sm text-[#9C4A3C] hover:bg-[#9C4A3C]/5 disabled:opacity-50"><Trash2 size={14}/>{deletingId === hero.id ? "Deleting…" : "Delete"}</button></div>
                            </motion.article>;
                        })}</div>}
                </div>
            </main>
        </div>
    );
}
