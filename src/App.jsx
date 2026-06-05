import { useState, useEffect, useRef } from "react";
import { CALENDAR_MONTH, CALENDAR_EVENTS } from "./scheduleConfig.js";

// ── SESSION CACHE ─────────────────────────────────────────────────────────────
const sessionCache = {};

// ── STATIC FALLBACK DATA ──────────────────────────────────────────────────────
const STATIC = {
  guidelines: [
    { org:"AGA",  year:"2025", month:"Nov", topic:"Barrett's Esophagus",     urgency:"High",     title:"AGA Clinical Practice Guideline on Surveillance of Barrett's Esophagus",                summary:"Evidence-based recommendations on endoscopic surveillance for Barrett's esophagus using GRADE methodology.",                                    url:"https://www.gastrojournal.org/article/S0016-5085(25)06013-5/fulltext" },
    { org:"AGA",  year:"2025", month:"Oct", topic:"Gastroparesis",            urgency:"High",     title:"AGA Clinical Practice Guideline on Management of Gastroparesis",                         summary:"Evidence-based recommendations for diagnosis and treatment of idiopathic and diabetic gastroparesis.",                                             url:"https://www.gastrojournal.org/article/S0016-5085(25)05857-3/fulltext" },
    { org:"ACG",  year:"2025", month:"Jun", topic:"Ulcerative Colitis",       urgency:"High",     title:"ACG Clinical Guideline Update: Ulcerative Colitis in Adults",                            summary:"Updated recommendations for adult UC covering biologics, small molecules, and treat-to-target strategies.",                                       url:"https://pubmed.ncbi.nlm.nih.gov/40701556/" },
    { org:"ACG",  year:"2025", month:"Jun", topic:"Crohn's Disease",          urgency:"High",     title:"ACG Clinical Guideline: Management of Crohn's Disease in Adults",                        summary:"Comprehensive updated recommendations for adult CD management with GRADE-level evidence assessment.",                                             url:"https://pubmed.ncbi.nlm.nih.gov/40701562/" },
    { org:"ACG",  year:"2025", month:"Mar", topic:"Hepatic Encephalopathy",   urgency:"Moderate", title:"ACG Clinical Guidelines: Diagnosis, Management and Prevention of Hepatic Encephalopathy", summary:"Issues 24 recommendations for HE in cirrhosis using GRADE methodology.",                                                                         url:"" },
    { org:"ASGE", year:"2025", month:"Feb", topic:"GERD",                     urgency:"Moderate", title:"ASGE Guideline on the Diagnosis and Management of GERD",                                 summary:"Updates 2014 ASGE GERD guideline addressing post-sleeve gastrectomy and post-POEM populations.",                                                 url:"https://pubmed.ncbi.nlm.nih.gov/39692638/" },
    { org:"ACG",  year:"2025", month:"Jan", topic:"IBS",                      urgency:"Moderate", title:"ACG Clinical Guideline: Management of Irritable Bowel Syndrome",                         summary:"Updated IBS recommendations covering low-FODMAP diet, soluble fiber, neuromodulators, and secretagogues.",                                       url:"" },
    { org:"ACG",  year:"2024", month:"Sep", topic:"H. pylori",                urgency:"High",     title:"ACG Clinical Guideline: Treatment of Helicobacter pylori Infection",                     summary:"Recommends bismuth quadruple or concomitant therapy as first-line given rising clarithromycin resistance.",                                      url:"https://pubmed.ncbi.nlm.nih.gov/39626064/" },
    { org:"ACG",  year:"2024", month:"Sep", topic:"CRC Screening",            urgency:"High",     title:"ACG Clinical Guideline: Colorectal Cancer Screening 2024 Update",                        summary:"Reaffirms average-risk CRC screening initiation at age 45 with updated post-polypectomy surveillance intervals.",                                url:"" },
    { org:"ACG",  year:"2024", month:"Jul", topic:"Alcohol-Associated Liver", urgency:"High",     title:"ACG Clinical Guideline: Alcohol-Associated Liver Disease",                               summary:"Recommendations for alcohol-associated hepatitis and cirrhosis including corticosteroid use and transplantation candidacy.",                      url:"https://pubmed.ncbi.nlm.nih.gov/38174913/" },
  ],
  weekly: [
    { type:"Research",  impactLevel:"Noteworthy",        multiSource:false, date:"May 20, 2026", topic:"MASLD / Pediatrics",     title:"BMI and Metabolic Markers Could Address Steatotic Liver Disease Screening Gap in Youth",                          source:"healio.com",        summary:"A new analysis suggests BMI combined with metabolic markers could identify a significant screening 'blind spot' for steatotic liver disease in children and adolescents, where current adult-derived thresholds may miss early disease. Researchers propose pediatric-specific cutoffs for clinical screening algorithms.",      url:"https://www.healio.com/news/gastroenterology/20260520/bmi-other-markers-could-address-steatotic-liver-disease-screening-blind-spot-in-youth", studyUrl:"" },
    { type:"Research",  impactLevel:"Practice-changing", multiSource:false, date:"May 25, 2026", topic:"Colorectal Cancer",      title:"Adjuvant Chemoimmunotherapy Sets New Standard in Stage III dMMR Colon Cancer",                          source:"gastroendonews.com", summary:"Adjuvant atezolizumab plus mFOLFOX6 reduced recurrence risk by approximately 50% versus chemotherapy alone in stage III deficient mismatch repair (dMMR) colon cancer in a phase 3 trial presented at ASCO 2026. This establishes a new standard of care for this molecularly defined subgroup.",   url:"https://www.gastroendonews.com/PRN/Article/05-26/Adjuvant-Chemoimmunotherapy-Standard-Stage-III-dMMR-Colon-Cancer/80633", studyUrl:"" },
    { type:"FDA",       impactLevel:"High Impact",       multiSource:false, date:"May 28, 2026", topic:"Hepatology",             title:"FDA Approves Bulevirtide — First-Ever Treatment for Chronic Hepatitis Delta Virus",                      source:"gastroendonews.com", summary:"Bulevirtide received FDA approval as the first therapeutic option for chronic hepatitis Delta virus (HDV) infection in the US, administered via once-daily subcutaneous injection. HDV affects an estimated 5% of the 300 million people living with chronic hepatitis B worldwide.",      url:"https://www.gastroendonews.com/Hepatology-in-Focus/Article/05-26/fda-approves-hepatitis-delta-treatment-Bulevirtide/80664", studyUrl:"" },
    { type:"Research",  impactLevel:"High Impact",       multiSource:true,  date:"May 21, 2026", topic:"IBD",                    title:"'Strikingly Better': Co-antibody Combination Tops Golimumab + Guselkumab in Refractory IBD",               source:"healio.com",        summary:"A phase 2 clinical trial demonstrated that a novel co-antibody combination showed significantly superior efficacy over both golimumab and guselkumab in patients with refractory inflammatory bowel disease. Results were presented at Digestive Disease Week 2026.",                      url:"https://www.healio.com/news/gastroenterology/20260521/strikingly-better-coantibody-combination-tops-golimumab-guselkumab-in-refractory-ibd", studyUrl:"" },
    { type:"Research",  impactLevel:"High Impact",       multiSource:false, date:"Jun 3, 2026",  topic:"Colonoscopy",            title:"Narrow-Band Imaging Reduces Serrated Lesion Miss Rate in Multicenter Randomized Trial",                    source:"news.gastro.org",   summary:"Enhanced imaging during colonoscopy significantly reduced missed sessile serrated lesions and adenomas in a multicenter RCT of average-risk screening patients. The study supports wider adoption of NBI as a standard quality measure during screening colonoscopy.",           url:"https://news.gastro.org/issues/2026/june-2026/narrowband-imaging-may-lower-serrated-lesion-miss-rate/", studyUrl:"https://www.cghjournal.org/article/S1542-3565(26)00055-8/fulltext" },
    { type:"Research",  impactLevel:"High Impact",       multiSource:true,  date:"May 19, 2026", topic:"EoE",                    title:"Dupilumab Boosts Esophageal Distensibility and Luminal Diameter in EoE — First-Time Structural Evidence",  source:"healio.com",        summary:"Dupilumab significantly improved esophageal distensibility and luminal diameter in patients with eosinophilic esophagitis in a first-of-its-kind analysis presented at DDW 2026. The findings suggest dupilumab confers a structural remodeling benefit beyond eosinophil suppression.",  url:"https://www.healio.com/news/gastroenterology/20260519/dupilumab-boosts-esophageal-distensibility-diameter-for-eoe-in-first-time-showing", studyUrl:"" },
    { type:"FDA",       impactLevel:"High Impact",       multiSource:false, date:"Jun 3, 2026",  topic:"Functional GI",          title:"FDA Expands Linzess Approval to Children Age 2+ for Functional Constipation",                              source:"gastroendonews.com", summary:"The FDA expanded linaclotide (Linzess) approval to treat functional constipation in children aged 2 years and older, extending access from the prior lower age limit of 6 years based on new pediatric safety and pharmacokinetic data.",                                              url:"https://www.gastroendonews.com/Functional-GI-Disorders/Article/05-26/Constipation-Treatment-FDA-Approves-Linzess-for-Children/80698", studyUrl:"" },
    { type:"Research",  impactLevel:"Noteworthy",        multiSource:false, date:"May 18, 2026", topic:"Colorectal Cancer",      title:"Low-Dose Aspirin Cuts Recurrence in PI3K-Mutant Colorectal Cancer",                                          source:"gastroendonews.com", summary:"A randomized controlled trial demonstrated that low-dose aspirin significantly reduced recurrence rates versus placebo specifically in patients with PI3K-mutant colorectal cancer, supporting a precision oncology approach to adjuvant aspirin therapy.",                              url:"https://www.gastroendonews.com/PRN/Article/05-26/Colorectal-Cancer-Aspirin-Low-Dose-Recurrence-Reduction/80557", studyUrl:"" },
    { type:"News",      impactLevel:"Noteworthy",        multiSource:false, date:"Jun 2, 2026",  topic:"IBD",                    title:"Ulcerative Proctitis May Not Raise Rectal Cancer Risk — Swedish Registry Study",                            source:"news.gastro.org",   summary:"A large Swedish registry study found that rectal cancer rates in ulcerative proctitis patients were comparable to the general population over more than a decade of follow-up, challenging the long-held assumption that all IBD subtypes confer elevated colorectal cancer risk.",        url:"https://news.gastro.org/issues/2026/june-2026/ulcerative-proctitis-may-not-raise-rectal-cancer-risk/", studyUrl:"" },
    { type:"Opinion",   impactLevel:"Noteworthy",        multiSource:false, date:"Jun 4, 2026",  topic:"MASH / MASLD",           title:"MASH Label Expansion Adds Few New Semaglutide Candidates",                                                  source:"news.gastro.org",   summary:"A population-based analysis found that the new MASH indication for semaglutide adds relatively few net new candidates, since most patients with fibrotic liver disease already qualify through existing obesity- or diabetes-related indications. Commentary on real-world prescribing implications.",  url:"https://news.gastro.org/issues/2026/june-2026/mash-label-expansion-adds-few-new-semaglutide-candidates/", studyUrl:"" },
  ],
};

