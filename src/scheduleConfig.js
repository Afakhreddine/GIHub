// ── MONTHLY CALENDAR CONFIG ───────────────────────────────────────────────────
// This is the ONLY file you need to update each month.
// Add events with a topic+slug for clickable lectures, leave topic/slug null otherwise.
// Slugs must be lowercase, hyphenated, no special characters.

export const CALENDAR_MONTH = "April 2026";

export const CALENDAR_EVENTS = [
  // ── TUESDAYS ──
  { date:"2026-03-31", label:"Han Zhang, MD — Esophageal Strictures & Dilation",        topic:"Esophageal Strictures & Dilation",         slug:"esophageal-strictures-dilation"       },
  { date:"2026-04-07", label:"Grand Rounds Practice — Senior Fellows",                   topic:null,                                        slug:null                                   },
  { date:"2026-04-14", label:"Quan Nhu, MD — Non-EoE Inflammatory Esophageal Diseases", topic:"Non-EoE Inflammatory Esophageal Diseases",  slug:"non-eoe-inflammatory-esophageal"      },
  { date:"2026-04-21", label:"Frank Tsai, MD — Barrett's Esophagus Therapies",          topic:"Barrett's Esophagus Therapies",             slug:"barretts-esophagus-therapies"         },
  { date:"2026-04-28", label:"Walt Coyle, MD — Neuroendocrine Tumors (NETs)",           topic:"Neuroendocrine Tumors (NETs)",              slug:"neuroendocrine-tumors"                 },
  // ── THURSDAYS ──
  { date:"2026-04-02", label:"Dr. Pockros, Dr. Chow (R-Mercy)",                         topic:null, slug:null },
  { date:"2026-04-09", label:"Dr. Nhu, Dr. Choi",                                       topic:null, slug:null },
  { date:"2026-04-16", label:"Dr. Mayemura, Dr. Gilazgi (R)",                           topic:null, slug:null },
  { date:"2026-04-23", label:"Dr. Heffernan, Dr. Wiseman (Navy)",                       topic:null, slug:null },
  { date:"2026-04-30", label:"Dr. Worsey/Beiermeister, Dr. Lanser",                     topic:null, slug:null },
  // ── FRIDAYS ──
  { date:"2026-04-03", label:"Wellness Lunch",                                           topic:null, slug:null },
  { date:"2026-04-10", label:"Fouad Moawad, MD — GERD / Medical & Dietary Management", topic:"GERD / Medical & Dietary Management",     slug:"gerd-medical-dietary-management"      },
  { date:"2026-04-17", label:"SDGI Society Fellows Research Forum Practice Session",     topic:null, slug:null },
  { date:"2026-04-24", label:"Board Review — Esophagus",                                topic:null, slug:null },
];

// Derived: only events with a topic (clickable lectures)
export const LECTURE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug)
  .map(e => ({ slug: e.slug, label: e.topic }));