import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar/NavBar";
import ImageUploadField from "./Imageuploadfield";
import GalleryUploadField from "./Galleryuploadfield";
import TagListInput from "./Taglistinput";

const EVENT_TYPE_OPTIONS = ["trek", "adventure", "trip", "peak", "special_event"];
const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Difficult", "Strenuous", "Extreme"];
const STATE_SUGGESTIONS = ["Upcoming", "Launched Now!", "In Progress", "Completed", "Sold Out"];
const LABEL_SUGGESTIONS = [
    "Trek",
    "Adventure Activity",
    "Trip",
    "Special Event",
    "Best Of The Year",
    "Popular",
    "Peak Expedition",
];

const EMPTY_FORM = {
    title: "",
    event_type: "",
    adventure_activity_category: "",
    adventure_difficulty_level: "",
    trek_difficulty_level: "",
    peak_difficulty_level: "",
    peak_group_type: "",
    age_requirement: "",
    fitness_requirement: "",
    location: "",
    duration_days: "",
    duration_nights: "",
    short_description: "",
    itinerary: "",
    highlights: [],
    cover_image_url: "",
    poster_horizontal_1_url: "",
    poster_horizontal_2_url: "",
    poster_vertical_3_url: "",
    gallery_image_urls: [],
    promo_video_url: "",
    max_participants_allowed: "",
    included_services: [],
    excluded_services: [],
    safety_guidelines_text: "",
    cancellation_policy_text: "",
    seo_tags: [],
    seo_title: "",
    seo_description: "",
    status: "draft",
    state: "",
    label: "",
};

function getAuthHeaders() {
    const token = localStorage.getItem("admin_token");
    return token ? { token } : {};
}

// Backend URL fields (HttpUrl-typed) reject "" as invalid — they need to be
// either a real URL or absent entirely, so blanks get converted to null.
const NULLABLE_IF_BLANK_FIELDS = [
    "adventure_activity_category",
    "adventure_difficulty_level",
    "trek_difficulty_level",
    "peak_difficulty_level",
    "peak_group_type",
    "state",
    "label",
    "cover_image_url",
    "poster_horizontal_1_url",
    "poster_horizontal_2_url",
    "poster_vertical_3_url",
    "promo_video_url",
];