const EDU_LINKS = [
  { org:"AGA",  color:"#1a6dd4", gradient:"linear-gradient(135deg,#0d4a9e,#1a6dd4)", logo:"AGA",  name:"AGA Universe",          url:"https://www.agauniversity.org/",                                     description:"AGA's comprehensive learning platform offering CME courses, board review, practice guidelines, and GI-focused educational content.",    features:["CME Courses","Board Review","Practice Resources","Webinars"] },
  { org:"ACG",  color:"#c49a0a", gradient:"linear-gradient(135deg,#8b6508,#d4a017)", logo:"ACG",  name:"ACG Education Universe", url:"https://education.gi.org/",                                          description:"Self-assessment programs, case-based learning, MOC resources, and GI fellowship training tools.",                                          features:["Self-Assessment (SAPS)","MOC Resources","Case Studies","Fellowship Tools"] },
  { org:"ASGE", color:"#1a8a5a", gradient:"linear-gradient(135deg,#0e5c3a,#1a8a5a)", logo:"ASGE", name:"ASGE Education",         url:"https://www.asge.org/home/education-meetings/educational-offerings", description:"ASGE's hub for endoscopy training, procedural competency, quality benchmarking, and advanced fellowships.",                              features:["Endoscopy Training","FundamentalsofEndoscopy.org","Quality Metrics","Advanced Fellowships"] },
];

const QUIZ_TOPICS = [
  { id:"General GI",            label:"General GI",            icon:"🫁", color:"#5b8af0" },
  { id:"Advanced Endoscopy",    label:"Advanced Endoscopy",    icon:"🔬", color:"#9c6af0" },
  { id:"IBD",                   label:"IBD",                   icon:"🧬", color:"#e05252" },
  { id:"General Hepatology",    label:"General Hepatology",    icon:"🫀", color:"#e09a2a" },
  { id:"Motility",              label:"Motility",              icon:"⚡", color:"#00b8d4" },
  { id:"Transplant Hepatology", label:"Transplant Hepatology", icon:"🏥", color:"#4caf7d" },
];

const SECTION_META = {
  guidelines: { label:"Clinical Guidelines", icon:"⚕️",  color:"#5b8af0" },
  weekly:     { label:"Weekly Update",       icon:"📰", color:"#e09a2a" },
};

