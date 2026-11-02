// ── MONTHLY CALENDAR CONFIG ───────────────────────────────────────────────────
// This is the ONLY file you need to update each month.
// Add events with a topic+slug for clickable lectures, leave topic/slug null otherwise.
// Slugs must be lowercase, hyphenated, no special characters.

export const CALENDAR_MONTH = "November 2026";

export const CALENDAR_EVENTS = [
  { date:"2026-11-03", label:"Journal Club — Cam Zenger and Katie Choi", topic:null, slug:null },
  { date:"2026-11-05", label:"Ali Sohail (away rotator), Ariel Lee", topic:null, slug:null },
  { date:"2026-11-06", label:"Pathology: Appendix/Anus — Dr. Bao", topic:"Appendix and Anus Pathology", slug:"appendix-and-anus-pathology" },
  { date:"2026-11-10", label:"Portal Hypertension: Pathophysiology & Pharmacology — Arvin Tan", topic:null, slug:null },
  { date:"2026-11-12", label:"Juliana Provencio (PGY3), Ali Badaoui (PGY3)", topic:null, slug:null },
  { date:"2026-11-13", label:"Pathology: Quiz — Dr. Bao", topic:null, slug:null },
  { date:"2026-11-17", label:"IBD Journal Club — fellows and papers TBD", topic:null, slug:null },
  { date:"2026-11-19", label:"Praveen Wickremasinghe (PGY3), Colleen Boyle (Navy)", topic:null, slug:null },
  { date:"2026-11-20", label:"Cirrhosis 101 — Julio Gutierrez", topic:null, slug:null },
  { date:"2026-11-24", label:"Post-AASLD Update — Paul Pockros", topic:null, slug:null },
  { date:"2026-11-26", label:"Thanksgiving", topic:null, slug:null },
  { date:"2026-11-27", label:"No conference (Thanksgiving)", topic:null, slug:null },
];

// Derived: only events with a topic (clickable lectures)
export const LECTURE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug)
  .map(e => ({ slug: e.slug, label: e.topic }));