function Section({ title, description, children }) {
    return (
        <div className="bg-white rounded-sm border border-[#1B222C]/8 p-6 md:p-7 mb-5">
            <div className="mb-5">
                <h3 className="text-lg font-serif text-[#1B222C]">{title}</h3>
                {description && (
                    <p className="text-sm text-[#6E6A5E] mt-0.5">{description}</p>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
        </div>
    );
}

function Field({ label, full, children }) {
    return (
        <div className={full ? "md:col-span-2" : ""}>
            {label && (
                <label className="block text-xs font-medium tracking-wide text-[#6E6A5E] uppercase mb-2">
                    {label}
                </label>
            )}
            {children}
        </div>
    );
}

const inputClass =
    "w-full bg-white border border-[#1B222C]/12 rounded-sm px-3 py-2.5 text-sm text-[#1B222C] placeholder:text-[#6E6A5E]/50 outline-none focus:border-[#A9782F] transition-colors";
const textareaClass = inputClass + " resize-y min-h-[90px]";

export default function CreateEventPage() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const setList = (key) => (values) => setForm((f) => ({ ...f, [key]: values }));
    const setUrl = (key) => (url) => setForm((f) => ({ ...f, [key]: url }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const payload = {
            ...form,
            age_requirement: Number(form.age_requirement) || 0,
            duration_days: Number(form.duration_days) || 0,
            duration_nights: Number(form.duration_nights) || 0,
            max_participants_allowed: Number(form.max_participants_allowed) || 0,
            gallery_image_urls: (form.gallery_image_urls || []).filter(
                (u) => typeof u === "string" && u.trim().length > 0
            ),
        };

        NULLABLE_IF_BLANK_FIELDS.forEach((key) => {
            if (!payload[key] || (typeof payload[key] === "string" && payload[key].trim() === "")) {
                payload[key] = null;
            }
        });
        try {
            const res = await API.post("/events/", payload, {
                headers: getAuthHeaders(),
            });
            const created = res.data;
            window.location.replace(
                created?.event_id
                    ? `/admin/events/${created.event_id}`
                    : "/admin/events"
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Couldn't create the event. Check the required fields and try again."
            );
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F2E9]">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <p className="text-[11px] font-medium tracking-[0.3em] text-[#4B5842] uppercase mb-1">
                        Basecamp
                    </p>
                    <h1 className="text-3xl font-serif text-[#1B222C]">New event</h1>
                </div>

                {error && (
                    <div className="mb-6 pl-4 py-3 border-l-2 border-[#9C4A3C] bg-[#9C4A3C]/[0.06]">
                        <p className="text-sm text-[#9C4A3C]">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Section title="Basics" description="What the event is and how it's categorized.">
                        <Field label="Title" full>
                            <input
                                required
                                value={form.title}
                                onChange={set("title")}
                                placeholder="Kudremukh Trek – The Green Paradise"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Event type">
                            <input
                                list="event-type-options"
                                value={form.event_type}
                                onChange={set("event_type")}
                                placeholder="trek"
                                className={inputClass}
                            />
                            <datalist id="event-type-options">
                                {EVENT_TYPE_OPTIONS.map((t) => (
                                    <option key={t} value={t} />
                                ))}
                            </datalist>
                        </Field>

                        <Field label="Activity category">
                            <input
                                value={form.adventure_activity_category}
                                onChange={set("adventure_activity_category")}
                                placeholder="Nature Trek"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Location" full>
                            <input
                                required
                                value={form.location}
                                onChange={set("location")}
                                placeholder="Kudremukh National Park, Chikmagalur, Karnataka, India"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Display label">
                            <input
                                list="label-options"
                                value={form.label}
                                onChange={set("label")}
                                placeholder="Trek"
                                className={inputClass}
                            />
                            <datalist id="label-options">
                                {LABEL_SUGGESTIONS.map((l) => (
                                    <option key={l} value={l} />
                                ))}
                            </datalist>
                        </Field>

                        <Field label="State">
                            <input
                                list="state-options"
                                value={form.state}
                                onChange={set("state")}
                                placeholder="Upcoming"
                                className={inputClass}
                            />
                            <datalist id="state-options">
                                {STATE_SUGGESTIONS.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>
                        </Field>

                        <Field label="Status">
                            <select value={form.status} onChange={set("status")} className={inputClass}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </Field>
                    </Section>

                    <Section
                        title="Classification & difficulty"
                        description="Fill in whichever difficulty fields apply to this event type."
                    >
                        <Field label="Adventure difficulty">
                            <input
                                list="difficulty-options"
                                value={form.adventure_difficulty_level}
                                onChange={set("adventure_difficulty_level")}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Trek difficulty">
                            <input
                                list="difficulty-options"
                                value={form.trek_difficulty_level}
                                onChange={set("trek_difficulty_level")}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Peak difficulty">
                            <input
                                list="difficulty-options"
                                value={form.peak_difficulty_level}
                                onChange={set("peak_difficulty_level")}
                                className={inputClass}
                            />
                        </Field>
                        <datalist id="difficulty-options">
                            {DIFFICULTY_OPTIONS.map((d) => (
                                <option key={d} value={d} />
                            ))}
                        </datalist>

                        <Field label="Peak group type">
                            <input
                                value={form.peak_group_type}
                                onChange={set("peak_group_type")}
                                placeholder="Single Peak"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Minimum age">
                            <input
                                type="number"
                                min="0"
                                value={form.age_requirement}
                                onChange={set("age_requirement")}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Fitness requirement" full>
                            <textarea
                                value={form.fitness_requirement}
                                onChange={set("fitness_requirement")}
                                placeholder="Good cardio endurance required. Able to walk 6-8 hours."
                                className={textareaClass}
                            />
                        </Field>
                    </Section>

                    <Section title="Duration & capacity">
                        <Field label="Duration (days)">
                            <input
                                type="number"
                                min="0"
                                value={form.duration_days}
                                onChange={set("duration_days")}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Duration (nights)">
                            <input
                                type="number"
                                min="0"
                                value={form.duration_nights}
                                onChange={set("duration_nights")}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Max participants" full>
                            <input
                                type="number"
                                min="0"
                                value={form.max_participants_allowed}
                                onChange={set("max_participants_allowed")}
                                className={inputClass}
                            />
                        </Field>
                    </Section>

                    <Section title="Content">
                        <Field label="Short description" full>
                            <textarea
                                value={form.short_description}
                                onChange={set("short_description")}
                                className={textareaClass}
                            />
                        </Field>
                        <Field label="Itinerary" full>
                            <textarea
                                value={form.itinerary}
                                onChange={set("itinerary")}
                                placeholder="Day 1 – ... Day 2 – ..."
                                className={textareaClass}
                            />
                        </Field>
                        <Field full>
                            <TagListInput
                                label="Highlights"
                                values={form.highlights}
                                onChange={setList("highlights")}
                                placeholder="Trek to the 3rd highest peak in Karnataka"
                            />
                        </Field>
                    </Section>

                    <Section
                        title="Media"
                        description="Files upload immediately and attach their storage URL to the event."
                    >
                        <ImageUploadField
                            label="Cover image"
                            folder="cover"
                            value={form.cover_image_url}
                            onChange={setUrl("cover_image_url")}
                        />
                        <ImageUploadField
                            label="Promo video"
                            folder="promo_video"
                            accept="video/*"
                            kind="video"
                            value={form.promo_video_url}
                            onChange={setUrl("promo_video_url")}
                        />
                        <ImageUploadField
                            label="Horizontal poster 1"
                            folder="poster"
                            value={form.poster_horizontal_1_url}
                            onChange={setUrl("poster_horizontal_1_url")}
                        />
                        <ImageUploadField
                            label="Horizontal poster 2"
                            folder="poster"
                            value={form.poster_horizontal_2_url}
                            onChange={setUrl("poster_horizontal_2_url")}
                        />
                        <ImageUploadField
                            label="Vertical poster"
                            folder="poster"
                            value={form.poster_vertical_3_url}
                            onChange={setUrl("poster_vertical_3_url")}
                        />
                        <Field full>
                            <GalleryUploadField
                                label="Gallery images"
                                folder="gallery_image"
                                values={form.gallery_image_urls}
                                onChange={setList("gallery_image_urls")}
                            />
                        </Field>
                    </Section>

                    <Section title="Inclusions & exclusions">
                        <Field full>
                            <TagListInput
                                label="Included services"
                                values={form.included_services}
                                onChange={setList("included_services")}
                                placeholder="Transportation Non-AC Seater"
                            />
                        </Field>
                        <Field full>
                            <TagListInput
                                label="Excluded services"
                                values={form.excluded_services}
                                onChange={setList("excluded_services")}
                                placeholder="Personal expenses"
                            />
                        </Field>
                    </Section>

                    <Section title="Policies">
                        <Field label="Safety guidelines" full>
                            <textarea
                                value={form.safety_guidelines_text}
                                onChange={set("safety_guidelines_text")}
                                className={textareaClass}
                            />
                        </Field>
                        <Field label="Cancellation policy" full>
                            <textarea
                                value={form.cancellation_policy_text}
                                onChange={set("cancellation_policy_text")}
                                className={textareaClass}
                            />
                        </Field>
                    </Section>

                    <Section title="SEO">
                        <Field label="SEO title" full>
                            <input
                                value={form.seo_title}
                                onChange={set("seo_title")}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="SEO description" full>
                            <textarea
                                value={form.seo_description}
                                onChange={set("seo_description")}
                                className={textareaClass}
                            />
                        </Field>
                        <Field full>
                            <TagListInput
                                label="SEO tags"
                                values={form.seo_tags}
                                onChange={setList("seo_tags")}
                                placeholder="Trekking in Karnataka"
                            />
                        </Field>
                    </Section>

                    <div className="flex items-center justify-end gap-3 mt-6 mb-16">
                        <button
                            type="button"
                            onClick={() => window.location.replace("/admin/events")}
                            className="px-5 py-2.5 text-sm font-medium text-[#1B222C] hover:text-[#9C4A3C] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#1B222C] hover:bg-[#A9782F] disabled:bg-[#1B222C]/40 text-[#F5F2E9] text-sm font-medium px-6 py-2.5 rounded-sm transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting && (
                                <span className="h-3.5 w-3.5 rounded-full border-2 border-[#F5F2E9]/40 border-t-[#F5F2E9] animate-spin" />
                            )}
                            {submitting ? "Publishing" : "Create event"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}