const urgencyColor      = { High:"#e05252", Moderate:"#e09a2a", Routine:"#4caf7d" };
const impactColor       = { "Practice-changing":"#5b8af0", "High Impact":"#9c6af0", Noteworthy:"#4caf7d" };
const weeklyTypeColor   = { Research:"#9c6af0", FDA:"#e05252", Guideline:"#5b8af0", News:"#00b8d4", Opinion:"#e09a2a" };
const SOCIETY_COLORS = {
  ACG:   { color:"#e08c3a", bg:"rgba(224,140,58,0.08)",  border:"rgba(224,140,58,0.2)"  },
  AGA:   { color:"#5b8af0", bg:"rgba(91,138,240,0.08)",  border:"rgba(91,138,240,0.2)"  },
  ASGE:  { color:"#9c6af0", bg:"rgba(156,106,240,0.08)", border:"rgba(156,106,240,0.2)" },
  AASLD: { color:"#4caf7d", bg:"rgba(76,175,61,0.08)",   border:"rgba(76,175,61,0.2)"  },
};
const DAY_LABELS     = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function parseDateStr(item) {
  const raw = item.date || (item.month && item.year ? `${item.month} ${item.year}` : null);
  if (!raw) return 0;
  const d = new Date(raw);
  return isNaN(d) ? 0 : d.getTime();
}
function sortByDate(items) { return [...items].sort((a,b) => parseDateStr(b) - parseDateStr(a)); }

async function apiCall(body) {
  const res = await fetch("/api/claude", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

function Badge({ label, color }) {
  return <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, color:"#fff", background:color||"#334", whiteSpace:"nowrap" }}>{label}</span>;
}

function Spinner({ size=16, color="#5b8af0" }) {
  return <span style={{ display:"inline-block", width:size, height:size, border:`2px solid ${color}33`, borderTop:`2px solid ${color}`, borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }} />;
}

function ContentCard({ item, type }) {
  const [hov, setHov] = useState(false);
  const ac = SECTION_META[type]?.color || "#5b8af0";
  const isWeekly = type === "weekly";
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>item.url&&window.open(item.url,"_blank")}
      style={{ background:hov?"rgba(255,255,255,0.055)":"rgba(255,255,255,0.025)", border:`1px solid ${hov?ac+"66":"rgba(255,255,255,0.08)"}`, borderLeft:`3px solid ${hov?ac:"rgba(255,255,255,0.12)"}`, borderRadius:12, padding:"20px 22px", display:"flex", flexDirection:"column", gap:10, transform:hov?"translateY(-2px)":"none", transition:"all 0.18s", cursor:item.url?"pointer":"default" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#5a6a88", fontFamily:"monospace" }}>
          {type==="guidelines"&&`${item.org} · ${item.month} ${item.year}`}
          {isWeekly&&`${item.source} · ${item.date}`}
        </span>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {type==="guidelines"&&<><Badge label={item.topic} color="#1a2535"/><Badge label={item.urgency} color={urgencyColor[item.urgency]}/></>}
          {isWeekly&&<>
            {item.type==="FDA"    &&<Badge label="FDA Approval" color={weeklyTypeColor.FDA}/>}
            {item.type==="Opinion"&&<Badge label="Opinion"      color={weeklyTypeColor.Opinion}/>}
            {item.multiSource     &&<Badge label="High Impact"  color={impactColor["High Impact"]}/>}
          </>}
        </div>
      </div>
      <div style={{ fontSize:14.5, fontWeight:600, color:hov?"#e8f0ff":"#c8d8f0", lineHeight:1.5 }}>{item.title||item.headline}</div>
      {isWeekly&&item.authors&&<div style={{ fontSize:11.5, color:"#445570", fontStyle:"italic" }}>{item.authors}</div>}
      <div style={{ fontSize:13, color:"#6a7a90", lineHeight:1.75 }}>{item.summary}</div>
      {isWeekly&&item.studyUrl&&(
        <div style={{ marginTop:4 }}>
          <button onClick={e=>{e.stopPropagation();window.open(item.studyUrl,"_blank");}}
            style={{ background:"rgba(76,175,61,0.12)", border:"1px solid rgba(76,175,61,0.3)", color:"#4caf7d", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:7, cursor:"pointer", fontFamily:"monospace", letterSpacing:0.3 }}>
            Link to Study ↗
          </button>
        </div>
      )}
      {hov&&item.url&&(
        <div style={{ fontSize:11, color:ac, fontFamily:"monospace", marginTop:2 }}>View source ↗</div>
      )}
    </div>
  );
}

function ContentSection({ type }) {
  const meta = SECTION_META[type];
  const [search, setSearch]     = useState("");
  const [items, setItems]       = useState(()=>sortByDate(STATIC[type]));
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState("loading");
  const [ageHours, setAgeHours] = useState(null);
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { setPage(1); }, [type]);

  useEffect(() => {
    async function load() {
      if (type !== "guidelines" && sessionCache[type]) {
        setItems(sessionCache[type].data);
        setAgeHours(sessionCache[type].ageHours);
        setStatus("live");
        setLoading(false);
        return;
      }
      setLoading(true);
      setStatus("loading");
      try {
        const result = await apiCall({ type:"content", section:type, page });
        if (Array.isArray(result.data) && result.data.length > 0) {
          const sorted = type === "guidelines" ? result.data : sortByDate(result.data);
          if (type !== "guidelines") sessionCache[type] = { data:sorted, ageHours:result.ageHours };
          setItems(sorted);
          setAgeHours(result.ageHours);
          setStatus("live");
          if (result.pages) { setPages(result.pages); setTotal(result.total || 0); }
        } else {
          setStatus("error");
        }
      } catch(e) {
        console.error(`${type} fetch failed:`, e.message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [type, page]);

  const filtered = items.filter(i=>!search||JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  const statusEl = {
    loading: <><Spinner size={10} color="#5a6a88"/> Loading…</>,
    live:    type === "guidelines"
      ? <><span style={{ color:"#4caf7d", fontWeight:700 }}>● Repository</span> · {total} guidelines · Page {page} of {pages}</>
      : <><span style={{ color:"#4caf7d", fontWeight:700 }}>● Live</span> · {ageHours!=null?`Updated ${ageHours}h ago`:"Fresh from web"} · Sources: news.gastro.org · gastroendonews.com · healio.com</>,
    error:   <><span style={{ color:"#5a6a88", fontWeight:700 }}>● Fallback</span> · Showing curated content · Live data updates weekly</>,
  }[status] || null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0" }}>{meta.icon} {meta.label}</h1>
          <p style={{ marginTop:4, fontSize:12, color:"#2e4060", display:"flex", alignItems:"center", gap:8 }}>{statusEl}</p>
        </div>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#2a3a50", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter…"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, color:"#90b0d0", fontSize:12, padding:"8px 12px 8px 28px", outline:"none", width:150 }}/>
        </div>
      </div>
      {search&&<div style={{ marginBottom:14, fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>{filtered.length} result{filtered.length!==1?"s":""} for "{search}" <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", color:"#5b8af0", fontSize:12, cursor:"pointer" }}>✕</button></div>}
      {filtered.length===0
        ?<div style={{ textAlign:"center", padding:"40px 0", color:"#1e2e40" }}>No results for "{search}"</div>
        :<div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(440px,1fr))", gap:14 }}>
           {filtered.map((item,i)=><ContentCard key={i} item={item} type={type}/>)}
         </div>}
      {type === "guidelines" && pages > 1 && !search && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginTop:28 }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1||loading}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:page===1?"#1e2e40":"#6a8aaa", padding:"8px 16px", borderRadius:8, fontSize:13, cursor:page===1?"not-allowed":"pointer" }}>← Prev</button>
          <span style={{ fontSize:12, color:"#3a5878", fontFamily:"monospace" }}>Page {page} of {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages||loading}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:page===pages?"#1e2e40":"#6a8aaa", padding:"8px 16px", borderRadius:8, fontSize:13, cursor:page===pages?"not-allowed":"pointer" }}>Next →</button>
        </div>
      )}
    </div>
  );
}

