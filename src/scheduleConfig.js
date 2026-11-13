// ── MONTHLY CALENDAR CONFIG ───────────────────────────────────────────────────
// This is the ONLY file you need to update each month.
// Named lecture topics remain clickable while their approved resources and
// source-based quizzes are pending. Leave non-topic events without a slug.
// Slugs must be lowercase, hyphenated, no special characters.

export const CALENDAR_MONTH = "November 2026";

export const CALENDAR_EVENTS = [
  { date:"2026-11-03", label:"Journal Club — Cam Zenger and Katie Choi", topic:null, slug:null },
  { date:"2026-11-05", label:"Ali Sohail (away rotator), Ariel Lee", topic:null, slug:null },
  { date:"2026-11-06", label:"Pathology: Appendix/Anus — Dr. Bao", topic:"Appendix and Anus Pathology", slug:"appendix-and-anus-pathology" },
  { date:"2026-11-10", label:"Portal Hypertension: Pathophysiology & Pharmacology — Arvin Tan", topic:"Portal Hypertension", slug:"portal-hypertension" },
  { date:"2026-11-12", label:"Juliana Provencio (PGY3), Ali Badaoui (PGY3)", topic:null, slug:null },
  { date:"2026-11-13", label:"Pathology: Quiz — Dr. Bao", topic:null, slug:null },
  { date:"2026-11-17", label:"IBD Journal Club — fellows and papers TBD", topic:null, slug:null },
  { date:"2026-11-19", label:"Praveen Wickremasinghe (PGY3), Colleen Boyle (Navy)", topic:null, slug:null },
  { date:"2026-11-20", label:"Cirrhosis 101 — Julio Gutierrez", topic:"Cirrhosis", slug:"cirrhosis-101" },
  { date:"2026-11-24", label:"Post-AASLD Update — Paul Pockros", topic:"Post-AASLD Update", slug:"post-aasld-update", resourceSearchDeferred:true },
  { date:"2026-11-26", label:"Thanksgiving", topic:null, slug:null },
  { date:"2026-11-27", label:"No conference (Thanksgiving)", topic:null, slug:null },
];

export const RESOURCE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug || e.resourceSlug)
  .map(e => ({ slug:e.slug || e.resourceSlug, label:e.topic || e.resourceTopic, eventDate:e.date, searchDeferred:!!e.resourceSearchDeferred }));

// A named topic is clickable even when its approved content or quiz is pending.
export const LECTURE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug)
  .map(e => ({ slug: e.slug, label: e.topic }));
