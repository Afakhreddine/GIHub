// ── MONTHLY CALENDAR CONFIG ───────────────────────────────────────────────────
// This is the ONLY file you need to update each month.
// Add events with a topic+slug for clickable lectures, leave topic/slug null otherwise.
// Slugs must be lowercase, hyphenated, no special characters.

export const CALENDAR_MONTH = "October 2026";

export const CALENDAR_EVENTS = [
  { date:"2026-10-01", label:"Landon Kozai and Michael Heffernan", topic:null, slug:null },
  { date:"2026-10-02", label:"Pathology: Colon Polyps — Dr. Bao", topic:"Colon Polyps Pathology", slug:"colon-polyps-pathology" },
  { date:"2026-10-06", label:"MEET AND GREET", topic:null, slug:null },
  { date:"2026-10-08", label:"Katie Choi and Daniel Na (R)", topic:null, slug:null },
  { date:"2026-10-09", label:"No Conference (ACG)", topic:null, slug:null },
  { date:"2026-10-13", label:"No conference (ACG)", topic:null, slug:null },
  { date:"2026-10-15", label:"Surg Path canceled", topic:null, slug:null },
  { date:"2026-10-16", label:"Pathology: Appendix and Anus — Dr. Swanson", topic:"Appendix and Anus Pathology", slug:"appendix-and-anus-pathology" },
  { date:"2026-10-20", label:"Chiara Maruggi — Celiac Disease", topic:"Celiac Disease", slug:"celiac-disease" },
  { date:"2026-10-22", label:"Daniela Shemirani (PGY3) and Melanie Wiseman (Navy)", topic:null, slug:null },
  { date:"2026-10-23", label:"Pathology: Small Intestine — Dr. Bao", topic:"Small Intestine Pathology", slug:"small-intestine-pathology" },
  { date:"2026-10-27", label:"Ali Fakhreddine — AI Lecture", topic:"AI in GI Research", slug:"ai-in-gi-research" },
  { date:"2026-10-29", label:"Worsey/Beiermeister and Dr Hunt", topic:null, slug:null },
  { date:"2026-10-30", label:"Pathology: Colon — Dr. Du", topic:"Colon Pathology", slug:"colon-pathology" },
];

// Derived: only events with a topic (clickable lectures)
export const LECTURE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug)
  .map(e => ({ slug: e.slug, label: e.topic }));
