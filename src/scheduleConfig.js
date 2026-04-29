// ── MONTHLY CALENDAR CONFIG ───────────────────────────────────────────────────
// This is the ONLY file you need to update each month.
// Add events with a topic+slug for clickable lectures, leave topic/slug null otherwise.
// Slugs must be lowercase, hyphenated, no special characters.

export const CALENDAR_MONTH = "May 2026";

export const CALENDAR_EVENTS = [
  // ── TUESDAYS ──
  { date:"2026-05-05", label:"Nabil El Chehade — M&M",             topic:null,                               slug:null                              },
  { date:"2026-05-12", label:"Emily Singh — IBS",                   topic:"IBS",                              slug:"irritable-bowel-syndrome"        },
  { date:"2026-05-19", label:"Vandan Patel — M&M",                  topic:null,                               slug:null                              },
  { date:"2026-05-26", label:"John Lyons — Billing (Fellows Only)", topic:null,                               slug:null                              },
  // ── THURSDAYS ──
  { date:"2026-05-07", label:"Dr. Mansour, Dr. Hamamah (R)",        topic:null, slug:null },
  { date:"2026-05-14", label:"Dr. Chehade, Dr. Patel",              topic:null, slug:null },
  { date:"2026-05-21", label:"No surg path — CCC",                  topic:null, slug:null },
  { date:"2026-05-28", label:"Dr. Worsey/Beiermeister, Dr. Badaoui (R)", topic:null, slug:null },
  // ── FRIDAYS ──
  { date:"2026-05-01", label:"No Lecture — DDW",                                   topic:null,                                     slug:null                              },
  { date:"2026-05-08", label:"Cam Zenger and Matt Skinner — AI for GI Update",     topic:"AI for GI Update",                       slug:"ai-for-gi-update"                },
  { date:"2026-05-15", label:"Katie Choi — Gastric Submucosal Lesions",            topic:"Gastric Submucosal Lesions",             slug:"gastric-submucosal-lesions"       },
  { date:"2026-05-22", label:"Jonathan Fisher — Postoperative Anatomy and Pitfalls", topic:"Postoperative Anatomy and Pitfalls",   slug:"postoperative-anatomy-pitfalls"   },
  { date:"2026-05-29", label:"Board Review",                                        topic:null,                                     slug:null                              },
];

// Derived: only events with a topic (clickable lectures)
export const LECTURE_TOPICS = CALENDAR_EVENTS
  .filter(e => e.slug)
  .map(e => ({ slug: e.slug, label: e.topic }));
