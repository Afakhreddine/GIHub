// ── MONTHLY CALENDAR CONFIG ───────────────────────────────────────────────────
// This is the ONLY file you need to update each month.
// Add events with a topic+slug for clickable lectures, leave topic/slug null otherwise.
// Slugs must be lowercase, hyphenated, no special characters.

export const CALENDAR_MONTH = "September 2026";

export const CALENDAR_EVENTS = [
  { date:"2026-09-01", label:"GI trainee research seminar", topic:null, slug:null },
  { date:"2026-09-03", label:"Rachel Dennis, Ashel Lee", topic:null, slug:null },
  { date:"2026-09-04", label:"Pathology: Stomach — Dr. Du", topic:"Stomach Pathology", slug:"stomach-pathology" },
  { date:"2026-09-08", label:"Doug Hunt — GI Bleeding 101", topic:"GI Bleeding", slug:"gi-bleeding" },
  { date:"2026-09-10", label:"Dr. Moawad, Sukhman Dhaliwal (Trinity)", topic:null, slug:null },
  { date:"2026-09-11", label:"Excused — Scripps IBD Cutting Edge", topic:null, slug:null },
  { date:"2026-09-15", label:"William Strum — Hypertriglyceridemia / Acute Pancreatitis (in person)", topic:"Hypertriglyceridemia / Acute Pancreatitis", slug:"hypertriglyceridemia-acute-pancreatitis" },
  { date:"2026-09-17", label:"THALAMUS PRACTICE SESSION", topic:null, slug:null },
  { date:"2026-09-18", label:"Pathology: Liver — Dr. Swanson", topic:"Liver Pathology", slug:"liver-pathology" },
  { date:"2026-09-22", label:"Katie Choi — IBD, topic TBD", topic:"IBD", slug:"ibd" },
  { date:"2026-09-24", label:"Drs. Worsey/Boiermeister, Dr. Deabes", topic:null, slug:null },
  { date:"2026-09-25", label:"Pathology: IBD and GI tumors — Dr. Swanson", topic:"IBD and GI Tumors Pathology", slug:"ibd-gi-tumors-pathology" },
  { date:"2026-09-29", label:"No lecture — Meet and Greet with Interviewees", topic:null, slug:null },
];

// Derived: only events with a topic (clickable lectures)
export const LECTURE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug)
  .map(e => ({ slug: e.slug, label: e.topic }));
