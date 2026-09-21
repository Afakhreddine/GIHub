// Repo-managed GIHub weekly update data.
// Update with: node scripts/update-weekly-data.mjs <weekly.json>

const weekly = [
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Sep 18, 2026",
    "topic": "Colonoscopy and AI",
    "title": "AI-assisted second look may raise right-colon adenoma detection",
    "authors": "Nishikawa Y, Fujimoto A, Hayashi Y, et al.",
    "source": "news.gastro.org",
    "summary": "An open-label multicenter RCT randomized 620 adults (606 analyzed) to a standard single right-colon examination or a second forward-view examination with Wise Vision AI; right-colon ADR was 36.4% versus 27.9% (OR 1.48), while overall ADR and advanced-neoplasia detection were not significantly different. The added pass prolonged median total examination time from 11.7 to 13.3 minutes and may improve nonadvanced adenoma detection, but the design cannot isolate AI from the second look and did not assess interval cancers. Source and study link verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/september-2026/aiassisted-second-look-may-raise-rightcolon-adenoma-detection/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42633947/"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Sep 15, 2026",
    "topic": "Ulcerative Colitis",
    "title": "Half of patients flared within two years of stopping anti-TNF for UC, trial finds",
    "authors": "Berset IP, Lerang F, Moum B, et al.",
    "source": "news.gastro.org",
    "summary": "In an open-label noninferiority RCT at 19 Norwegian hospitals, 172 patients with deeply remitted ulcerative colitis were randomized to stop or continue anti-TNF; two-year endoscopic remission was 80.5% versus 96.3%, and flares occurred in 52% versus 12%. Of 27 withdrawal patients who restarted anti-TNF after a flare, 20 (74%) regained clinical and endoscopic remission, but withdrawal failed noninferiority and supports selective shared decision-making with close monitoring rather than routine de-escalation. The study recruited fewer patients than planned and had pandemic-era disruptions and low azathioprine use; source and study link verified, and this AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/september-2026/half-of-patients-flared-within-two-years-of-stopping-antitnf-for-uc-trial-finds/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42557857/"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Sep 16, 2026",
    "topic": "Colorectal Polypectomy Quality",
    "title": "Panel sets 10% ceiling on incomplete resection of 10-19 mm polyps",
    "authors": "van Bokhorst QNE, Yarra S, van der Vlugt M, et al.",
    "source": "news.gastro.org",
    "summary": "A three-round modified Delphi study reached consensus on 18 of 20 statements among 53 experts from 16 countries, recommending at least a 1-mm normal-tissue margin, deliberate defect inspection, and before-and-after photo documentation. For 10-19 mm polyps, the panel proposed an incomplete resection ceiling of 10% (preferably below 5%) and image-enhanced defect inspection, offering practical quality targets rather than a formal standard of care. The thresholds are expert consensus rather than outcome-derived evidence and participation declined across rounds; source and study link verified, and this AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/september-2026/panel-sets-10-ceiling-on-incomplete-resection-of-1019-mm-polyps/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42624393/"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Sep 16, 2026",
    "topic": "Fecal Incontinence",
    "title": "Durable efficacy seen with neuromodulation for fecal incontinence",
    "authors": "Rao SSC, Yan Y, Hamdy S, et al.",
    "source": "gastroendonews.com",
    "summary": "In a double-blind sham-controlled RCT of 109 adults with fecal incontinence, response occurred in 65.8% with 2,400 magnetic pulses, 81.1% with 3,600 pulses, and 32.4% with sham; the respective odds ratios versus sham were 3.91 (95% CI 1.48-10.91) and 8.53 (2.96-27.47). Severity, nerve-conduction measures, and anal squeeze pressure improved without treatment-related serious adverse events, but between-group quality-of-life benefit was not shown and long-term durability and real-world availability remain uncertain. Source and study link verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.gastroendonews.com/Functional-GI-Disorders/Article/09-26/Fecal-Incontinence-Neuromodulation-Shows-Durable-Efficacy/81535",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42105947/"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Sep 2026",
    "topic": "ERCP / Pancreatic Duct Stents",
    "title": "Four-week pancreatic stent interval reduces repeat endoscopies",
    "authors": "Doug Brunk",
    "source": "GI & Hepatology News print",
    "summary": "A nine-center Korean randomized trial of post-ERCP prophylactic pancreatic duct stents screened 182 patients, randomized 160, and analyzed 156 after assigning follow-up abdominal X-ray at two versus four weeks. Endoscopic stent removal was required in 7% with four-week follow-up versus 19% with two-week follow-up, with spontaneous passage in 92% versus 81% and no visible signal of increased pancreatitis or clinically important complications; source extracted from user-shared print article and requires human review before merge.",
    "url": "https://www.mdedge.com/gihepnews/endoscopy",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Sep 2026",
    "topic": "Colonoscopy and AI",
    "title": "AI colonoscopy tool boosts adenoma detection in VA network, study finds",
    "authors": "Doug Brunk",
    "source": "GI & Hepatology News print",
    "summary": "A cluster-randomized Veterans Health Administration study compared 42 facilities adopting GI Genius computer-aided detection with 97 controls across more than 334,000 colonoscopies. Facilities with CADe availability saw ADR rise by about 4 percentage points without lengthening withdrawal times, supporting pragmatic real-world benefit but requiring full-source review for implementation details and potential deployment confounding; source extracted from user-shared print article and requires human review before merge.",
    "url": "https://www.mdedge.com/gihepnews/colonoscopy",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Sep 2026",
    "topic": "Endoscopy Technology",
    "title": "First-in-Human 50-Patient Robotic Colonoscopy Study Meets End Points",
    "authors": "",
    "source": "Gastroenterology & Endoscopy News print",
    "summary": "The CARE trial was a prospective single-arm first-in-human study in Poland testing the Triton robotic colonoscopy system in 50 adults across a 10-patient lead-in safety phase and 40-patient efficacy phase. Cecal intubation was achieved in 100% of cases, all procedures were completed in the left lateral position without repositioning or conversion, and no major adverse events were visible in the print report; conference/early-device data should be treated as preliminary and requires human review before merge.",
    "url": "https://www.gastroendonews.com/",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Sep 2026",
    "topic": "IBS / Disorders of Gut-Brain Interaction",
    "title": "Rome V criteria may miss some IBS cases in secondary care",
    "authors": "Doug Brunk",
    "source": "GI & Hepatology News print",
    "summary": "A UK secondary-care validation study at Leeds Teaching Hospitals included 726 adults with suspected IBS and complete Rome V data, comparing Rome V against a clinical reference standard after testing to exclude organic disease. Only 390 of 590 reference-standard IBS cases met Rome V criteria, for sensitivity of about 66%, while earlier Rome definitions appeared more sensitive; the main visible reason for missed cases was the Rome V exclusion of continuous daily abdominal pain, requiring full article review before merge.",
    "url": "https://www.mdedge.com/gihepnews/ibs",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 28, 2026",
    "topic": "Hepatitis B",
    "title": "One in five reach hepatitis B functional cure with finite bepirovirsen",
    "authors": "",
    "source": "gastroendonews.com",
    "summary": "Two phase 3 B-Well trials found that a finite 24-week course of bepirovirsen produced functional cure in about one-fifth of patients with chronic hepatitis B, while none on placebo responded. The repo archive lists functional cure rates of 20% versus 0% in B-Well 1 and 19% versus 0% in B-Well 2, with significant risk differences; this is already represented in the weekly archive and requires human review before re-inclusion in the active weekly feed.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/42206582/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42206582/"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Jun 23, 2026",
    "topic": "Ulcerative Colitis",
    "title": "Home calprotectin monitoring fails to reduce ulcerative colitis flares",
    "authors": "",
    "source": "Gastroenterology",
    "summary": "The PROMOTE UC randomized trial included 611 adults with ulcerative colitis in clinical remission, randomizing 308 to standard care and 303 to proactive fecal calprotectin home monitoring every two months for 18 months. Monitoring did not reduce symptomatic flare risk overall (HR 1.05; 95% CI, 0.79-1.40), though flare frequency among the 88 patients who changed therapy after confirmed elevated FCP was numerically lower at 49% versus 55%; DOI/PubMed verified and AI-assisted summary requires human review before merge.",
    "url": "https://pubmed.ncbi.nlm.nih.gov/42336164/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42336164/"
  }
];

export default weekly;