const SOCIETY_FALLBACK_URLS = {
  ACG:   "https://gi.org/guidelines",
  AGA:   "https://gastro.org/clinical-guidance",
  ASGE:  "https://www.asge.org/home/resources/publications/guidelines",
  AASLD: "https://www.aasld.org/practice-guidelines",
};

function resolveUrl(g) {
  const url = g.url;
  if (!url) return SOCIETY_FALLBACK_URLS[g.org] || null;
  const isIndex = url.includes("guidelinecentral.com") ||
                  /\/guidelines\/?$/.test(url) ||
                  url.includes("/pages/default.aspx") ||
                  url.match(/journals\.lww\.com\/[^/]+\/?$/);
  return isIndex ? (SOCIETY_FALLBACK_URLS[g.org] || null) : url;
}

function SocietyWidget({ org, guidelines, search }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [newOnly, setNewOnly]           = useState(false);
  const sentinelRef  = useRef(null);
  const containerRef = useRef(null);
  const sc = SOCIETY_COLORS[org] || SOCIETY_COLORS.AGA;

  useEffect(() => { setVisibleCount(3); setNewOnly(false); }, [guidelines]);

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const isRecent = g => { const d = new Date(`${g.month} ${g.year}`); return !isNaN(d) && d >= threeMonthsAgo; };
  const newCount = guidelines.filter(isRecent).length;

  const filtered = guidelines.filter(g => {
    if (newOnly && !isRecent(g)) return false;
    if (search) return (g.title + " " + (g.topic||"") + " " + (g.summary||"")).toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const isFiltering = newOnly || !!search;
  const visible  = isFiltering ? filtered : filtered.slice(0, visibleCount);
  const hasMore  = !isFiltering && visibleCount < filtered.length;

  useEffect(() => {
    if (!sentinelRef.current || !containerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount(c => Math.min(c + 3, filtered.length)); },
      { root: containerRef.current, threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:sc.bg, borderBottom:`1px solid ${sc.border}`, padding:"11px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:15, fontWeight:800, color:sc.color, letterSpacing:0.5 }}>{org}</span>
        <span style={{ fontSize:11, color:"#3a5878", fontFamily:"monospace" }}>{guidelines.length} guidelines</span>
      </div>
      {/* Controls */}
      <div style={{ display:"flex", gap:7, alignItems:"center", padding:"8px 12px", borderBottom:"1px solid rgba(255,255,255,0.04)", background:"rgba(0,0,0,0.12)" }}>
        <button onClick={()=>{setNewOnly(n=>!n);setVisibleCount(3);}}
          style={{ background:newOnly?sc.bg:"rgba(255,255,255,0.04)", border:`1px solid ${newOnly?sc.border:"rgba(255,255,255,0.08)"}`, color:newOnly?sc.color:"#3a5878", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:7, cursor:"pointer", whiteSpace:"nowrap" }}>
          {newOnly&&"● "}Last 3 months ({newCount})
        </button>
      </div>
      {/* List */}
      <div ref={containerRef} style={{ overflowY:"auto", maxHeight:480 }}>
        {visible.length === 0
          ? <div style={{ padding:"24px 18px", fontSize:12, color:"#2a3a50", textAlign:"center" }}>No results</div>
          : visible.map((g, i) => {
              const url = resolveUrl(g);
              return (
                <div key={i} onClick={()=>url&&window.open(url,"_blank")}
                  style={{ padding:"13px 18px", borderBottom:i<visible.length-1?"1px solid rgba(255,255,255,0.04)":"none", cursor:url?"pointer":"default" }}
                  onMouseEnter={e=>url&&(e.currentTarget.style.background="rgba(255,255,255,0.03)")}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#8aafcf", fontFamily:"monospace", marginBottom:5, letterSpacing:0.3 }}>{g.month} {g.year}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#c0d0e8", lineHeight:1.5, marginBottom:5 }}>{g.title}</div>
                  <div style={{ fontSize:12, color:"#5a6a80", lineHeight:1.65 }}>{g.summary}</div>
                </div>
              );
            })
        }
        {hasMore && <div ref={sentinelRef} style={{ height:20 }}/>}
      </div>
    </div>
  );
}

const ONE_MONTH_MS = 30 * 24 * 3600 * 1000;

function GuidelinesSection() {
  const [grouped, setGrouped]     = useState(null);
  const [status, setStatus]       = useState("loading");
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState("");
  const [newAlerts, setNewAlerts] = useState([]);

  function buildGrouped(list) {
    const g = {};
    list.forEach(item => {
      if (!g[item.org]) g[item.org] = [];
      g[item.org].push(item);
    });
    return g;
  }

  useEffect(() => {
    async function load() {
      // Load new-guideline banner alerts (non-critical — ignore failures)
      try {
        const r = await apiCall({ type:"content", section:"guidelines-new" });
        if (Array.isArray(r.data)) {
          setNewAlerts(r.data.filter(a => a.detectedAt && Date.now() - a.detectedAt < ONE_MONTH_MS));
        }
      } catch(_) {}

      try {
        const result = await apiCall({ type:"content", section:"guidelines", page:"all" });
        if (Array.isArray(result.data) && result.data.length > 0) {
          setGrouped(buildGrouped(result.data));
          setTotal(result.total || result.data.length);
          setStatus("live");
        } else {
          setGrouped(buildGrouped(STATIC.guidelines));
          setStatus("error");
        }
      } catch(e) {
        setGrouped(buildGrouped(STATIC.guidelines));
        setStatus("error");
      }
    }
    load();
  }, []);

  const statusEl = {
    loading: <><Spinner size={10} color="#5a6a88"/> Loading…</>,
    live:    <><span style={{ color:"#4caf7d", fontWeight:700 }}>● Repository</span> · {total} guidelines</>,
    error:   <><span style={{ color:"#5a6a88", fontWeight:700 }}>● Fallback</span> · Showing curated content · Live data updates weekly</>,
  }[status];

  return (
    <div>
      {newAlerts.length > 0 && (
        <div style={{ marginBottom:28, display:"flex", flexDirection:"column", gap:14 }}>
          {newAlerts.map((alert, i) => (
            <div key={i} style={{ background:"linear-gradient(135deg,rgba(91,138,240,0.18),rgba(156,106,240,0.12))", border:"2px solid rgba(91,138,240,0.5)", borderLeft:"5px solid #5b8af0", borderRadius:14, padding:"20px 26px", boxShadow:"0 4px 24px rgba(91,138,240,0.15)" }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#a8d0ff", letterSpacing:0.8, textTransform:"uppercase", lineHeight:1.25 }}>
                NEW {alert.org} GUIDELINE PUBLISHED
              </div>
              <div style={{ fontSize:15, fontWeight:600, color:"#d0e8ff", marginTop:10, lineHeight:1.55 }}>{alert.title}</div>
              {(alert.month || alert.year) && (
                <div style={{ fontSize:11, color:"#4a7aaa", marginTop:8, fontFamily:"monospace" }}>{[alert.month, alert.year].filter(Boolean).join(" ")} · Added to repository</div>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0" }}>⚕️ Clinical Guidelines</h1>
            <p style={{ marginTop:4, fontSize:12, color:"#2e4060", display:"flex", alignItems:"center", gap:8 }}>{statusEl}</p>
          </div>
        </div>
        <div style={{ position:"relative", maxWidth:380 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#2a3a50", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search all guidelines…"
            style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:9, color:"#90b0d0", fontSize:13, padding:"9px 12px 9px 32px", outline:"none" }}/>
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#5b8af0", fontSize:13, cursor:"pointer", padding:0 }}>✕</button>}
        </div>
      </div>
      {status === "loading" && <div style={{ textAlign:"center", padding:"60px 0" }}><Spinner size={28}/></div>}
      {grouped && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(440px,1fr))", gap:16 }}>
          {["ACG","AGA","ASGE","AASLD"].map(org =>
            grouped[org]?.length > 0 ? <SocietyWidget key={org} org={org} guidelines={grouped[org]} search={search}/> : null
          )}
        </div>
      )}
    </div>
  );
}

function EduCard({ edu }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>window.open(edu.url,"_blank")}
      style={{ background:hov?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${hov?edu.color+"88":"rgba(255,255,255,0.08)"}`, borderRadius:14, overflow:"hidden", cursor:"pointer", transform:hov?"translateY(-3px)":"none", transition:"all 0.2s", boxShadow:hov?`0 8px 28px ${edu.color}22`:"none" }}>
      <div style={{ background:edu.gradient, padding:"20px 22px 16px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:46, height:46, borderRadius:10, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", fontFamily:"monospace" }}>{edu.logo}</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{edu.name}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{edu.url.replace("https://","").split("/")[0]}</div>
        </div>
      </div>
      <div style={{ padding:"16px 20px 18px" }}>
        <p style={{ fontSize:13, color:"#7a8aa0", lineHeight:1.7, marginBottom:14 }}>{edu.description}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {edu.features.map(f=><span key={f} style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:edu.color+"22", color:edu.color, border:`1px solid ${edu.color}44`, fontWeight:600 }}>{f}</span>)}
        </div>
        {hov&&<div style={{ marginTop:12, fontSize:11, color:edu.color, fontFamily:"monospace" }}>Visit {edu.name} ↗</div>}
      </div>
    </div>
  );
}

function EducationSection() {
  return (
    <div>
      <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0", marginBottom:6 }}>🎓 Education Hubs</h1>
      <p style={{ fontSize:12.5, color:"#2e4060", marginBottom:28 }}>Official learning platforms from ACG, AGA, and ASGE — CME, board review, endoscopy training, and more.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
        {EDU_LINKS.map(edu=><EduCard key={edu.org} edu={edu}/>)}
      </div>
    </div>
  );
}

const firstDate  = new Date(CALENDAR_EVENTS[0].date + "T12:00:00");
const gridStart  = new Date(firstDate);
gridStart.setDate(gridStart.getDate() - gridStart.getDay());
const MONTH_DAYS = Array.from({ length:35 }, (_,i) => {
  const d = new Date(gridStart); d.setDate(d.getDate()+i);
  return d.toISOString().split("T")[0];
});
const DISPLAY_MONTH = firstDate.getMonth();

// ── QUIZ DISPLAY (static, pre-generated by cron) ──────────────────────────────
function QuizDisplay({ quiz }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers]     = useState({});

  useEffect(() => {
    setQuizIndex(0);
    setAnswers({});
  }, [quiz]);

  function selectAnswer(idx, letter) {
    if (answers[idx]) return;
    setAnswers(a => ({ ...a, [idx]: letter }));
  }

  const currentQ = quiz[quizIndex];
  if (!currentQ) return null;

  const hasAnswered = !!answers[quizIndex];

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#5b8af0", fontFamily:"monospace", letterSpacing:1 }}>🧠 GUIDELINE QUIZ</div>
        <div style={{ fontSize:11, color:"#3a5878", fontFamily:"monospace" }}>Question {quizIndex+1} of {quiz.length}</div>
      </div>
      <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"16px" }}>
        <div style={{ fontSize:13, color:"#c8d8f0", lineHeight:1.7, marginBottom:14 }}>{currentQ.question}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {currentQ.options.map((opt,oi)=>{
            const letter = ["A","B","C","D"][oi];
            const isChosen = answers[quizIndex] === letter;
            const isRight  = letter === currentQ.correct;
            let bg="rgba(255,255,255,0.03)", border="rgba(255,255,255,0.08)", color="#8898b0";
            if (hasAnswered) {
              if (isRight)          { bg="rgba(76,175,61,0.12)";  border="#4caf7d55"; color="#4caf7d"; }
              else if (isChosen)    { bg="rgba(224,82,82,0.1)";   border="#e0525255"; color="#e05252"; }
            } else if (isChosen)    { bg="rgba(91,138,240,0.13)"; border="#5b8af088"; color="#5b8af0"; }
            return (
              <div key={oi} onClick={()=>selectAnswer(quizIndex, letter)}
                style={{ background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"8px 12px", fontSize:12, color, cursor:hasAnswered?"default":"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontWeight:700, fontFamily:"monospace", fontSize:11, minWidth:14 }}>{letter}</span>
                <span>{opt.replace(/^[A-D][\.\)]\s*/i,"")}</span>
                {hasAnswered&&isRight  &&<span style={{ marginLeft:"auto" }}>✓</span>}
                {hasAnswered&&isChosen&&!isRight&&<span style={{ marginLeft:"auto" }}>✗</span>}
              </div>
            );
          })}
        </div>
        {hasAnswered&&(
          <div style={{ marginTop:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"10px 12px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#4a6a8a", fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>EXPLANATION</div>
            <div style={{ fontSize:12, color:"#6a8aaa", lineHeight:1.7 }}>{currentQ.explanation}</div>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
          <button onClick={()=>setQuizIndex(i=>Math.max(0,i-1))} disabled={quizIndex===0}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:quizIndex===0?"#1e2e40":"#6a8aaa", padding:"6px 14px", borderRadius:7, fontSize:12, cursor:quizIndex===0?"not-allowed":"pointer" }}>← Prev</button>
          <div style={{ display:"flex", gap:6 }}>
            {quiz.map((_,i)=>(
              <div key={i} onClick={()=>setQuizIndex(i)}
                style={{ width:8, height:8, borderRadius:"50%", background:i===quizIndex?"#5b8af0":answers[i]?(answers[i]===quiz[i].correct?"#4caf7d":"#e05252"):"rgba(255,255,255,0.1)", cursor:"pointer", transition:"all 0.15s" }}/>
            ))}
          </div>
          <button onClick={()=>setQuizIndex(i=>Math.min(quiz.length-1,i+1))} disabled={quizIndex===quiz.length-1}
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:quizIndex===quiz.length-1?"#1e2e40":"#6a8aaa", padding:"6px 14px", borderRadius:7, fontSize:12, cursor:quizIndex===quiz.length-1?"not-allowed":"pointer" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── LECTURE DETAIL PANEL ──────────────────────────────────────────────────────
function LectureDetailPanel({ event, onClose }) {
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [showQuiz, setShowQuiz]           = useState(false);
  const [showAllGuidelines, setShowAllGuidelines] = useState(false);

  useEffect(() => {
    setShowQuiz(false);
    setShowAllGuidelines(false);
    async function load() {
      setLoading(true);
      try {
        const result = await apiCall({ type:"lecture", topic:event.slug });
        setData(result);
      } catch(e) { console.error("Lecture fetch failed:", e.message); }
      setLoading(false);
    }
    load();
  }, [event.slug]);

  const noData = !loading && (!data || (!data.guideline?.length && !data.articles?.length && !data.news?.length));
  const hasQuiz = data?.quiz?.length > 0;

  return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, width:"min(600px,100vw)", background:"#0c1526", borderLeft:"1px solid rgba(255,255,255,0.1)", zIndex:200, overflowY:"auto", boxShadow:"-8px 0 32px rgba(0,0,0,0.4)" }}>
      <div style={{ position:"sticky", top:0, background:"rgba(12,21,38,0.97)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div>
          <div style={{ fontSize:11, color:"#3a5878", fontFamily:"monospace", marginBottom:4 }}>{new Date(event.date+"T12:00:00").toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric", year:"numeric" })}</div>
          <div style={{ fontSize:16, fontWeight:700, color:"#c8d8f0", lineHeight:1.4 }}>{event.topic}</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#6a8aaa", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16, flexShrink:0 }}>✕</button>
      </div>

      <div style={{ padding:24 }}>
        {loading&&<div style={{ textAlign:"center", padding:"60px 0" }}><Spinner size={28}/><div style={{ marginTop:14, fontSize:13, color:"#3a5878" }}>Loading lecture content…</div></div>}
        {noData&&<div style={{ textAlign:"center", padding:"60px 0", color:"#2a3a50" }}><div style={{ fontSize:32, marginBottom:12 }}>📭</div><div style={{ fontSize:13 }}>No content yet. Run the schedule cron to populate.</div></div>}

        {!loading&&data&&(
          <div style={{ display:"flex", flexDirection:"column", gap:32 }}>

            {/* Guidelines — most recent shown by default, expand for rest */}
            {data.guideline?.length>0&&(()=>{
              const sorted = sortByDate(data.guideline);
              const visible = showAllGuidelines ? sorted : [sorted[0]];
              return (
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#5b8af0", fontFamily:"monospace", letterSpacing:1, marginBottom:12 }}>⚕️ RELEVANT GUIDELINE{data.guideline.length>1?"S":""}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {visible.map((g,i)=>{
                    const sc = SOCIETY_COLORS[g.org] || { color:"#5b8af0", border:"rgba(91,138,240,0.2)" };
                    return (
                    <div key={i} onClick={()=>g.url&&window.open(g.url,"_blank")}
                      style={{ background:"rgba(91,138,240,0.04)", border:`1px solid ${sc.border}`, borderLeft:`3px solid ${sc.color}`, borderRadius:10, padding:"14px 16px", cursor:g.url?"pointer":"default" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:sc.color, background:sc.bg||"rgba(91,138,240,0.12)", padding:"2px 8px", borderRadius:12 }}>{g.org}</span>
                        <span style={{ fontSize:11, color:"#3a5878", fontFamily:"monospace" }}>{g.month} {g.year}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#c8d8f0", lineHeight:1.5, marginBottom:6 }}>{g.title}</div>
                      <div style={{ fontSize:12, color:"#6a7a90", lineHeight:1.7 }}>{g.summary}</div>
                    </div>
                  );})}
                </div>
                {sorted.length > 1 && (
                  <button onClick={()=>setShowAllGuidelines(s=>!s)}
                    style={{ marginTop:10, background:"none", border:"none", color:"#5b8af0", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace", padding:0 }}>
                    {showAllGuidelines ? "Show less ↑" : `Show ${sorted.length - 1} more guideline${sorted.length>2?"s":""} ↓`}
                  </button>
                )}

                {/* Quiz button — only shown if quiz data exists */}
                {hasQuiz&&!showQuiz&&(
                  <button onClick={()=>setShowQuiz(true)}
                    style={{ marginTop:14, background:"linear-gradient(135deg,#1a3a6a,#2a5a9a)", border:"1px solid #2a5a9a55", color:"#90c0ff", padding:"8px 16px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                    🧠 Show Guideline Quiz
                  </button>
                )}
                {hasQuiz&&showQuiz&&(
                  <QuizDisplay quiz={data.quiz}/>
                )}
              </div>
            );
          })()}

            {/* Articles */}
            {data.articles?.length>0&&(
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#9c6af0", fontFamily:"monospace", letterSpacing:1, marginBottom:12 }}>📄 RECENT ARTICLES</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {data.articles.map((a,i)=>(
                    <div key={i} onClick={()=>a.url&&window.open(a.url,"_blank")}
                      style={{ background:"rgba(156,106,240,0.05)", border:"1px solid rgba(156,106,240,0.15)", borderLeft:"3px solid #9c6af0", borderRadius:10, padding:"12px 14px", cursor:a.url?"pointer":"default" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:"#1a2535", padding:"2px 8px", borderRadius:12 }}>{a.journal}</span>
                        <span style={{ fontSize:11, color:"#3a5878", fontFamily:"monospace" }}>{a.date}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#c8d8f0", lineHeight:1.5, marginBottom:4 }}>{a.title}</div>
                      {a.authors&&<div style={{ fontSize:11, color:"#445570", fontStyle:"italic", marginBottom:4 }}>{a.authors}</div>}
                      <div style={{ fontSize:12, color:"#6a7a90", lineHeight:1.7 }}>{a.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {data.news?.length>0&&(
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#00b8d4", fontFamily:"monospace", letterSpacing:1, marginBottom:12 }}>📡 RELATED NEWS</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {data.news.map((n,i)=>(
                    <div key={i} onClick={()=>n.url&&window.open(n.url,"_blank")}
                      style={{ background:"rgba(0,184,212,0.05)", border:"1px solid rgba(0,184,212,0.15)", borderLeft:"3px solid #00b8d4", borderRadius:10, padding:"12px 14px", cursor:n.url?"pointer":"default" }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:"#1a2535", padding:"2px 8px", borderRadius:12 }}>{n.source}</span>
                        <span style={{ fontSize:11, color:"#3a5878", fontFamily:"monospace" }}>{n.date}</span>
                      </div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#c8d8f0", lineHeight:1.5, marginBottom:4 }}>{n.headline}</div>
                      <div style={{ fontSize:12, color:"#6a7a90", lineHeight:1.7 }}>{n.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventMap = {};
  CALENDAR_EVENTS.forEach(e=>{ eventMap[e.date]=e; });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0" }}>📅 Schedule</h1>
          <p style={{ marginTop:4, fontSize:12, color:"#2e4060" }}>{CALENDAR_MONTH} · Click highlighted lectures for guidelines, articles & news</p>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center", fontSize:11, color:"#3a5070" }}>
          <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#e05252", marginRight:4 }}/>Lecture</span>
          <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"#e09a2a", marginRight:4 }}/>Conference</span>
          <span><span style={{ display:"inline-block", width:10, height:10, borderRadius:2, background:"rgba(91,138,240,0.4)", border:"1px solid #5b8af0", marginRight:4 }}/>Clickable</span>
        </div>
      </div>
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          {DAY_LABELS.map(d=><div key={d} style={{ padding:"10px 0", textAlign:"center", fontSize:11, fontWeight:700, color:"#2a4060", fontFamily:"monospace", letterSpacing:1 }}>{d}</div>)}
        </div>
        {Array.from({ length:5 }, (_,week)=>(
          <div key={week} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:week<4?"1px solid rgba(255,255,255,0.05)":"none" }}>
            {Array.from({ length:7 }, (_,day)=>{
              const dateStr = MONTH_DAYS[week*7+day];
              const d = new Date(dateStr+"T12:00:00");
              const isCurrentMonth = d.getMonth()===DISPLAY_MONTH;
              const event = eventMap[dateStr];
              const isClickable = event?.slug!=null;
              return (
                <div key={day}
                  onClick={()=>isClickable&&setSelectedEvent(event)}
                  onMouseEnter={e=>{ if(isClickable) e.currentTarget.style.background="rgba(91,138,240,0.1)"; }}
                  onMouseLeave={e=>{ if(isClickable) e.currentTarget.style.background="rgba(91,138,240,0.04)"; }}
                  style={{ minHeight:90, padding:8, borderRight:day<6?"1px solid rgba(255,255,255,0.05)":"none", background:isClickable?"rgba(91,138,240,0.04)":"transparent", cursor:isClickable?"pointer":"default", transition:"background 0.15s" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:isCurrentMonth?"#4a6080":"#1e2e40", marginBottom:4 }}>{d.getDate()}</div>
                  {event&&(
                    <div style={{ fontSize:10.5, lineHeight:1.4, padding:"4px 6px", borderRadius:5,
                      background:isClickable?"rgba(91,138,240,0.15)":event.topic?"#e0525222":"#e09a2a22",
                      border:isClickable?"1px solid rgba(91,138,240,0.3)":event.topic?"1px solid #e0525233":"1px solid #e09a2a33",
                      color:isClickable?"#90b8ff":event.topic?"#e05252":"#e09a2a",
                      fontWeight:isClickable?600:400 }}>
                      {isClickable&&<span style={{ marginRight:3 }}>🔗</span>}
                      {event.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {selectedEvent&&(
        <>
          <div onClick={()=>setSelectedEvent(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:199 }}/>
          <LectureDetailPanel event={selectedEvent} onClose={()=>setSelectedEvent(null)}/>
        </>
      )}
    </div>
  );
}

function QuizSection() {
  const [sel, setSel]             = useState(null);
  const [question, setQuestion]   = useState(null);
  const [answer, setAnswer]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [history, setHistory]     = useState(()=>{ try { return JSON.parse(localStorage.getItem("gihub_quiz_history")||"[]"); } catch { return []; } });

  const ti = QUIZ_TOPICS.find(t=>t.id===sel);

  async function generate(topicId) {
    setSel(topicId); setQuestion(null); setAnswer(null); setSubmitted(false); setError(null); setLoading(true);
    try {
      const result = await apiCall({ type:"quiz", topic:topicId });
      if (Array.isArray(result.data) && result.data.length>0) setQuestion(result.data[0]);
      else setError("Could not generate question. Please try again.");
    } catch(e) { setError(`Error: ${e.message}`); }
    setLoading(false);
  }

  function submit() {
    if (!answer) return;
    setSubmitted(true);
    const correct = answer===question.correct;
    const entry = { topic:sel, correct, date:new Date().toLocaleDateString(), time:new Date().toLocaleTimeString([],{ hour:"2-digit", minute:"2-digit" }) };
    const updated = [entry,...history].slice(0,20);
    setHistory(updated);
    try { localStorage.setItem("gihub_quiz_history", JSON.stringify(updated)); } catch {}
  }

  const pct = history.length ? Math.round(history.filter(h=>h.correct).length/history.length*100) : null;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#c8d8f0" }}>🧠 GI Quiz</h1>
          <p style={{ fontSize:12.5, color:"#2e4060", marginTop:4 }}>AI-generated board-style MCQ · Fresh question every time · Powered by Claude</p>
        </div>
        {pct!==null&&<div style={{ background:"rgba(91,138,240,0.08)", border:"1px solid rgba(91,138,240,0.2)", borderRadius:10, padding:"8px 16px", textAlign:"center" }}><div style={{ fontSize:20, fontWeight:700, color:"#5b8af0" }}>{pct}%</div><div style={{ fontSize:10, color:"#3a5070", fontFamily:"monospace" }}>AVG SCORE</div></div>}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, margin:"20px 0 28px" }}>
        {QUIZ_TOPICS.map(t=>(
          <button key={t.id} onClick={()=>generate(t.id)} disabled={loading}
            style={{ background:sel===t.id?t.color+"33":"rgba(255,255,255,0.04)", border:`1px solid ${sel===t.id?t.color:"rgba(255,255,255,0.1)"}`, color:sel===t.id?t.color:"#4a6080", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:7, cursor:loading?"not-allowed":"pointer", opacity:loading?0.6:1, transition:"all 0.18s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      {error&&!loading&&<div style={{ background:"rgba(224,82,82,0.08)", border:"1px solid #e0525244", borderRadius:10, padding:"14px 18px", marginBottom:20 }}><div style={{ fontSize:12, fontWeight:700, color:"#e05252", marginBottom:4 }}>Error</div><div style={{ fontSize:12, color:"#a05050", fontFamily:"monospace" }}>{error}</div></div>}
      {loading&&<div style={{ textAlign:"center", padding:"60px 0" }}><Spinner size={32}/><div style={{ marginTop:16, fontSize:14, color:"#3a5878" }}>Generating question…</div></div>}
      {submitted&&question&&(
        <div style={{ background:answer===question.correct?"rgba(76,175,61,0.1)":"rgba(224,82,82,0.1)", border:`1px solid ${answer===question.correct?"#4caf7d":"#e05252"}55`, borderRadius:12, padding:"16px 22px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontSize:18, fontWeight:700, color:answer===question.correct?"#4caf7d":"#e05252" }}>{answer===question.correct?"Correct! 🎉":"Incorrect 📚"}</div>
          <button onClick={()=>generate(sel)} style={{ background:"rgba(91,138,240,0.12)", border:"1px solid rgba(91,138,240,0.3)", color:"#8aafff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>New Question →</button>
        </div>
      )}
      {!loading&&question&&(
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"20px 22px" }}>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            <span style={{ background:ti?.color+"33", color:ti?.color, width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>Q</span>
            <div style={{ fontSize:14, color:"#c8d8f0", lineHeight:1.7 }}>{question.question}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, paddingLeft:40 }}>
            {question.options.map((opt,oi)=>{
              const letter=["A","B","C","D"][oi], isChosen=answer===letter, isRight=letter===question.correct;
              let bg="rgba(255,255,255,0.03)", border="rgba(255,255,255,0.08)", color="#8898b0";
              if (submitted) { if(isRight){bg="rgba(76,175,61,0.12)";border="#4caf7d55";color="#4caf7d";} else if(isChosen){bg="rgba(224,82,82,0.1)";border="#e0525255";color="#e05252";} }
              else if (isChosen) { bg=ti?.color+"22"; border=ti?.color+"88"; color=ti?.color; }
              return (
                <div key={oi} onClick={()=>!submitted&&setAnswer(letter)}
                  style={{ background:bg, border:`1px solid ${border}`, borderRadius:8, padding:"10px 14px", fontSize:13, color, cursor:submitted?"default":"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontWeight:700, fontFamily:"monospace", fontSize:11, minWidth:14 }}>{letter}</span>
                  <span>{opt.replace(/^[A-D][\.\)]\s*/i,"")}</span>
                  {submitted&&isRight&&<span style={{ marginLeft:"auto" }}>✓</span>}
                  {submitted&&isChosen&&!isRight&&<span style={{ marginLeft:"auto" }}>✗</span>}
                </div>
              );
            })}
          </div>
          {!submitted&&<div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}><button onClick={submit} disabled={!answer} style={{ background:!answer?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#3a6fd8,#7c4af0)", border:"none", color:!answer?"#2a3a50":"#fff", padding:"11px 26px", borderRadius:10, fontSize:14, fontWeight:700, cursor:!answer?"not-allowed":"pointer", transition:"all 0.2s" }}>Submit</button></div>}
          {submitted&&question.explanation&&(
            <div style={{ marginTop:16, paddingLeft:40 }}>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"12px 14px" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:"#4a6a8a", fontFamily:"monospace", marginBottom:4, letterSpacing:0.5 }}>EXPLANATION</div>
                <div style={{ fontSize:13, color:"#6a8aaa", lineHeight:1.7 }}>{question.explanation}</div>
              </div>
            </div>
          )}
        </div>
      )}
      {!loading&&!sel&&<div style={{ textAlign:"center", padding:"60px 0" }}><div style={{ fontSize:40, marginBottom:14 }}>🧠</div><div style={{ fontSize:15, color:"#2a3a50" }}>Select a topic above to generate a question</div></div>}
      {history.length>0&&(
        <div style={{ marginTop:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#8898b8" }}>📊 Score History</h2>
            <button onClick={()=>{ setHistory([]); try{ localStorage.removeItem("gihub_quiz_history"); }catch{} }} style={{ background:"none", border:"1px solid rgba(255,255,255,0.07)", color:"#3a5070", fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer" }}>Clear</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:10 }}>
            {history.map((h,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:"#3a5070", fontFamily:"monospace" }}>{h.date} · {h.time}</div>
                <div style={{ fontSize:12, fontWeight:600, color:"#6a8aaa", marginTop:3 }}>{h.topic}</div>
                <div style={{ fontSize:16, fontWeight:700, color:h.correct?"#4caf7d":"#e05252", marginTop:6 }}>{h.correct?"✓ Correct":"✗ Incorrect"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id:"guidelines", label:"Clinical Guidelines", icon:"⚕️" },
  { id:"weekly",     label:"Weekly Update",       icon:"📰" },
  { id:"education",  label:"Education",           icon:"🎓" },
  { id:"schedule",   label:"Schedule",            icon:"📅" },
  { id:"quiz",       label:"Quiz",                icon:"🧠" },
];

export default function GIHub() {
  const [active, setActive] = useState("guidelines");
  return (
    <div style={{ minHeight:"100vh", background:"#080f1e", color:"#d0e0ff", fontFamily:"Georgia,'Times New Roman',serif", paddingBottom:80 }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        button,input{font-family:inherit}
        ::placeholder{color:#2a3a50}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#1a2a3a;border-radius:3px}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,15,30,0.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0 10px", gap:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#3a6fd8,#7c4af0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 0 16px rgba(91,138,240,0.25)" }}>⚕️</div>
              <div>
                <div style={{ fontSize:20, fontWeight:700, color:"#e0eeff" }}>GI<span style={{ color:"#5b8af0" }}>Hub</span>{" "}<span style={{ fontSize:11, background:"linear-gradient(135deg,#3a6fd8,#7c4af0)", color:"#fff", padding:"2px 8px", borderRadius:20, fontWeight:700, fontFamily:"monospace", verticalAlign:"middle" }}>AI</span></div>
                <div style={{ fontSize:9.5, color:"#2a4060", letterSpacing:1.4, textTransform:"uppercase", fontFamily:"monospace" }}>Gastroenterology Educational Hub</div>
              </div>
            </div>
            <div style={{ fontSize:11, color:"#1a2e42", fontFamily:"monospace" }}>{new Date().toLocaleDateString("en-US",{ month:"long", day:"numeric", year:"numeric" })}</div>
          </div>
          <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.04)", overflowX:"auto" }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setActive(t.id)}
                style={{ background:active===t.id?"rgba(91,138,240,0.07)":"transparent", border:"none", borderBottom:`2px solid ${active===t.id?"#5b8af0":"transparent"}`, color:active===t.id?"#90b8ff":"#3a5070", padding:"11px 18px", fontSize:13, fontWeight:600, transition:"all 0.18s", whiteSpace:"nowrap", cursor:"pointer" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 32px 0" }}>
        {active==="guidelines"&&<GuidelinesSection/>}
        {active==="weekly"    &&<ContentSection key="weekly"     type="weekly"/>}
        {active==="education" &&<EducationSection/>}
        {active==="schedule"  &&<ScheduleSection/>}
        {active==="quiz"      &&<QuizSection/>}
      </div>
      <div style={{ maxWidth:1100, margin:"52px auto 0", padding:"16px 32px 0", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ fontSize:10.5, color:"#141e2c", textAlign:"center", lineHeight:2, fontFamily:"monospace" }}>
          GIHub is a curated educational reference tool for gastroenterologists. AI content generated via Claude with web search.<br/>
          Always verify against official society sources. Quiz questions are for educational purposes only. Not a substitute for clinical judgment.
        </p>
      </div>
    </div>
  );
}
